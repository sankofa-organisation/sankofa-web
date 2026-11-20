# `src/components/pilot-editor/` — the story editor (`/pilot/create`)

A Word-like tool to write a pilot story. All files are **client components**.
The data types and logic (no UI) are in `src/lib/pilot-draft.ts`.

## Files

| File | What it does |
| --- | --- |
| `editor.tsx` | The main component, `PilotEditor`. Holds the draft in state, the ribbon (toolbar), undo/redo, autosave, save to server, export/import, the drafts drawer and the live preview. |
| `document-panel.tsx` | The right-side **Properties** panel. Groups: *Story header* (headline, tag, date, reading time, location, lead), *Hero image*, *At a glance* (facts), *Pilot & index card* (name, slug, country, status, card text). Typing the name also fills the slug, unless you lock the slug. |
| `block-editor.tsx` | `BlockCard`: the editing box for **one** block. It has the right inputs for each block type (list items, pathway steps, table cells, media items) and buttons to move up/down, duplicate and delete. |
| `fields.tsx` | Small inputs: `Field` (label + input), `TextInput`, `Select`, `RichTextArea` (grows as you type). Also `FormatProvider` / `useFormatting`: remembers the **last text box you clicked**, so the ribbon's Bold / Italic / Link buttons act on it, like in Word. |
| `media-input.tsx` | `MediaEditor`: pick or drag an image/video, upload it, set alt text, caption and shape (aspect). |

## How data moves

```
           ┌────────────── PilotEditor (editor.tsx) ──────────────┐
           │  state: draft (PilotDraft), history (undo/redo)      │
           │                                                      │
 typing ──►│ patchDraft / patchStory ──► new draft ──► re-render  │
           │        │                                    │        │
           │        ▼                                    ▼        │
           │  pushHistory (undo)              StoryArticle preview│
           └────────┬─────────────────────────────────────────────┘
                    │ 0.7 s after the last change
                    ▼
            localStorage "sankofa.pilot-drafts.v1"  (max 25 drafts)
```

- **Undo / Redo:** before each change the old draft is kept in `history.past`
  (max 60). Fast typing within 0.6 s counts as one step.
- **Autosave:** 0.7 s after you stop typing, the draft is saved in the browser.
  On page load, the newest local draft is opened again.
- **Save** button (or **Ctrl+S**): `POST /api/pilot-drafts` → writes
  `content/pilot-drafts/<slug>.json` (only works in dev, see `src/app/api/`).
- **Images:** `media-input.tsx` sends the file to `POST /api/pilot-uploads`.
  If that fails and the image is under 1.5 MB, it is kept in the draft as a
  `data:` URL so you can keep working (then use Export to keep it).
- **Export:** downloads the draft as `<slug>.json`. **Open:** loads such a file.
- **Copy as TypeScript:** `toTypeScript()` turns the draft into code. Paste it
  into `src/lib/pilots.ts` to publish the story.
- **Print:** uses the browser print.

## Checks before publishing

`validateDraft()` (in `src/lib/pilot-draft.ts`) lists problems:

- **Errors** (must fix): no headline, no name, bad slug, no country, no hero
  image, an image with no alt text.
- **Warnings** (should fix): empty card text, empty lead, empty blocks.

## Keyboard shortcuts

| Keys | Action |
| --- | --- |
| Ctrl/Cmd + S | Save to server |
| Ctrl/Cmd + Z | Undo |
| Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y | Redo |
| Ctrl/Cmd + B | Bold (`**text**`) in the current text box |
| Ctrl/Cmd + I | Italic (`_text_`) in the current text box |

## View modes

**Write** (editor only), **Split** (editor + preview side by side, on large
screens) and **Preview** (preview only).
