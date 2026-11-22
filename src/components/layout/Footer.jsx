// Subsolul: telefon și email mari, adresa, programul, paginile, legăturile legale și datele firmei.
import { CONTACT, STAY, SOCIAL } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { openLegal, openCookieSettings } from '../../events.js'
import { Link } from '../../router.jsx'
import { useTexts } from '../../i18n.jsx'
import LangSwitch from './LangSwitch.jsx'

const TEXT = {
  ro: {
    lead: 'Rezervări și întrebări, zilnic între 9 și 21',
    alt: 'Altitudine 850 m',
    hours: 'Program',
    stay: (s) => `Check-in de la ${s.checkIn}, check-out până la ${s.checkOut}`,
    site: 'Pe site',
    legal: 'Legal',
    privacy: 'Politica de confidențialitate',
    cookies: 'Politica de cookie-uri',
    settings: 'Setări cookie-uri',
    terms: 'Termeni de rezervare',
    anpc: 'ANPC – soluționarea alternativă a litigiilor',
    photos: 'Fotografiile aparțin Pensiunii Baciu. Vremea: Open-Meteo.com.',
    lang: 'Limba',
  },
  en: {
    lead: 'Bookings and questions, daily from 9:00 to 21:00',
    alt: 'Altitude 850 m',
    hours: 'Opening hours',
    stay: (s) => `Check-in from ${s.checkIn}, check-out by ${s.checkOut}`,
    site: 'On this site',
    legal: 'Legal',
    privacy: 'Privacy policy',
    cookies: 'Cookie policy',
    settings: 'Cookie settings',
    terms: 'Booking terms',
    anpc: 'ANPC – alternative dispute resolution (in Romanian)',
    photos: 'Photographs belong to Pensiunea Baciu. Weather: Open-Meteo.com.',
    lang: 'Language',
  },
}

export default function Footer() {
  const { HOURS, LINKS } = useData()
  const txt = useTexts(TEXT)
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="foot__top wrap">
        <p className="foot__lead">{txt.lead}</p>
        <a className="foot__phone" href={CONTACT.phoneHref}>
          {CONTACT.phone}
        </a>
        <a className="foot__mail link" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
        <div className="foot__social">
          {SOCIAL.map((account) => (
            <a key={account.name} className="link" href={account.url} target="_blank" rel="noopener noreferrer">
              {account.name} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="foot__cols wrap">
        <div>
          <p className="foot__h">Pensiunea Baciu</p>
          <p>{CONTACT.street}</p>
          <p>{CONTACT.city}</p>
          <p>{txt.alt}</p>
          <div className="foot__lang">
            <p className="foot__h">{txt.lang}</p>
            <LangSwitch />
          </div>
        </div>
        <div>
          <p className="foot__h">{txt.hours}</p>
          {HOURS.map((row) => (
            <p key={row.label}>
              {row.label}: {row.hours}
            </p>
          ))}
          <p>{txt.stay(STAY)}</p>
        </div>
        <nav aria-label={txt.site}>
          <p className="foot__h">{txt.site}</p>
          {LINKS.map((link) => (
            <p key={link.page}>
              <Link className="link" to={link.page}>
                {link.label}
              </Link>
            </p>
          ))}
        </nav>
        <div>
          <p className="foot__h">{txt.legal}</p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
              {txt.privacy}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
              {txt.cookies}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={openCookieSettings}>
              {txt.settings}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('termeni')}>
              {txt.terms}
            </button>
          </p>
          <p>
            <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
              {txt.anpc}
            </a>
          </p>
        </div>
      </div>

      <div className="foot__legal wrap">
        <p>
          © {year} {CONTACT.company} · CUI {CONTACT.cui} · {CONTACT.reg}
        </p>
        <p>{txt.photos}</p>
      </div>
    </footer>
  )
}
