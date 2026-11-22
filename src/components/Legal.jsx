import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { CONTACT } from '../data/content.js'
import { useLockScroll, openLegal } from '../lib.jsx'
import { useT, useLang } from '../i18n.jsx'
import Icon from './Icon.jsx'

const CL = {
  ro: {
    t: 'Cookie-uri',
    p: 'Folosim doar ce e necesar ca site-ul să funcționeze. Harta Google se încarcă numai dacă ești de acord, pentru că Google poate seta cookie-uri proprii.',
    policy: 'Politica de cookie-uri',
    no: 'Refuz',
    set: 'Setări',
    yes: 'Accept toate',
    close: 'Închide',
    h: 'Setări cookie-uri',
    nec: 'Strict necesare',
    necP: 'Țin minte alegerea ta despre cookie-uri și limba site-ului. Fără ele site-ul nu poate respecta aceste alegeri.',
    always: 'Mereu active',
    maps: 'Hărți externe (Google Maps)',
    mapsP: 'Încarcă harta interactivă. Google poate seta cookie-uri și primește adresa ta IP.',
    none: 'Nu folosim cookie-uri de statistică sau de publicitate.',
    noAll: 'Refuz tot',
    save: 'Salvează alegerea',
    docs: 'Documente',
  },
  en: {
    t: 'Cookies',
    p: 'We only use what the site needs to work. The Google map loads only if you agree, because Google may set its own cookies.',
    policy: 'Cookie policy',
    no: 'Decline',
    set: 'Settings',
    yes: 'Accept all',
    close: 'Close',
    h: 'Cookie settings',
    nec: 'Strictly necessary',
    necP: 'They remember your cookie choice and the site language. Without them the site cannot respect these choices.',
    always: 'Always on',
    maps: 'External maps (Google Maps)',
    mapsP: 'Loads the interactive map. Google may set cookies and receives your IP address.',
    none: 'We do not use analytics or advertising cookies.',
    noAll: 'Decline all',
    save: 'Save my choice',
    docs: 'Documents',
  },
}

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
  const l = useT(CL)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (decided) return
    const t = setTimeout(() => setShow(true), 1400)
    return () => clearTimeout(t)
  }, [decided])
  if (decided) return null
  return (
    <div className={`cookie ${show ? 'is-in' : ''}`} role="region" aria-label={l.t}>
      <p className="cookie__t">{l.t}</p>
      <p className="cookie__p">
        {l.p}{' '}
        <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
          {l.policy}
        </button>
      </p>
      <div className="cookie__btns">
        <button type="button" className="btn btn--line" onClick={() => save(false)}>
          {l.no}
        </button>
        <button type="button" className="btn btn--line" onClick={() => setSettingsOpen(true)}>
          {l.set}
        </button>
        <button type="button" className="btn" onClick={() => save(true)}>
          {l.yes}
        </button>
      </div>
    </div>
  )
}

export function CookieSettings() {
  const { maps, save, settingsOpen, setSettingsOpen } = useConsent()
  const l = useT(CL)
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
        <button type="button" className="x" onClick={() => setSettingsOpen(false)} aria-label={l.close}>
          <Icon name="close" />
        </button>
        <h2 id="ck-h" className="h3">
          {l.h}
        </h2>
        <div className="ck">
          <div className="ck__row">
            <div>
              <p className="ck__name">{l.nec}</p>
              <p className="muted small">{l.necP}</p>
            </div>
            <span className="ck__always">{l.always}</span>
          </div>
          <label className="ck__row">
            <div>
              <p className="ck__name">{l.maps}</p>
              <p className="muted small">{l.mapsP}</p>
            </div>
            <input type="checkbox" checked={m} onChange={(e) => setM(e.target.checked)} />
            <span className="toggle" aria-hidden="true" />
          </label>
        </div>
        <p className="muted small">{l.none}</p>
        <div className="modal__btns">
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              save(false)
              setSettingsOpen(false)
            }}
          >
            {l.noAll}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              save(m)
              setSettingsOpen(false)
            }}
          >
            {l.save}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ================= Paginile legale ================= */
const UPDATED = 'noiembrie 2026'
const UPDATED_EN = 'November 2026'
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

