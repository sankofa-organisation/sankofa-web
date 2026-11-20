# `src/app/members/` — `/members`

| File | Kind |
| --- | --- |
| `page.tsx` | RSC, statically prerendered |

## Data flow

```
lib/members.ts  members: Member[]  ──┐
                                     ├─► MembersPage → <ul> of member cards
page.tsx        photos: Record<name, "/members/…">  ┘
page.tsx        groupStyles: Record<WorkingGroup, tailwind classes>
```

- `Member = { name, country, groups: WorkingGroup[] }`.
- Portrait lookup is `photos[m.name]` — **exact string match**. Missing → an
  `initials(name)` panel is rendered instead.
- `groupStyles` colours the working-group badges.
- List `key` is `m.name` (names must be unique).

## Privacy

Contact details were removed from the data on purpose. Do not reintroduce
email/phone fields: anything used while rendering (including React keys) ends
up in the public HTML/RSC payload.
