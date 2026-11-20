# `src/app/pilots/[slug]/` — one pilot story (`/pilots/<slug>`)

**File:** `page.tsx`

The square brackets in `[slug]` mean this is a **dynamic route**. One file
makes many pages. The part of the URL after `/pilots/` is given to the page as
`slug`.

Example: `/pilots/tanzania-network` → `slug = "tanzania-network"`.

## The 3 functions in `page.tsx`

| Function | When it runs | What it does |
| --- | --- | --- |
| `generateStaticParams()` | At build time | Returns every slug that has a story. Next.js builds those pages ahead of time, so they are fast static HTML. |
| `generateMetadata()` | At build time | Sets the tab title, description and the image for link previews (Open Graph) from the story. |
| `PilotStoryPage()` | At build time | Finds the pilot with `getPilot(slug)`. If there is no story → `notFound()` (404). Otherwise draws it with `StoryArticle`, then adds a "More from the pilot network" box with 3 other pilots. |

## Note on Next.js 16

`params` is a **Promise**. That is why the code does `const { slug } = await params;`.

## Where the article design is

The look of the article is not here. It is in
`src/components/pilot-story/story-view.tsx`. The same component is used by the
live preview in the editor.
