# Design reference — photography-portfolio direction

Derived from the **JPhotolio** wedding photography template (jegtheme,
ThemeForest item 3057579). The purchased theme is the course's predefined
design; the instructor's copy lives at `resources/jphotolio-html-bundle/`
(gitignored — the license covers the buyer, not everyone who clones this
repo). **This file is the shareable form**: everything FamAlbum takes from
that design, described in our own terms.

**What this file is:** design *direction* — tokens, layout rules, and
interaction patterns, for building FamAlbum's UI. The app implements it from
the first slice: components are built already styled.
**What it is not:** the template's markup, CSS, or images. Nothing here
should be implemented by pasting the theme's code — derive, don't paste.

---

## The design in one paragraph

A white card sitting on a near-white textured page, arranged in a tight masonry
grid. The photograph is the only saturated thing on screen — every piece of
chrome is greyscale, and there is exactly one accent colour used sparingly.
Captions live *below* the image in a white strip rather than overlaid on it, so
nothing competes with the photo. Type is a condensed sans for structure and an
italic serif for personality. Everything is small, quiet, and closely spaced.

It reads as 2012 in its execution (background textures, sprite icons, Bootstrap
2, gradient chrome) but the underlying composition rules are still sound and
are what we should take.

---

## Tokens

### Colour

| Role | Value | Notes |
|---|---|---|
| Page background | `#fafafa` | near-white, not pure white |
| Card / surface | `#ffffff` | the card must read as lighter than the page |
| Ink | `#222222` | body text |
| Chrome / active | `#181818` | dark bars, active filter pill |
| Caption title | `#464646` | softer than body ink |
| Caption meta | `#969595` | tags, secondary line |
| Muted / disabled | `#999999` | |
| Border | `#dddddd` | the workhorse — used everywhere |
| Border, light | `#eeeeee` / `#f5f5f5` | dividers, alternating rows |
| Accent | `#de3917` | a warm red-orange, used *rarely* |
| Card shadow | `rgba(34,25,25,.4)` | |
| Overlay scrim | `rgba(0,0,0,.4)` | |

The discipline worth copying: **eight greys and one accent.** The accent appears
on maybe two elements per screen. Everything else earns its hierarchy from
weight and size, not colour.

### Type

- **Structure / body:** `PT Sans Narrow` — a condensed sans. Condensed is doing
  real work here: navigation and captions stay compact so the images get the
  space.
- **Accent / voice:** `Overlock`, *italic only* — taglines, filter labels,
  the "we won't bite you" line under a nav item. Never for body copy.
- **Logo:** a script face, image-based.
- Base `1em` / `16px`, line-height **1.5**.
- Sizes are relative, in a small set: `70% 80% 85% 90% 100% 120% 150%`, with
  `300%` / `450%` reserved for display headings.
- Weights: normal and 700. No light, no black.
- Captions run at **80%** — deliberately smaller than you'd expect.

A useful rule extracted: *two families, one of which is italic-only and
decorative.* That pairing is most of the personality.

### Space, radius, shadow, motion

- Grid gutter: **10px**. Tight — the mosaic should feel dense.
- Card padding: image flush to the card edge; caption block padded
  `14px 5px 0` for the title, `2px 5px 0` for the meta line.
- Radius: **3px** almost everywhere. `30px` only for pills.
- Shadow: `0 1px 2px rgba(34,25,25,.4)` — one shadow, applied to cards only.
- Transitions: `.3s ease-in-out` for UI, `.4s linear` for image reveals.

---

## Layout patterns

### Masonry card grid

Fixed-width columns (200px content / ~220px card) with variable heights,
packed. Not a CSS-grid `auto-fill` — genuine masonry, so tall portrait shots and
wide landscape shots interlock instead of leaving gaps.

The card is: `image → title → tag line`, all centred, on white.

### Filter bar

A single horizontal row of segmented pills above the grid: `all | audio video |
black and white | church | prewedding | wedding`. Labels lowercase, italic
serif. Active state is solid `#181818` with white text — no border, no glow.
A small icon button at the left toggles grid/list.

### Like badge

Top-right corner of each image: count + heart, white background, `70%` font,
`border-bottom-left-radius: 5px` so it tucks into the image corner. Cheap,
legible, doesn't obscure the photo.

### Header

Nav items as a row of bordered cells, each with a **label plus an italic
sub-label** ("PORTFOLIO / *What we have done*"). The logo sits in the middle of
the nav, splitting it. That centred-logo split-nav is dated but the
label+sublabel idea is genuinely nice and cheap to reuse.

### Card hover

