# `src/app/contact/` — `/contact`

| File | Kind |
| --- | --- |
| `page.tsx` | RSC, statically prerendered |

## Data

| Const | Value |
| --- | --- |
| `EMAIL` | `info@teachsankofa.org` (shown as a `mailto:` link) |
| `socials` | `{ label, href }[]` — Facebook, X, LinkedIn |

## Composition

`PageHero` → two-column `Section`: image `public/contact.png` + contact info,
and the client component `ContactForm`
(`src/components/contact/contact-form.tsx`).

The form has no backend; it opens the visitor's mail client via `mailto:`.
`EMAIL` here and `RECIPIENT` in the form component are separate constants —
keep them in sync.
