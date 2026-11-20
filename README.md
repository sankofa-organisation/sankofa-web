# Sankofa Website

This is the website for **Sankofa**. Sankofa is a group of volunteers. They bring
STREAM learning (Science, Technology, Reading, Engineering, Art and Mathematics)
to poor communities. The group works with **IEEE Smart Village**.

The name "Sankofa" is an Akan word. It means **"go back and fetch it."**

This file explains how the whole project works. Every folder also has its own
`README.md` that explains only that folder.

---

## 1. What tools does the site use?

| Tool | What it does here |
| --- | --- |
| **Next.js 16** (App Router) | The main framework. It turns folders into web pages. |
| **React 19** | Builds the parts of each page (we call them "components"). |
| **TypeScript** | JavaScript with types. It catches mistakes before the site runs. |
| **Tailwind CSS 4** | Styling. We write class names like `p-4 text-lg` in the HTML. |
| **motion** (Framer Motion) | Animations: fade in, slide up, 3D tilt, count up. |
| **lucide-react** | The small icons (arrows, mail, map pin, and so on). |
| **clsx + tailwind-merge** | A helper to join class names safely (see `src/lib/cn.ts`). |

There is **no database**. All the content (pilots, members, news) lives inside
TypeScript files in `src/lib` and `src/app`. To change text, you change code.

---

## 2. How to run it on your computer

You need **Node.js 20 or newer**.

```bash
npm install        # download all packages into node_modules/
npm run dev        # start the site at http://localhost:3000
```

Other commands:

```bash
npm run build      # make the production version (checks types too)
npm run start      # run the production version you just built
npm run lint       # check the code style with ESLint
```

---

## 3. The folders

```
sankofa-web/
├── src/                  ← all the code
│   ├── app/              ← the pages (each folder = one URL)
│   ├── components/       ← reusable pieces of the pages
│   └── lib/              ← data and helper functions (no UI)
├── public/               ← images and files served as they are
├── Tanzania Pilots/      ← raw photos from the Tanzania pilots (not code)
├── next.config.ts        ← Next.js settings (empty for now)
├── tsconfig.json         ← TypeScript settings. "@/..." means "src/..."
├── postcss.config.mjs    ← turns on Tailwind
├── eslint.config.mjs     ← code style rules
└── package.json          ← list of packages and npm commands
```

**Important shortcut:** in the code, `@/` means the `src/` folder.
So `import { cn } from "@/lib/cn"` loads `src/lib/cn.ts`.

**Privacy rule:** do not put members' emails or phone numbers in this repo.
The site does not need them, and anything in the code can end up in the
public page.

---

## 4. How a page is made (the big picture)

Next.js uses **file-based routing**. A folder inside `src/app` with a
`page.tsx` file becomes a URL.

| File | URL |
| --- | --- |
| `src/app/page.tsx` | `/` (home) |
| `src/app/about/page.tsx` | `/about` |
| `src/app/curriculum/page.tsx` | `/curriculum` |
| `src/app/pilots/page.tsx` | `/pilots` |
| `src/app/pilots/[slug]/page.tsx` | `/pilots/tanzania-network`, `/pilots/echipparra-kerala`, ... |
| `src/app/members/page.tsx` | `/members` |
| `src/app/news/page.tsx` | `/news` |
| `src/app/contact/page.tsx` | `/contact` |
| `src/app/pilot/create/page.tsx` | `/pilot/create` (the story editor tool) |
| `src/app/not-found.tsx` | any URL that does not exist (404) |
| `src/app/api/pilot-drafts/route.ts` | `/api/pilot-drafts` (server API, not a page) |
| `src/app/api/pilot-uploads/route.ts` | `/api/pilot-uploads` (server API, not a page) |

Every page is wrapped by **`src/app/layout.tsx`**. The layout puts these on
every page:

```
┌──────────────────────────────┐
│ "Skip to main content" link  │  (for keyboard users, hidden until focused)
│ CustomCursor                 │  (the dot that follows the mouse)
│ SiteHeader                   │  (top menu)
│ ┌──────────────────────────┐ │
│ │ <main>  YOUR PAGE HERE   │ │
│ │ FollowLinkedin box       │ │
│ └──────────────────────────┘ │
│ SiteFooter                   │
└──────────────────────────────┘
```

### Server components and client components

- By default, a component runs on the **server**. It makes HTML. It cannot use
  `useState`, clicks, or the browser.
- If a file starts with `"use client"`, it also runs in the **browser**. Use
  this only when you need state, clicks, animations, or `window`.
- Most pages are server components. They import small client components (like
  the `Hero` or `Reveal`) for the moving parts.

---

## 5. Where the content lives

| Content | File |
| --- | --- |
| Top menu and footer links | `src/lib/nav.ts` |
| Pilot projects + their full stories | `src/lib/pilots.ts` |
| Members list (name, country, groups) | `src/lib/members.ts` |
| Member photos | `src/app/members/page.tsx` (the `photos` map) + `public/members/` |
| News posts | inside `src/app/news/page.tsx` |
| Home page text | inside `src/app/page.tsx` and `src/components/home/` |
| About page text | inside `src/app/about/page.tsx` |
| Curriculum text | inside `src/app/curriculum/page.tsx` |
| Contact email | `src/app/contact/page.tsx` and `src/components/contact/contact-form.tsx` |
| LinkedIn and Survey links | `src/components/follow-linkedin.tsx` |
| Colors and fonts | `src/app/globals.css` and `src/app/layout.tsx` |

