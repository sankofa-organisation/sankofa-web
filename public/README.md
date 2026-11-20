# `public/` — static assets

Served as-is from the site root by Next.js (`public/x.png` → `/x.png`).
Reference with absolute paths without the `public` prefix. Files here are
**publicly downloadable**, including this README — never put private data here.

Images are normally rendered through `next/image`, which resizes and converts
them on demand; originals can therefore be large, but keep them reasonable
(≤ ~2 MB) for build/deploy size.

## Files

| Path | Used by |
| --- | --- |
| `logo.png` (1536×1024) | header, footer, hero card — all **currently commented out** |
| `image.jpg` | `components/home/hero.tsx` background |
| `image1.jpg`, `image2.jpg`, `image3.jpg` | `app/page.tsx` → `pillars[].image` |
| `contact.png` | `app/contact/page.tsx` |
| `sankofa-bird.jpg` | unused |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | unused `create-next-app` leftovers |

Favicons are **not** here; they are `src/app/icon.png` and
`src/app/apple-icon.png` (Next file-based metadata).

## Folders

| Folder | Contents |
| --- | --- |
| [`members/`](members/README.md) | portraits for `/members` and `/about` |
| [`pilots/`](pilots/README.md) | story media, one folder per pilot slug |

## Git

`.gitignore` excludes `*.mp4`, `*.mov`, `*.avi`, `*.tiff` and similar large
media. Such files must be deployed separately (see root README §15).
