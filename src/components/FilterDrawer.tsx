import { useMemo, useState } from 'react'
import {
  facetCounts,
  genreOptions,
  yearBounds,
  type EnrichedFilm,
  type Filters,
} from '../browse'

type FilterDrawerProps = {
  open: boolean
  films: EnrichedFilm[]
  filters: Filters
  resultCount: number
  onChange: (filters: Filters) => void
  onClose: () => void
  onReset: () => void
}

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

export function FilterDrawer({
  open,
  films,
  filters,
  resultCount,
  onChange,
  onClose,
  onReset,
}: FilterDrawerProps) {
  const [directorQuery, setDirectorQuery] = useState('')
  const [castQuery, setCastQuery] = useState('')
  const genres = useMemo(() => facetCounts(films, filters, 'genres'), [films, filters])
  const directors = useMemo(() => facetCounts(films, filters, 'directors'), [films, filters])
  const cast = useMemo(() => facetCounts(films, filters, 'cast'), [films, filters])
  const genreCount = new Map(genres)
  const directorMatches = directors.filter(([name]) => name.toLowerCase().includes(directorQuery.trim().toLowerCase()))
  const castMatches = cast.filter(([name]) => name.toLowerCase().includes(castQuery.trim().toLowerCase()))
  const span = yearBounds.max - yearBounds.min || 1
  const fillLeft = ((filters.yearMin - yearBounds.min) / span) * 100
  const fillRight = ((yearBounds.max - filters.yearMax) / span) * 100

  if (!open) return null

  return (
    <div className="drawer-root">
      <button className="drawer-scrim" type="button" aria-label="Close filters" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Filter">
        <header className="drawer-head">
          <h2>Filter</h2>
          <button type="button" aria-label="Close filters" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="drawer-body">
          <section>
            <h3>Status</h3>
            {(['all', 'upcoming', 'released'] as const).map((status) => (
              <label key={status} className="choice">
                <input
                  type="radio"
                  name="status"
                  checked={filters.status === status}
                  onChange={() => onChange({ ...filters, status })}
                />
                <span>{status === 'all' ? 'All' : status === 'upcoming' ? 'Upcoming' : 'Released'}</span>
              </label>
            ))}
          </section>
          <section>
            <h3>Genre</h3>
            {genreOptions.map((genre) => (
              <label key={genre} className="choice">
                <input
                  type="checkbox"
                  checked={filters.genres.includes(genre)}
                  onChange={() => onChange({ ...filters, genres: toggle(filters.genres, genre) })}
                />
                <span>{genre}</span>
                <em>{genreCount.get(genre) ?? 0}</em>
              </label>
            ))}
          </section>
          <section>
            <h3>Year</h3>
            <div className="year-values">
              <span>{filters.yearMin}</span>
              <span>{filters.yearMax}</span>
            </div>
            <div className="range">
              <div className="range-fill" style={{ left: `${fillLeft}%`, right: `${fillRight}%` }} />
              <input
                type="range"
                min={yearBounds.min}
                max={yearBounds.max}
                value={filters.yearMin}
                aria-label="From year"
                onChange={(event) => {
                  const yearMin = Math.min(Number(event.target.value), filters.yearMax)
                  onChange({ ...filters, yearMin })
                }}
              />
              <input
                type="range"
                min={yearBounds.min}
                max={yearBounds.max}
                value={filters.yearMax}
                aria-label="To year"
                onChange={(event) => {
                  const yearMax = Math.max(Number(event.target.value), filters.yearMin)
                  onChange({ ...filters, yearMax })
                }}
              />
            </div>
          </section>
          <section>
            <h3>Director</h3>
            <input
              className="facet-search"
              value={directorQuery}
              placeholder="Search directors..."
              onChange={(event) => setDirectorQuery(event.target.value)}
            />
            <div className="facet-list">
              {directorMatches.slice(0, 12).map(([name, count]) => (
                <label key={name} className="choice">
                  <input
                    type="checkbox"
                    checked={filters.directors.includes(name)}
                    onChange={() => onChange({ ...filters, directors: toggle(filters.directors, name) })}
                  />
                  <span>{name}</span>
                  <em>{count}</em>
                </label>
              ))}
            </div>
          </section>
          <section>
            <h3>Cast</h3>
            <input
              className="facet-search"
              value={castQuery}
              placeholder="Search cast..."
              onChange={(event) => setCastQuery(event.target.value)}
            />
            <div className="facet-list">
              {castMatches.slice(0, 12).map(([name, count]) => (
                <label key={name} className="choice">
                  <input
                    type="checkbox"
                    checked={filters.cast.includes(name)}
                    onChange={() => onChange({ ...filters, cast: toggle(filters.cast, name) })}
                  />
                  <span>{name}</span>
                  <em>{count}</em>
                </label>
              ))}
            </div>
          </section>
        </div>
        <footer className="drawer-foot">
          <button type="button" onClick={onReset}>
            Reset
          </button>
          <button type="button" className="show-films" onClick={onClose}>
            Show {resultCount} films →
          </button>
        </footer>
      </aside>
    </div>
  )
}
