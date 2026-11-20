# `src/app/` — App Router

Next.js 16 file-system routing. Only special file names become routes
(`page.tsx`, `layout.tsx`, `route.ts`, `not-found.tsx`, `icon.png`, …); other
files, including these READMEs, are ignored by the router.

## Root files

| File | Kind | Details |
| --- | --- | --- |
| `layout.tsx` | Root layout (RSC) | Loads Poppins via `next/font/google` (`--font-poppins`, weights 400–700, `display: swap`). Exports global `metadata`: `metadataBase: https://teachsankofa.org`, `title.template: "%s · Sankofa"`, description, Open Graph. Renders skip link → `CustomCursor` → `SiteHeader` → `<main id="main">{children}<FollowLinkedin/></main>` → `SiteFooter`. |
| `page.tsx` | Route `/` (RSC, static) | Home. Content in module-level consts: `VISION`, `approach`, `streamLetters`, `pillars`, `outcomes`, `values`, `pilots` (local teaser list, **not** `lib/pilots`). Composes `Hero`, `StatsMarquee`, `Section`, `SectionHeader`, `FocusBlur`, `RevealGroup/Item`, `TiltCard`, `Typewriter`. |
| `not-found.tsx` | 404 boundary | Used for unknown URLs and `notFound()` calls. `robots: { index: false, follow: true }`. Brand mark commented out ("asked to temporaly remove"). |
| `globals.css` | Global stylesheet | Tailwind 4 entry, design tokens, `@theme inline` mapping, base layer, `container-page`/`container-prose` utilities, keyframes (rise, marquee, caret), cursor and reduced-motion rules. See root README §11. |
| `icon.png` (64×64), `apple-icon.png` (180×180) | File-based metadata | Next emits `<link rel="icon">` / `apple-touch-icon` automatically. Still show the logo. |

## Routes

| Folder | URL | Rendering | README |
| --- | --- | --- | --- |
| `about/` | `/about` | static | [→](about/README.md) |
| `curriculum/` | `/curriculum` | static | [→](curriculum/README.md) |
| `pilots/` | `/pilots`, `/pilots/[slug]` | static / SSG | [→](pilots/README.md) |
| `pilot/create/` | `/pilot/create` | static shell + client app | [→](pilot/README.md) |
| `members/` | `/members` | static | [→](members/README.md) |
| `news/` | `/news` | static | [→](news/README.md) |
| `contact/` | `/contact` | static | [→](contact/README.md) |
| `api/` | `/api/*` | dynamic route handlers | [→](api/README.md) |

## Page contract

Every page file:

```tsx
import type { Metadata } from "next";
export const metadata: Metadata = { title: "About Us", description: "…" };
export default function AboutPage() { /* RSC */ }
```

- `title` is combined with the root template → `About Us · Sankofa`.
- Pages are synchronous RSCs with no data fetching, so Next prerenders them
  as static HTML at build time (`○` in build output).
- Inner pages start with `<PageHero eyebrow title description?>` and then a
  series of `<Section tone=…>` blocks wrapped in `container-page`.
