import catalog from './data/films.json'
import { EXTRA_CAST, EXTRA_DIRECTORS, GENRES, genresFor } from './data/metadata'
import type { Catalog, Film } from './types'

export type Status = 'all' | 'upcoming' | 'released'
export type SortMode = 'newest' | 'alpha'
export type ViewMode = 'grid' | 'list'

export type EnrichedFilm = Film & {
  genres: string[]
  directors: string[]
  cast: string[]
  yearNum: number
}

export type Filters = {
  status: Status
  genres: string[]
  yearMin: number
  yearMax: number
  directors: string[]
  cast: string[]
}

const data = catalog as Catalog

function splitNames(value: string) {
  return value
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean)
}

function unique(values: string[]) {
  return [...new Set(values)]
}

function enrich(film: Film, order: number): EnrichedFilm {
  const directors: string[] = []
  const cast: string[] = []
  for (const credit of film.credits) {
    const label = credit.label.toLowerCase()
    if (label.includes('direct')) directors.push(...splitNames(credit.value))
    if (label.includes('starring')) cast.push(...splitNames(credit.value))
  }
  return {
    ...film,
    genres: genresFor(film.slug),
    directors: unique([...(EXTRA_DIRECTORS[film.slug] ?? []), ...directors]),
    cast: unique([...(EXTRA_CAST[film.slug] ?? []), ...cast]),
    yearNum: Number.parseInt(film.year, 10) || order,
  }
}

export const films: EnrichedFilm[] = [...data.upcoming, ...data.all].map(enrich)

export const yearBounds = {
  min: Math.min(...films.map((film) => film.yearNum)),
  max: Math.max(...films.map((film) => film.yearNum)),
}

export const genreOptions = [...GENRES]

export function emptyFilters(): Filters {
  return {
    status: 'all',
    genres: [],
    yearMin: yearBounds.min,
    yearMax: yearBounds.max,
    directors: [],
    cast: [],
  }
}

export function filtersActive(filters: Filters) {
  return (
    filters.status !== 'all' ||
    filters.genres.length > 0 ||
    filters.directors.length > 0 ||
    filters.cast.length > 0 ||
    filters.yearMin !== yearBounds.min ||
    filters.yearMax !== yearBounds.max
  )
}

function matchesStatus(film: EnrichedFilm, status: Status) {
  if (status === 'upcoming') return film.comingSoon
  if (status === 'released') return !film.comingSoon
  return true
}

function matches(
  film: EnrichedFilm,
  filters: Filters,
  ignore?: 'genres' | 'directors' | 'cast',
) {
  if (!matchesStatus(film, filters.status)) return false
  if (film.yearNum < filters.yearMin || film.yearNum > filters.yearMax) return false
  if (ignore !== 'genres' && filters.genres.length && !filters.genres.some((genre) => film.genres.includes(genre))) {
    return false
  }
  if (ignore !== 'directors' && filters.directors.length && !filters.directors.some((name) => film.directors.includes(name))) {
    return false
  }
  if (ignore !== 'cast' && filters.cast.length && !filters.cast.some((name) => film.cast.includes(name))) {
    return false
  }
  return true
}

export function applyFilters(source: EnrichedFilm[], filters: Filters, sort: SortMode) {
  const next = source.filter((film) => matches(film, filters))
  next.sort((a, b) => {
    if (sort === 'alpha') return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' })
    if (b.yearNum !== a.yearNum) return b.yearNum - a.yearNum
    if (a.comingSoon !== b.comingSoon) return a.comingSoon ? 1 : -1
    return 0
  })
  return next
}

export function facetCounts(
  source: EnrichedFilm[],
  filters: Filters,
  key: 'genres' | 'directors' | 'cast',
) {
  const counts = new Map<string, number>()
  for (const film of source) {
    if (!matches(film, filters, key)) continue
    for (const value of film[key]) counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}
