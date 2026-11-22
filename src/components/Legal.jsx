import { createContext, useContext, useEffect, useState } from 'react'
import { CONTACT } from '../data/content.js'
import { useLockScroll, openLegal } from '../lib.jsx'
import Icon from './Icon.jsx'

/* ================= Acordul pentru cookie-uri ================= */
const KEY = 'baciu-consent-v2'
const VERSION = 1
const read = () => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null')
    return v && v.v === VERSION ? v : null
  } catch {
    return null
  }
}
const write = (v) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(v))
  } catch {
    /* stocare indisponibilă: alegerea ține doar până se închide pagina */
  }
}

const Ctx = createContext(null)
export const useConsent = () => useContext(Ctx)

export function ConsentProvider({ children }) {
  const [state, setState] = useState(read)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const save = (maps) => {
    const v = { v: VERSION, necessary: true, maps: !!maps, date: new Date().toISOString() }
    write(v)
    setState(v)
  }
  useEffect(() => {
    const on = () => setSettingsOpen(true)
    window.addEventListener('baciu:cookies', on)
    return () => window.removeEventListener('baciu:cookies', on)
  }, [])
  return (
    <Ctx.Provider
      value={{ decided: !!state, maps: !!state?.maps, save, settingsOpen, setSettingsOpen }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function CookieBanner() {
  const { decided, save, setSettingsOpen } = useConsent()
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (decided) return
    const t = setTimeout(() => setShow(true), 1400)
    return () => clearTimeout(t)
  }, [decided])
  if (decided) return null
  return (
    <div className={`cookie ${show ? 'is-in' : ''}`} role="region" aria-label="Cookie-uri">
      <p className="cookie__t">Cookie-uri</p>
      <p className="cookie__p">
        Folosim doar ce e necesar ca site-ul să funcționeze. Harta Google se încarcă numai dacă ești de acord, pentru că
        Google poate seta cookie-uri proprii.{' '}
        <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
          Politica de cookie-uri
        </button>
      </p>
      <div className="cookie__btns">
        <button type="button" className="btn btn--line" onClick={() => save(false)}>
          Refuz
        </button>
        <button type="button" className="btn btn--line" onClick={() => setSettingsOpen(true)}>
          Setări
        </button>
        <button type="button" className="btn" onClick={() => save(true)}>
          Accept toate
        </button>
      </div>
    </div>
  )
}

export function CookieSettings() {
  const { maps, save, settingsOpen, setSettingsOpen } = useConsent()
  const [m, setM] = useState(maps)
  useEffect(() => {
    if (settingsOpen) setM(maps)
  }, [settingsOpen, maps])
  useLockScroll(settingsOpen)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setSettingsOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [setSettingsOpen])
  return (
    <div className={`modal ${settingsOpen ? 'is-open' : ''}`} aria-hidden={!settingsOpen} onClick={() => setSettingsOpen(false)}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="ck-h" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button type="button" className="x" onClick={() => setSettingsOpen(false)} aria-label="Închide">
          <Icon name="close" />
        </button>
        <h2 id="ck-h" className="h3">
          Setări cookie-uri
        </h2>
        <div className="ck">
          <div className="ck__row">
            <div>
              <p className="ck__name">Strict necesare</p>
              <p className="muted small">
                Țin minte alegerea ta despre cookie-uri. Fără ele site-ul nu poate respecta această alegere.
              </p>
            </div>
            <span className="ck__always">Mereu active</span>
          </div>
          <label className="ck__row">
            <div>
              <p className="ck__name">Hărți externe (Google Maps)</p>
              <p className="muted small">
                Încarcă harta interactivă. Google poate seta cookie-uri și primește adresa ta IP.
              </p>
            </div>
            <input type="checkbox" checked={m} onChange={(e) => setM(e.target.checked)} />
            <span className="toggle" aria-hidden="true" />
          </label>
        </div>
        <p className="muted small">Nu folosim cookie-uri de statistică sau de publicitate.</p>
        <div className="modal__btns">
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              save(false)
              setSettingsOpen(false)
            }}
          >
            Refuz tot
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              save(m)
              setSettingsOpen(false)
            }}
          >
            Salvează alegerea
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= Paginile legale ================= */
const UPDATED = 'noiembrie 2026'
const Operator = () => (
  <p>
    <strong>{CONTACT.company}</strong>, cu sediul în {CONTACT.address}, CUI {CONTACT.cui}, nr. Registrul Comerțului{' '}
    {CONTACT.reg}. Telefon {CONTACT.phone}, email{' '}
    <a className="link" href={`mailto:${CONTACT.email}`}>
      {CONTACT.email}
    </a>
    .
  </p>
)

