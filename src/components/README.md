# `src/components/` — reusable pieces

A **component** is a function that returns HTML (JSX). Pages in `src/app/`
are built by putting these pieces together.

## Files directly in this folder (used on every page)

| File | Client? | What it does |
| --- | --- | --- |
| `site-header.tsx` | yes | The top bar. Desktop menu, mobile menu (hamburger), and the "Member Portal" button. The links come from `src/lib/nav.ts`. `isActive()` underlines the link for the page you are on. **The logo is commented out** ("asked to temporaly remove"). |
| `site-footer.tsx` | no | The dark footer. Short text, LinkedIn + Survey links, the "Explore" links and "Member Portal" links. **The logo is commented out** ("asked to temporaly remove"). |
| `follow-linkedin.tsx` | no | The box at the bottom of every page that asks people to follow on LinkedIn and fill the survey. Exports `LINKEDIN_URL` and `SURVEY_URL` so other files use the same links. |
| `custom-cursor.tsx` | yes | A small dot + soft glow that follows the mouse. Only on computers with a mouse and when "reduced motion" is off. On phones it shows nothing. |
| `page-hero.tsx` | no | The title block at the top of inner pages (About, Curriculum, ...). Takes `eyebrow` (small top text), `title` and `children`. |
| `sankofa-mark.tsx` | no | An SVG drawing of the Sankofa bird mark. Was used on the 404 page; now **not used** because the logo is hidden. Kept for later. |

"Client? yes" means the file starts with `"use client"` and runs in the browser.

## Sub-folders

| Folder | What is inside |
| --- | --- |
| [`ui/`](ui/README.md) | Basic building blocks: `Button`, `ButtonLink`, `Section`, `SectionHeader`. |
| [`motion/`](motion/README.md) | Animation wrappers: reveal on scroll, tilt, typewriter, count up, focus blur. |
| [`home/`](home/README.md) | Pieces used only on the home page. |
| [`contact/`](contact/README.md) | The contact form. |
| [`pilot-story/`](pilot-story/README.md) | The layout of a pilot story article. |
| [`pilot-editor/`](pilot-editor/README.md) | The story editor tool at `/pilot/create`. |
