# `public/` — images and files served as they are

Every file in this folder can be opened by its path, with `public` removed.

```
public/logo.png            →  https://<site>/logo.png
public/members/Amira.png   →  https://<site>/members/Amira.png
```

In code, write the path **starting with `/`** and without `public`:

```tsx
<Image src="/image.jpg" alt="..." width={800} height={600} />
```

> Note: this README is also public (`/README.md`). Do not write secrets here.

## Files

| File | Used in |
| --- | --- |
| `logo.png` | Header, footer and home hero. **Currently hidden** (commented out — "asked to temporaly remove"). The file is kept. |
| `image.jpg` | Home hero background photo (`src/components/home/hero.tsx`). |
| `image1.jpg`, `image2.jpg`, `image3.jpg` | Photo cards on the home page (`src/app/page.tsx`). |
| `contact.png` | Photo on the Contact page. |
| `sankofa-bird.jpg` | Not used in the code right now. |
| `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | Default files from `create-next-app`. Not used. Safe to delete later. |

## Folders

| Folder | What is inside |
| --- | --- |
| [`members/`](members/README.md) | Member photos for the Members page. |
| [`pilots/`](pilots/README.md) | Photos (and videos) for each pilot story. |
