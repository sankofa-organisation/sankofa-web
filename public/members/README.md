# `public/members/` — portraits

Served at `/members/<file>`.

| Consumer | Lookup |
| --- | --- |
| `src/app/members/page.tsx` | `photos: Record<string, string>` keyed by exact `Member.name` |
| `src/app/about/page.tsx` | `leadership[].photo` |

File names are free-form (mostly first or last name, `.jpg`/`.png`); the
mapping in code is what links a file to a person. A member without an entry
gets an initials panel.

Recommended: square crop, ~600×600 px, faces centred (cards use
`object-cover`).
