# Rakit boilerplate

Next.js 15 (App Router) + Tailwind v3 + `@opennextjs/cloudflare`, ready to
deploy into a Cloudflare Workers-for-Platforms dispatch namespace via the
Rakit deploy pipeline.

## Scripts

- `bun install` — install deps
- `bun run dev` — start dev server on `0.0.0.0:3000`
- `bun run build:cf` — produce `.open-next/worker.js` + `.open-next/assets/`
- `bun run preview:cf` — build and serve locally via `wrangler dev`
- `bun run typecheck` — type-check only

## Rakit deploy flow

`bun run build:cf` in the Daytona sandbox → Rakit pulls `.open-next/` →
uploads Worker script + Static Assets to the dispatch namespace → writes
KV route for `<subdomain>.rakit.dev`.
