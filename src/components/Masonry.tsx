import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type MasonryProps<T> = {
  items: T[]
  getKey: (item: T) => string
  renderItem: (item: T, index: number) => ReactNode
}

function columnCount(width: number) {
  return width < 640 ? 1 : 3
}

export function Masonry<T>({ items, getKey, renderItem }: MasonryProps<T>) {
  const [columns, setColumns] = useState(() =>
    typeof window === 'undefined' ? 3 : columnCount(window.innerWidth),
  )

  useEffect(() => {
    const onResize = () => setColumns(columnCount(window.innerWidth))
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const buckets: { item: T; index: number }[][] = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    buckets[index % columns].push({ item, index })
  })

  return (
    <div className="masonry">
      {buckets.map((bucket, index) => (
        <div className="masonry-col" key={index}>
          {bucket.map(({ item, index: itemIndex }) => (
            <div key={getKey(item)}>{renderItem(item, itemIndex)}</div>
          ))}
        </div>
      ))}
    </div>
  )
}
