# `src/app/` — pages, layout and APIs

This folder uses the **Next.js App Router**. The rule is simple:

> A folder with a `page.tsx` file becomes a web page.
> A folder with a `route.ts` file becomes an API address.

## Files directly in this folder

| File | What it does |
| --- | --- |
| `layout.tsx` | The frame around **every** page. Loads the Poppins font, sets the site title and description (SEO), and adds the skip link, `CustomCursor`, `SiteHeader`, `FollowLinkedin` box and `SiteFooter`. |
| `page.tsx` | The **home page** (`/`). Shows the `Hero`, the stats marquee, the vision text (typewriter), the approach cards, the STREAM letters, and photo sections. Text is stored in arrays at the top of the file (`approach`, `streamLetters`, `pillars`, ...). |
| `not-found.tsx` | The **404 page**. Shown for any URL that does not exist. It is hidden from search engines (`robots: { index: false }`). The small logo here is commented out ("asked to temporaly remove"). |
| `globals.css` | Global styles. All site colors are here as CSS variables (`--primary`, `--accent`, ...). Also the custom Tailwind helpers `container-page` and `container-prose`, and the keyframes for the marquee and typewriter caret. |
| `icon.png` | The small browser tab icon (favicon). Next.js uses it because of its file name. It still shows the logo. |
| `apple-icon.png` | The icon used when someone saves the site to an iPhone home screen. Also shows the logo. |

## Sub-folders (pages)

| Folder | URL | Read more |
| --- | --- | --- |
| `about/` | `/about` | [about/README.md](about/README.md) |
| `curriculum/` | `/curriculum` | [curriculum/README.md](curriculum/README.md) |
| `pilots/` | `/pilots` and `/pilots/<slug>` | [pilots/README.md](pilots/README.md) |
| `pilot/` | `/pilot/create` (story editor) | [pilot/README.md](pilot/README.md) |
| `members/` | `/members` | [members/README.md](members/README.md) |
| `news/` | `/news` | [news/README.md](news/README.md) |
| `contact/` | `/contact` | [contact/README.md](contact/README.md) |
| `api/` | `/api/...` (no page, only data) | [api/README.md](api/README.md) |

## Each page also exports `metadata`

```ts
export const metadata: Metadata = {
  title: "About Us",          // shows as "About Us · Sankofa" in the tab
  description: "...",         // for Google and link previews
};
```

The `· Sankofa` part is added by the `title.template` in `layout.tsx`.

## Note

`README.md` files in this folder are safe. Next.js only turns special file
names (`page.tsx`, `route.ts`, `layout.tsx`, ...) into routes. It ignores
everything else.
