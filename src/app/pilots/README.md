# `src/app/pilots/` — the pilot projects pages

| File | URL | What it shows |
| --- | --- | --- |
| `page.tsx` | `/pilots` | A card for every pilot project. |
| `[slug]/page.tsx` | `/pilots/<slug>` | The full story of one pilot. See [`[slug]/README.md`](%5Bslug%5D/README.md). |

## `page.tsx` (the list)

- Reads the `pilots` array from `src/lib/pilots.ts` and splits it in two:
  - `featured` = pilots **with** a story. Shown big, with the hero photo,
    tag, date and title, and a link to `/pilots/<slug>`.
  - `rest` = pilots **without** a story. Shown as smaller cards with name,
    country, status badge and the short `body` text. No link.
- The badge color comes from `statusStyles` (also in `src/lib/pilots.ts`).

## To add a pilot

Add it to the `pilots` array in `src/lib/pilots.ts`. A pilot without a `story`
is fine — it just shows a card. To write a story, use the editor at
`/pilot/create` (see `src/app/pilot/README.md`).
