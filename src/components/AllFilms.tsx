import { useMemo } from 'react'
import type { Film, SortMode } from '../types'
import { FilmList } from './FilmList'
import { FilmTile } from './FilmTile'
import { Masonry } from './Masonry'

const POSTER_LIMIT = 9

type AllFilmsProps = {
  films: Film[]
  sort: SortMode
  onSort: (sort: SortMode) => void
}

export function AllFilms({ films, sort, onSort }: AllFilmsProps) {
  const ordered = useMemo(() => {
    if (sort === 'newest') return films
    return [...films].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
  }, [films, sort])

  const posters = ordered.slice(0, POSTER_LIMIT)
  const rest = ordered.slice(POSTER_LIMIT)

  return (
    <section className="all-films">
      <div className="section-header">
        <h2 className="group-name">All Films</h2>
        <div className="sort">
          <h6>Sort by:</h6>
          <div>
            <button
              type="button"
              className={sort === 'newest' ? 'is-on' : undefined}
              aria-pressed={sort === 'newest'}
              onClick={() => onSort('newest')}
            >
              Newest
            </button>
            <button
              type="button"
              className={sort === 'alpha' ? 'is-on' : undefined}
              aria-pressed={sort === 'alpha'}
              onClick={() => onSort('alpha')}
            >
              A-Z
            </button>
          </div>
        </div>
      </div>
      <Masonry
        items={posters}
        getKey={(film) => film.slug}
        renderItem={(film, index) => <FilmTile film={film} index={index} />}
      />
      <FilmList films={rest} />
    </section>
  )
}
