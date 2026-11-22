import { CONTACT, HOURS } from '../data/content.js'
import { go, openLegal } from '../lib.jsx'
import { LINKS } from './Nav.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="foot__top wrap">
        <p className="foot__lead">Rezervări și întrebări, zilnic între 9 și 21</p>
        <a className="foot__phone" href={CONTACT.phoneHref}>
          {CONTACT.phone}
        </a>
        <a className="foot__mail link" href={`mailto:${CONTACT.email}`}>
          {CONTACT.email}
        </a>
      </div>

      <div className="foot__cols wrap">
        <div>
          <p className="foot__h">Pensiunea Baciu</p>
          <p>{CONTACT.street}</p>
          <p>{CONTACT.city}</p>
          <p>Altitudine 850 m</p>
        </div>
        <div>
          <p className="foot__h">Program</p>
          {HOURS.map(([d, h]) => (
            <p key={d}>
              {d}: {h}
            </p>
          ))}
        </div>
        <nav aria-label="Pe site">
          <p className="foot__h">Pe site</p>
          {LINKS.map(([id, l]) => (
            <p key={id}>
              <a className="link" href={`#${id}`} onClick={go(id)}>
                {l}
              </a>
            </p>
          ))}
        </nav>
        <div>
          <p className="foot__h">Legal</p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
              Politica de confidențialitate
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
              Politica de cookie-uri
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => window.dispatchEvent(new Event('baciu:cookies'))}>
              Setări cookie-uri
            </button>
          </p>
          <p>
            <button type="button" className="link" onClick={() => openLegal('termeni')}>
              Termeni de rezervare
            </button>
          </p>
          <p>
            <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
              ANPC – soluționarea alternativă a litigiilor
            </a>
          </p>
        </div>
      </div>

      <div className="foot__legal wrap">
        <p>
          © {year} {CONTACT.company} · CUI {CONTACT.cui} · {CONTACT.reg}
        </p>
        <p>Fotografiile aparțin Pensiunii Baciu.</p>
      </div>
    </footer>
  )
}
