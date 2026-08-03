# Resources

Reference material for the course. Nothing in here is application code, and
nothing in here ships with FamAlbum.

## The React template (what students start from)

`react-template/` is the course's "purchased template": the JPhotolio
portfolio page as a small runnable **React app** in FamAlbum's exact stack.
The lesson it embodies — buy a template in the technology you plan to build
with, then adapt its data model to your product instead of porting markup.
Slice 1 of the course is exactly that adaptation. See
`react-template/README.md` for how to run it and how instructors import the
real theme assets (which stay local-only).

## The design reference

`design-reference.md` is the design source in document form: the tokens,
layout rules, and interaction patterns the template implements, described
in our own terms — the license-safe record of where the design came from.

## The purchased theme bundle (local only, instructor's machine)

`jphotolio-html-bundle/` is the **purchased** JPhotolio theme (jegtheme,
ThemeForest item 3057579) — the original HTML build, PSDs, docs, and license
texts. It is the *provenance archive*: the source the React template and the
design reference were derived from. Students never need it — they work from
`react-template/`.

It is **gitignored** (see `.gitignore`) and exists only on the instructor's
machine: the ThemeForest license covers the buyer's use, not redistribution to
everyone who clones this repo. The demo photographs inside `images/` were
mirrored from the author's own demo site to replace the grey placeholders the
bundle ships with; they are under the same restriction. The untouched
placeholders are kept in `images-placeholder-backup/`.

To browse it with everything working, serve it over HTTP — parts of it load
via ajax, so `file://` won't fully work:

```bash
cd resources/jphotolio-html-bundle/jphotoliohtml
python3 -m http.server 8899
# open http://localhost:8899/masonry.html
```

## Saved web pages

`.mhtml` / `.html` captures are also gitignored. Drop them in this folder
locally and they'll stay out of the repo. Note that an MHTML snapshot contains
**no JavaScript** — Chrome strips scripts on save — so none of a template's
interactions survive in it; it's a static visual reference only.

## The rule for FamAlbum code

Derive, don't paste. Studying the theme and rebuilding its patterns (tokens,
layout, interactions) in FamAlbum's own Tailwind/React code is what the license
and the course both intend. Copying the theme's markup, CSS, or images into the
app — or into anything committed — is redistribution of a paid product.