The gallery's hover is not a zoom. Three things happen together, fast
(~200ms): a **white veil** wipes down over the whole card (the theme's
`.shadow` div animating height 0 → 100%), the **caption slides** from the
bottom strip to the vertical centre of the card, and a small **type icon**
appears under it (`display:none` until hover — it must not occupy layout
space before). The corner badge sharpens from ~40% to full opacity. Cursor
is pointer; the whole card is the click target.

### The reveal

Each image starts covered by a white panel that animates its height to zero —
a curtain wiping downward as images load. Not a fade. It's the one piece of
motion in the design and it's what makes the grid feel considered rather than
just filled in.

### Breakpoints

`480 / 767 / 979 / 1000` — Bootstrap-2 era. Map to Tailwind's `sm 640 / md 768 /
lg 1024 / xl 1280` rather than reproducing these.

---

## Mapping to FamAlbum

**Take:**

- The card-on-off-white treatment, 10px gutters, caption below the image.
- Greyscale chrome + one accent. Our accent can carry the private/shared
  distinction.
- Small caption type. The photo is the content.
- The corner-badge pattern — **this is where our `private` / `shared` badge
  goes.** Same position as their like counter, same tuck-in radius. Private gets
  the accent or a lock glyph; shared stays neutral. It's the only place the
  permission model needs to appear visually, and it's already solved.
- The curtain reveal, if there's time. It costs one div and a transition.

**Adapt:**

- Masonry: implemented as a **measured layout** matching the theme's
  plugin behaviour — fixed 220px items placed left-to-right into the
  shortest column, absolutely positioned, relayout on resize and image
  load (`useMasonry`, ~50 lines, no plugin, no stored dimensions).
- Their filter bar maps onto the gallery's display filter (all / my photos
  / family's) — shipped styled in slice 1, filtering **display only**. The
  homework wires it into the database query and asks why the JS version
  was never a security control.

**Leave:**

- Sprite-sheet icons and gradient chrome — use `lucide-react`, it's already
  a dependency.
- Percentage font sizing. Use Tailwind's scale.
- Bootstrap 2 grid and its breakpoints.

**Local-only assets:** the header/body/footer textures and the logo image
are theme files served from gitignored `public/theme/` (the demo photos
likewise from `public/fixtures/`). The app degrades gracefully without
them — flat page colour, text wordmark, SVG placeholder photos — so fresh
clones work; the full look exists only where the purchased bundle does.
The centred split navigation is ported as-is; it's the page's identity.

---

## Tailwind tokens

The base page for all of this is the purchased bundle's
`jphotoliohtml/masonry.html`; every value below is verified against its
actual stylesheet (`jphotoliohtml/css/style.css`). If a token here and the
bundle ever disagree, the bundle wins — re-derive, don't guess.

Drop into `tailwind.config.js` under `theme.extend`, or express as CSS variables
in `src/index.css` alongside the existing shadcn ones:

```js
colors: {
  page:    '#fafafa',
  ink:     '#222222',
  chrome:  '#181818',
  caption: '#464646',
  meta:    '#969595',
  accent:  '#de3917',
},
boxShadow: {
  card: '0 1px 2px rgba(34,25,25,0.4)',
},
fontFamily: {
  sans:   ['"PT Sans Narrow"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  accent: ['Overlock', 'Georgia', 'serif'],
},
```

Both faces are on Google Fonts. Load `PT Sans Narrow` 400/700 and `Overlock`
400 *italic only* — don't ship the roman weight you won't use.

---

## Prompt for the agent

Paste this when you do the styling pass. It is deliberately a *styling* task
with a hard boundary — no behaviour changes.

> Read CLAUDE.md and resources/design-reference.md.
>
> Restyle the existing gallery and shell to match the design reference. Scope:
> visual only. Do not change any hook, query, or permission logic, and do not
> add or remove features.
>
> - Add the palette and font families from the reference to
>   `tailwind.config.js`. Load PT Sans Narrow (400/700) and Overlock (400
>   italic) from Google Fonts.
> - Photo cards: white surface on the off-white page, 10px gutters, `3px`
>   radius, the card shadow from the reference, image flush to the card edge,
>   caption block below it.
> - Put the private/shared indicator in the top-right corner of the image as a
>   small badge with a bottom-left radius, following the reference's badge
>   pattern. Private uses the accent; shared stays neutral grey.
> - Keep the fixed aspect-ratio grid. Do not implement masonry — we don't have
>   image dimensions yet.
> - One accent colour, used only on the private badge and the primary action.
>
> Show me the plan first.

---

## Seeing the real thing

Students: this file is your design source — it's complete on its own.
Instructors with the purchased bundle can browse the live original for
orientation or projector demos:

```bash
cd resources/jphotolio-html-bundle/jphotoliohtml
python3 -m http.server 8899   # then open http://localhost:8899/masonry.html
```
