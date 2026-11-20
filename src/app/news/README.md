# `src/app/news/` — the News page (`/news`)

**File:** `page.tsx`

A simple list of news posts. There is no CMS or database.

## What is inside `page.tsx`

| Part | What it is |
| --- | --- |
| `type Post` | The shape of one post: `title`, `date`, `excerpt`, `tag`, and an optional `href` (link) and `external` (opens in a new tab). |
| `featured` | The one big post at the top. |
| `posts` | The rest of the posts, shown as cards. |
| `NewsPage()` | Draws the page. |

## To add a news post

Add a new object at the **top** of the `posts` array (newest first), or
replace `featured` if it should be the big one.
