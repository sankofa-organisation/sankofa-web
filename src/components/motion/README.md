# `src/components/motion/` — animation wrappers

All files are client components built on `motion/react`. Each one calls
`useReducedMotion()` and renders a plain element when it returns `true`.
`globals.css` additionally neutralises CSS animations under reduced motion.

| Export | Props (defaults) | Implementation | Used in |
| --- | --- | --- | --- |
| `Reveal` | `children, className?, delay=0, y=24, as="div"` (`div\|section\|li\|article\|span`) | `motion[as]` with `initial {opacity:0,y}` → `whileInView`; `viewport { once:true, amount:0.25, margin:"0px 0px -80px 0px" }`; 0.6 s, ease `[0.16,1,0.3,1]` | `pilot-story/story-view.tsx` |
| `RevealGroup` | `children, className?` | Parent variants `hidden → visible` with `staggerChildren: 0.09`, `whileInView`, `once`, `amount: 0.2` | home |
| `RevealItem` | `children, className?` | Child variant: `opacity 0→1`, `y 22→0`, 0.55 s. Must be a descendant of `RevealGroup` | home |
| `TiltCard` | `children, className?, max=7` (degrees) | Pointer offset from centre → `rx/ry` motion values → `useSpring` (`stiffness 200, damping 20`); outer `perspective: 900px`; `whileHover translateZ 8`. Ignores `pointerType === "touch"` | home |
| `Typewriter` | `text, className?, speed=26, startDelay=400, as="span"` (`span\|p`) | Recursive `setTimeout`: `speed + random(0–38) ms`, +240 ms after `.,;:`. Wrapper has `aria-label={text}`; visible text and caret are `aria-hidden` | home (vision quote) |
| `FocusBlur` | `children, className?, maxBlur=5, minOpacity=0.45` | `useScroll({ target, offset: ["start end","end start"] })`; progress `[0, .32, .68, 1]` → blur `[max,0,0,max]`, opacity `[min,1,1,min]` | home, `home/tiassale-section.tsx` |
| `CountUpStat` | `value, className?` | Parses `^(\d+)(.*)$`; `useInView(once, 0.6)` sets a spring (1.4 s); writes `textContent` directly on change (no re-render). Non-numeric values render as-is | **unused** |

## Notes

- `Typewriter` sets state inside `useEffect` for the reduced-motion branch,
  which triggers ESLint `react-hooks/set-state-in-effect` (error, does not
  break the build). Fix by deriving `count`/`done` from `reduce` instead of
  setting them.
- `FocusBlur` animates `filter`, which is paint-heavy; keep it on a small
  number of elements per page.
