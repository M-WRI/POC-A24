const ITEMS = [
  { label: 'Films', href: '/films', current: true },
  { label: 'Television', href: 'https://a24films.com/television' },
  { label: 'Docs', href: 'https://a24films.com/docs' },
  { label: 'Shop', href: 'https://shop.a24films.com', external: true },
  { label: 'Membership', href: 'https://aaa24.a24films.com/', external: true },
  { label: 'Notes', href: 'https://a24films.com/notes' },
  { label: 'App', href: 'https://app.a24films.com/', external: true },
]

type MenuProps = {
  open: boolean
  onSearch: () => void
}

export function Menu({ open, onSearch }: MenuProps) {
  return (
    <aside className={open ? 'menu is-open' : 'menu'} aria-hidden={!open}>
      <nav aria-label="Menu">
        <ul>
          {ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={item.current ? 'is-current' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                onClick={item.current ? (event) => event.preventDefault() : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={onSearch}>
              Search
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
