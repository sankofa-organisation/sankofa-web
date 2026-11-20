# `src/components/pilot-story/` — how a pilot story looks

**File:** `story-view.tsx`

This file is the **design of a pilot story article**. It is used in 2 places:

1. The real page: `src/app/pilots/[slug]/page.tsx`
2. The live preview in the editor: `src/components/pilot-editor/editor.tsx`

Because both use the same code, **what the author sees is what readers get**.

## What is inside

| Export | What it does |
| --- | --- |
| `StoryArticle` | The whole article: header (back link, tag, status, title, date, reading time, location, lead text), the hero image, the "facts" boxes, and then every block. Props: `pilot`, `story`, optional `backHref` (hidden in the preview) and `children` (extra content at the bottom). |
| `Block` | Draws **one** block. A `switch` on `block.type` picks the HTML: `heading` → `<h2>`, `paragraph` → `<p>`, `quote` → `<blockquote>`, `list` → `<ul>`, `numbered` → `<ol>`, `pathway` → steps with arrows, `table` → `<table>`, `media` → a grid of images/videos. |
| `MediaFrame` | One image or video with its caption. |
| `aspectClass` | Maps `landscape / portrait / square / wide / tall` to a Tailwind aspect ratio class. |
| `StoryPilot` | Type: the few pilot fields the article needs (name, country, status, ...). |

## Text formatting

Text in blocks goes through `renderInline()` from `src/lib/rich-text.tsx`, so
`**bold**`, `_italic_` and `[label](url)` work.

## Images

- Normal images (`src` starts with `/` or `http`) use Next.js `<Image>`, which
  makes them smaller and faster.
- Images that are still only in the browser (`blob:` or `data:` URLs, from the
  editor before upload) cannot be optimised, so they use a plain `<img>`.
- An empty `src` shows a grey image icon (useful in the editor).
