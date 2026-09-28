import { useState } from 'react'
import type { Film } from '../types'

type FilmListProps = {
  films: Film[]
}

export function FilmList({ films }: FilmListProps) {
  const [hover, setHover] = useState<Film | null>(null)

  return (
    <div className="film-list" onMouseLeave={() => setHover(null)}>
      <div className="film-list-frame">
        {hover?.listImage && <img className="film-list-still" src={hover.listImage} alt="" />}
      </div>
      {films.map((film) => (
        <a
          key={film.slug}
          href={`/films/${film.slug}`}
          title={film.title}
          onClick={(event) => event.preventDefault()}
          onMouseEnter={() => setHover(film)}
        >
          <h2>
            {film.title}
            {film.year && <sup>{film.year}</sup>}
          </h2>
        </a>
      ))}
    </div>
  )
}