const PAGES_RO = {
  confidentialitate: {
    title: 'Politica de confidențialitate',
    tab: 'Confidențialitate',
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
        <h3>Vremea de pe site</h3>
        <p>
          Panoul „Acum la Baciu” cere vremea de la Open-Meteo (open-meteo.com) direct din browserul tău. Cererea conține
          doar coordonatele pensiunii, dar Open-Meteo vede adresa IP, ca orice site vizitat. Nu se setează cookie-uri.
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
    tab: 'Cookie-uri',
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
            <span role="cell">baciu-lang</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Ține minte limba aleasă, română sau engleză (stocare locală în browser)</span>
            <span role="cell">Până o ștergi</span>
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
    tab: 'Termeni de rezervare',
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
        <h3>Sosire și plecare</h3>
        <p>Check-in de la ora 14:00, check-out până la ora 11:00. Recepția este deschisă între 7:00 și 20:00.</p>
        <h3>Confirmarea rezervării</h3>
        <p>
          Cererea trimisă de pe site nu este o rezervare confirmată. Rezervarea se confirmă după plata unui avans de 50%
          din valoarea totală a serviciilor cerute. Avansul este garanția rezervării.
        </p>
        <h3>Plata</h3>
        <p>Numerar, card bancar, transfer bancar sau card de vacanță (Pluxee/Sodexo, Up, Edenred).</p>
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


const OperatorEn = () => (
  <p>
    <strong>{CONTACT.company}</strong>, registered at {CONTACT.address}, Romania, tax ID (CUI) {CONTACT.cui}, Trade
    Register no. {CONTACT.reg}. Phone {CONTACT.phone}, email{' '}
    <a className="link" href={`mailto:${CONTACT.email}`}>
      {CONTACT.email}
    </a>
    .
  </p>
)

const PAGES_EN = {
  confidentialitate: {
    title: 'Privacy policy',
    tab: 'Privacy',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <h3>Who is responsible for your data</h3>
        <OperatorEn />
        <h3>What data we process</h3>
        <p>
          When you send a booking request from the site, the form prepares an email in your own email app. The data
          reaches us only if you send that email: your name, phone, email address (if given), dates, number of guests and
          your message. The site has no database and does not keep this information.
        </p>
        <p>When you call or write to us directly, we process the data you give us in that conversation.</p>
        <h3>Why, and on what legal basis</h3>
        <ul>
          <li>To answer your request and make the booking, i.e. steps before entering a contract (Art. 6(1)(b) of Regulation (EU) 2016/679, GDPR).</li>
          <li>To keep the accounting records required by law, once a booking is confirmed (Art. 6(1)(c) GDPR).</li>
          <li>To show the Google map, only with your consent (Art. 6(1)(a) GDPR).</li>
        </ul>
        <h3>How long we keep it</h3>
        <p>
          Requests that do not become bookings are deleted within 6 months at most. Documents related to a paid booking
          are kept for as long as accounting law requires.
        </p>
        <h3>Who receives it</h3>
        <p>
          We do not sell or rent data. It may reach our email provider and, if you turn the map on, Google Ireland Ltd.,
          under Google’s policy.
        </p>
        <h3>Weather on the site</h3>
        <p>
          The “Now at Baciu” panel requests the weather from Open-Meteo (open-meteo.com) directly from your browser. The
          request only contains the guesthouse’s coordinates, but Open-Meteo sees your IP address, like any site you
          visit. No cookies are set.
        </p>
        <h3>Your rights</h3>
        <p>
          You may ask for access to your data, correction, erasure or restriction, object to processing, receive it in a
          portable format and withdraw consent at any time. Write to us at{' '}
          <a className="link" href={`mailto:${CONTACT.email}`}>
            {CONTACT.email}
          </a>
          . You can complain to the Romanian data protection authority (ANSPDCP),{' '}
          <a className="link" href="https://www.dataprotection.ro/" target="_blank" rel="noopener noreferrer">
            dataprotection.ro
          </a>
          .
        </p>
      </>
    ),
  },
  'cookie-uri': {
    title: 'Cookie policy',
    tab: 'Cookies',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <p>
          Cookies are small files a site saves in your browser. Our site uses as few as possible: no analytics, no
          advertising, no embedded social networks. Fonts and photos are hosted on our own site, not by third parties.
        </p>
        <h3>What we store</h3>
        <div className="ltable" role="table">
          <div role="row" className="ltable__h">
            <span role="columnheader">Name</span>
            <span role="columnheader">Who</span>
            <span role="columnheader">Why</span>
            <span role="columnheader">How long</span>
          </div>
          <div role="row">
            <span role="cell">baciu-consent-v2</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Remembers your cookie choice (local storage in the browser)</span>
            <span role="cell">Until you delete it or change your choice</span>
          </div>
          <div role="row">
            <span role="cell">baciu-lang</span>
            <span role="cell">Pensiunea Baciu</span>
            <span role="cell">Remembers the language you chose, Romanian or English (local storage in the browser)</span>
            <span role="cell">Until you delete it</span>
          </div>
          <div role="row">
            <span role="cell">Google cookies (for example NID, AEC)</span>
            <span role="cell">Google</span>
            <span role="cell">Make the Google Maps map work, only after your consent</span>
            <span role="cell">Under Google’s policy, up to a few months</span>
          </div>
        </div>
        <h3>How to change your choice</h3>
        <p>
          At any time, from the “Cookie settings” link at the bottom of the page. You can also delete cookies in your
          browser settings. About Google cookies:{' '}
          <a className="link" href="https://policies.google.com/technologies/cookies?hl=en" target="_blank" rel="noopener noreferrer">
            policies.google.com
          </a>
          .
        </p>
        <h3>Who is responsible</h3>
        <OperatorEn />
      </>
    ),
  },
  termeni: {
    title: 'Booking terms',
    tab: 'Booking terms',
    body: (
      <>
        <p className="muted">Last updated: {UPDATED_EN}. The Romanian version is the reference text.</p>
        <h3>Prices</h3>
        <ul>
          <li>Double room with a double bed: 300 lei a night. Double room with twin beds: 300 lei a night. Room for three: 380 lei a night.</li>
          <li>Breakfast is included in the room rate.</li>
          <li>Extra bed, on request: 60 lei a night, without breakfast.</li>
          <li>Discounts on accommodation: 6% for 3 nights, 9% for 4 nights, 12% for 5 nights.</li>
        </ul>
        <h3>Arrival and departure</h3>
        <p>Check-in from 14:00, check-out by 11:00. Reception is open from 7:00 to 20:00.</p>
        <h3>Confirming a booking</h3>
        <p>
          A request sent from the site is not a confirmed booking. The booking is confirmed once a deposit of 50% of the
          total is paid. The deposit guarantees the booking.
        </p>
        <h3>Payment</h3>
        <p>Cash, bank card, bank transfer or Romanian holiday card (Pluxee/Sodexo, Up, Edenred).</p>
        <h3>No-shows</h3>
        <p>If you do not arrive on the agreed date, the deposit is not refunded. Please check your booking details carefully before paying.</p>
        <h3>Pets</h3>
        <p>For hygiene reasons, pets are not allowed in the rooms or in the restaurant.</p>
        <h3>Activities</h3>
        <p>
          The alpine coaster, riding and rentals are paid separately, at the listed prices. Using the coaster means
          accepting the rules posted at the track.
        </p>
        <h3>Disputes</h3>
        <p>
          For complaints you can contact us directly. You can also turn to the Romanian consumer protection authority
          (ANPC) and alternative dispute resolution (SAL):{' '}
          <a className="link" href="https://anpc.ro/ce-este-sal/" target="_blank" rel="noopener noreferrer">
            anpc.ro/ce-este-sal
          </a>
          .
        </p>
        <h3>Company details</h3>
        <OperatorEn />
      </>
    ),
  },
}

export function LegalPages() {
  const lang = useLang()
  const l = useT(CL)
  const PAGES = lang === 'en' ? PAGES_EN : PAGES_RO
  const [page, setPage] = useState(null)
  const back = useRef('')
  useEffect(() => {
    const fromHash = () => {
      const h = location.hash.slice(1)
      if (PAGES_RO[h]) setPage(h)
    }
    fromHash()
    const on = (e) => {
      // ținem minte pagina de dedesubt, ca s-o punem la loc la închidere
      if (!PAGES_RO[location.hash.slice(1)]) back.current = location.hash
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
    history.replaceState(null, '', location.pathname + location.search + (back.current || ''))
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
            <nav className="legal__tabs" aria-label={l.docs}>
              {Object.entries(PAGES).map(([k, v]) => (
                <button key={k} type="button" className={k === page ? 'on' : ''} onClick={() => setPage(k)}>
                  {v.tab}
                </button>
              ))}
            </nav>
            <button type="button" className="x x--static" onClick={close} aria-label={l.close}>
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
