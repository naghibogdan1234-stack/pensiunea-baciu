// Bara fixă de jos, doar pe telefon (o ascunde CSS-ul pe ecran lat): „Sună” și „Rezervă”.
import { openBooking } from '../../events.js'
import { CONTACT } from '../../data/content.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'

const TEXT = {
  ro: { call: 'Sună', book: 'Rezervă', quick: 'Acțiuni rapide' },
  en: { call: 'Call', book: 'Book', quick: 'Quick actions' },
}

export default function MobileBar() {
  const txt = useTexts(TEXT)
  return (
    <div className="mbar" role="navigation" aria-label={txt.quick}>
      <a className="btn btn--line" href={CONTACT.phoneHref}>
        <Icon name="phone" size={18} /> {txt.call}
      </a>
      <button type="button" className="btn" onClick={() => openBooking()}>
        {txt.book}
      </button>
    </div>
  )
}
