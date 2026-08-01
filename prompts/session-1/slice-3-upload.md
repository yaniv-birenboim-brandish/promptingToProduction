# Slice 3 — Upload: file → Storage → metadata row

**Goal:** pick an image, choose private or shared, upload it. The bytes land in
Storage under your own folder; a row lands in `photos` pointing at them.

**Time:** ~20 minutes. This is the meatiest slice.

**Commit message:** `slice 3: upload flow — storage object plus metadata row`

---

## Prompt

> Read CLAUDE.md first, especially the architecture and security sections.
>
> Build slice 3: the upload flow.
>
> **Requirements**
>
> - A `useUploadPhoto` hook in `src/hooks/` exposing an `upload(file,
>   visibility)` action plus `isUploading` and `error`.
> - The order is: upload the file to Storage first, then insert the metadata
>   row. If the insert fails, remove the object you just uploaded so we don't
>   orphan bytes in the bucket.
> - The storage path must be `<user id>/<generated uuid>.<ext>`. Derive the
>   extension from the MIME type, not from the user's filename — never put a
>   user-supplied filename into the path.
> - Validate before uploading, with Zod: image MIME types only
>   (jpeg/png/webp/gif), 5 MB max. Surface a readable message when it fails.
> - An `UploadPhoto` component: a file input, a private/shared control
>   defaulting to **private**, a submit button, and visible progress plus
>   error states. It must not import `supabase` — it calls the hook.
> - Wire it into the signed-in shell.
>
> **Constraints**
>
> - No drag and drop, no multi-file, no image preview cropping, no resizing,
>   no thumbnails.
> - Use `PhotoInsert` from `src/lib/database.types.ts` for the row.
>
> Plan first. I want to see the failure-path handling in the plan, not
> discovered in the diff.

---

## What to look for when you review the diff

- **The rollback.** Did it actually delete the object when the insert fails, or
  does the plan mention it and the code skip it? This is the single most common
  place the agent's plan and its code disagree.
- **The path.** `${user.id}/${crypto.randomUUID()}.${ext}` — anything else and
  either the check constraint or the Storage policy will reject it. If it used
  `file.name`, that's the security rule from CLAUDE.md being ignored; call it
  out by name.
- **Zod at the boundary, or a cast?** `file as Image` is not validation.
- Does `owner_id` get set from the session, or is it hoped for from a default?
- Is the default visibility `private`? Defaults are a product decision. The safe
  default is the private one, and the agent will happily pick `shared` if you
  didn't say.

## Teaching beat

Two things happen in the real world and one of them can fail — that's the whole
lesson of this slice. Ask the room what state the system is in if the app
crashes between the two steps, before you look at the code. Then check whether
the agent thought about it. This is also the natural place to teach
**revert-and-re-prompt**: if the first attempt tangles the hook and the
component together, don't patch it — `git checkout .`, add the missing sentence
to the prompt, run it again. It is almost always faster, and it teaches that
prompts are the source you're editing.
