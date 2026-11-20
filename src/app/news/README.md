# `src/app/news/` — `/news`

| File | Kind |
| --- | --- |
| `page.tsx` | RSC, statically prerendered |

## Model

```ts
type Post = {
  title: string;
  date: string;       // display string, not parsed
  excerpt: string;
  tag: string;
  href?: string;      // optional link
  external?: boolean; // true → opens in new tab
};
const featured: Post;   // large card at top
const posts: Post[];    // grid, rendered in array order
```

No CMS: posts are hard-coded. Add new posts at the start of `posts` (newest
first) or replace `featured`. Most posts link out to LinkedIn.
