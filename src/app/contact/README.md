# `src/app/contact/` — the Contact page (`/contact`)

**File:** `page.tsx`

## What is inside `page.tsx`

| Part | What it is |
| --- | --- |
| `EMAIL` | The public email: `info@teachsankofa.org`. |
| `socials` | Facebook, X and LinkedIn links shown on the page. |
| `ContactPage()` | Page with a photo (`public/contact.png`) and the form. |

## How the form sends messages

The form is the `ContactForm` component in
`src/components/contact/contact-form.tsx`. **There is no email server.** It
builds a `mailto:` link and opens the visitor's email app. See that folder's
README for details.

If you change the email address, change it in **both** files.
