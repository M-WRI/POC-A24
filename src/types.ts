export type Credit = {
  label: string
  value: string
}

export type Film = {
  slug: string
  title: string
  year: string
  comingSoon: boolean
  releaseLabel: string
  credits: Credit[]
  poster: string
  listImage: string
}

export type Catalog = {
  upcoming: Film[]
  all: Film[]
}

export type SortMode = 'newest' | 'alpha'
