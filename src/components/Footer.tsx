import { useState } from 'react'

const LEGAL = [
  { label: 'Jobs', href: 'https://a24films.com/jobs' },
  { label: 'Shop', href: 'https://shop.a24films.com/', external: true },
  { label: 'App', href: 'https://app.a24films.com/', external: true },
  { label: 'Membership', href: 'https://aaa24.a24films.com/', external: true },
]

const POLICIES = [
  { label: 'Terms of Use', href: 'https://a24films.com/terms-of-use' },
  { label: 'Privacy Policy', href: 'https://a24films.com/privacy-policy' },
  { label: 'Do Not Sell or Share My Personal Information', href: 'https://a24films.com/privacy-policy' },
]

const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/A24' },
  { label: 'Twitter', href: 'https://twitter.com/A24' },
  { label: 'Instagram', href: 'https://instagram.com/a24' },
  { label: 'YouTube', href: 'https://www.youtube.com/A24Films' },
]

export function Footer() {
  const [message, setMessage] = useState('')

  return (
    <footer>
      <div className="footer-grid">
        <nav className="footer-legal" aria-label="Footer">
          <ul>
            {LEGAL.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ul>
            {POLICIES.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h6>More A24</h6>
          <ul>
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h6>Want More A24?</h6>
          <p>
            Get our emails. Letters from our filmmakers, new trailers, podcasts, merch, and more. Not too often — just enough.
          </p>
          <form
            className="signup-form light"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.currentTarget)
              const email = String(data.get('email') ?? '')
              setMessage(email.includes('@') ? 'Success!' : 'Please provide a valid email address.')
            }}
          >
            <label>
              <span>email</span>
              <input name="email" type="email" autoComplete="email" />
            </label>
            <button type="submit">Sign Up</button>
          </form>
          {message && <p className="form-message">{message}</p>}
        </div>
      </div>
      <p className="aaa">
        This website is not endorsed or approved by, and is not in any way affiliated with, the American Automobile Association, Inc. (“AAA”).
      </p>
    </footer>
  )
}
