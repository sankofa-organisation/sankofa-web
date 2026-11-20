# `src/app/api/` — server APIs for the story editor

These are **not pages**. They are small server functions that the story editor
(`/pilot/create`) calls with `fetch()`. Each folder has a `route.ts` file.
A function named `GET`, `POST` or `DELETE` in that file answers that HTTP method.

| URL | Method | What it does |
| --- | --- | --- |
| `/api/pilot-drafts` | `GET` | List all drafts saved on the disk. |
| `/api/pilot-drafts` | `POST` | Save one draft (JSON body) to the disk. |
| `/api/pilot-drafts?slug=abc` | `DELETE` | Delete one saved draft. |
| `/api/pilot-uploads` | `POST` | Save one image or video file into `public/`. |

Both files have `export const dynamic = "force-dynamic"`. This means Next.js
runs them on every request and never caches them.

## Shared helpers

Both routes use `src/lib/pilot-editor-server.ts`:

| Helper | Job |
| --- | --- |
| `editorWritesAllowed()` | `true` in dev. In production only if `PILOT_EDITOR_ENABLED=true`. |
| `forbidden()` | Sends back HTTP **403** with a friendly message. |
| `safeSlug()` | Cleans a slug so it only has `a-z`, `0-9` and `-`. This stops tricks like `../../etc` from writing outside the folder. |
| `draftsDir` | `<project>/content/pilot-drafts/` |
| `uploadsRoot` | `<project>/public/pilots/uploads/` |

## Why writes are off in production

These routes write files to the project folder. On a real server that is
risky, and many hosts delete those files anyway. So they only work on your own
computer (`npm run dev`) unless you turn them on on purpose.

See the README in each sub-folder for details.
