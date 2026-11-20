# `src/components/contact/` — the contact form

**File:** `contact-form.tsx` (client component)

## How it works

There is **no backend** and no email service. The form only opens the
visitor's own email app.

1. The visitor types name, email and message (kept in `useState`).
2. On submit, the code builds a `mailto:` link:
   ```
   mailto:info@teachsankofa.org?subject=Message from <name>&body=Name: ...\nEmail: ...\n\n<message>
   ```
   (Text is made safe with `encodeURIComponent`.)
3. It shows a short "sending" state, waits **5 seconds**, then sets
   `window.location.href = mailto`. The email app opens with everything filled in.
4. The visitor must press **Send** in their email app.

## Things to know

- If the visitor has no email app set up, nothing happens.
- To change the address, edit `RECIPIENT` here **and** `EMAIL` in
  `src/app/contact/page.tsx`.
- To get real form sending later, replace step 2–3 with a `fetch()` to an API
  route or a form service.
