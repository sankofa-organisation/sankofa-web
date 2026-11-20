# `src/app/api/` — route handlers

Backend for the story editor only. The public site does not call these.

| Route | Methods | Handler file |
| --- | --- | --- |
| `/api/pilot-drafts` | `GET`, `POST`, `DELETE` | [`pilot-drafts/route.ts`](pilot-drafts/README.md) |
| `/api/pilot-uploads` | `POST` | [`pilot-uploads/route.ts`](pilot-uploads/README.md) |

Both export `dynamic = "force-dynamic"` (never cached, `ƒ` in build output)
and use Web `Request`/`Response` APIs plus `node:fs/promises`.

## Shared helpers — `src/lib/pilot-editor-server.ts`

| Export | Purpose |
| --- | --- |
| `editorWritesAllowed()` | `NODE_ENV !== "production" \|\| PILOT_EDITOR_ENABLED === "true"` |
| `forbidden()` | `403` JSON response with a user-facing message |
| `safeSlug(value: unknown)` | lowercase, non `[a-z0-9-]` → `-`, trim dashes, max 60, fallback `"untitled"`. Prevents path traversal. |
| `draftsDir` | `${cwd}/content/pilot-drafts` |
| `uploadsRoot` | `${cwd}/public/pilots/uploads` |

## Security model

- No authentication. Protection = writes disabled in production by default.
- File paths are always built from `safeSlug()` output, never raw input.
- Upload MIME types are whitelisted and size-limited.

## Deployment caveat

These handlers write into the project directory. On serverless/immutable
hosts (e.g. Vercel) writes fail or disappear. To make the editor usable in
production, replace the `fs` calls with object storage (S3, R2, Vercel Blob)
and add authentication.
