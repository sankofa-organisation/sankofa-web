# `src/components/home/` — home page sections

Used only by `src/app/page.tsx`.

## `hero.tsx` — `Hero` (client)

Structure:

```
<section ref=heroRef>
  background: next/image /image.jpg (fill, priority, brightness 0.4) + gradient
              two blurred orbs, y driven by useScroll(heroRef) → useTransform
  grid lg:[1.1fr_0.9fr]
    left:  <h1> words from `headline` + `accentLine`, animated with variants
           (staggerChildren 0.07, each word y 0.5em→0, rotateX -40→0)
           paragraph, CTA links (/curriculum, survey bit.ly), tagline
    right: 3D logo card — COMMENTED OUT ("asked to temporaly remove")
  scroll cue (lg only)
  SVG "dripping paint" divider into the page background
```

- Pointer tilt state (`rx`, `ry`, `rotateX`, `rotateY`, `handlePointer`,
  `resetTilt`, `cardRef`) is still declared for the hidden card; ESLint warns
  they are unused. Do not delete if the logo is coming back.
- Restoring the card: remove the `{/* asked to temporaly remove … */}`
  wrapper and convert the inner `// …` note lines back into `{/* … */}`.
- With reduced motion, `initial` is `false` and parallax offsets are 0.

## `stats-marquee.tsx` — `StatsMarquee` (server)

- Data: local `stats: { value, label }[]`.
- Pure CSS animation: `.marquee-track` contains the list **twice**; keyframes
  translate `0 → -50%` so the loop is seamless. Duration via inline CSS var
  `--marquee-duration: 32s`. `.marquee-group:hover` pauses it.
- First `<ul>` has `aria-label`; the duplicate is `aria-hidden`.
- Rendered inside `<Section tone="ink">`; edge fades use `from-foreground`.

## `tiassale-section.tsx` — `TiassaleSection` (server)

Bilingual section about Tiassalé, Côte d'Ivoire, with a YouTube embed via
`youtube-nocookie.com/embed/${VIDEO_ID}`. **Not mounted** on any page.
Import and place it in `app/page.tsx` to use it.
