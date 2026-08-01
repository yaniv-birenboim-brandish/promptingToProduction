---
name: supabase-data-access
description: Read or write FamAlbum data through Supabase — querying the photos table, uploading or deleting Storage objects, generating signed image URLs, or reasoning about why a query returns an empty array. Use whenever code touches the supabase client, RLS policies, or the photos bucket.
---

# Supabase data access in FamAlbum

This is the reference skill. Study it in session 1 — the shape here is what
you'll copy when you write your own.

## The one client

```ts
import { supabase, PHOTOS_BUCKET } from '@/lib/supabase'
```

There is exactly one client, it is typed with `Database`, and it lives in
`src/lib/supabase.ts`. Never call `createClient` again anywhere; two instances
race each other over the auth session in localStorage and you get
intermittent, unreproducible logouts.

Never `fetch()` the PostgREST endpoint by hand. You lose the types, the auth
header, and the retry behaviour.

## Metadata here, bytes there

A photo is two objects in two services:

| | Where | What |
|---|---|---|
| Metadata | `public.photos` row | `owner_id`, `storage_path`, `visibility`, `caption`, `created_at` |
| Bytes | `photos` Storage bucket | the image, at `<owner_id>/<uuid>.<ext>` |

Every write touches both, in a fixed order, with a rollback:

```ts
// 1. bytes first — the cheaper failure to recover from
const path = `${user.id}/${crypto.randomUUID()}.${ext}`
const { error: upErr } = await supabase.storage
  .from(PHOTOS_BUCKET)
  .upload(path, file, { contentType: file.type, upsert: false })
if (upErr) throw upErr

// 2. metadata second
const { error: rowErr } = await supabase
  .from('photos')
  .insert({ owner_id: user.id, storage_path: path, visibility })

// 3. if the row failed, don't leave the object orphaned
if (rowErr) {
  await supabase.storage.from(PHOTOS_BUCKET).remove([path])
  throw rowErr
}
```

Deletes run the same two steps in reverse — object, then row — and both must
be attempted.

## The path convention is load-bearing

`<owner_id>/<uuid>.<ext>`. Not decoration:

- the Storage policies check `(storage.foldername(name))[1] = auth.uid()`
- the `photos` table has a check constraint requiring the same prefix

Derive the extension from `file.type`, never from `file.name`. A user-supplied
filename in a storage path is a path-traversal and content-type problem you
don't need to have.

## Reads: let RLS do the filtering

```ts
const { data, error } = await supabase
  .from('photos')
  .select('*')
  .order('created_at', { ascending: false })
```

That query has no `visibility` clause and it is correct. The policy already
returns "shared, or mine." Adding `.eq('visibility', 'shared')` in the client
would *narrow* the result — and adding `.filter()` in React after the fetch
protects nothing, because the rows already crossed the network.

Rule: **filter for security in the database, filter for display in the client,
and never confuse which one you're doing.**

## An empty array is what "denied" looks like

Postgres RLS does not return 403. A read you aren't allowed to do returns zero
rows with `error === null`. When a query comes back empty, check in this order:

1. Are you actually authenticated? `await supabase.auth.getSession()`
2. Does a row exist at all? Check the Table Editor as the project owner.
3. Does the policy cover this role and this operation?

Writes are different — a denied insert *does* error, with `new row violates
row-level security policy`. That message almost always means `owner_id` didn't
match `auth.uid()`, or the storage path didn't start with the user's id.

## Private bucket: sign your URLs

The `photos` bucket is private, so `getPublicUrl` returns a URL that 400s. Use
signed URLs, and batch them — one call per photo inside a `map` is an N+1:

```ts
const { data } = await supabase.storage
  .from(PHOTOS_BUCKET)
  .createSignedUrls(paths, 60 * 60)   // one hour; long enough to browse
```

Signing is itself permission-checked, so a path you can't read won't sign.
Handle per-item failures — `createSignedUrls` returns an `error` field on each
entry rather than throwing.

## Errors

`supabase-js` returns errors, it doesn't throw them. `const { data, error }`
every time, and check `error` before touching `data`. An unchecked destructure
is how you end up rendering `null.map`.

Surface failures to the user. `catch {}` is banned in this repo.

## Never

- `service_role` anywhere in client code. It bypasses RLS completely.
- Disabling RLS to "unblock" something.
- A second `createClient`.
- Trusting a row shape with `as PhotoRow` instead of parsing it.