### Example: add a new member

1. Open `src/lib/members.ts`.
2. Add one line to the `members` list:
   ```ts
   { name: "Jane Doe", country: "Ghana", groups: ["Curricula"] },
   ```
3. (Optional) Put a photo in `public/members/Jane.jpg` and add
   `"Jane Doe": "/members/Jane.jpg"` to the `photos` map in
   `src/app/members/page.tsx`.

---

## 6. How pilot stories work (the most complex part)

A **pilot** is one Sankofa project in one place (for example Tanzania).
Some pilots also have a full **story** (a blog-style article).

### 6.1 The data shape

All of this is in `src/lib/pilots.ts`:

```
Pilot
 ├── slug      "tanzania-network"   ← used in the URL
 ├── name, country, status ("Active" | "In development" | "Coming soon")
 ├── body      short text for the card on /pilots
 └── story?    (optional) the full article:
      ├── title, tag, date, dateTime, readingTime, location, lead
      ├── hero      one big image (Media)
      ├── facts     small label/value boxes
      └── blocks    the article body, a list of "blocks"
```

A **block** is one piece of the article. There are 8 kinds:
`heading`, `paragraph`, `quote`, `list`, `numbered`, `pathway`, `table`, `media`.

Text inside blocks can use 3 small marks (see `src/lib/rich-text.tsx`):

```
**bold**     _italic_     [link text](https://example.com)
```

### 6.2 How a story page is shown

1. `src/app/pilots/[slug]/page.tsx` reads the slug from the URL.
2. It calls `getPilot(slug)` from `src/lib/pilots.ts`.
3. If there is no story, it shows the 404 page.
4. If there is a story, it gives it to `StoryArticle`
   (`src/components/pilot-story/story-view.tsx`), which draws every block.
5. `generateStaticParams()` tells Next.js to build all story pages **ahead of
   time** at build time. So they load very fast.

### 6.3 The story editor (`/pilot/create`)

This is a small Word-like tool to write a new pilot story without writing code.

```
 Author types in the editor (browser)
          │
          ├── every 0.7 s ──► saved in the browser (localStorage)
          │
          ├── "Save" button ─► POST /api/pilot-drafts ─► content/pilot-drafts/<slug>.json
          │
          ├── adds a photo ──► POST /api/pilot-uploads ─► public/pilots/uploads/<slug>/<file>
          │
          ├── "Export" ──────► downloads the draft as a .json file
          │
          └── "Copy as TypeScript" ─► copies ready code to paste into src/lib/pilots.ts
```

- The right side shows a **live preview**. It uses the same `StoryArticle`
  component as the real page, so what you see is what readers get.
- The editor checks the draft (`validateDraft` in `src/lib/pilot-draft.ts`):
  for example a title is required and every image needs alt text.
- **To publish** a story: click "Copy as TypeScript", paste the code into
  `src/lib/pilots.ts`, then build and deploy again.

### 6.4 Safety rule for the server APIs

The two APIs write files on the disk. That is only safe on your own computer.
So `src/lib/pilot-editor-server.ts` says:

- In **development** (`npm run dev`): saving is allowed.
- In **production**: saving is **blocked** (HTTP 403), unless you set the
  environment variable `PILOT_EDITOR_ENABLED=true`.

When saving is blocked, the editor still works. The work stays in the browser
and you can use "Export".

Note: most hosts (like Vercel) do not keep files you write at runtime. So in
practice, use the editor on your own computer.

---

## 7. Styling and design

- All colors are CSS variables in `src/app/globals.css` (for example
  `--primary: #9e2b25` crimson, `--accent: #b07a1e` gold).
- Tailwind reads those variables, so you can write `bg-primary`,
  `text-muted`, `border-border` and so on.
- `container-page` and `container-prose` are our own Tailwind helpers that
  center content and give it a max width.
- The font is **Poppins**, loaded in `src/app/layout.tsx`.
- Every animation checks **"reduced motion"**. If the visitor's computer asks
  for less motion, the animation is turned off.

---

## 8. The contact form

There is **no email server**. The form in
`src/components/contact/contact-form.tsx` builds a `mailto:` link and opens the
visitor's own email app with the message already filled in. The address is
`info@teachsankofa.org`.

---

## 9. Things to know (current state)

- **The logo is hidden for now.** It was "asked to temporaly remove". It is
  not deleted, only commented out. Search the code for `asked to temporaly remove`
  to find all 4 places:
  - `src/components/site-header.tsx` (top menu logo)
  - `src/components/site-footer.tsx` (footer logo)
  - `src/components/home/hero.tsx` (big 3D logo card on the home page)
  - `src/app/not-found.tsx` (small brand mark on the 404 page)

  To bring it back, remove the comment around the code (and in the hero, turn
  the `//` notes back into `{/* */}` JSX comments). The image is still at
  `public/logo.png`.
- **Member Portal links** (`/portal/...`) are in the menu, but those pages do
  not exist yet. They show the 404 page.
- `.gitignore` still has old **merge-conflict markers** (`<<<<<<<`, `=======`,
  `>>>>>>>`). It should be cleaned up.
- `npm run lint` shows 2 old errors (`set-state-in-effect` in
  `custom-cursor.tsx` and `typewriter.tsx`). They do not stop the build.
