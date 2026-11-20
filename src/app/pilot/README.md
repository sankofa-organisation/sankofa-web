# `src/app/pilot/` — the pilot story editor

| File | URL |
| --- | --- |
| `create/page.tsx` | `/pilot/create` |

(Note: `pilot` here is **singular**. The public pages are in `pilots/`, plural.)

## What it is

A small Word-like tool to **write a new pilot story** with headings,
paragraphs, quotes, lists, tables, photos and videos, and see a live preview.

`create/page.tsx` is very small. It only:

1. Sets `robots: { index: false }` so Google does not show this tool.
2. Renders `<PilotEditor />` from `src/components/pilot-editor/editor.tsx`.

All the real work is in `src/components/pilot-editor/` and
`src/lib/pilot-draft.ts`. Read the README in `src/components/pilot-editor/`.

## How a story goes live

1. Write it at `/pilot/create` (run `npm run dev` on your computer).
2. Click **Copy as TypeScript**.
3. Paste the code into `src/lib/pilots.ts`.
4. Build and deploy again.
