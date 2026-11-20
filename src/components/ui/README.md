# `src/components/ui/` — basic building blocks

Small, simple components. Use them instead of writing the same classes again.

## `button.tsx`

Two components with the same look:

| Component | Renders | Use it for |
| --- | --- | --- |
| `Button` | `<button>` | Actions (submit a form, open a menu). |
| `ButtonLink` | Next.js `<Link>` | Going to another page. |

Props:

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `"primary"` (crimson), `"secondary"` (brown), `"outline"`, `"ghost"` | `"primary"` |
| `size` | `"sm"`, `"md"`, `"lg"` | `"md"` |
| `className` | extra Tailwind classes | — |

```tsx
<ButtonLink href="/contact" variant="outline" size="lg">Get in touch</ButtonLink>
```

The classes are joined with `cn()` from `src/lib/cn.ts`, so your `className`
can safely override the default ones.

## `section.tsx`

| Component | What it does |
| --- | --- |
| `Section` | A `<section>` with standard top/bottom space. `tone` picks the background: `"default"` (parchment), `"sunken"` (a bit darker), `"ink"` (dark). |
| `SectionHeader` | A heading group: small `eyebrow` text, big `title`, optional `description`. Can be centered. |

```tsx
<Section tone="sunken">
  <div className="container-page">
    <SectionHeader eyebrow="Our approach" title="Learning from what is at hand" />
  </div>
</Section>
```
