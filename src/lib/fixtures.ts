import type { PhotoRow, Visibility } from './database.types'

/**
 * Slice 1 fixture data — the template's data.ts, adapted: portfolio items
 * with categories and likes became photos shaped EXACTLY like the real
 * rows (`PhotoRow` from database.types.ts), so that slice 3 can swap the
 * data source for the database without touching a single component.
 *
 * This file is deleted in slice 3. If you find yourself importing it after
 * that, something went wrong.
 */

/** The pretend signed-in user until slice 2 brings real auth. */
export const FIXTURE_USER = {
  id: '00000000-0000-4000-8000-00000000000a',
  email: 'you@example.com',
}

/** A second family member, so the gallery shows photos we do NOT own. */
const OTHER_USER_ID = '00000000-0000-4000-8000-00000000000b'

const PALETTE = [
  ['#8aa29e', '#3e5c76'],
  ['#d08c60', '#997b66'],
  ['#a3a380', '#6b705c'],
  ['#b0728c', '#7d4f6d'],
  ['#7a9cc6', '#334e68'],
  ['#c9ada7', '#9a8c98'],
  ['#84a59d', '#52796f'],
  ['#e07a5f', '#8f5d5d'],
]

/**
 * The image dimensions of the template's twelve demo items, in order — so
 * the fixture grid interlocks the same way the template's does.
 */
const IMAGE_SIZES: Array<[number, number]> = [
  [220, 146],
  [220, 293],
  [220, 158],
  [220, 142],
  [220, 311],
  [220, 147],
  [220, 275],
  [220, 329],
  [220, 146],
  [220, 329],
  [220, 157],
  [220, 330],
]

/**
 * An embedded placeholder image — no network, no assets folder. The label
 * makes it obvious on the projector that these are fixtures.
 */
export function makePlaceholderImage(seed: number, label: string): string {
  const [from, to] = PALETTE[seed % PALETTE.length]
  const [w, h] = IMAGE_SIZES[seed % IMAGE_SIZES.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <text x="${w / 2}" y="${h / 2 + 6}" font-family="sans-serif" font-size="18" fill="rgba(255,255,255,0.85)" text-anchor="middle">${label}</text>
</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

function fixturePhoto(
  n: number,
  ownerId: string,
  visibility: Visibility,
  daysAgo: number
): PhotoRow {
  const id = `00000000-0000-4000-9000-${String(n).padStart(12, '0')}`
  return {
    id,
    owner_id: ownerId,
    storage_path: `${ownerId}/${id}.jpg`,
    visibility,
    caption: null,
    created_at: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  }
}

/**
 * Newest first, matching the order the real gallery query will use.
 * Family members' photos are only ever `shared` on purpose: you never see
 * someone else's private photo, so a fixture like that would lie.
 */
export const FIXTURE_PHOTOS: PhotoRow[] = [
  fixturePhoto(1, FIXTURE_USER.id, 'private', 0),
  fixturePhoto(2, OTHER_USER_ID, 'shared', 1),
  fixturePhoto(3, FIXTURE_USER.id, 'shared', 2),
  fixturePhoto(4, OTHER_USER_ID, 'shared', 3),
  fixturePhoto(5, FIXTURE_USER.id, 'private', 4),
  fixturePhoto(6, OTHER_USER_ID, 'shared', 5),
  fixturePhoto(7, FIXTURE_USER.id, 'shared', 6),
  fixturePhoto(8, OTHER_USER_ID, 'shared', 7),
  fixturePhoto(9, FIXTURE_USER.id, 'shared', 8),
  fixturePhoto(10, OTHER_USER_ID, 'shared', 9),
  fixturePhoto(11, FIXTURE_USER.id, 'private', 10),
  fixturePhoto(12, OTHER_USER_ID, 'shared', 11),
]

/**
 * Image URL per photo id — the stand-in for slice 3's signed URLs.
 * `/fixtures/fixture-N.jpg` are local photos (gitignored); the fallbacks
 * below keep fresh clones working with embedded placeholders.
 */
export const FIXTURE_IMAGE_URLS: Record<string, string> = Object.fromEntries(
  FIXTURE_PHOTOS.map((photo, i) => [photo.id, `/fixtures/fixture-${i + 1}.jpg`])
)

/** Embedded fallbacks, keyed by photo id, for when the local files are absent. */
export const FIXTURE_FALLBACK_URLS: Record<string, string> = Object.fromEntries(
  FIXTURE_PHOTOS.map((photo, i) => [
    photo.id,
    makePlaceholderImage(
      i,
      photo.owner_id === FIXTURE_USER.id ? 'your photo' : "someone else's"
    ),
  ])
)
