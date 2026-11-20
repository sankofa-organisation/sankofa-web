# `src/components/motion/` — animation helpers

All files here are **client components** (`"use client"`) and use the
`motion` library (`motion/react`).

**Every one of them checks `useReducedMotion()`.** If the visitor's device asks
for less motion, the content is shown with no animation. Please keep this rule
when you add new ones.

| File | Component(s) | What it does | Used in |
| --- | --- | --- | --- |
| `reveal.tsx` | `Reveal` | Content fades in and moves up a little, **once**, when it scrolls into view. | story-view |
| `reveal.tsx` | `RevealGroup` + `RevealItem` | Same, but the children come in one after another (stagger). Put `RevealItem`s inside a `RevealGroup`. | home page |
| `tilt-card.tsx` | `TiltCard` | A card that tilts in 3D toward the mouse and lifts a bit. | home page |
| `typewriter.tsx` | `Typewriter` | Types text letter by letter with a blinking caret. Screen readers get the full text at once (`aria-label`). | home page (vision text) |
| `focus-blur.tsx` | `FocusBlur` | Content is a little blurred at the top/bottom of the screen and sharp in the middle, while you scroll. | home page, tiassale-section |
| `count-up.tsx` | `CountUpStat` | A number that counts up from 0 (e.g. `"14"`, `"5+"`). Text like `"STREAM"` is shown as is. | **not used right now** |

## Example

```tsx
<RevealGroup className="grid gap-4 sm:grid-cols-3">
  {items.map((it) => (
    <RevealItem key={it.title}>
      <TiltCard>...</TiltCard>
    </RevealItem>
  ))}
</RevealGroup>
```

## Known lint error

`typewriter.tsx` calls `setState` inside `useEffect` (for the reduced-motion
case). ESLint reports this as `react-hooks/set-state-in-effect`. It works, and
it does not stop the build.
