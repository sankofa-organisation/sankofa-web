# `src/app/about/` — the About Us page (`/about`)

**File:** `page.tsx`

This page tells who Sankofa is. It is a **server component** (no `"use client"`),
so it is turned into plain HTML at build time.

## What is inside `page.tsx`

| Part | What it is |
| --- | --- |
| `metadata` | Page title and description for the browser tab and Google. |
| `groups` | The 3 working groups (Curricula, Communication, Implementation) with an icon and text. |
| `leadership` | The leaders shown on the page. |
| `countries` | The list of countries where Sankofa is active. |
| `AboutPage()` | The page itself. Uses `PageHero` at the top, then `Section` blocks. |

## To change the text

Edit the arrays at the top of `page.tsx`. The page loops over them, so you do
not need to touch the HTML below.
