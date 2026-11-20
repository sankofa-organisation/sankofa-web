# `src/app/api/pilot-drafts/` — `/api/pilot-drafts`

Persists `PilotDraft` objects (type in `src/lib/pilot-draft.ts`) as JSON files:
`content/pilot-drafts/<safeSlug(slug || id)>.json` (2-space indented, trailing
newline). The `content/` directory is created on first write.

## `GET`

| Case | Response |
| --- | --- |
| OK | `200 { drafts: PilotDraft[], writable: boolean }` — sorted by `updatedAt` desc |
| folder missing (`ENOENT`) | `200 { drafts: [], writable }` |
| other read/parse error | `500 { error }` |

`GET` is allowed even when writes are disabled; `writable` tells the client.

## `POST`

Body: `PilotDraft` (JSON).

| Case | Response |
| --- | --- |
| writes disabled | `403 { error }` |
| invalid JSON | `400 { error: "Malformed draft." }` |
| missing/non-string `id` | `400 { error: "Draft is missing an id." }` |
| OK | `200 { draft, savedTo }` — `draft.updatedAt` replaced with server time; `savedTo` is relative to `cwd` |

Same slug → file is overwritten. The body is not schema-validated beyond `id`.

## `DELETE ?slug=<slug>`

| Case | Response |
| --- | --- |
| writes disabled | `403` |
| deleted or already missing | `200 { ok: true }` |
| other unlink error | `500 { error }` |

Note: the editor client currently only calls `POST`; drafts listed in the
editor's drawer come from `localStorage`.
