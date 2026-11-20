# `src/lib/` — data and helper functions

Code here does **not** draw pages (except `rich-text.tsx`). It holds the site's
data and shared logic.

| File | What is inside |
| --- | --- |
| `nav.ts` | The menu links. `primaryNav` = the main menu (Introduction, Curriculum, Pilot Projects, About Us, Members, News, Contact). `portalNav` = Member Portal links (`/portal/...`). Used by the header and footer. **Note:** the `/portal` pages are not built yet, so these links show the 404 page. |
| `members.ts` | Type `Member` (name, country, groups) and the `members` list (June 2026 list). **No emails or phone numbers on purpose** — do not add them back. `WorkingGroup` = `"Curricula" \| "Communication" \| "Implementation"`. |
| `pilots.ts` | The **main content file** for pilots. Types (`Pilot`, `PilotStory`, `StoryBlock`, `Media`, `PilotStatus`), the 3 full stories (`bananaFibreStory`, `echipparraStory`, `tanzaniaStory`), the `pilots` list (6 pilots), `statusStyles` (badge colors), `getPilot(slug)` and `pilotsWithStories`. |
| `pilot-draft.ts` | Logic for the story editor (works in the browser). The `PilotDraft` type, empty templates (`createEmptyDraft`, `emptyBlock`), `slugify`, word count and reading time (200 words = 1 min), `validateDraft`, saving drafts in `localStorage`, and `toTypeScript` (turns a draft into code for `pilots.ts`). |
| `pilot-editor-server.ts` | Logic for the editor **APIs** (server only, uses Node `path`). Where to save (`draftsDir`, `uploadsRoot`), `editorWritesAllowed()`, `forbidden()`, and `safeSlug()` which blocks bad file paths. |
| `rich-text.tsx` | `renderInline(text)`: turns `**bold**`, `_italic_` and `[label](url)` inside a plain string into real HTML. Outside links open in a new tab. |
| `cn.ts` | `cn(...)`: joins class names. `clsx` drops empty/false values, `tailwind-merge` removes clashes (e.g. `p-2` + `p-4` → `p-4`). |

## Story blocks (from `pilots.ts`)

```ts
type StoryBlock =
  | { type: "heading";   text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote";     text: string; attribution?: string }
  | { type: "list";      items: string[] }
  | { type: "numbered";  items: string[] }
  | { type: "pathway";   steps: string[] }      // steps with arrows between
  | { type: "table";     caption?: string; columns: string[]; rows: string[][] }
  | { type: "media";     items: Media[] };      // images and/or videos
```

This is a **union type**. The `type` field tells TypeScript (and the
`switch` in `story-view.tsx`) which other fields exist.

## To add a block type

1. Add it to `StoryBlock` in `pilots.ts`.
2. Draw it in `Block` in `src/components/pilot-story/story-view.tsx`.
3. In `pilot-draft.ts`: add it to `blockTypes`, `blockLabels`, `emptyBlock`,
   `countWords` and `blockSource`.
4. Add its inputs in `src/components/pilot-editor/block-editor.tsx`.

TypeScript will show errors in every `switch` you forgot. That helps you.
