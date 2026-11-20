# `src/app/curriculum/` — `/curriculum`

| File | Kind |
| --- | --- |
| `page.tsx` | RSC, statically prerendered |

## Data (module-level constants)

| Const | Content |
| --- | --- |
| `stream` | `{ icon, letter, word, note }[]` — the 6 STREAM disciplines |
| `principles` | Pedagogical principles (local materials, daily life, culture, …) |
| `themes` | Learning themes |

## Composition

`PageHero` → `Section` + `SectionHeader` blocks mapping over the arrays →
`ButtonLink` calls to action. No client components.
