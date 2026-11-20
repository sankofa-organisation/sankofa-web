# `src/app/members/` — the Members page (`/members`)

**File:** `page.tsx`

Shows a card for every Sankofa working-group member.

## How it works

1. The list of people comes from `src/lib/members.ts` (`members` array).
2. The `photos` map at the top of `page.tsx` links a member **name** to a
   photo in `public/members/`. Example:
   ```ts
   "Amira Ouerfelli": "/members/Amira.png",
   ```
   If a name is not in the map, the card shows the person's initials instead.
3. `groupStyles` gives each working group (Curricula / Communication /
   Implementation) its own badge color.

## To add a person

1. Add them to `src/lib/members.ts`.
2. (Optional) Put their photo in `public/members/` and add a line to `photos`.

**The name must match exactly** in both places, or the photo will not show.
