import { Logo, SearchIcon } from './Logo'

type HeaderProps = {
  onSearch: () => void
}

export function Header({ onSearch }: HeaderProps) {
  return (
    <header className="site-header">
      <span />

      <a className="logo" href="https://a24films.com/" title="A24">
        <Logo />
      </a>

      <button className="search-button" type="button" aria-label="Search" onClick={onSearch}>
        <SearchIcon />
      </button>
    </header>
  )
}
