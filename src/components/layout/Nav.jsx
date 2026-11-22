// Bara de sus (mereu vizibilă) și meniul mare care acoperă ecranul.
//
// Bara are trei stări, puse ca clase pe <header>:
//   nav--over   transparentă, cu text alb, cât timp stă peste poza mare de sus
//   nav--small  mai joasă, după primii 60 px de scroll
//   nav--open   meniul mare e deschis
// În meniul mare, fiecare pagină are o poză; poza se schimbă când treci cu mouse-ul peste nume.
import { useEffect, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { useLockScroll } from '../../lib/scroll.js'
import { openBooking } from '../../events.js'
import { CONTACT } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { Link, usePage } from '../../router.jsx'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'
import LangSwitch from './LangSwitch.jsx'

const TEXT = {
  ro: {
    menu: 'Meniu',
    close: 'Închide',
    book: 'Rezervă',
    bookRoom: 'Rezervă o cameră',
    home: 'Pensiunea Baciu, prima pagină',
    call: 'Sună',
    sections: 'Pagini',
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
    start: 'Home',
    startLine: 'Everything at Baciu, on one page',
  },
}

export default function Nav() {
  const page = usePage()
  const { LINKS } = useData()
  const txt = useTexts(TEXT)
  const [overPhoto, setOverPhoto] = useState(true) // bara stă încă peste poza mare de sus
  const [small, setSmall] = useState(false)
  const [open, setOpen] = useState(false) // meniul mare
  const [hovered, setHovered] = useState(0) // a câta pagină din meniu e sub mouse (îi arătăm poza)
  const [loadPhotos, setLoadPhotos] = useState(false) // pozele din meniu se încarcă abia la prima deschidere
  // prima pagină + paginile din content.js
  const items = [{ page: '', label: txt.start, img: 'vara-drona', line: txt.startLine }, ...LINKS]

  // starea barei după scroll; poza de sus e mai joasă pe paginile separate (62% din ecran)
  useEffect(() => {
    const update = () => {
      const photoBottom = page ? window.innerHeight * 0.62 - 90 : window.innerHeight - 90
      setOverPhoto(window.scrollY < photoBottom)
      setSmall(window.scrollY > 60)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [page])

  useLockScroll(open)
  useEffect(() => {
    if (open) setLoadPhotos(true)
  }, [open])
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  // la deschidere, poza arătată e a paginii pe care ești
  useEffect(() => {
    if (open) {
      const i = items.findIndex((item) => item.page === page)
      setHovered(i >= 0 ? i : 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, page])
  // pagina s-a schimbat: meniul se închide
  useEffect(() => setOpen(false), [page])

  const tab = open ? 0 : -1 // legăturile din meniul închis nu se pot atinge cu Tab

  return (
    <>
      <header className={`nav ${overPhoto && !open ? 'nav--over' : ''} ${small ? 'nav--small' : ''} ${open ? 'nav--open' : ''}`}>
        <div className="nav__in">
          {/* stânga: butonul de meniu (și limba, pe ecran lat) */}
          <div className="nav__start">
            <button
              type="button"
              className="nav__menu"
              aria-expanded={open}
              aria-controls="meniu-site"
              aria-label={open ? txt.close : txt.menu}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="nav__burger" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="nav__menu-t" aria-hidden="true">
                {open ? txt.close : txt.menu}
              </span>
            </button>
            <LangSwitch />
          </div>
          {/* mijloc: numele, duce la prima pagină */}
          <Link to="" className="nav__mark" aria-label={txt.home}>
            <span className="nav__name">Pensiunea Baciu</span>
            <span className="nav__place">Toplița · 850 m</span>
          </Link>
          {/* dreapta: limba (pe telefon), telefonul, „Rezervă” */}
          <div className="nav__end">
            <LangSwitch />
            <a className="nav__tel" href={CONTACT.phoneHref} aria-label={`${txt.call}: ${CONTACT.phone}`}>
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
              {txt.book}
            </button>
          </div>
        </div>
      </header>

      {/* meniul mare: numele paginilor în stânga, poza paginii în dreapta, contactul jos */}
      <div id="meniu-site" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        <div className="sheet__grid">
          <nav className="sheet__links" aria-label={txt.sections}>
            {items.map((item, i) => (
              <Link
                key={item.page || 'home'}
                to={item.page}
                onClick={() => setOpen(false)}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                className={`${hovered === i ? 'is-hover' : ''} ${page === item.page ? 'is-active' : ''}`}
                aria-current={page === item.page ? 'page' : undefined}
                style={{ '--i': i }}
                tabIndex={tab}
              >
                <span className="sheet__label">{item.label}</span>
                <span className="sheet__line">{item.line}</span>
              </Link>
            ))}
          </nav>
          <div className="sheet__pic" aria-hidden="true">
            {items.map((item, i) => (
              <div key={item.page || 'home'} className={`sheet__img ${hovered === i ? 'on' : ''}`}>
                {loadPhotos && <Img name={item.img} alt="" sizes="40vw" />}
              </div>
            ))}
          </div>
        </div>
        <div className="sheet__foot">
          <div className="sheet__info">
            <a href={CONTACT.phoneHref} tabIndex={tab}>
              <Icon name="phone" size={17} /> {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} tabIndex={tab}>
              <Icon name="mail" size={17} /> {CONTACT.email}
            </a>
            <span>
              <Icon name="pin" size={17} /> {CONTACT.street}, Toplița
            </span>
          </div>
          <div className="sheet__end">
            <LangSwitch tab={tab} />
            <button
              type="button"
              className="btn btn--brass"
              tabIndex={tab}
              onClick={() => {
                setOpen(false)
                openBooking()
              }}
            >
              {txt.bookRoom}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
