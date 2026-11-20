# `public/pilots/` — media for pilot stories

One folder per pilot. **The folder name is the pilot's slug.**

| Folder | Story |
| --- | --- |
| `tanzania-network/` | `/pilots/tanzania-network` |
| `echipparra-kerala/` | `/pilots/echipparra-kerala` |
| `uganda-banana-fibre/` | `/pilots/uganda-banana-fibre` |

In `src/lib/pilots.ts` each story has a short constant for its folder, for
example:

```ts
const TZ = "/pilots/tanzania-network";
// ...
src: `${TZ}/morning-circle.jpg`,
```

## Naming

Use lowercase words with `-`, that say what is in the picture:
`planting-a-seedling.jpg`, not `IMG_2034.JPG`. Files ending in `-poster.jpg`
are the still image shown before a video plays.

## `uploads/` (created by the editor)

When you add a picture in the story editor (`/pilot/create`) while running
`npm run dev`, it is saved to:

```
public/pilots/uploads/<slug>/<name>-<time code>.<ext>
```

This folder does not exist until the first upload. After you publish a story
you can move those files into a normal `<slug>/` folder and update the paths.

## Videos

`.mp4` files are in `.gitignore` (big files), so they are **not in git**. If a
story uses a video, make sure the file is on the server when you deploy.
