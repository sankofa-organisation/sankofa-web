# `public/members/` — member photos

Photos shown on the Members page (`/members`).

## How a photo is linked to a person

The file name does **not** do it by itself. The link is the `photos` map at the
top of `src/app/members/page.tsx`:

```ts
const photos: Record<string, string> = {
  "Amira Ouerfelli": "/members/Amira.png",
  ...
};
```

The key must be the **exact** name from `src/lib/members.ts`.

## To add a photo

1. Put the file here (square-ish `.jpg` or `.png`, about 600×600 px is enough).
2. Add one line to `photos` in `src/app/members/page.tsx`.

People with no photo show their initials instead.
