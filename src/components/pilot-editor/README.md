# `src/components/pilot-editor/` — story authoring app

Client-only app mounted at `/pilot/create`. It edits a `PilotDraft`, previews
it with the production renderer, and exports TypeScript for
`src/lib/pilots.ts`. Pure logic lives in `src/lib/pilot-draft.ts`.

## Files

| File | Exports | Responsibility |
| --- | --- | --- |
| `editor.tsx` | `PilotEditor` | Root. Owns all state, history, autosave, keyboard shortcuts, ribbon, drafts drawer, view modes, validation display, preview |
| `document-panel.tsx` | `DocumentPanel({ draft, issues, onDraftChange, onStoryChange })` | Collapsible groups: *Story header*, *Hero image*, *At a glance* (facts), *Pilot & index card*. Editing `name` also sets `slug = slugify(name)` unless the slug is locked (`slugLocked`). Shows field errors from `issues`. |
| `block-editor.tsx` | `BlockCard({ block, index, total, slug, active, onChange, onMove, onDuplicate, onDelete, onFocus })`, re-exports `Field` | Per-type editors (`BlockBody` switch). `ItemRow` for list/step rows: Enter adds a row, Shift+Enter is a newline. Table editor manages columns/rows/cells. Media blocks use `MediaEditor`. |
| `fields.tsx` | `FormatProvider`, `useFormatting`, `Field`, `TextInput`, `Select<T>`, `RichTextArea`, `IconButton` | Form primitives + formatting context (below). |
| `media-input.tsx` | `MediaEditor({ value, onChange, onRemove?, slug, label? })`, re-exports `emptyMedia` | File picker / drag-and-drop → upload → `Media` fields (alt, caption, aspect, kind). |

## State (in `PilotEditor`)

| State | Type | Notes |
| --- | --- | --- |
| `draft` | `PilotDraft \| null` | `null` until hydrated from `localStorage` on mount |
| `history` | `{ past: PilotDraft[]; future: PilotDraft[] }` | max 60 past snapshots |
| `localDrafts` | `PilotDraft[]` | drawer list (from `localStorage`) |
| `view` | `"write" \| "split" \| "preview"` | |
| `saveState` | `"idle" \| "saving" \| "saved" \| "error"` | server save status |
| `panelOpen`, `drawerOpen`, `activeBlock`, `message`, `savedAt` | UI | |

### Update path

```
patchStory(partial) → patchDraft({ story: {...draft.story, ...partial} })
patchDraft(partial) → pushHistory(draft) → setDraft({...draft, ...partial})
commit(next)        → force a history entry, replace whole draft (open/import/new)
```

`pushHistory` skips snapshots taken < 600 ms apart (`HISTORY_COALESCE_MS`), so
a burst of typing is one undo step. Any new edit clears `future`.

### Side effects

| Effect | Trigger | Action |
| --- | --- | --- |
| Hydration | mount | `loadLocalDrafts()` → open newest or `createEmptyDraft()` |
| Autosave | `draft` change, debounced 700 ms | `persistLocalDraft()` (key `sankofa.pilot-drafts.v1`, max 25, newest first) |
| Shortcuts | `keydown` on window | Ctrl/Cmd+S `saveToServer`, +Z undo, +Shift+Z / +Y redo |

### Commands (ribbon)

| Button | Implementation |
| --- | --- |
| Undo / Redo | move snapshots between `past` and `future` |
| Write / Split / Preview / Properties | `view`, `panelOpen` |
| Insert | `emptyBlock(type)` inserted after the active block |
| Bold / Italic / Link | `useFormatting().wrap(prefix, suffix)` |
| Drafts / New / Open | drawer of local drafts; `createEmptyDraft()`; import `.json` (must contain `story.blocks`) |
| Save | `POST /api/pilot-drafts` with the draft JSON |
| Export | download `<slug>.json` via Blob URL |
| Copy as TypeScript | `navigator.clipboard.writeText(toTypeScript(draft))` |
| Print | `window.print()` |

### Preview

`draftToPilot(draft)` + current story with computed reading time is passed to
`StoryArticle` (no `backHref`). Same component as production → WYSIWYG.

## Formatting context (`fields.tsx`)

`FormatProvider` holds a ref to the last focused text field
(`{ el, setValue }`). `RichTextArea` registers itself on focus and handles
Ctrl/Cmd+B / Ctrl/Cmd+I locally. `wrap(prefix, suffix)` inserts markers around
the current selection (or the placeholder `"text"`), calls the field's
`setValue`, then restores the selection in `requestAnimationFrame`.
Markers match `renderInline()`: `**…**`, `_…_`, `[…](…)`.

## Uploads (`media-input.tsx`)

```
file → FormData { file, slug || "untitled" } → POST /api/pilot-uploads
  200        → onChange({ ...value, src, kind })
  error/403  → if image && size ≤ 1.5 MB → src = data: URL (FileReader) + warning to Export
             → else show error
  network    → "Upload failed — is the dev server still running?"
```

Data URLs inflate drafts; `persistLocalDraft` silently ignores
`localStorage` quota errors, so large inline images may not autosave.

## Known limitations

- Server-saved drafts (`content/pilot-drafts`) are not loaded back into the
  UI; the drawer only shows browser drafts. Use Export/Open to move work
  between machines.
- No auth; intended for local use only (see `src/app/api/README.md`).
- Publishing is manual: paste generated code into `src/lib/pilots.ts`.
