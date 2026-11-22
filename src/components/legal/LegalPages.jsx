// Paginile legale (confidențialitate, cookie-uri, termeni), deschise peste site.
// Se deschid cu openLegal('termeni') (events.js) sau direct din adresă: #termeni.
// La închidere, adresa revine la ce era înainte. Textele sunt în pages-ro.jsx și pages-en.jsx.
import { useEffect, useRef, useState } from 'react'
import { useLockScroll } from '../../lib/scroll.js'
import { EVENTS } from '../../events.js'
import { useTexts, useLang } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'
import { PAGES_RO } from './pages-ro.jsx'
import { PAGES_EN } from './pages-en.jsx'

const TEXT = {
  ro: { close: 'Închide', docs: 'Documente' },
  en: { close: 'Close', docs: 'Documents' },
}

export default function LegalPages() {
  const lang = useLang()
  const txt = useTexts(TEXT)
  const PAGES = lang === 'en' ? PAGES_EN : PAGES_RO
  const [page, setPage] = useState(null)
  const back = useRef('') // adresa de dinainte de deschidere
  useEffect(() => {
    // deschisă direct din adresă (pensiuneabaciu.ro/#termeni)
    const fromHash = () => {
      const key = location.hash.slice(1)
      if (PAGES_RO[key]) setPage(key)
    }
    fromHash()
    const onOpen = (e) => {
      // ținem minte adresa de dedesubt (de ex. #/contact), ca s-o punem la loc la închidere
      if (!PAGES_RO[location.hash.slice(1)]) back.current = location.hash
      setPage(e.detail)
      history.replaceState(null, '', `#${e.detail}`)
    }
    window.addEventListener(EVENTS.legal, onOpen)
    window.addEventListener('hashchange', fromHash)
    return () => {
      window.removeEventListener(EVENTS.legal, onOpen)
      window.removeEventListener('hashchange', fromHash)
    }
  }, [])
  const close = () => {
    setPage(null)
    history.replaceState(null, '', location.pathname + location.search + (back.current || ''))
  }
  useLockScroll(!!page)
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && page && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })
  const doc = page ? PAGES[page] : null // pagina deschisă
  return (
    <div className={`legal ${doc ? 'is-open' : ''}`} aria-hidden={!doc}>
      {doc && (
        <div className="legal__box" role="dialog" aria-modal="true" aria-labelledby="legal-h" data-lenis-prevent>
          <div className="legal__bar">
            <nav className="legal__tabs" aria-label={txt.docs}>
              {Object.entries(PAGES).map(([key, d]) => (
                <button key={key} type="button" className={key === page ? 'on' : ''} onClick={() => setPage(key)}>
                  {d.tab}
                </button>
              ))}
            </nav>
            <button type="button" className="x x--static" onClick={close} aria-label={txt.close}>
              <Icon name="close" />
            </button>
          </div>
          <article className="legal__doc">
            <h2 id="legal-h" className="h2">
              {doc.title}
            </h2>
            {doc.body}
          </article>
        </div>
      )}
    </div>
  )
}
