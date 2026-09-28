import type { Film } from '../types'

type FilmTileProps = {
  film: Film
  index: number
}

function ratioClass(index: number) {
  const place = index % 6
  if (place === 0 || place === 5) return 'ratio-portrait'
  if (place === 2 || place === 3) return 'ratio-landscape'
  return 'ratio-standard'
}

export function FilmTile({ film, index }: FilmTileProps) {
  const image = film.poster || film.listImage
  const label = film.comingSoon ? 'Coming Soon' : film.year

  return (
    <article className="film-tile">
      <a href={`/films/${film.slug}`} title={film.title} onClick={(event) => event.preventDefault()}>
        <figure>
          <div className={`film-image ${ratioClass(index)}`}>
            {image && <img src={image} alt="" />}
            <div className="overlay">
              {film.credits.map((credit) => (
                <div key={credit.label}>
                  <h4>{credit.label}</h4>
                  <p>{credit.value}</p>
                </div>
              ))}
            </div>
          </div>
          <figcaption>
            {label && <h6 className={film.comingSoon ? undefined : 'date'}>{label}</h6>}
            <h3>{film.title}</h3>
          </figcaption>
        </figure>
      </a>
    </article>
  )
}
