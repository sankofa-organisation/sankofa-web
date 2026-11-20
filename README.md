# Sankofa Website — Technical Handover

This document is for the developer who takes over this project. It explains
how the system is built, how data moves through it, how to run and deploy it,
and what is unfinished. Read it once from top to bottom before you change code.

**Sankofa** is a volunteer group, in affiliation with IEEE Smart Village, that
brings STREAM education (Science, Technology, Reading, Engineering, Art,
Mathematics) to under-resourced communities. This repo is its public website.

- Repo: `github.com/sankofa-organisation/sankofa-web` (private), branch `main`
- Production domain: `https://teachsankofa.org` (set as `metadataBase` in
  `src/app/layout.tsx`; contact email is `info@teachsankofa.org`).

---

## Table of contents

1. [Summary in 10 lines](#1-summary-in-10-lines)
2. [Getting started](#2-getting-started)
3. [Tech stack](#3-tech-stack)
4. [Architecture](#4-architecture)
5. [Project structure](#5-project-structure)
6. [Routes](#6-routes)
7. [Data layer (content as code)](#7-data-layer-content-as-code)
8. [Pilot stories: model and rendering](#8-pilot-stories-model-and-rendering)
9. [Pilot story editor (`/pilot/create`)](#9-pilot-story-editor-pilotcreate)
10. [API reference](#10-api-reference)
11. [Styling system](#11-styling-system)
12. [Motion and animation](#12-motion-and-animation)
13. [Component reference](#13-component-reference)
14. [SEO, metadata and icons](#14-seo-metadata-and-icons)
15. [Build and deployment](#15-build-and-deployment)
16. [Conventions](#16-conventions)
17. [Common tasks](#17-common-tasks)
18. [Known issues and technical debt](#18-known-issues-and-technical-debt)

---

## 1. Summary in 10 lines

1. **Next.js 16 App Router + React 19 + TypeScript (strict) + Tailwind CSS 4.**
2. **No database, no CMS, no auth, no backend services.** All content is
   TypeScript data in `src/lib/*.ts` or inline in page files.
3. Every public page is **prerendered to static HTML at build time**.
4. Pilot story pages (`/pilots/[slug]`) are **statically generated** from
   `src/lib/pilots.ts` with `generateStaticParams`.
5. There are 2 **API routes** (`/api/pilot-drafts`, `/api/pilot-uploads`). They
   exist only to support a local authoring tool and **write to the file
   system**. They are disabled in production by default.
6. `/pilot/create` is a browser-based **story editor** that outputs TypeScript
   you paste into `src/lib/pilots.ts`. Publishing = commit + redeploy.
7. Components are **React Server Components by default**; only interactive or
   animated parts use `"use client"`.
8. Design tokens are **CSS variables** in `src/app/globals.css`, exposed to
   Tailwind with `@theme inline`. There is no `tailwind.config.js`.
9. Animations use the `motion` library and **all respect
   `prefers-reduced-motion`**.
10. The contact form uses a **`mailto:` link** — no email sending service.

---

## 2. Getting started

**Requirements:** Node.js 20+ (developed on Node 22), npm.

```bash
npm install          # install dependencies (lockfile: package-lock.json)
npm run dev          # dev server on http://localhost:3000 (Turbopack)
npm run build        # production build + type check
npm run start        # serve the production build
npm run lint         # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit     # type check only
```

### Environment variables

There is no `.env` file and nothing is required to run the site.

| Variable | Default | Effect |
| --- | --- | --- |
| `NODE_ENV` | set by Next | When not `production`, the editor APIs can write files. |
| `PILOT_EDITOR_ENABLED` | unset | Set to `true` to allow the editor APIs to write in production. Only do this on a host with a persistent, trusted file system. |

`.env*` files are git-ignored.

---

## 3. Tech stack

| Package | Version | Used for |
| --- | --- | --- |
| `next` | 16.2.7 | Framework, routing, image optimisation, fonts, metadata |
| `react` / `react-dom` | 19.2.4 | UI |
| `typescript` | 5.x | Types. `strict: true` |
| `tailwindcss` + `@tailwindcss/postcss` | 4.x | Styling (configured in CSS, not JS) |
| `motion` | 12.x | Animations (import from `motion/react`) |
| `lucide-react` | 1.x | Icons |
| `clsx` + `tailwind-merge` | — | `cn()` class name helper |
| `eslint` + `eslint-config-next` | 9 / 16.2.7 | Linting (core-web-vitals + typescript rules) |

There are **no tests** and **no CI** in this repo.

> Next.js 16 note: route `params` are a **Promise** (`const { slug } = await params`).
> If you look up docs, make sure they are for Next 15+.

---

## 4. Architecture

### 4.1 Big picture

```
                    BUILD TIME (next build)                          RUNTIME
 ┌───────────────────────────────────────────────────┐   ┌──────────────────────────┐
 │ src/lib/pilots.ts ─┐                              │   │ Static HTML/RSC payload   │
 │ src/lib/members.ts ┼─► Server Components ─► HTML ─┼──►│ served for every page     │
 │ src/lib/nav.ts    ─┘   (src/app/**/page.tsx)     │   │                           │
 │ inline arrays in page files                       │   │ Client components hydrate │
 └───────────────────────────────────────────────────┘   │ (header menu, animations, │
                                                         │  contact form, editor)    │
                                                         │                           │
                                                         │ /api/* run on demand      │
                                                         │ (editor only, writes disk)│
                                                         └──────────────────────────┘
```

Build output (from `next build`):

```
○ /  /about  /contact  /curriculum  /members  /news  /pilots  /pilot/create  /_not-found
● /pilots/[slug]   → tanzania-network, echipparra-kerala, uganda-banana-fibre
ƒ /api/pilot-drafts   /api/pilot-uploads
○ /icon.png  /apple-icon.png

○ static   ● SSG via generateStaticParams   ƒ dynamic (server, on demand)
```

So the site can be hosted as a normal Next.js app. Apart from the two editor
APIs, nothing needs a server at request time.

### 4.2 Server vs client components

- Files **without** `"use client"` are Server Components. They run only at
  build/request time on the server, can import data directly, and send no JS
  for themselves to the browser.
- Files **with** `"use client"` are Client Components. They ship JS, can use
  state, effects, event handlers and browser APIs.
- Pattern used everywhere: a **server page** imports data and renders small
  **client islands** (`Hero`, `Reveal*`, `TiltCard`, `Typewriter`,
  `FocusBlur`, `ContactForm`, `SiteHeader`, `CustomCursor`, `PilotEditor`).

Client components in this repo:
`site-header`, `custom-cursor`, `home/hero`, `contact/contact-form`,
everything in `motion/`, everything in `pilot-editor/`.

**Important:** anything a Server Component passes to the page — including
React `key`s and props given to client components — ends up in the public
HTML/RSC payload. Never put private data in `src/lib` (see §7.3).

### 4.3 Page shell

`src/app/layout.tsx` wraps every route:

```
<html lang="en" class="--font-poppins">
  <body>
    skip-to-content link (#main)
    <CustomCursor/>          client, desktop only
    <SiteHeader/>            client (mobile menu state, active link)
    <main id="main">
      {page}
      <FollowLinkedin/>      LinkedIn + survey call to action
    </main>
    <SiteFooter/>            server
  </body>
</html>
```

The font is loaded with `next/font/google` (Poppins 400–700) and exposed as
the CSS variable `--font-poppins`.

---

## 5. Project structure

```
sankofa-web/
├── src/
│   ├── app/                         Routes (App Router)
│   │   ├── layout.tsx               Root layout, fonts, global metadata
│   │   ├── globals.css              Design tokens, Tailwind theme, keyframes
│   │   ├── page.tsx                 Home (/)
│   │   ├── not-found.tsx            404
│   │   ├── icon.png, apple-icon.png Favicons (file-based metadata)
│   │   ├── about/ contact/ curriculum/ members/ news/   Static pages
│   │   ├── pilots/page.tsx          Pilot index
│   │   ├── pilots/[slug]/page.tsx   Pilot story (SSG)
│   │   ├── pilot/create/page.tsx    Story editor (noindex)
│   │   └── api/
│   │       ├── pilot-drafts/route.ts   GET/POST/DELETE drafts on disk
│   │       └── pilot-uploads/route.ts  POST media into /public
│   ├── components/
│   │   ├── site-header.tsx, site-footer.tsx, follow-linkedin.tsx,
│   │   │   custom-cursor.tsx, page-hero.tsx, sankofa-mark.tsx
│   │   ├── ui/            Button, ButtonLink, Section, SectionHeader
│   │   ├── motion/        Reveal, RevealGroup/Item, TiltCard, Typewriter, FocusBlur, CountUpStat
│   │   ├── home/          Hero, StatsMarquee, TiassaleSection
│   │   ├── contact/       ContactForm
│   │   ├── pilot-story/   StoryArticle, Block, MediaFrame (shared renderer)
│   │   └── pilot-editor/  PilotEditor and its panels/fields
│   └── lib/
│       ├── pilots.ts               Pilot + story types and ALL pilot content
│       ├── members.ts              Member type and roster
│       ├── nav.ts                  Header/footer navigation
│       ├── pilot-draft.ts          Editor model, validation, localStorage, codegen
│       ├── pilot-editor-server.ts  Server-only helpers for the APIs
│       ├── rich-text.tsx           Inline markup renderer
│       └── cn.ts                   clsx + tailwind-merge
├── public/                  Static assets served at "/"
│   ├── members/             Member portraits
│   └── pilots/<slug>/       Story images (videos are git-ignored, see §15)
├── Tanzania Pilots/         Raw source photos (not used by code)
├── next.config.ts           Empty (defaults)
├── tsconfig.json            strict, alias "@/*" → "./src/*"
├── postcss.config.mjs       Tailwind 4 PostCSS plugin
└── eslint.config.mjs        next core-web-vitals + typescript
```

Each folder under `src/` and `public/` also has a short `README.md` about its
own files.

---

## 6. Routes

| URL | File | Render | Data source |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | static | inline arrays (`approach`, `streamLetters`, `pillars`, `outcomes`, `values`, `pilots`) + `components/home/*` |
| `/about` | `app/about/page.tsx` | static | inline (`groups`, `leadership`, `countries`) |
| `/curriculum` | `app/curriculum/page.tsx` | static | inline (`stream`, `principles`, `themes`) |
| `/pilots` | `app/pilots/page.tsx` | static | `lib/pilots.ts` — pilots with a story are "featured", others are plain cards |
| `/pilots/[slug]` | `app/pilots/[slug]/page.tsx` | SSG | `getPilot(slug)`; 404 if no `story` |
| `/members` | `app/members/page.tsx` | static | `lib/members.ts` + local `photos` map |
| `/news` | `app/news/page.tsx` | static | inline `featured` + `posts` |
| `/contact` | `app/contact/page.tsx` | static | inline `EMAIL`, `socials` |
| `/pilot/create` | `app/pilot/create/page.tsx` | static shell, client app | browser `localStorage` + editor APIs |
| `/api/pilot-drafts` | `app/api/pilot-drafts/route.ts` | dynamic | `content/pilot-drafts/*.json` |
| `/api/pilot-uploads` | `app/api/pilot-uploads/route.ts` | dynamic | writes `public/pilots/uploads/` |
| anything else | `app/not-found.tsx` | static | — |

**Navigation** is defined once in `src/lib/nav.ts`:
`primaryNav` (main menu) and `portalNav` (Member Portal). Both header and
footer read from it. The `/portal/*` routes **do not exist yet** (see §18).

---

## 7. Data layer (content as code)

There is no database. Content is typed data compiled into the build.
**Any content change needs a commit and a redeploy.**

### 7.1 Pilots — `src/lib/pilots.ts`

```ts
type PilotStatus = "Active" | "In development" | "Coming soon";

type Pilot = {
  slug: string;        // URL segment, also the media folder name
  name: string;
  country: string;
  status: PilotStatus;
  body: string;        // short summary for the index card
  story?: PilotStory;  // optional; if present, /pilots/<slug> exists
};
```

Exports: `pilots` (6 entries, 3 with stories), `getPilot(slug)`,
`pilotsWithStories`, `statusStyles` (Tailwind classes per status).
The full story type is described in §8.

### 7.2 Members — `src/lib/members.ts`

```ts
type WorkingGroup = "Curricula" | "Communication" | "Implementation";
type Member = { name: string; country: string; groups: WorkingGroup[] };
```

Portraits are **not** part of the type. They are mapped by exact name in the
`photos` object at the top of `src/app/members/page.tsx`
(`"Full Name": "/members/File.jpg"`). No match → initials are shown.

### 7.3 Privacy rule

Member emails and phone numbers were **intentionally removed** from the repo.
Do not add them back. Because pages are prerendered, any value a page touches
(even a React `key`) can appear in the public HTML. They still exist in older
git history; the repo is private.

### 7.4 Other inline content

Home, About, Curriculum, News and Contact keep their text in `const` arrays at
the top of each page file. The JSX below maps over them. Edit the arrays, not
the markup.

---

## 8. Pilot stories: model and rendering

### 8.1 Model

```ts
type PilotStory = {
  title: string; tag: string;
  date: string;        // human readable, e.g. "12 August 2026"
  dateTime: string;    // ISO, used in <time dateTime>
  readingTime: string; // e.g. "6 min read"
  location: string;
  lead: string;        // standfirst under the title
  hero: Media;
  facts: { label: string; value: string }[];
  blocks: StoryBlock[];
};

type Media = {
  kind: "image" | "video";
  src: string;          // "/pilots/<slug>/file.jpg"
  poster?: string;      // still image for videos
  alt: string;
  caption?: string;
  aspect: "landscape" | "portrait" | "square" | "wide" | "tall";
};

type StoryBlock =                          // discriminated union on `type`
  | { type: "heading";   text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote";     text: string; attribution?: string }
  | { type: "list";      items: string[] }
  | { type: "numbered";  items: string[] }
  | { type: "pathway";   steps: string[] }   // steps joined by arrows
  | { type: "table";     caption?: string; columns: string[]; rows: string[][] }
  | { type: "media";     items: Media[] };
```

Each story defines a folder constant, e.g. `const TZ = "/pilots/tanzania-network"`,
and builds media paths from it.

### 8.2 Inline markup — `src/lib/rich-text.tsx`

All block text is a plain string. `renderInline(text)` turns three patterns
into elements; anything else renders verbatim:

| Syntax | Output |
| --- | --- |
| `**bold**` | `<strong>` |
| `_italic_` | `<em>` |
| `[label](url)` | `<a>`; `http(s)` links get `target="_blank" rel="noreferrer noopener"` |

No nesting, no HTML. This keeps the data serialisable and safe.

### 8.3 Rendering pipeline

```
/pilots/<slug>
  └─ app/pilots/[slug]/page.tsx  (Server Component)
       generateStaticParams()  → pilotsWithStories.map(slug)   build all pages
       generateMetadata()      → title, lead, OG image = hero.src
       PilotStoryPage()        → getPilot(slug) → notFound() if no story
            └─ <StoryArticle pilot story backHref="/pilots">
                 header (tag, status badge, title, date, reading time, location, lead)
                 hero <MediaFrame priority>
                 facts strip
                 story.blocks.map(<Block>)      switch(block.type)
                 {children}  ← "More from the pilot network" box
```

`StoryArticle` lives in `src/components/pilot-story/story-view.tsx` and is
**shared with the editor's live preview**, so preview = production output.

Media rules in `MediaFrame`/`MediaImage`:
- `src` starting with `/` or `http` → `next/image` with `fill` + `sizes`.
- `blob:` / `data:` (unsaved uploads in the editor) → plain `<img>`, because
  the image optimiser cannot fetch them.
- empty `src` → placeholder icon.
- videos → `<video controls preload="none" playsInline poster=…>`.
- `aspect` maps to a Tailwind `aspect-[…]` class via `aspectClass`.

---

## 9. Pilot story editor (`/pilot/create`)

An internal authoring tool. It is `noindex` and not linked from the menu.
Use it **locally** with `npm run dev`.

### 9.1 Files

| File | Role |
| --- | --- |
| `app/pilot/create/page.tsx` | Route; sets `robots: noindex`, renders `<PilotEditor/>` |
| `components/pilot-editor/editor.tsx` | Root client component: state, history, autosave, ribbon, drafts drawer, view modes, preview |
| `components/pilot-editor/document-panel.tsx` | Properties panel: story header, hero, facts, pilot/index card fields; name auto-fills slug unless locked |
| `components/pilot-editor/block-editor.tsx` | `BlockCard`: per-type inputs for one block + move/duplicate/delete |
| `components/pilot-editor/fields.tsx` | `Field`, `TextInput`, `Select`, `RichTextArea`, `IconButton`; `FormatProvider`/`useFormatting` context |
| `components/pilot-editor/media-input.tsx` | `MediaEditor`: pick/drag file, upload, alt/caption/aspect |
| `lib/pilot-draft.ts` | Model + pure logic (no React) |
| `lib/pilot-editor-server.ts` | Server-only helpers for the APIs |

### 9.2 Model

```ts
type PilotDraft = {
  id: string;            // "draft-<time36>-<rand>"
  slug: string; name: string; country: string; status: PilotStatus;
  body: string;          // index card text
  story: PilotStory;
  updatedAt: string;     // ISO
};
```

`draftToPilot(draft)` converts it to a `Pilot` for the preview.

### 9.3 State and persistence

```
PilotEditor state: draft, history {past, future}, view, saveState, ...

edit ─► patchDraft / patchStory ─► pushHistory(old) ─► setDraft(new)
                                                      │
          ┌───────────────────────────────────────────┼─────────────────────┐
          ▼                                           ▼                     ▼
 Layer 1: localStorage                     Layer 2: server disk     Layer 3: file
 key "sankofa.pilot-drafts.v1"             POST /api/pilot-drafts   Export → <slug>.json
 debounced 700 ms, max 25 drafts           → content/pilot-drafts/  Open  ← <slug>.json
 restored on mount                         (Save / Ctrl+S)
```

- **History:** snapshot before each change, max 60 entries; changes within
  600 ms are merged into one step (`HISTORY_COALESCE_MS`).
- **Hydration:** drafts are read from `localStorage` in a `useEffect` because
  storage does not exist during prerender.
- **Formatting:** `FormatProvider` remembers the last focused text field; ribbon
  Bold/Italic/Link wrap the selection in that field with `**…**`, `_…_`,
  `[…](…)`.
- **Validation:** `validateDraft()` returns `Issue[]` with `level`
  `"error"` (headline, name, valid slug, country, hero image + alt, alt on
  every media item) or `"warning"` (empty card text, lead, empty blocks).
- **Reading time:** `readingTimeFor()` = words / 200, minimum 1.
- **View modes:** `write`, `split` (editor + live preview, large screens),
  `preview`.

Keyboard: Ctrl/Cmd+S save, Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y
redo, Ctrl/Cmd+B bold, Ctrl/Cmd+I italic.

### 9.4 Publishing workflow

The editor never publishes by itself.

1. Write the story at `/pilot/create` (local dev server).
2. Add images — they are uploaded to `public/pilots/uploads/<slug>/`.
3. Fix all validation errors.
4. Click **Copy as TypeScript**. `toTypeScript()` produces a
   `const <camelSlug>Story: PilotStory = {…}` plus a `pilots` array entry.
5. Paste both into `src/lib/pilots.ts`.
6. Optionally move images from `uploads/<slug>/` into `public/pilots/<slug>/`
   and update the paths.
7. Commit, push, redeploy.

### 9.5 Upload fallback

If `/api/pilot-uploads` fails (e.g. writes disabled) and the file is an image
under **1.5 MB**, `MediaEditor` stores it in the draft as a `data:` URL so
work can continue, and warns the user to Export. Large data URLs can exceed
the `localStorage` quota; `persistLocalDraft` swallows that error silently.

---

## 10. API reference

Both routes: `export const dynamic = "force-dynamic"`. Writes are allowed
only if `editorWritesAllowed()` returns true:

```ts
NODE_ENV !== "production" || PILOT_EDITOR_ENABLED === "true"
```

Otherwise they return **403** `{ error: "Saving to the server is disabled here. …" }`.
All slugs pass through `safeSlug()` (lowercase, `[a-z0-9-]` only, max 60
chars, fallback `"untitled"`), which prevents path traversal.

### `GET /api/pilot-drafts`

Reads `content/pilot-drafts/*.json`, newest first.

```json
200 { "drafts": [PilotDraft, ...], "writable": true }
```
Missing folder → empty list. Other read error → `500`.

### `POST /api/pilot-drafts`

Body: `PilotDraft` JSON.

| Status | When |
| --- | --- |
| 200 `{ draft, savedTo: "content/pilot-drafts/<slug>.json" }` | saved (overwrites same slug; `updatedAt` set by server) |
| 400 | invalid JSON or missing `id` |
| 403 | writes disabled |

File name: `safeSlug(draft.slug || draft.id) + ".json"`. The `content/`
folder is created on first save.

### `DELETE /api/pilot-drafts?slug=<slug>`

Deletes the file. Missing file is not an error. `200 { ok: true }`, `403`,
or `500`.

### `POST /api/pilot-uploads`

`multipart/form-data` with `file` and `slug`.

| Check | Failure |
| --- | --- |
| writes allowed | 403 |
| `file` present | 400 |
| type in `image/jpeg, png, webp, avif, gif`, `video/mp4` | 415 |
| size ≤ 25 MB | 413 |

Saved as `public/pilots/uploads/<safeSlug>/<stem>-<time36>.<ext>` (`stem` =
sanitised original name, max 50 chars).

```json
200 { "src": "/pilots/uploads/<slug>/<name>", "kind": "image" | "video" }
```

> Production hosts like Vercel have a read-only / temporary file system.
> Files written there are lost. Keep the editor a local tool unless you add
> real storage (e.g. S3/R2/Blob) behind these routes.

---

## 11. Styling system

Tailwind CSS 4, configured **in CSS** (`src/app/globals.css`):

1. `@import "tailwindcss";`
2. `:root { … }` — design tokens as CSS variables:

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#faf5ec` | page (parchment) |
| `--surface` / `--surface-sunken` | `#fffdf8` / `#f3ebdb` | cards / alt sections |
| `--foreground` / `--muted` | `#211915` / `#6b5d4f` | text |
| `--primary` (+ `-hover`, `on-primary`) | `#9e2b25` | crimson brand, buttons |
| `--accent` / `--accent-strong` | `#b07a1e` / `#8a5e14` | gold |
| `--secondary` | `#5c4733` | brown |
| `--border` / `--border-strong` / `--ring` | … | lines, focus ring |

3. `@theme inline { --color-primary: var(--primary); … }` maps tokens to
   Tailwind utilities, so you write `bg-primary`, `text-muted`,
   `border-border-strong`, `font-display`, `rounded-lg`.
4. `@layer base` — base element styles and a global `:focus-visible` ring.
5. Custom utilities: `container-page` (max 72rem, centred, 1.5rem padding)
   and `container-prose` (max 44rem).
6. Plain CSS for: `.animate-rise`, the marquee (`.marquee-track`,
   `--marquee-duration`), the typewriter caret (`.type-caret`), the custom
   cursor (`html.cursor-ready` hides the native cursor), and a global
   reduced-motion override that disables all CSS animations.

There is **no dark mode**. To restyle the site, change the tokens in `:root`.
Use `cn()` from `src/lib/cn.ts` when combining or overriding classes.

---

## 12. Motion and animation

Library: `motion` (`import { motion, … } from "motion/react"`).
**Rule:** every animated component calls `useReducedMotion()` and renders a
static version when it is true. Keep this rule.

| Component | Mechanism |
| --- | --- |
| `Reveal` | `whileInView` fade + rise, `once: true`; `as` prop picks the tag |
| `RevealGroup` / `RevealItem` | parent variants with `staggerChildren: 0.09` |
| `TiltCard` | pointer position → `rotateX/Y` springs (ignores touch) |
| `Typewriter` | `setTimeout` loop, extra pause on punctuation; full text in `aria-label`, animated text `aria-hidden` |
| `FocusBlur` | `useScroll` progress → `filter: blur()` + opacity at viewport edges |
| `CountUpStat` | spring from 0 to the leading integer when in view (currently unused) |
| `Hero` | word-by-word headline variants; scroll parallax orbs (`useScroll` + `useTransform`) |
| `StatsMarquee` | pure CSS: list rendered twice, track translates −50% forever; pauses on hover |
| `CustomCursor` | only for `(hover: hover) and (pointer: fine)` and no reduced motion; adds `cursor-ready` to `<html>`; dot + lagging glow springs; ring over `INTERACTIVE` elements |

---

## 13. Component reference

| Component | File | Props / notes |
| --- | --- | --- |
| `Button` | `ui/button.tsx` | `variant: primary\|secondary\|outline\|ghost`, `size: sm\|md\|lg`, button attrs |
| `ButtonLink` | `ui/button.tsx` | same + `href` (Next `Link`) |
| `Section` | `ui/section.tsx` | `tone: default\|sunken\|ink`, vertical padding |
| `SectionHeader` | `ui/section.tsx` | `eyebrow?`, `title`, `description?`, `align: left\|center` |
| `PageHero` | `page-hero.tsx` | top banner of inner pages: `eyebrow`, `title`, `description?` |
| `SiteHeader` | `site-header.tsx` | sticky; desktop nav, mobile menu (`useState`), active link via `usePathname` |
| `SiteFooter` | `site-footer.tsx` | nav lists from `lib/nav.ts`, year |
| `FollowLinkedin` | `follow-linkedin.tsx` | exports `LINKEDIN_URL`, `SURVEY_URL` (reuse these constants) |
| `ContactForm` | `contact/contact-form.tsx` | builds `mailto:info@teachsankofa.org?subject&body`, opens it after a 5 s "sending" state |
| `StoryArticle`, `Block`, `MediaFrame` | `pilot-story/story-view.tsx` | see §8.3 |
| `TiassaleSection` | `home/tiassale-section.tsx` | YouTube (nocookie) embed section — **not mounted anywhere** |
| `SankofaMark` | `sankofa-mark.tsx` | SVG brand mark — **unused while the logo is hidden** |

---

## 14. SEO, metadata and icons

- Global metadata in `layout.tsx`: `metadataBase`, `title.template = "%s · Sankofa"`,
  description, Open Graph.
- Each page exports `metadata` with its own `title` and `description`.
- Story pages build metadata in `generateMetadata` (type `article`,
  `publishedTime`, hero image as OG image).
- `noindex`: `/pilot/create` and the 404 page.
- Favicons use Next's file convention: `src/app/icon.png` (64×64) and
  `src/app/apple-icon.png` (180×180).
- There is no `sitemap.ts` or `robots.ts` yet.

---

## 15. Build and deployment

- Standard Next.js app: `npm run build` then `npm run start`, or any host
  that supports Next.js (Vercel is the natural choice; `.vercel` is ignored).
- `next.config.ts` is empty — no `basePath`, no `output: "export"`, no remote
  image domains. If you need to load images from another domain, add
  `images.remotePatterns`.
- Because the API routes exist, a pure static export (`output: "export"`)
  will fail unless you remove or move them.
- **Videos are not in git.** `*.mp4` is in `.gitignore`. These files are
  referenced in `pilots.ts` but missing from the repo, and must be placed on
  the server by hand (or hosted elsewhere and referenced by URL):
  - `public/pilots/uganda-banana-fibre/the-compound.mp4`
  - `public/pilots/uganda-banana-fibre/introducing-the-fibre.mp4`
  - `public/pilots/uganda-banana-fibre/ball-play.mp4`
  - `public/pilots/uganda-banana-fibre/laughter-and-connection.mp4`
  - `public/pilots/tanzania-network/a-class-in-session.mp4`

  A better long-term fix is to host videos on a CDN/YouTube and store URLs.
- Before deploying, run `npm run build` locally; it type-checks the project.

---

## 16. Conventions

- Import alias: `@/` → `src/`.
- Server Component by default. Add `"use client"` only for state, effects,
  events or browser APIs, and keep client components small.
- File names: kebab-case. Components: PascalCase named exports (no default
  exports except route files).
- Content lives in typed constants, not in JSX.
- Images: `next/image` with `alt` always set; decorative images use `alt=""`
  and `aria-hidden`.
- Accessibility: skip link, visible focus ring, `aria-current` on active nav
  links, 44px minimum touch targets, reduced-motion support.
- Class names: Tailwind utilities + tokens; combine with `cn()`.

---

## 17. Common tasks

**Add a page**
1. Create `src/app/<name>/page.tsx` exporting `metadata` and a default component.
2. Use `PageHero` + `Section` for consistent layout.
3. Add it to `primaryNav` in `src/lib/nav.ts`.

**Add a pilot without a story** — add an entry to `pilots` in `src/lib/pilots.ts`.

**Add a pilot story** — use the editor (§9.4) or write a `PilotStory`
const by hand; put media in `public/pilots/<slug>/`.

**Add a new story block type**
1. Extend `StoryBlock` in `lib/pilots.ts`.
2. Render it in `Block` (`components/pilot-story/story-view.tsx`).
3. In `lib/pilot-draft.ts`: `blockTypes`, `blockLabels`, `emptyBlock`,
   `countWords`, `blockSource` (codegen), and `validateDraft` if needed.
4. Add inputs in `components/pilot-editor/block-editor.tsx`.
TypeScript's exhaustive `switch` statements will point to anything you miss.

**Add a member** — add `{ name, country, groups }` to `src/lib/members.ts`;
optional photo in `public/members/` + entry in `photos` in
`src/app/members/page.tsx`.

**Add a news post** — add to `posts` (or replace `featured`) in
`src/app/news/page.tsx`.

**Change brand colours** — edit `:root` tokens in `src/app/globals.css`.

**Change contact email** — `EMAIL` in `app/contact/page.tsx` and `RECIPIENT`
in `components/contact/contact-form.tsx`.

---

## 18. Known issues and technical debt

| # | Issue | Where | Notes |
| --- | --- | --- | --- |
| 1 | **Logo is temporarily hidden** (commented out, marked `asked to temporaly remove`) | `site-header.tsx`, `site-footer.tsx`, `home/hero.tsx`, `app/not-found.tsx` | Search for the phrase to restore. In `hero.tsx` the inner JSX comments were turned into `//` lines; turn them back into `{/* */}`. Favicons still show the logo. |
| 2 | 4 ESLint "unused variable" warnings | `home/hero.tsx` | Tilt handlers were only used by the hidden logo card. Resolves when the logo returns. |
| 3 | 2 ESLint errors `react-hooks/set-state-in-effect` | `custom-cursor.tsx`, `motion/typewriter.tsx` | Pre-existing; build still passes. Fix with lazy initial state or an eslint-disable with reason (as done in `editor.tsx`). |
| 4 | **Member Portal does not exist** | `lib/nav.ts` → `/portal/*` | Header button and footer links lead to 404. Needs auth + storage, or hide the links. |
| 5 | Videos missing from repo | see §15 | Story pages show broken players without them. |
| 6 | `.gitignore` contains merge-conflict markers | `.gitignore` | Two versions merged badly; clean it up (keep the Next.js section). |
| 7 | Contact form is `mailto:` only, with a fixed 5 s delay | `contact/contact-form.tsx` | Does nothing if the visitor has no mail client. Consider a form service or an API route. |
| 8 | Editor APIs write to local disk | `app/api/*` | Not usable on serverless hosting. Keep local, or move to object storage. |
| 9 | Unused code/assets | `TiassaleSection`, `CountUpStat`, `SankofaMark`, `public/sankofa-bird.jpg`, `public/{file,globe,next,vercel,window}.svg` | Safe to delete when no longer wanted. |
| 10 | No tests, no CI, no sitemap/robots | — | Suggested: GitHub Action running `npm run lint` and `npm run build`; add `app/sitemap.ts`. |
| 11 | Old git history contains member contact data | git history | Repo is private. Rewriting history would need a force-push. |
