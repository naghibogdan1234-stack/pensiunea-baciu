import { CONTACT, STAY, SOCIAL } from '../data/content.js'
import { useData } from '../data/index.js'
import { openLegal } from '../lib.jsx'
import { Link } from '../router.jsx'
import { useT } from '../i18n.jsx'
import { LangSwitch } from './Nav.jsx'

const L = {
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
  const l = useT(L)
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="foot__top wrap">
        <p className="foot__lead">{l.lead}</p>
        <a className="foot__phone" href={CONTACT.phoneHref}>
          {CONTACT.phone}
        </a>
        <a className="foot__mail link" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
        <div className="foot__social">
          {SOCIAL.map(([n, u]) => (
            <a key={n} className="link" href={u} target="_blank" rel="noopener noreferrer">
              {n} ↗
            </a>
          ))}
        </div>
      </div>

      <div className="foot__cols wrap">
        <div>
          <p className="foot__h">Pensiunea Baciu</p>
          <p>{CONTACT.street}</p>
          <p>{CONTACT.city}</p>
          <p>{l.alt}</p>
          <div className="foot__lang">
            <p className="foot__h">{l.lang}</p>
            <LangSwitch />
          </div>
        </div>
        <div>
          <p className="foot__h">{l.hours}</p>
          {HOURS.map(([d, h]) => (
            <p key={d}>
              {d}: {h}
            </p>
          ))}
          <p>{l.stay(STAY)}</p>
        </div>
        <nav aria-label={l.site}>
          <p className="foot__h">{l.site}</p>
          {LINKS.map(([id, label]) => (
            <p key={id}>
              <Link className="link" to={id}>
                {label}
              </Link>
            </p>
          ))}
        </nav>
        <div>
          <p className="foot__h">{l.legal}</p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
              {l.privacy}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
              {l.cookies}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => window.dispatchEvent(new Event('baciu:cookies'))}>
              {l.settings}
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('termeni')}>
              {l.terms}
            </button>
          </p>
          <p>
            <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
              {l.anpc}
            </a>
          </p>
        </div>
      </div>

      <div className="foot__legal wrap">
        <p>
          © {year} {CONTACT.company} · CUI {CONTACT.cui} · {CONTACT.reg}
        </p>
        <p>{l.photos}</p>
      </div>
    </footer>
  )
}
