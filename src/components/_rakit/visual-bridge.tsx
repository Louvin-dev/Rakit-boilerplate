"use client";

/**
 * Rakit Visual Edit Bridge — runs INSIDE the user's project iframe and
 * implements direct text editing (Webflow / Framer style). User clicks
 * a text element, types in place, presses Enter, the edit goes back to
 * the parent which patches the source file via find-and-replace. No
 * AI prompt in the loop for plain text changes.
 *
 * Lives in the boilerplate so every Rakit project ships with it. Self-
 * gates by NODE_ENV — production builds render `null` so deployed apps
 * carry zero overhead and surface no postMessage attack area.
 *
 * Protocol (parent → iframe):
 *   { type: "rakit:visual:enable" }   turn edit mode on
 *   { type: "rakit:visual:disable" }  turn it off
 *   { type: "rakit:visual:ping" }     handshake
 *
 * Protocol (iframe → parent):
 *   { type: "rakit:visual:ready" }                bridge mounted
 *   { type: "rakit:visual:text-edit",
 *     originalText, newText, selector }           user committed text edit
 *   { type: "rakit:visual:cancelled" }            user pressed ESC
 *   { type: "rakit:visual:noop", reason }         click landed on a
 *                                                 non-editable target
 *
 * Security: messages from parent must come from a trusted origin
 * (rakit.dev / *.rakit.dev / localhost). Outbound messages are
 * postMessage(*, '*') — parent validates message shape, not iframe
 * origin (sandbox domain rotates per project).
 */

import { useEffect, useRef, useState } from "react";

const HOVER_OUTLINE = "2px solid #ff6b1a";
const HOVER_BG = "rgba(255, 107, 26, 0.08)";
const EDIT_OUTLINE = "2px dashed #16a34a";
const SHAKE_OUTLINE = "2px solid #ef4444";
const TEXT_LIMIT = 2000;

function isTrustedOrigin(origin: string): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_ANY_PARENT === "1") return true;
  const explicit = process.env.NEXT_PUBLIC_RAKIT_PARENT_ORIGIN;
  if (explicit && origin === explicit) return true;
  try {
    const u = new URL(origin);
    if (u.hostname === "rakit.dev") return true;
    if (u.hostname.endsWith(".rakit.dev")) return true;
    if (u.hostname === "localhost") return true;
    if (u.hostname === "127.0.0.1") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * "Text leaf" = an element whose only meaningful content is its own
 * text. Drilling into a wrapper div with multiple kids would yank
 * ambiguous text; we want the deepest-text-only element. The bridge
 * uses `e.target` which is already the deepest event target, so this
 * predicate just confirms the chosen element is safe to editify.
 *
 * Rule: NO child elements (text-only descendants are fine — those
 * show up as text nodes, not children). textContent must be non-
 * empty after trimming.
 */
function isTextLeaf(el: Element): boolean {
  if (el.children.length > 0) return false;
  const t = (el.textContent ?? "").trim();
  if (!t) return false;
  if (t.length > TEXT_LIMIT) return false;
  return true;
}

function buildSelector(el: Element, maxDepth = 4): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  const parts: string[] = [];
  let cur: Element | null = el;
  let depth = 0;
  while (cur && cur !== document.body && depth < maxDepth) {
    let part = cur.tagName.toLowerCase();
    if (cur.classList.length > 0) {
      const cls = Array.from(cur.classList)
        .filter((c) => /^[a-zA-Z_-][\w-]*$/.test(c))
        .slice(0, 3)
        .map((c) => `.${c}`)
        .join("");
      part += cls;
    }
    const parent = cur.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter(
        (c) => c.tagName === cur!.tagName
      );
      if (sameTag.length > 1) {
        const idx = sameTag.indexOf(cur) + 1;
        part += `:nth-of-type(${idx})`;
      }
    }
    parts.unshift(part);
    cur = parent;
    depth++;
  }
  return parts.join(" > ");
}

