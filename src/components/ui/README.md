# `src/components/ui/` — primitives

Server-safe (no `"use client"`). Styles combined with `cn()`.

## `button.tsx`

```ts
type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";
type CommonProps = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

Button(props: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>)   // <button>
ButtonLink(props: CommonProps & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className">)  // <Link>
```

| Variant | Style |
| --- | --- |
| `primary` (default) | crimson fill, `text-on-primary`, shadow on hover |
| `secondary` | brown fill |
| `outline` | bordered surface, crimson on hover |
| `ghost` | transparent, sunken background on hover |

| Size | Classes |
| --- | --- |
| `sm` | `h-9 px-4 text-sm` |
| `md` (default) | `h-11 px-5` |
| `lg` | `h-13 px-7 min-h-[44px]` |

Shared base: pill shape, focus-visible ring, disabled state, `active:scale-[0.98]`.
Because `className` is merged last through `tailwind-merge`, callers can
override any base class.

## `section.tsx`

```ts
Section({ tone?: "default" | "sunken" | "ink", className?, children })
SectionHeader({ eyebrow?, title, description?, align?: "left" | "center", className? })
```

| `tone` | Background |
| --- | --- |
| `default` | `bg-background` |
| `sunken` | `bg-surface-sunken` |
| `ink` | `bg-foreground` with light text |

`Section` only sets vertical rhythm (`py-16 sm:py-20 lg:py-24`) and background;
put `container-page` inside it for width. `SectionHeader` renders an `<h2>`, so
use it below the page's single `<h1>` (from `PageHero` or the hero).