const PAGES = {
  confidentialitate: {
    title: 'Politica de confidențialitate',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <h3>Cine răspunde de datele tale</h3>
        <Operator />
        <h3>Ce date prelucrăm</h3>
        <p>
          Când ne trimiți o cerere de rezervare din formularul site-ului, formularul pregătește un email în aplicația ta
          de email. Datele ajung la noi doar dacă trimiți tu emailul: numele, telefonul, adresa de email (dacă o
          completezi), perioada, numărul de persoane și mesajul tău. Site-ul nu are bază de date și nu păstrează aceste
          informații.
        </p>
        <p>Când ne suni sau ne scrii direct, prelucrăm datele pe care ni le dai în acea discuție.</p>
        <h3>De ce și pe ce temei</h3>
        <ul>
          <li>Ca să răspundem cererii tale și să facem rezervarea, adică pași înainte de încheierea unui contract (art. 6 alin. 1 lit. b din Regulamentul UE 2016/679, GDPR).</li>
          <li>Ca să ținem evidența financiar-contabilă cerută de lege, atunci când rezervarea se confirmă (art. 6 alin. 1 lit. c GDPR).</li>
          <li>Ca să afișăm harta Google, doar cu acordul tău (art. 6 alin. 1 lit. a GDPR).</li>
        </ul>
        <h3>Cât timp le păstrăm</h3>
        <p>
          Cererile care nu devin rezervări le ștergem în cel mult 6 luni. Documentele legate de o rezervare plătită le
          păstrăm cât cere legislația financiar-contabilă.
        </p>
        <h3>Cui le dăm</h3>
        <p>
          Nu vindem și nu închiriem date. Ele pot ajunge la furnizorul nostru de email și, dacă pornești harta, la Google
          Ireland Ltd., conform politicii Google.
        </p>
        <h3>Drepturile tale</h3>
        <p>
          Ai dreptul să ceri acces la datele tale, corectarea, ștergerea sau restricționarea lor, să te opui prelucrării,
          să le primești într-un format portabil și să îți retragi oricând acordul. Ne scrii la{' '}
          <a className="link" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . Poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal
          (ANSPDCP),{' '}
          <a className="link" href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">
            dataprotection.ro
          </a>
          .
        </p>
      </>
    ),
  },
  'cookie-uri': {
    title: 'Politica de cookie-uri',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <p>
          Cookie-urile sunt fișiere mici pe care un site le salvează în browserul tău. Site-ul nostru folosește cât mai
          puține: nu are statistici, publicitate sau rețele sociale încorporate. Fonturile și pozele sunt găzduite pe
          site-ul nostru, nu la terți.
        </p>
        <h3>Ce salvăm</h3>
        <div className="ltable" role="table">
          <div role="row" className="ltable__h">
            <span role="columnheader">Nume</span>
            <span role="columnheader">Cine</span>
            <span role="columnheader">De ce</span>
            <span role="columnheader">Cât timp</span>
          </div>
          <div role="row">
            <span role="cell">baciu-consent-v2</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Ține minte alegerea ta despre cookie-uri (stocare locală în browser)</span>
            <span role="cell">Până o ștergi sau îți schimbi alegerea</span>
          </div>
          <div role="row">
            <span role="cell">Cookie-uri Google (de exemplu NID, AEC)</span>
            <span role="cell">Google</span>
            <span role="cell">Funcționarea hărții Google Maps, numai după acordul tău</span>
            <span role="cell">Conform politicii Google, până la câteva luni</span>
          </div>
        </div>
        <h3>Cum îți schimbi alegerea</h3>
        <p>
          Oricând, din linkul „Setări cookie-uri” din subsolul paginii. Poți șterge cookie-urile și din setările
          browserului. Despre cookie-urile Google:{' '}
          <a className="link" href="https://policies.google.com/technologies/cookies?hl=ro" target="_blank" rel="noopener noreferrer">
            policies.google.com
          </a>
          .
        </p>
        <h3>Cine răspunde</h3>
        <Operator />
      </>
    ),
  },
  termeni: {
    title: 'Termeni de rezervare',
    body: (
      <>
        <p className="muted">Ultima actualizare: {UPDATED}</p>
        <h3>Prețuri</h3>
        <ul>
          <li>Cameră dublă cu pat matrimonial: 300 lei / noapte. Cameră dublă cu paturi separate: 300 lei / noapte. Cameră pentru 3 persoane: 380 lei / noapte.</li>
          <li>Micul dejun este inclus în prețul cazării.</li>
          <li>Pat suplimentar, la cerere: 60 lei / noapte, fără mic dejun.</li>
          <li>Reduceri la cazare: 6% pentru 3 nopți, 9% pentru 4 nopți, 12% pentru 5 nopți.</li>
        </ul>
        <h3>Confirmarea rezervării</h3>
        <p>
          Cererea trimisă de pe site nu este o rezervare confirmată. Rezervarea se confirmă după plata unui avans de 50%
          din valoarea totală a serviciilor cerute. Avansul este garanția rezervării.
        </p>
        <h3>Neprezentare</h3>
        <p>
          Dacă nu vă prezentați la data stabilită, avansul nu se returnează. Vă rugăm să verificați cu atenție detaliile
          rezervării înainte de plată.
        </p>
        <h3>Animale de companie</h3>
        <p>Pentru igienă, accesul cu animale de companie nu este permis în camere și în restaurant.</p>
        <h3>Activități</h3>
        <p>
          Bobul, echitația și închirierile se plătesc separat, la tarifele afișate. Folosirea bobului înseamnă acceptarea
          regulamentului afișat la pistă.
        </p>
        <h3>Litigii</h3>
        <p>
          Pentru reclamații ne poți contacta direct. Poți apela și la Autoritatea Națională pentru Protecția
          Consumatorilor (ANPC) și la soluționarea alternativă a litigiilor (SAL):{' '}
          <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
            anpc.ro/ce-este-sal
          </a>
          .
        </p>
        <h3>Date firmă</h3>
        <Operator />
      </>
    ),
  },
}

