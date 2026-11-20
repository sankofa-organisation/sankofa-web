# `src/app/api/pilot-drafts/` — save, list and delete drafts

**File:** `route.ts` → URL `/api/pilot-drafts`

A **draft** is a pilot story that is not published yet. Its shape is
`PilotDraft` (see `src/lib/pilot-draft.ts`). Drafts are saved as JSON files in:

```
content/pilot-drafts/<slug>.json
```

(The `content/` folder is created the first time you save.)

## `GET` — list drafts

1. Read every `.json` file in `content/pilot-drafts/`.
2. Sort them, newest first (by `updatedAt`).
3. Answer: `{ drafts: [...], writable: true | false }`.

If the folder does not exist yet, it answers with an empty list (not an error).
`writable` tells the editor if the Save button can work.

## `POST` — save a draft

1. If writes are not allowed → **403**.
2. Read the JSON body. Bad JSON → **400**. No `id` → **400**.
3. Set `updatedAt` to now.
4. Write the file `content/pilot-drafts/<safeSlug(slug or id)>.json`.
5. Answer: `{ draft, savedTo: "content/pilot-drafts/xyz.json" }`.

Saving the same slug again **overwrites** the old file.

## `DELETE` — remove a draft

Call `/api/pilot-drafts?slug=xyz`.

1. If writes are not allowed → **403**.
2. Delete `content/pilot-drafts/xyz.json`.
3. If the file was already gone, that is fine. Answer `{ ok: true }`.
