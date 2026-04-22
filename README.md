# Rakit-boilerplate

The canvas. Cloned into every new Rakit sandbox as the starting point.

## What's baked in

- **Next.js 15** App Router + TypeScript
- **Tailwind 3** with the Rakit design tokens (warm cream base, desaturated emerald accent)
- **Geist Sans + Geist Mono** typography — no Inter, no dashboard serifs
- **Framer Motion** ready for spring-physics interactions
- **Phosphor icons** — `@phosphor-icons/react`
- `cn()` helper, `Button` primitive, mesh/grain/shimmer utilities
- `min-h-[100dvh]` everywhere (no mobile-jumpy `h-screen`)
- Asymmetric hero on the starter page — anti-center-bias

## Develop

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Design rules (for humans and AIs extending this)

1. **No pure black or pure white.** Use the cream/charcoal tokens.
2. **One accent, desaturated.** Emerald is the brand color. No secondary brand.
3. **Controlled hierarchy.** Headlines stay `text-4xl md:text-5xl`; weight + color do the work, not size.
4. **Anti-card-overuse.** Prefer `border-t` + `divide-y` over boxing every group.
5. **No 3-column equal card rows.** Use asymmetric grids (`grid-cols-12` with spans like 7/5).
6. **Fixed-position grain only.** Never attach to scrolling containers — kills GPU.
7. **Hardware-accelerated motion only.** Animate `transform` / `opacity`, never `top`/`left`/`width`.
8. **Motion with spring physics.** `type: "spring", stiffness: 100, damping: 20` — not linear easing.
9. **`useMotionValue` for magnetic/continuous.** Never `useState` on pointer move.
10. **Memoize infinite loops.** Isolate perpetual animations in their own client leaf.
