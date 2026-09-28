import { useMemo, useState } from 'react'
import catalog from './data/films.json'
import { FilmsBrowse } from './components/FilmsBrowse'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { NewsletterModal } from './components/NewsletterModal'
import { SearchOverlay } from './components/SearchOverlay'
import type { Catalog, Film } from './types'

const data = catalog as Catalog

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [newsletterOpen, setNewsletterOpen] = useState(false)

  const searchable = useMemo<Film[]>(() => [...data.upcoming, ...data.all], [])

  return (
    <>
      <Header onSearch={() => setSearchOpen(true)} />
      <SearchOverlay open={searchOpen} films={searchable} onClose={() => setSearchOpen(false)} />
      <NewsletterModal open={newsletterOpen && !searchOpen} onClose={() => setNewsletterOpen(false)} />
      <main>
        <FilmsBrowse />
      </main>
      <Footer />
    </>
  )
}
