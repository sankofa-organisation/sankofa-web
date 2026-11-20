# `src/app/pilots/[slug]/` — `/pilots/<slug>`

Dynamic segment, fully statically generated.

```ts
type PageProps = { params: Promise<{ slug: string }> };   // Next 16: params is a Promise
```

| Export | Runs | Behaviour |
| --- | --- | --- |
| `generateStaticParams()` | build | `pilotsWithStories.map(p => ({ slug: p.slug }))` — one HTML page per story |
| `generateMetadata({ params })` | build | `title = story.title`, `description = story.lead`, OG `type: "article"`, `publishedTime = story.dateTime`, `images = [story.hero.src]`. Missing story → `"Pilot not found"`. |
| `default PilotStoryPage({ params })` | build | `getPilot(slug)`; no `story` → `notFound()`. Renders `<StoryArticle pilot story backHref="/pilots">` and passes a "More from the pilot network" box (3 other pilots + CTAs) as `children`. |

Slugs not returned by `generateStaticParams` are rendered on demand and then
hit `notFound()` (default `dynamicParams = true`), so unknown slugs → 404.

Article layout lives in `src/components/pilot-story/story-view.tsx`
(shared with the editor preview).
