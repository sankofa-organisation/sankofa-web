# `src/`

All application source. Compiled by Next.js; nothing here is served raw.

| Folder | Responsibility | May import from |
| --- | --- | --- |
| [`app/`](app/README.md) | Routing (App Router): pages, layouts, route handlers, metadata, global CSS | `components/`, `lib/` |
| [`components/`](components/README.md) | Reusable React components (server and client) | `lib/`, other components |
| [`lib/`](lib/README.md) | Types, content data, pure logic, server-only helpers | `lib/` only (+ React in `rich-text.tsx`) |

Dependency direction is one-way: `app → components → lib`. `lib` must not
import from `app` or `components`.

## Path alias

`tsconfig.json`: `"paths": { "@/*": ["./src/*"] }`. Always import across
folders with `@/…` (e.g. `@/lib/pilots`); use relative imports only inside the
same folder (e.g. `./block-editor`).

## Server / client boundary

- Default: React Server Component (RSC).
- `"use client"` at the top of a file makes it — and everything it imports — part
  of the client bundle.
- `src/lib/pilot-editor-server.ts` uses `node:path` and must only be imported
  by route handlers. `src/lib/pilot-draft.ts` touches `window.localStorage`
  behind `typeof window` guards and is safe on both sides.
- Values passed from an RSC to a client component (props) are serialised into
  the page payload and are publicly visible.
