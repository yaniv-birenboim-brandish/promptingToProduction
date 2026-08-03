import { useCallback, useLayoutEffect, useRef, useState } from 'react'

export const MASONRY_ITEM_WIDTH = 220
export const MASONRY_GUTTER = 10

interface ItemPosition {
  left: number
  top: number
}

/**
 * The theme's masonry, re-implemented in ~50 lines instead of a jQuery
 * plugin: fixed 220px items placed left-to-right into the currently
 * shortest column, absolutely positioned, centred in the container.
 * A ResizeObserver relayouts when the container resizes or any card
 * changes height (e.g. its image finishes loading).
 *
 * This is a LAYOUT hook — it never touches data, so it lives with the
 * components, not in src/hooks/ (that folder is for data hooks).
 */
export function useMasonry(itemCount: number) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [positions, setPositions] = useState<ItemPosition[]>([])
  const [containerHeight, setContainerHeight] = useState(0)

  const relayout = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const cols = Math.max(
      1,
      Math.floor((width + MASONRY_GUTTER) / (MASONRY_ITEM_WIDTH + MASONRY_GUTTER))
    )
    const contentWidth = cols * MASONRY_ITEM_WIDTH + (cols - 1) * MASONRY_GUTTER
    const offset = Math.max(0, Math.floor((width - contentWidth) / 2))

    const columnHeights = new Array<number>(cols).fill(0)
    const next: ItemPosition[] = []

    for (const child of Array.from(container.children) as HTMLElement[]) {
      const col = columnHeights.indexOf(Math.min(...columnHeights))
      next.push({
        left: offset + col * (MASONRY_ITEM_WIDTH + MASONRY_GUTTER),
        top: columnHeights[col],
      })
      columnHeights[col] += child.offsetHeight + MASONRY_GUTTER
    }

    setPositions(next)
    setContainerHeight(Math.max(0, ...columnHeights))
  }, [])

  useLayoutEffect(() => {
    relayout()
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(relayout)
    observer.observe(container)
    for (const child of Array.from(container.children)) observer.observe(child)

    return () => observer.disconnect()
  }, [relayout, itemCount])

  return { containerRef, positions, containerHeight, relayout }
}
