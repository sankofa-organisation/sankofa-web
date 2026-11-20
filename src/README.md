# `src/` — all the code

Everything that makes the website lives here. There are 3 folders:

| Folder | What is inside | Has UI? |
| --- | --- | --- |
| [`app/`](app/README.md) | The pages. Each folder is one URL. Also the server APIs. | Yes |
| [`components/`](components/README.md) | Reusable pieces used by the pages (header, buttons, animations, editor). | Yes |
| [`lib/`](lib/README.md) | Data (pilots, members, menu links) and helper functions. | No |

## Simple rule

- A **page** (in `app/`) puts components together and adds the text.
- A **component** (in `components/`) is a piece you can use on many pages.
- **lib** holds data and logic. It does not draw anything (except
  `rich-text.tsx`, which turns small text marks into bold/italic/links).

## Import shortcut

`@/` means this `src/` folder. Example:

```ts
import { members } from "@/lib/members";      // = src/lib/members.ts
import { Section } from "@/components/ui/section";
```

This is set in `tsconfig.json` (`"paths": { "@/*": ["./src/*"] }`).