export function VisualBridge() {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  // Element currently carrying the hover outline. We restore its
  // inline styles when we move off / disable.
  const hoveredRef = useRef<HTMLElement | null>(null);
  const savedStylesRef = useRef<
    Map<HTMLElement, { outline: string; bg: string; cursor: string }>
  >(new Map());
  // Element currently being edited (contentEditable on). Tracked
  // separately so click events don't try to re-editify it.
  const editingRef = useRef<HTMLElement | null>(null);

  if (process.env.NODE_ENV !== "development") return null;

  function applyHoverStyle(el: HTMLElement) {
    if (editingRef.current === el) return; // don't overwrite edit highlight
    if (!savedStylesRef.current.has(el)) {
      savedStylesRef.current.set(el, {
        outline: el.style.outline,
        bg: el.style.backgroundColor,
        cursor: el.style.cursor,
      });
    }
    el.style.outline = HOVER_OUTLINE;
    el.style.backgroundColor = HOVER_BG;
    el.style.cursor = "text";
  }

  function clearHoverStyle(el: HTMLElement) {
    if (editingRef.current === el) return; // keep edit highlight
    const saved = savedStylesRef.current.get(el);
    if (saved) {
      el.style.outline = saved.outline;
      el.style.backgroundColor = saved.bg;
      el.style.cursor = saved.cursor;
      savedStylesRef.current.delete(el);
    }
  }

  function clearAllStyles() {
    for (const [el, saved] of savedStylesRef.current.entries()) {
      el.style.outline = saved.outline;
      el.style.backgroundColor = saved.bg;
      el.style.cursor = saved.cursor;
    }
    savedStylesRef.current.clear();
    hoveredRef.current = null;
  }

  function flashShake(el: HTMLElement) {
    // Brief red outline + small wiggle — signals "can't edit this".
    const prev = el.style.outline;
    const prevTransform = el.style.transform;
    const prevTransition = el.style.transition;
    el.style.outline = SHAKE_OUTLINE;
    el.style.transition = "transform 60ms ease";
    let n = 0;
    const offsets = [-2, 2, -1, 1, 0];
    const interval = setInterval(() => {
      el.style.transform = `translateX(${offsets[n]}px)`;
      n++;
      if (n >= offsets.length) {
        clearInterval(interval);
        el.style.transform = prevTransform;
        el.style.transition = prevTransition;
        el.style.outline = prev;
      }
    }, 70);
  }

  function postToParent(payload: object) {
    try {
      window.parent?.postMessage(payload, "*");
    } catch {
      /* parent gone */
    }
  }

  function beginEdit(target: HTMLElement) {
    const originalText = target.textContent ?? "";
    editingRef.current = target;
    // Store + override styles. Hover map already has this element if
    // we passed through mouseover; if not, save here.
    if (!savedStylesRef.current.has(target)) {
      savedStylesRef.current.set(target, {
        outline: target.style.outline,
        bg: target.style.backgroundColor,
        cursor: target.style.cursor,
      });
    }
    target.style.outline = EDIT_OUTLINE;
    target.style.backgroundColor = "rgba(22, 163, 74, 0.06)";
    target.style.cursor = "text";
    target.contentEditable = "true";
    // Spellcheck off — the user-visible spellcheck squiggles look
    // weird in a transient editor and add noise to copy-paste.
    target.spellcheck = false;
    target.focus();
    // Select-all so first keystroke replaces entire text — matches
    // how every CMS / inline-edit UX I've used works. User can also
    // arrow-key / click around to reposition.
    const range = document.createRange();
    range.selectNodeContents(target);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);

    let committed = false;
    function commit() {
      if (committed) return;
      committed = true;
      cleanup();
      // contentEditable can introduce U+00A0 (non-breaking space)
      // when the user types a literal space in some browsers — the
      // source code has regular spaces, so normalise back. Then
      // trim both sides so JSX-formatted whitespace doesnt poison
      // the find-and-replace match in the parent.
      const rawNew = (target.textContent ?? "").replace(/\u00a0/g, " ");
      const trimmedOriginal = originalText.replace(/\u00a0/g, " ").trim();
      const trimmedNew = rawNew.trim();
      if (!trimmedOriginal || trimmedNew === trimmedOriginal) return;
      postToParent({
        type: "rakit:visual:text-edit",
        originalText: trimmedOriginal,
        newText: trimmedNew,
        selector: buildSelector(target),
      });
    }
    function cancel() {
      if (committed) return;
      committed = true;
      target.textContent = originalText;
      cleanup();
      postToParent({ type: "rakit:visual:cancelled" });
    }
    function cleanup() {
      target.contentEditable = "false";
      // Restore styles
      const saved = savedStylesRef.current.get(target);
      if (saved) {
        target.style.outline = saved.outline;
        target.style.backgroundColor = saved.bg;
        target.style.cursor = saved.cursor;
        savedStylesRef.current.delete(target);
      }
      editingRef.current = null;
      target.removeEventListener("blur", commit);
      target.removeEventListener("keydown", onKey);
      // Disable mode after a single edit so user doesn't keep
      // accidentally clicking the next element.
      setEnabled(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commit();
        target.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancel();
        target.blur();
      }
    }
    target.addEventListener("blur", commit, { once: true });
    target.addEventListener("keydown", onKey);
  }

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!isTrustedOrigin(e.origin)) return;
      const data = e.data as { type?: string } | null;
      if (!data || typeof data.type !== "string") return;
      switch (data.type) {
        case "rakit:visual:enable":
          setEnabled(true);
          break;
        case "rakit:visual:disable":
          setEnabled(false);
          // If user is mid-edit, blur to commit / cancel via the
          // existing blur listener.
          editingRef.current?.blur();
          clearAllStyles();
          break;
        case "rakit:visual:ping":
          postToParent({ type: "rakit:visual:ready" });
          break;
      }
    }
    window.addEventListener("message", onMessage);
    postToParent({ type: "rakit:visual:ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    function onMouseOver(e: MouseEvent) {
      if (!enabledRef.current) return;
      if (editingRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target === document.documentElement || target === document.body)
        return;

      const prev = hoveredRef.current;
      if (prev && prev !== target) clearHoverStyle(prev);
      // Always show hover outline so user can see what they're aimed
      // at. The "is editable?" check happens on click — don't make
      // the user guess by colour.
      applyHoverStyle(target);
      hoveredRef.current = target;
    }

    function onClick(e: MouseEvent) {
      if (!enabledRef.current) return;
      if (editingRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target === document.documentElement || target === document.body)
        return;

      // Always block the user-app's click handler — otherwise <Link>
      // would navigate the iframe away from the page being edited.
      e.preventDefault();
      e.stopPropagation();

      if (!isTextLeaf(target)) {
        flashShake(target);
        postToParent({
          type: "rakit:visual:noop",
          reason:
            target.children.length > 0
              ? "not-text-leaf"
              : "no-text-content",
        });
        return;
      }

      beginEdit(target);
    }

    function onKey(e: KeyboardEvent) {
      // Escape from selection mode (before user picks anything).
      if (e.key === "Escape" && !editingRef.current) {
        setEnabled(false);
        clearAllStyles();
        postToParent({ type: "rakit:visual:cancelled" });
      }
    }

    document.addEventListener("mouseover", onMouseOver, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mouseover", onMouseOver, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("keydown", onKey, true);
      // Don't clearAllStyles here — disable handler does it. Causing
      // it on every effect re-run would clobber an in-progress edit.
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 2147483647,
        pointerEvents: "none",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 11,
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      }}
    >
      Klik teks untuk edit · Enter simpan · ESC batal
    </div>
  );
}
