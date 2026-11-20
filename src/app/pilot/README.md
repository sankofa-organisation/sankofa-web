# `src/app/pilot/` — authoring tools

Singular `pilot/` holds internal tools; the public pages are under `pilots/`.

| Route | File | Notes |
| --- | --- | --- |
| `/pilot/create` | `create/page.tsx` | Story editor. `robots: { index: false, follow: false }`. Not linked from navigation. |

The page is a thin RSC wrapper around the client app `<PilotEditor/>`
(`src/components/pilot-editor/editor.tsx`). It prerenders an empty shell;
all state is created in the browser.

Back end: `src/app/api/pilot-drafts` and `src/app/api/pilot-uploads`, which
write to disk only when `editorWritesAllowed()` is true (dev, or
`PILOT_EDITOR_ENABLED=true`).

Output of the tool is TypeScript pasted into `src/lib/pilots.ts`; it does not
publish anything itself. Full description: root README §9 and
`src/components/pilot-editor/README.md`.
