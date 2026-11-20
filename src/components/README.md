# `src/components/`

Reusable React components. Named exports only. kebab-case file names.

## Top-level components (site shell)

| File | Export | Type | Description |
| --- | --- | --- | --- |
| `site-header.tsx` | `SiteHeader` | client | Sticky header (`z-40`, blurred background). `usePathname()` + `isActive(pathname, href)` (exact for `/`, `startsWith` otherwise) sets `aria-current` and the active underline. Desktop nav ≥ `lg`; below that a toggle (`useState`) shows `#mobile-menu` with `primaryNav` and `portalNav`. Logo `<Link>` commented out ("asked to temporaly remove"). |
| `site-footer.tsx` | `SiteFooter` | server | Three columns: blurb + `LINKEDIN_URL`/`SURVEY_URL` links, `primaryNav`, `portalNav`. Year from `new Date()` at build time. Logo commented out. |
| `follow-linkedin.tsx` | `FollowLinkedin`, `LINKEDIN_URL`, `SURVEY_URL` | server | CTA section rendered by the root layout at the end of every `<main>`. Import the URL constants instead of duplicating them. |
| `custom-cursor.tsx` | `CustomCursor` | client | Custom pointer. Enabled only if `matchMedia("(hover: hover) and (pointer: fine)")` and not reduced motion; then adds `html.cursor-ready` (CSS hides native cursor). Window `pointer*` listeners feed a motion value; dot and glow follow via springs with different stiffness. `active` = `e.target.closest(INTERACTIVE)`. Returns `null` when disabled. |
| `page-hero.tsx` | `PageHero({ eyebrow, title, description? })` | server | Header band for inner pages; renders the page `<h1>`. |
| `sankofa-mark.tsx` | `SankofaMark({ className?, title? })` | server | Inline SVG brand mark (`currentColor` + `var(--accent)`). Currently unused (logo hidden). |

## Sub-folders

| Folder | Contents |
| --- | --- |
| [`ui/`](ui/README.md) | Design-system primitives: `Button`, `ButtonLink`, `Section`, `SectionHeader` |
| [`motion/`](motion/README.md) | Animation wrappers (all client) |
| [`home/`](home/README.md) | Home page sections |
| [`contact/`](contact/README.md) | `ContactForm` |
| [`pilot-story/`](pilot-story/README.md) | Story renderer shared by site and editor |
| [`pilot-editor/`](pilot-editor/README.md) | Story authoring app |

## Rules

- Keep components server-side unless they need state/effects/events/browser APIs.
- Accept `className` and merge with `cn()` so callers can extend styles.
- Use design tokens (`bg-primary`, `text-muted`, …), not raw hex, except in the
  dark footer/hero where fixed tints are used.
- Any animated component must handle `useReducedMotion()`.
