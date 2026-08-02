# Slice 4 — Delete your own photos

**Goal:** a delete control on your own photos only. The photo disappears from
the grid, the row from the table, and the bytes from Storage. This slice
closes the spec — the two-user test passes end to end.

**Time:** ~7 minutes. Small on purpose; the review is the point.

**Commit message:** `feat: delete own photos`

---

## Prompt

> Read CLAUDE.md and instructions/plan.md first.
>
> Build slice 4 of the plan: delete your own photos.
>
> **Requirements**
>
> - A delete action (extend `usePhotos`, or a small `useDeletePhoto` hook):
>   delete the **row first, then the Storage object**, and surface a visible
>   error if either step fails — no silent halves.
> - `PhotoCard` shows the delete control only when the photo's `owner_id`
>   matches the session user. That's a display convenience — **RLS is the
>   enforcement**, and both are correct together.
> - Refresh the gallery after a successful delete.
>
> **Constraints**
>
> - At most a plain `confirm()` before deleting — no modal component, no
>   undo, no soft-delete.
>
> Plan first.

---

## What to look for when you review the diff

- **The order: row, then object.** An orphaned object (row gone, delete of
  bytes failed) is invisible to users; the other order can leave a row whose
  image 404s — a broken card on screen. Did the agent get the order right,
  and did it *surface* a second-step failure rather than swallow it?
- Is the delete control hidden for other people's photos in the UI only, or
  is the code also relying on the policy? (Both is the right answer — the UI
  hides it, the database enforces it.)
- Does the grid refresh, or does the deleted photo linger until reload?

## Teaching beat

Run the spec's **definition of done**, live, with two people: each uploads
one private and one shared photo; each sees exactly three; neither can see or
delete the other's private one. Then say the quiet part: nothing in the React
code makes any of that true — the database does. The UI's owner-check on the
delete button is a courtesy. That's the payoff of the whole session, and it
plants the session-2 question: *if the row is protected, is the file?* Leave
it hanging.

## Done when

The full two-user definition-of-done test from `instructions/spec.md` passes,
all clauses.
