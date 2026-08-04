---
description: Scaffold a presentational component the FamAlbum way — props in, callbacks out, no supabase
---

Scaffold a new presentational component named **$ARGUMENTS** in
`src/components/`, following this repo's rules exactly:

1. **Named export**, one component per file, file named after the
   component.
2. **Presentational only**: everything it shows arrives via props;
   everything it does goes out via callback props. It must NOT import
   `supabase` or any `src/hooks/*` module — if it needs data, the parent
   passes it down.
3. Props defined in an `interface <Name>Props` above the component.
   Optional callbacks are optional props, not empty-function defaults.
4. Style with the design tokens already in `tailwind.config.js`
   (`page`, `ink`, `chrome`, `caption`, `meta`, `brand`, `shadow-card`,
   `font-accent`) and the template's patterns: white card on the page
   colour, `rounded-[3px]`, `#dddddd` borders, one accent used sparingly.
5. Include the unglamorous states in the markup where they apply: empty,
   loading, and error — visible, not console-logged.
6. A short JSDoc comment saying what the component is for, in the voice
   of the existing components.

Show me the file, then stop — wiring it into App is the caller's job.
