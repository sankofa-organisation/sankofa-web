# `src/app/pilots/` — `/pilots` and `/pilots/[slug]`

| File | URL | Rendering |
| --- | --- | --- |
| `page.tsx` | `/pilots` | static |
| `[slug]/page.tsx` | `/pilots/<slug>` | SSG — see [`[slug]/README.md`](%5Bslug%5D/README.md) |

## `/pilots` index

Source: `pilots` from `src/lib/pilots.ts`, split in the component:

```ts
const featured = pilots.filter((p) => p.story);   // full-width cards, image side alternates
const rest     = pilots.filter((p) => !p.story);  // compact cards, no link
```

- Featured cards link to `/pilots/${slug}` and show `story.hero`, `story.tag`,
  `story.date` (`<time dateTime>`), `story.title`.
- Compact cards show `name`, `country`, status badge (`statusStyles[status]`)
  and `body`.
- Array order in `lib/pilots.ts` = display order.
