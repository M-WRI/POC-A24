import { useEffect, useMemo, useState } from 'react'
import type { Film } from '../types'

type SearchOverlayProps = {
  open: boolean
  films: Film[]
  onClose: () => void
}

export function SearchOverlay({ open, films, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [hover, setHover] = useState<Film | null>(null)

  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      document.getElementById('film-search')?.focus()
    })
    return () => cancelAnimationFrame(frame)
  }, [open])

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return []
    return films.filter((film) => film.title.toLowerCase().includes(needle))
  }, [films, query])

  if (!open) return null

  return (
    <aside className="search-overlay" role="dialog" aria-label="Search">
      <button className="overlay-close" type="button" aria-label="Dismiss search" onClick={onClose}>
        Close
      </button>
      <form
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <label htmlFor="film-search">Search</label>
        <input
          id="film-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
      </form>
      {query.trim() && (
        <div className="search-results">
          {results.length === 0 && <p className="search-empty">No films match.</p>}
          {results.map((film) => (
            <a
              key={film.slug}
              href={`/films/${film.slug}`}
              onClick={(event) => event.preventDefault()}
              onMouseEnter={() => setHover(film)}
              onMouseLeave={() => setHover(null)}
            >
              {film.title}
              {film.year && <sup>{film.year}</sup>}
            </a>
          ))}
          {hover?.listImage && (
            <img className="search-still" src={hover.listImage} alt="" />
          )}
        </div>
      )}
    </aside>
  )
}
