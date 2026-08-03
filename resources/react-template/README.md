# JPhotolio — React template

This is the course's "purchased template": the JPhotolio portfolio page as
a small, self-contained **React app** — the same stack FamAlbum uses
(Vite + React + TypeScript + Tailwind). The lesson it embodies: when you
buy a template, buy one in the technology you plan to build with.

## What it includes

- Header with nav cells (label + italic sublabel, black-out hover) and the
  logo splitting the middle
- Category filter pills (active = solid chrome-black), display-only
- Measured masonry gallery: fixed 220px cards, 10px gutters,
  shortest-column packing, relayout on resize/image load (`src/useMasonry.ts`)
- Cards with like badges, white load-reveal, and the hover interaction
  (veil wipes down, caption slides to centre, type icon appears)
- Single-item view with prev/next, behind the page-transition curtain
- Slim dark footer

What it deliberately does **not** include: uploads, auth, permissions,
persistence — that's the app you build from it.

## Run it

```bash
cd resources/react-template
npm install
npm run dev     # http://localhost:5180
```

## Images and theme assets

`public/fixtures/` and `public/theme/` ship **empty** (gitignored): the
original theme's photos, textures, and logo are licensed to the purchaser
and can't be redistributed in this repo. The template runs fine without
them — embedded placeholders and a text wordmark render instead.

Instructors with the purchased bundle: run `./import-theme-assets.sh` to
copy the real photos, textures, and logo in locally.

## Adapting it (what the course does)

Everything is plain React + Tailwind, no plugins. The intended workflow is
to change `src/data.ts` to your own data model, repurpose the badge/filter/
caption slots for your product's concepts, and keep the layout, tokens, and
interactions. FamAlbum's slice 1 does exactly this.
