"use client";

/**
 * Rakit Visual Edit Bridge — runs INSIDE the user's project iframe and
 * talks to the Rakit dashboard (the parent window) via postMessage.
 *
 * This file lives in the boilerplate (NOT in the user's app code) so it
 * gets shipped with every Rakit project automatically. It self-gates by
 * NODE_ENV: production builds render `null`, so deployed apps don't carry
 * any of this overhead or surface attack area.
 *
 * Protocol (parent → iframe):
 *   { type: "rakit:visual:enable" }   turn selection mode on
 *   { type: "rakit:visual:disable" }  turn it off
 *   { type: "rakit:visual:ping" }     handshake check; we reply with
 *                                     "ready" so parent knows the
 *                                     bridge is loaded
 *
 * Protocol (iframe → parent):
 *   { type: "rakit:visual:ready" }                bridge mounted
 *   { type: "rakit:visual:hover",    element }    pointer moved over
 *   { type: "rakit:visual:selected", element }    element clicked
 *
 * Element shape:
 *   {
 *     tag:        "BUTTON",
 *     selector:   "button.btn-primary:nth-of-type(2)",
 *     id:         "submit-btn" | null,
 *     classes:    "btn btn-primary",
 *     text:       "Daftar Sekarang"        // truncated 200 chars
 *     outerHTML:  "<button …></button>"    // truncated 600 chars
 *     rect:       { x, y, width, height }  // viewport-relative
 *   }
 *
 * Security: we only accept messages from a parent origin matching
 * NEXT_PUBLIC_RAKIT_PARENT_ORIGIN (defaults to *.rakit.dev pattern).
 * Anything else is silently ignored — prevents random pages embedding
 * a Rakit preview from triggering visual edit on the user's project.
 */

import { useEffect, useRef, useState } from "react";

interface SerializedElement {
  tag: string;
  selector: string;
  id: string | null;
  classes: string;
  text: string;
  outerHTML: string;
  rect: { x: number; y: number; width: number; height: number };
}

const HIGHLIGHT_OUTLINE = "2px solid #ff6b1a";
const HIGHLIGHT_BG = "rgba(255, 107, 26, 0.08)";
const SELECTED_OUTLINE = "2px solid #16a34a";
const TEXT_LIMIT = 200;
const HTML_LIMIT = 600;

/**
 * Validate that the postMessage came from the Rakit dashboard, not a
 * random page that happens to embed our preview iframe. Falls open
 * to ANY origin in dev (NEXT_PUBLIC_ALLOW_ANY_PARENT=1) for testing
 * convenience; never use that flag in shipped builds.
 */
function isTrustedOrigin(origin: string): boolean {
  if (process.env.NEXT_PUBLIC_ALLOW_ANY_PARENT === "1") return true;
  // Default allowlist: rakit.dev + localhost (dev). Customise via
  // NEXT_PUBLIC_RAKIT_PARENT_ORIGIN for self-hosted Rakit instances.
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
 * Build a stable-ish CSS selector for an element. Strategy:
 *   1. If it has an id, use #id (high specificity, usually unique).
 *   2. Otherwise walk up the tree, collecting tag.classname:nth-of-type
 *      until we either hit body or have a long-enough chain.
 * Not RFC-correct selectors — good enough for AI to identify the
 * element in source code.
 */
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

function serializeElement(el: Element): SerializedElement {
  const rect = el.getBoundingClientRect();
  const text = (el.textContent ?? "").trim().slice(0, TEXT_LIMIT);
  const outerHTML = el.outerHTML.slice(0, HTML_LIMIT);
  return {
    tag: el.tagName,
    selector: buildSelector(el),
    id: el.id || null,
    classes: el.className && typeof el.className === "string"
      ? el.className.trim()
      : "",
    text,
    outerHTML,
    rect: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    },
  };
}

