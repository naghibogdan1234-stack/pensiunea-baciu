import { useEffect, useState } from 'react'
import { Img, openBooking, useLockScroll } from '../lib.jsx'
import { CONTACT } from '../data/content.js'
import { useData } from '../data/index.js'
import { Link, usePage } from '../router.jsx'
import { useT, useLang, useSetLang, LANGS } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    menu: 'Meniu',
    close: 'Închide',
    book: 'Rezervă',
    bookRoom: 'Rezervă o cameră',
    home: 'Pensiunea Baciu, prima pagină',
    call: 'Sună',
    sections: 'Pagini',
    lang: 'Limba',
    start: 'Acasă',
    startLine: 'Tot ce e la Baciu, pe o singură pagină',
  },
  en: {
    menu: 'Menu',
    close: 'Close',
    book: 'Book',
    bookRoom: 'Book a room',
    home: 'Pensiunea Baciu, home page',
    call: 'Call',
    sections: 'Pages',
    lang: 'Language',
    start: 'Home',
    startLine: 'Everything at Baciu, on one page',
  },
}

export function LangSwitch({ tab = 0 }) {
  const lang = useLang()
  const setLang = useSetLang()
  const l = useT(L)
  return (
    <div className="lang" role="group" aria-label={l.lang}>
      {LANGS.map((k) => (
        <button
          key={k}
          type="button"
          lang={k}
          className={k === lang ? 'on' : ''}
          aria-pressed={k === lang}
          tabIndex={tab}
          onClick={() => setLang(k)}
        >
          {k.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const page = usePage()
  const { LINKS } = useData()
  const l = useT(L)
  const [over, setOver] = useState(true) // deasupra pozei mari de sus
  const [small, setSmall] = useState(false)
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(0)
  const [seen, setSeen] = useState(false) // pozele din meniu se încarcă abia la prima deschidere
  const items = [['', l.start, 'vara-drona', l.startLine], ...LINKS]

  useEffect(() => {
    const on = () => {
      const limit = page ? window.innerHeight * 0.62 - 90 : window.innerHeight - 90
      setOver(window.scrollY < limit)
      setSmall(window.scrollY > 60)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [page])

  useLockScroll(open)
  useEffect(() => {
    if (open) setSeen(true)
  }, [open])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    if (open) {
      const i = items.findIndex(([id]) => id === page)
      setHover(i >= 0 ? i : 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, page])
  // pagina s-a schimbat: meniul se închide
  useEffect(() => setOpen(false), [page])

  return (
    <>
      <header className={`nav ${over && !open ? 'nav--over' : ''} ${small ? 'nav--small' : ''} ${open ? 'nav--open' : ''}`}>
        <div className="nav__in">
          <div className="nav__start">
            <button
              type="button"
              className="nav__menu"
              aria-expanded={open}
              aria-controls="meniu-site"
              aria-label={open ? l.close : l.menu}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="nav__burger" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="nav__menu-t" aria-hidden="true">
                {open ? l.close : l.menu}
              </span>
            </button>
            <LangSwitch />
          </div>
          <Link to="" className="nav__mark" aria-label={l.home}>
            <span className="nav__name">Pensiunea Baciu</span>
            <span className="nav__place">Toplița · 850 m</span>
          </Link>
          <div className="nav__end">
            <LangSwitch />
            <a className="nav__tel" href={CONTACT.phoneHref} aria-label={`${l.call}: ${CONTACT.phone}`}>
              <Icon name="phone" size={17} />
              <span>{CONTACT.phone}</span>
            </a>
            <button
              type="button"
              className="btn btn--brass nav__cta"
              onClick={() => {
                setOpen(false)
                openBooking()
              }}
            >
              {l.book}
            </button>
          </div>
        </div>
      </header>

      <div id="meniu-site" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        <div className="sheet__grid">
          <nav className="sheet__links" aria-label={l.sections}>
            {items.map(([id, label, , line], i) => (
              <Link
                key={id || 'home'}
                to={id}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className={`${hover === i ? 'is-hover' : ''} ${page === id ? 'is-active' : ''}`}
                aria-current={page === id ? 'page' : undefined}
                style={{ '--i': i }}
                tabIndex={open ? 0 : -1}
              >
                <span className="sheet__label">{label}</span>
                <span className="sheet__line">{line}</span>
              </Link>
            ))}
          </nav>
          <div className="sheet__pic" aria-hidden="true">
            {items.map(([id, , img], i) => (
              <div key={id || 'home'} className={`sheet__img ${hover === i ? 'on' : ''}`}>
                {seen && <Img name={img} alt="" sizes="40vw" />}
              </div>
            ))}
          </div>
        </div>
        <div className="sheet__foot">
          <div className="sheet__info">
            <a href={CONTACT.phoneHref} tabIndex={open ? 0 : -1}>
              <Icon name="phone" size={17} /> {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} tabIndex={open ? 0 : -1}>
              <Icon name="mail" size={17} /> {CONTACT.email}
            </a>
            <span>
              <Icon name="pin" size={17} /> {CONTACT.street}, Toplița
            </span>
          </div>
          <div className="sheet__end">
            <LangSwitch tab={open ? 0 : -1} />
            <button
              type="button"
              className="btn btn--brass"
              tabIndex={open ? 0 : -1}
              onClick={() => {
                setOpen(false)
                openBooking()
              }}
            >
              {l.bookRoom}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
