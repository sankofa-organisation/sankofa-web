# `src/components/home/` — home page pieces

These are only used on the home page (`src/app/page.tsx`).

| File | Client? | What it does |
| --- | --- | --- |
| `hero.tsx` | yes | The big top section. Dark background photo (`public/image.jpg`), floating color orbs that move with scroll (parallax), the headline that appears word by word, two buttons (Curriculum, Survey) and a scroll hint. **The 3D logo card on the right is commented out** ("asked to temporaly remove"). |
| `stats-marquee.tsx` | no | A strip of numbers (14 countries, STREAM, 5+ pilots, 1M children) that scrolls sideways forever. The list is drawn twice and moved by -50% in a loop, so it looks endless. The CSS is in `globals.css` (`.marquee-track`). Stops on hover. |
| `tiassale-section.tsx` | no | A section about Tiassalé, Côte d'Ivoire with a YouTube video (`VIDEO_ID`). **Not used on any page right now.** |

## How the hero animations work (short)

- `useScroll` + `useTransform` → when you scroll, the orbs move up/down at
  different speeds (parallax).
- The headline words are in the `headline` array. `wordContainer` and `word`
  are motion "variants" that show each word 0.07 s after the last one.
- The 3D tilt code (`rx`, `ry`, `handlePointer`, `resetTilt`) is still in the
  file. It was only used by the logo card, so ESLint now warns that those
  values are unused. Leave them; they are needed when the logo comes back.