export function VisualBridge() {
  const [enabled, setEnabled] = useState(false);
  const enabledRef = useRef(false);
  // Track which element currently carries the highlight overlay so
  // we can clean its inline styles when we move to a new one.
  const highlightedRef = useRef<HTMLElement | null>(null);
  // Saved inline-style fragments we touched, so disable() restores
  // the page exactly as we found it (no leaked outline / cursor).
  const savedStylesRef = useRef<Map<HTMLElement, { outline: string; bg: string; cursor: string }>>(
    new Map()
  );

  // Production builds: render nothing. The whole bridge is dev-only.
  if (process.env.NODE_ENV !== "development") return null;

  function applyHighlight(el: HTMLElement, kind: "hover" | "selected") {
    if (!savedStylesRef.current.has(el)) {
      savedStylesRef.current.set(el, {
        outline: el.style.outline,
        bg: el.style.backgroundColor,
        cursor: el.style.cursor,
      });
    }
    el.style.outline =
      kind === "selected" ? SELECTED_OUTLINE : HIGHLIGHT_OUTLINE;
    el.style.backgroundColor = HIGHLIGHT_BG;
    el.style.cursor = "crosshair";
  }

  function clearHighlight(el: HTMLElement) {
    const saved = savedStylesRef.current.get(el);
    if (saved) {
      el.style.outline = saved.outline;
      el.style.backgroundColor = saved.bg;
      el.style.cursor = saved.cursor;
      savedStylesRef.current.delete(el);
    }
  }

  function clearAllHighlights() {
    for (const [el, saved] of savedStylesRef.current.entries()) {
      el.style.outline = saved.outline;
      el.style.backgroundColor = saved.bg;
      el.style.cursor = saved.cursor;
    }
    savedStylesRef.current.clear();
    highlightedRef.current = null;
  }

  function postToParent(payload: object) {
    try {
      window.parent?.postMessage(payload, "*");
    } catch {
      /* parent gone — nothing to do */
    }
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
          clearAllHighlights();
          break;
        case "rakit:visual:ping":
          postToParent({ type: "rakit:visual:ready" });
          break;
      }
    }
    window.addEventListener("message", onMessage);
    // Announce ready on mount so a parent that's already listening
    // doesn't have to ping first.
    postToParent({ type: "rakit:visual:ready" });
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    // We use capture so we see events before the user's app handlers
    // and can preventDefault before any nav/submit fires. Required:
    // clicking a <Link> would normally navigate the iframe.
    function isOurChrome(target: EventTarget | null): boolean {
      // Skip our own root host element if we add one in the future.
      // Also avoid hijacking clicks on the iframe's scrollbar, etc.
      if (!target) return false;
      const el = target as Element;
      if (el === document.documentElement) return true;
      if (el === document.body) return true;
      return false;
    }

    function onMouseOver(e: MouseEvent) {
      if (!enabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target || isOurChrome(target)) return;
      // Move highlight to new element
      const prev = highlightedRef.current;
      if (prev && prev !== target) clearHighlight(prev);
      applyHighlight(target, "hover");
      highlightedRef.current = target;
      postToParent({
        type: "rakit:visual:hover",
        element: serializeElement(target),
      });
    }

    function onClick(e: MouseEvent) {
      if (!enabledRef.current) return;
      const target = e.target as HTMLElement | null;
      if (!target || isOurChrome(target)) return;
      // Suppress the user-app's own click handler — otherwise clicking
      // a Link would navigate the iframe away from the page being
      // edited. Only kicks in while edit mode is on.
      e.preventDefault();
      e.stopPropagation();
      // Briefly show the "selected" green outline so user sees their
      // pick was registered, then clear after parent presumably
      // disables edit mode.
      const prev = highlightedRef.current;
      if (prev && prev !== target) clearHighlight(prev);
      applyHighlight(target, "selected");
      highlightedRef.current = target;
      postToParent({
        type: "rakit:visual:selected",
        element: serializeElement(target),
      });
    }

    function onKey(e: KeyboardEvent) {
      // Escape cancels selection mode locally (parent should also
      // honour this when it sees no further "selected" event).
      if (e.key === "Escape") {
        setEnabled(false);
        clearAllHighlights();
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
      clearAllHighlights();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  // Render a tiny dev-only banner so the user inside the iframe
  // realises we're intercepting clicks (not just a phantom freeze).
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
      Visual edit aktif — klik elemen, ESC batal
    </div>
  );
}
