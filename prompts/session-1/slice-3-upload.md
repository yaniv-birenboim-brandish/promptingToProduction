# Slice 3 — Upload with rollback ⚠ the riskiest slice

**Goal:** pick an image, choose private or shared, upload it, and watch it
appear in the gallery. The bytes land in Storage under your own folder; a row
lands in `photos` pointing at them. A bad file fails loudly.

**Time:** ~20 minutes. The meatiest slice — budget for it.

**Commit message:** `feat: photo upload with visibility choice and rollback`

---

## Prompt

> Read CLAUDE.md and instructions/plan.md first, especially the architecture
> and security sections of CLAUDE.md.
>
> Build slice 3 of the plan: the upload flow.
>
> **Requirements**
>
> - A `useUploadPhoto` hook in `src/hooks/` exposing `upload(file,
>   visibility)` plus `isUploading` and `error`.
> - The order is fixed: upload the file to Storage first, then insert the
>   metadata row. **If the insert fails, remove the object you just
>   uploaded** — no orphaned bytes in the bucket.
> - The storage path must be `<user id>/<generated uuid>.<ext>`. Derive the
>   extension from the MIME type — never put a user-supplied filename in the
>   path.
> - Validate before uploading, with Zod: image MIME types only
>   (jpeg/png/webp/gif), 5 MB max. Surface a readable message when it fails.
> - An `UploadForm` component: file input, a private/shared control
>   defaulting to **private**, a submit button, visible progress and error
>   states. It calls the hook — it does not import `supabase`.
> - After a successful upload the gallery refreshes without a page reload.
>
> **Constraints**
>
> - No drag-and-drop, no multi-file, no preview cropping, no resizing, no
>   thumbnails.
> - Use `PhotoInsert` from `src/lib/database.types.ts` for the row.
>
> Plan first. I want to see the failure-path handling in the plan, not
> discovered in the diff.

---

## What to look for when you review the diff

- **The rollback.** Did it actually delete the object when the insert fails,
  or does the plan mention it and the code skip it? This is the single most
  common place the agent's plan and its code disagree. Test it: deliberately
  break the insert and check the bucket stays clean.
- **The path.** `${user.id}/${crypto.randomUUID()}.${ext}` — anything else
  and either the check constraint or the Storage policy rejects it. If it
  used `file.name`, that's the CLAUDE.md security rule being ignored; call it
  out by name.
- **Zod at the boundary, or a cast?** `file as Image` is not validation.
- Does `owner_id` come from the session, or is it hoped for from a default?
- Is the default visibility `private`? Defaults are a product decision; the
  agent will happily pick `shared` if you didn't say.

## Teaching beat

Two things happen in two different services and either can fail — that's the
whole lesson of this slice. Ask the room what state the system is in if the
app dies between the two steps, *before* looking at the code. Then check
whether the agent thought about it. This is also the natural place to teach
**revert-and-re-prompt**: if the first attempt tangles the hook and the
component together, don't patch it — `git checkout .`, add the missing
sentence to the prompt, run it again. Prompts are the source you're editing.

## Done when

Upload a photo and it appears in the gallery for the right people; break the
insert and the bucket stays clean; a 6 MB file and a `.pdf` each show a clear
on-screen error.
