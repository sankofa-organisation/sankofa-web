# `src/components/pilot-story/` — story renderer

`story-view.tsx` (server-compatible; uses client `Reveal` inside). Single
source of truth for how a `PilotStory` looks. Used by:

- `src/app/pilots/[slug]/page.tsx` (production, prerendered)
- `src/components/pilot-editor/editor.tsx` (live preview, client)

Because the editor imports it, this file must stay usable from a client
component: no server-only imports, no async components.

## Exports

| Export | Signature | Role |
| --- | --- | --- |
| `StoryPilot` | `{ slug, name, country, status }` | Minimal pilot identity needed by the article |
| `aspectClass` | `Record<Media["aspect"], string>` | `landscape 4/3`, `portrait 3/4`, `square`, `wide 2/1`, `tall 9/16` |
| `MediaFrame` | `({ item: Media, priority?: boolean })` | `<figure>` with image or video + optional `<figcaption>` |
| `Block` | `({ block: StoryBlock })` | `switch (block.type)` → element (exhaustive) |
| `StoryArticle` | `({ pilot, story, backHref?, children? })` | Full article layout |

## `StoryArticle` layout

```
<article>
  <header>   back link (only if backHref) · tag · status badge (statusStyles)
             <h1>title · <time dateTime> · readingTime · location · lead
  hero       MediaFrame priority, caption
  facts      grid of { label, value } (omitted when empty)
  body       story.blocks.map((b, i) => <Block key={i} block={b} />)
  {children} e.g. related pilots
</article>
```

## Block → markup

| `type` | Output | Width |
| --- | --- | --- |
| `heading` | `<h2>` | `container-prose` |
| `paragraph` | `<p>` | prose |
| `quote` | `<blockquote>` + optional attribution, in `Reveal` | prose |
| `list` | `<ul>` | prose |
| `numbered` | `<ol>` | prose |
| `pathway` | `<ol>` of steps separated by arrows, in `Reveal` | prose |
| `table` | scrollable `<table>` (min 30rem) + caption, in `Reveal` | prose |
| `media` | grid of `MediaFrame`; 1 item = full width, 2+ = `sm:grid-cols-2` | `max-w-4xl` |

All text fields go through `renderInline()` (`src/lib/rich-text.tsx`).

## Media handling

| `src` | Rendered with |
| --- | --- |
| empty | placeholder icon |
| starts with `/` or `http` | `next/image` `fill`, `sizes="(min-width:1024px) 42rem, (min-width:640px) 50vw, 100vw"` |
| `blob:` / `data:` (editor, unsaved upload) | plain `<img>` (optimizer cannot fetch these) |
| `kind: "video"` | `<video controls preload="none" playsInline poster>` |

Remote `http` images require `images.remotePatterns` in `next.config.ts`
(currently empty), otherwise `next/image` throws.

## Adding a block type

Add the case to `Block`; TypeScript will flag the missing case once the union
in `src/lib/pilots.ts` is extended. See `src/lib/README.md` for the full list
of places to update.
