// Acordul pentru cookie-uri.
//
// Site-ul nu folosește cookie-uri de statistică sau reclame. Singurul lucru opțional e harta Google
// (pagina Contact), care se încarcă doar cu acordul vizitatorului. Alegerea se ține în localStorage.
//
//   ConsentProvider   ține alegerea; useConsent() → { decided, maps, save(maps), settingsOpen, setSettingsOpen }
//   CookieBanner      bannerul de jos, până când vizitatorul alege
//   CookieSettings    fereastra „Setări cookie-uri” (din banner sau din subsol: openCookieSettings())
import { createContext, useContext, useEffect, useState } from 'react'
import { useLockScroll } from '../../lib/scroll.js'
import { openLegal, EVENTS } from '../../events.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'

const TEXT = {
  ro: {
    t: 'Cookie-uri',
    p: 'Folosim doar ce e necesar ca site-ul să funcționeze. Harta Google se încarcă numai dacă ești de acord, pentru că Google poate seta cookie-uri proprii.',
    ps: 'Doar cookie-uri necesare. Harta Google pornește numai cu acordul tău.',
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
    ps: 'Only necessary cookies. The Google map loads only with your consent.',
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

/* ---------- alegerea salvată ---------- */
// Dacă se schimbă ce întrebăm (de ex. apare o categorie nouă de cookie-uri), crește VERSION:
// alegerile vechi nu mai sunt valabile și bannerul apare din nou.
const STORAGE_KEY = 'baciu-consent-v2'
const VERSION = 1
const readSaved = () => {
  try {
    const v = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return v && v.v === VERSION ? v : null
  } catch {
    return null
  }
}
const writeSaved = (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
  } catch {
    /* stocare indisponibilă: alegerea ține doar până se închide pagina */
  }
}

const ConsentContext = createContext(null)
export const useConsent = () => useContext(ConsentContext)

export function ConsentProvider({ children }) {
  const [state, setState] = useState(readSaved)
  const [settingsOpen, setSettingsOpen] = useState(false)
  /** maps = true dacă vizitatorul acceptă harta Google */
  const save = (maps) => {
    const v = { v: VERSION, necessary: true, maps: !!maps, date: new Date().toISOString() }
    writeSaved(v)
    setState(v)
  }
  useEffect(() => {
    const onOpen = () => setSettingsOpen(true)
    window.addEventListener(EVENTS.cookies, onOpen)
    return () => window.removeEventListener(EVENTS.cookies, onOpen)
  }, [])
  return (
    <ConsentContext.Provider
      value={{ decided: !!state, maps: !!state?.maps, save, settingsOpen, setSettingsOpen }}
    >
      {children}
    </ConsentContext.Provider>
  )
}

// bannerul apare după 1,4 secunde, ca să nu acopere primul ecran cât se încarcă
export function CookieBanner() {
  const { decided, save, setSettingsOpen } = useConsent()
  const txt = useTexts(TEXT)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (decided) return
    const t = setTimeout(() => setShow(true), 1400)
    return () => clearTimeout(t)
  }, [decided])
  if (decided) return null
  return (
    <div className={`cookie ${show ? 'is-in' : ''}`} role="region" aria-label={txt.t}>
      <p className="cookie__t">{txt.t}</p>
      <p className="cookie__p">
        <span className="cookie__long">{txt.p}</span>
        <span className="cookie__short">{txt.ps}</span>{' '}
        <button type="button" className="link" onClick={() => openLegal('cookie-uri')}>
          {txt.policy}
        </button>
      </p>
      <div className="cookie__btns">
        <button type="button" className="btn btn--line" onClick={() => save(false)}>
          {txt.no}
        </button>
        <button type="button" className="btn btn--line" onClick={() => setSettingsOpen(true)}>
          {txt.set}
        </button>
        <button type="button" className="btn" onClick={() => save(true)}>
          {txt.yes}
        </button>
      </div>
    </div>
  )
}

export function CookieSettings() {
  const { maps, save, settingsOpen, setSettingsOpen } = useConsent()
  const txt = useTexts(TEXT)
  const [mapsChoice, setMapsChoice] = useState(maps) // bifa din fereastră, până la „Salvează”
  useEffect(() => {
    if (settingsOpen) setMapsChoice(maps)
  }, [settingsOpen, maps])
  useLockScroll(settingsOpen)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setSettingsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setSettingsOpen])
  return (
    <div className={`modal ${settingsOpen ? 'is-open' : ''}`} aria-hidden={!settingsOpen} onClick={() => setSettingsOpen(false)}>
      <div className="modal__box" role="dialog" aria-modal="true" aria-labelledby="ck-h" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <button type="button" className="x" onClick={() => setSettingsOpen(false)} aria-label={txt.close}>
          <Icon name="close" />
        </button>
        <h2 id="ck-h" className="h3">
          {txt.h}
        </h2>
        <div className="ck">
          <div className="ck__row">
            <div>
              <p className="ck__name">{txt.nec}</p>
              <p className="muted small">{txt.necP}</p>
            </div>
            <span className="ck__always">{txt.always}</span>
          </div>
          <label className="ck__row">
            <div>
              <p className="ck__name">{txt.maps}</p>
              <p className="muted small">{txt.mapsP}</p>
            </div>
            <input type="checkbox" checked={mapsChoice} onChange={(e) => setMapsChoice(e.target.checked)} />
            <span className="toggle" aria-hidden="true" />
          </label>
        </div>
        <p className="muted small">{txt.none}</p>
        <div className="modal__btns">
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              save(false)
              setSettingsOpen(false)
            }}
          >
            {txt.noAll}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              save(mapsChoice)
              setSettingsOpen(false)
            }}
          >
            {txt.save}
          </button>
        </div>
      </div>
    </div>
  )
}
