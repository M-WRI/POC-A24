import type { Film } from '../types'
import { FilmTile } from './FilmTile'
import { Masonry } from './Masonry'

type UpcomingProps = {
  films: Film[]
}

export function Upcoming({ films }: UpcomingProps) {
  return (
    <section className="upcoming">
      <h2 className="group-name">Upcoming</h2>
      <Masonry
        items={films}
        getKey={(film) => film.slug}
        renderItem={(film, index) => <FilmTile film={film} index={index} />}
      />
    </section>
  )
}
