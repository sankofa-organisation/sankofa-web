# `src/app/api/pilot-uploads/` — upload images and videos

**File:** `route.ts` → URL `/api/pilot-uploads`

The editor sends a file here when the author adds a photo or video to a story.

## `POST` — upload one file

The request is a **form** (`multipart/form-data`) with 2 fields:

| Field | Value |
| --- | --- |
| `file` | The image or video. |
| `slug` | The pilot slug. The file is put in a folder with this name. |

### Steps

1. If writes are not allowed → **403**.
2. No file → **400**.
3. Check the type. Only these are allowed → else **415**:
   `image/jpeg`, `image/png`, `image/webp`, `image/avif`, `image/gif`, `video/mp4`.
4. Check the size. Max **25 MB** → else **413**.
5. Make a clean file name: lowercase, `-` instead of spaces, max 50 letters,
   plus a short time code so two uploads with the same name do not overwrite
   each other. Example: `my-photo-lx3k9a.jpg`.
6. Save it to `public/pilots/uploads/<slug>/<name>`.
7. Answer:
   ```json
   { "src": "/pilots/uploads/<slug>/<name>", "kind": "image" }
   ```
   `kind` is `"video"` for mp4, else `"image"`.

Because the file is in `public/`, the browser can show it right away at the
`src` address.

## If upload fails

The editor (`media-input.tsx`) has a backup plan: if the image is small, it
keeps the picture inside the draft as a `data:` URL so the author can keep
working. The author should then **Export** the draft so it is not lost.
