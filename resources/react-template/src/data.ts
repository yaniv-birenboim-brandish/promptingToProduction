/**
 * The template's demo content — a portfolio of items with a title, a set
 * of categories (which drive the filter bar), a like count, and an image.
 *
 * Images resolve from /fixtures/fixture-N.jpg (put your own photos there —
 * that folder ships empty). When a file is missing, the embedded SVG
 * placeholder below is used instead, so the template always runs.
 */

export interface PortfolioItem {
  id: string
  title: string
  categories: string[]
  likes: number
  image: string
  fallback: string
}

export const ALL_CATEGORIES = [
  'audio video',
  'black and white',
  'church',
  'prewedding',
  'wedding',
]

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

/** Mixed portrait/landscape sizes so the masonry columns interlock. */
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

function item(
  n: number,
  title: string,
  categories: string[],
  likes: number
): PortfolioItem {
  return {
    id: `item-${n}`,
    title,
    categories,
    likes,
    image: `/fixtures/fixture-${n}.jpg`,
    fallback: makePlaceholderImage(n - 1, title),
  }
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  item(1, 'Flower Petals', ['church', 'wedding'], 218),
  item(2, 'Gordon & Jenna', ['church', 'wedding'], 2879),
  item(3, 'Sunset by the Sea', ['audio video', 'prewedding'], 1249),
  item(4, 'A Quiet Kiss', ['black and white', 'wedding'], 1032),
  item(5, 'The Dress', ['audio video', 'wedding'], 759),
  item(6, 'Unexpected Guests', ['wedding'], 935),
  item(7, 'Indoor Prewedding', ['prewedding'], 303),
  item(8, 'Just Married', ['audio video', 'black and white'], 849),
  item(9, 'Happy Married', ['prewedding', 'wedding'], 743),
  item(10, 'The Red Umbrella', ['prewedding'], 318),
  item(11, 'Backseat Laughter', ['black and white', 'wedding'], 302),
  item(12, 'Cobblestone Walk', ['black and white', 'prewedding'], 18),
]
