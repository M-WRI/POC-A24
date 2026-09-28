import { useMemo, useState } from 'react'
import {
  applyFilters,
  emptyFilters,
  films,
  filtersActive,
  yearBounds,
  type EnrichedFilm,
  type SortMode,
  type Status,
  type ViewMode,
} from '../browse'
import { FilmList } from './FilmList'
import { FilterDrawer } from './FilterDrawer'

const STATUS_TABS: { id: Status; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'released', label: 'Released' },
]

function Poster({ film }: { film: EnrichedFilm }) {
  const release = film.releaseLabel || film.year
  const image = film.poster || film.listImage
  return (
    <article className="poster">
      <a href={`/films/${film.slug}`} title={film.title} onClick={(event) => event.preventDefault()}>
        <div className="poster-frame">
          {image && <img src={image} alt="" loading="lazy" />}
          <div className="poster-overlay">
            {release && (
              <p>
                <span>Release date</span>
                {release}
              </p>
            )}
            {film.directors.length > 0 && (
              <p>
                <span>Directed by</span>
                {film.directors.join(', ')}
              </p>
            )}
          </div>
        </div>
        <p className="poster-kicker">{film.comingSoon ? 'Coming Soon' : film.year}</p>
        <h3>{film.title}</h3>
      </a>
    </article>
  )
}

export function FilmsBrowse() {
  const [filters, setFilters] = useState(emptyFilters)
  const [sort, setSort] = useState<SortMode>('newest')
  const [view, setView] = useState<ViewMode>('grid')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const results = useMemo(() => applyFilters(films, filters, sort), [filters, sort])
  const active = filtersActive(filters)

  function setStatus(status: Status) {
    setFilters((current) => ({ ...current, status }))
  }

  function removeGenre(genre: string) {
    setFilters((current) => ({ ...current, genres: current.genres.filter((item) => item !== genre) }))
  }

  function removePerson(key: 'directors' | 'cast', name: string) {
    setFilters((current) => ({ ...current, [key]: current[key].filter((item) => item !== name) }))
  }

  const yearChip =
    filters.yearMin !== yearBounds.min || filters.yearMax !== yearBounds.max
      ? `${filters.yearMin} – ${filters.yearMax}`
      : ''

  return (
    <section className="browse">
      <h2 className="browse-title">
        Films <sup>{films.length}</sup>
      </h2>
      <div className="status-tabs" role="tablist" aria-label="Film status">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filters.status === tab.id}
            className={filters.status === tab.id ? 'is-on' : undefined}
            onClick={() => setStatus(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="browse-toolbar">
        <div className="toolbar-left">
          <button className="filter-launch" type="button" onClick={() => setDrawerOpen(true)}>
            Filter +
          </button>
          {filters.genres.map((genre) => (
            <button key={genre} type="button" className="chip" onClick={() => removeGenre(genre)}>
              {genre} <span>×</span>
            </button>
          ))}
          {yearChip && (
            <button
              type="button"
              className="chip"
              onClick={() => setFilters((current) => ({ ...current, yearMin: yearBounds.min, yearMax: yearBounds.max }))}
            >
              {yearChip} <span>×</span>
            </button>
          )}
          {filters.directors.map((name) => (
            <button key={name} type="button" className="chip" onClick={() => removePerson('directors', name)}>
              {name} <span>×</span>
            </button>
          ))}
          {filters.cast.map((name) => (
            <button key={name} type="button" className="chip" onClick={() => removePerson('cast', name)}>
              {name} <span>×</span>
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <label className="sort-select">
            <span>Sort:</span>
            <select value={sort} aria-label="Sort" onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="newest">Newest</option>
              <option value="alpha">A–Z</option>
            </select>
          </label>
          <div className="view-toggle">
            <button type="button" className={view === 'grid' ? 'is-on' : undefined} onClick={() => setView('grid')}>
              Grid
            </button>
            <button type="button" className={view === 'list' ? 'is-on' : undefined} onClick={() => setView('list')}>
              List
            </button>
          </div>
          <button
            type="button"
            className="clear-all"
            disabled={!active}
            onClick={() => setFilters(emptyFilters())}
          >
            Clear all
          </button>
        </div>
      </div>
      {results.length === 0 ? (
        <p className="browse-empty">No films match these filters.</p>
      ) : (
        view === 'list' ? (
          <FilmList films={results} />
        ) : (
          <div className="browse-grid">
            {results.map((film) => (
              <Poster key={film.slug} film={film} />
            ))}
          </div>
        )
      )}
      <FilterDrawer
        open={drawerOpen}
        films={films}
        filters={filters}
        resultCount={results.length}
        onChange={setFilters}
        onClose={() => setDrawerOpen(false)}
        onReset={() => setFilters(emptyFilters())}
      />
    </section>
  )
}
