# `src/components/contact/` — `ContactForm` (client)

```ts
const RECIPIENT = "info@teachsankofa.org";
```

## Flow

```
state: name, email, message, sending
submit
  → preventDefault; ignore if sending; setSending(true)
  → subject = encodeURIComponent(`Message from ${name || "the website"}`)
  → body    = encodeURIComponent(`Name: …\nEmail: …\n\n${message}`)
  → setTimeout(5000) → window.location.href = `mailto:${RECIPIENT}?subject=…&body=…`
```

- No network request, no backend, no spam protection, no delivery guarantee —
  the visitor must have a mail client and press Send there.
- The 5-second delay is purely visual (a "sending" state).
- `sending` is never reset, so a second submit requires a page reload.

## Replacing with real delivery

Add a route handler (e.g. `src/app/api/contact/route.ts`) that sends via an
email provider, `fetch()` it from `handleSubmit`, and show success/error
states. Keep `RECIPIENT` in sync with `EMAIL` in `src/app/contact/page.tsx`.
