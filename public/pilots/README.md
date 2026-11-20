# `public/pilots/` — story media

Convention: **one folder per pilot `slug`**. `src/lib/pilots.ts` declares a
base path per story and builds `Media.src` from it:

| Folder | Const in `pilots.ts` | Route |
| --- | --- | --- |
| `uganda-banana-fibre/` | `UG` | `/pilots/uganda-banana-fibre` |
| `echipparra-kerala/` | `KL` | `/pilots/echipparra-kerala` |
| `tanzania-network/` | `TZ` | `/pilots/tanzania-network` |

## Naming

- kebab-case, descriptive (`planting-a-seedling.jpg`).
- Video stills: `<video-name>-poster.jpg`, used as `Media.poster`.

## Missing videos (git-ignored, must be deployed separately)

```
uganda-banana-fibre/the-compound.mp4
uganda-banana-fibre/introducing-the-fibre.mp4
uganda-banana-fibre/ball-play.mp4
uganda-banana-fibre/laughter-and-connection.mp4
tanzania-network/a-class-in-session.mp4
```

Without them, the `<video>` elements show the poster but cannot play.

## `uploads/` (generated)

Created by `POST /api/pilot-uploads` in dev:
`uploads/<safeSlug>/<stem>-<time36>.<ext>`. After publishing a story you may
move files into the pilot's own folder and update the paths in `pilots.ts`.
