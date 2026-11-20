# `src/app/about/` — `/about`

| File | Kind |
| --- | --- |
| `page.tsx` | RSC, statically prerendered |

## Data (module-level constants)

| Const | Shape | Rendered as |
| --- | --- | --- |
| `groups` | `{ icon: LucideIcon, title, … }[]` — the 3 working groups | icon cards |
| `leadership` | `{ name, role, org, photo }[]` — photo path in `public/members/` | leadership cards |
| `countries` | `string[]` | country chips |

## Composition

`PageHero` → `Section`s with `SectionHeader`, `next/image`, lucide icons
(`BookOpenCheck`, `Radio`, `Rocket`, `ArrowRight`) and a `ButtonLink` call to
action.

## Editing

Change the constants; the JSX maps over them. Adding an item needs no markup
change. Icons must be imported from `lucide-react`.
