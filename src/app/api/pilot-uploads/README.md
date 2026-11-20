# `src/app/api/pilot-uploads/` — `/api/pilot-uploads`

Stores media for stories under `public/` so it is served immediately as a
static file.

## `POST` (`multipart/form-data`)

| Field | Type | Notes |
| --- | --- | --- |
| `file` | `File` | required |
| `slug` | string | folder name, passed through `safeSlug()` |

### Validation order

| Check | Failure |
| --- | --- |
| `editorWritesAllowed()` | `403` |
| `file instanceof File` | `400 { error: "No file was received." }` |
| MIME in `allowed` map | `415` |
| `file.size <= 25 MB` (`MAX_BYTES`) | `413` |

`allowed` (MIME → extension): `image/jpeg→jpg`, `image/png→png`,
`image/webp→webp`, `image/avif→avif`, `image/gif→gif`, `video/mp4→mp4`.
The extension comes from the MIME type, not the uploaded name.

### Storage

```
public/pilots/uploads/<safeSlug>/<stem>-<Date.now().toString(36)>.<ext>
stem = original name without extension, lowercased, [^a-z0-9]+ → "-", max 50, fallback "media"
```

The timestamp suffix prevents overwriting on re-upload.

### Response

```json
200 { "src": "/pilots/uploads/<slug>/<name>", "kind": "image" | "video" }
```

`src` is directly usable as `Media.src`.

## Client side

Called from `MediaEditor` (`src/components/pilot-editor/media-input.tsx`).
On failure, images ≤ 1.5 MB are kept inline as `data:` URLs in the draft.

## Git note

`*.mp4` is git-ignored, so uploaded videos will not be committed. Images will
be, if you `git add` the `uploads/` folder.
