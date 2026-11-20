# `src/lib/` — types, content, logic

No UI here (except `rich-text.tsx`, which returns React nodes). Must not
import from `app/` or `components/`.

| File | Runtime | Exports |
| --- | --- | --- |
| `pilots.ts` | both | `PilotStatus`, `StoryBlock`, `Media`, `PilotStory`, `Pilot`, `pilots`, `statusStyles`, `getPilot`, `pilotsWithStories` |
| `members.ts` | both | `WorkingGroup`, `Member`, `members` |
| `nav.ts` | both | `NavItem`, `primaryNav`, `portalNav` |
| `pilot-draft.ts` | both (browser APIs guarded) | editor model + logic (below) |
| `pilot-editor-server.ts` | **server only** (`node:path`, `process.cwd()`) | `editorWritesAllowed`, `draftsDir`, `uploadsRoot`, `forbidden`, `safeSlug` |
| `rich-text.tsx` | both | `renderInline(text): ReactNode[]` |
| `cn.ts` | both | `cn(...ClassValue[]) = twMerge(clsx(...))` |

## `pilots.ts` — pilot content (~780 lines)

```ts
type Pilot = { slug; name; country; status: PilotStatus; body; story?: PilotStory };
```

- Three story objects (`bananaFibreStory`, `echipparraStory`, `tanzaniaStory`),
  each with a folder const (`UG`, `KL`, `TZ`) for media paths.
- `pilots: Pilot[]` — 6 entries; array order = display order on `/pilots`.
- `getPilot(slug)` — linear `find`.
- `pilotsWithStories` — filtered with a type guard, so `p.story` is
  non-optional in consumers (`generateStaticParams`).
- `statusStyles` — `Record<PilotStatus, string>` badge classes.

Full type definitions: root README §8.1. `StoryBlock` is a discriminated union
on `type`; switches over it are exhaustive, so adding a member produces
compile errors at every place that must handle it:

1. `components/pilot-story/story-view.tsx` → `Block`
2. `lib/pilot-draft.ts` → `blockTypes`, `blockLabels`, `emptyBlock`,
   `countWords`, `blockSource`, (optional) `validateDraft`
3. `components/pilot-editor/block-editor.tsx` → `BlockBody`
4. `components/pilot-editor/editor.tsx` → `blockPreview`

## `members.ts`

`Member = { name, country, groups: WorkingGroup[] }`. Contact fields were
removed deliberately — do not add them back (see root README §7.3).
`name` is used as the React key and the photo-map key, so it must be unique
and match `photos` in `app/members/page.tsx` exactly.

## `nav.ts`

`NavItem = { label, href, description? }`. `primaryNav` drives header and
footer; `portalNav` points to `/portal/*`, which is **not implemented** (404).

## `pilot-draft.ts` — editor model

| Export | Purpose |
| --- | --- |
| `PilotDraft` | `{ id, slug, name, country, status, body, story, updatedAt }` |
| `BlockType`, `blockTypes`, `blockLabels`, `statuses`, `aspects` | enumerations for UI pickers |
| `DRAFTS_KEY` | `"sankofa.pilot-drafts.v1"` (bump the version if the shape changes) |
| `slugify(s)` | NFKD, strip diacritics, `[^a-z0-9]+ → -`, max 60 |
| `newId()` | `draft-<time36>-<rand6>` |
| `emptyMedia(kind)`, `emptyBlock(type)`, `createEmptyDraft()` | factories |
| `formatDisplayDate(iso)` | `en-GB` long date |
| `countWords(story)`, `readingTimeFor(story)` | words across lead + all blocks; `max(1, round(words/200))` min read |
| `draftToPilot(draft)` | `PilotDraft → Pilot` |
| `Issue`, `validateDraft(draft)` | `{ field, message, level: "error"\|"warning" }[]`; `field` is a form field name or `block-<index>` |
| `loadLocalDrafts`, `persistLocalDraft`, `removeLocalDraft` | `localStorage` CRUD, SSR-safe, keeps 25 newest, swallows quota errors on write |
| `toTypeScript(draft)` | code generator: `const <camelSlug>Story: PilotStory = {…}` + a `pilots` entry; strings escaped with `JSON.stringify` |

## `pilot-editor-server.ts`

See `src/app/api/README.md`. Importing this into a client component will fail
the build (Node built-ins).

## `rich-text.tsx`

```ts
const INLINE = /(\*\*[^*\n]+\*\*|_[^_\n]+_|\[[^\]\n]+\]\([^)\s]+\))/g;
```

`text.split(INLINE)` → each part becomes `<strong>`, `<em>`, `<a>` or a text
fragment. Single level, no nesting, no escaping syntax. External links
(`^https?://`) get `target="_blank" rel="noreferrer noopener"`. Output is
React elements, never `dangerouslySetInnerHTML`, so it is XSS-safe.
