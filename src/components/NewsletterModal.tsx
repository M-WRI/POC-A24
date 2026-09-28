import { useState } from 'react'

type NewsletterModalProps = {
  open: boolean
  onClose: () => void
}

export function NewsletterModal({ open, onClose }: NewsletterModalProps) {
  const [message, setMessage] = useState('')

  if (!open) return null

  return (
    <aside className="newsletter-modal" role="dialog" aria-label="Want more A24?">
      <button className="overlay-close" type="button" aria-label="Dismiss newsletter signup" onClick={onClose}>
        Close
      </button>
      <p className="eyebrow">Want More A24?</p>
      <p className="newsletter-copy">
        Get our emails. Letters from our filmmakers, new trailers, podcasts, merch, and more. Not too often — just enough.
      </p>
      <form
        className="signup-form"
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
      <p className="disclaimer-inline">
        I understand that my information will be used in accordance with A24&apos;s{' '}
        <a href="https://a24films.com/privacy-policy">Privacy Policy</a>.
      </p>
    </aside>
  )
}