export function LegalPages() {
  const [page, setPage] = useState(null)
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1)
      if (PAGES[h]) setPage(h)
    }
    fromHash()
    const on = (e) => {
      setPage(e.detail)
      history.replaceState(null, '', `#${e.detail}`)
    }
    window.addEventListener('baciu:legal', on)
    window.addEventListener('hashchange', fromHash)
    return () => {
      window.removeEventListener('baciu:legal', on)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [])
  const close = () => {
    setPage(null)
    history.replaceState(null, '', location.pathname + location.search)
  }
  useLockScroll(!!page)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && page && close()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  })
  const p = page ? PAGES[page] : null
  return (
    <div className={`legal ${p ? 'is-open' : ''}`} aria-hidden={!p}>
      {p && (
        <div className="legal__box" role="dialog" aria-modal="true" aria-labelledby="legal-h" data-lenis-prevent>
          <div className="legal__bar">
            <nav className="legal__tabs" aria-label="Documente">
              {Object.entries(PAGES).map(([k, v]) => (
                <button key={k} type="button" className={k === page ? 'on' : ''} onClick={() => setPage(k)}>
                  {v.title.replace('Politica de ', '').replace(/^./, (c) => c.toUpperCase())}
                </button>
              ))}
            </nav>
            <button type="button" className="x x--static" onClick={close} aria-label="Închide">
              <Icon name="close" />
            </button>
          </div>
          <article className="legal__doc">
            <h2 id="legal-h" className="h2">
              {p.title}
            </h2>
            {p.body}
          </article>
        </div>
      )}
    </div>
  )
}
