# Resources

Reference material for the course. Nothing in here is application code.

| File | What it is |
|---|---|
| `design-reference.md` | Design direction for FamAlbum's UI — palette, type scale, layout and interaction patterns, plus a scoped styling prompt for the agent. |
| `design-reference-source.png` | A render of the source design, for orientation while building. Reference only — not an asset to ship. |

## Saved web pages

`.mhtml` / `.html` captures are **gitignored** (see `.gitignore`). Drop them in
this folder locally and they'll stay out of the repo.

The reason: a "Save As" of a commercial template preview contains that
template's complete stylesheet, scripts and images. Studying it and deriving
design direction is fine — that's what `design-reference.md` is. Committing the
capture to a repo other people clone is redistributing a paid product, which is
a different thing.

To work from a saved page yourself: save it here, then ask the agent to derive
tokens and patterns into a markdown reference rather than to copy the CSS.
