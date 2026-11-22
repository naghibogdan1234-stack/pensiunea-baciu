import { useEffect, useState } from 'react'
import { Img, scrollToId, openBooking, useLockScroll } from '../lib.jsx'
import { CONTACT } from '../data/content.js'
import Icon from './Icon.jsx'

export const LINKS = [
  ['camere', 'Camere', 'camera-matrimonial', 'Paisprezece camere, mic dejun inclus'],
  ['restaurant', 'Restaurant', 'terasa-vedere', 'Bucate românești și terasa panoramică'],
  ['meniu', 'Meniu', 'masa', 'Tot meniul, de răsfoit ca la masă'],
  ['activitati', 'Activități', 'manej', 'Cai, bob, pârtii, vara și iarna'],
  ['galerie', 'Galerie', 'panorama', 'Locul, în fotografii'],
  ['contact', 'Contact', 'vara-drona', 'Adresă, program și hartă'],
]

export default function Nav() {
  const [over, setOver] = useState(true) // deasupra pozei mari de sus
  const [small, setSmall] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [hover, setHover] = useState(0)

  useEffect(() => {
    const on = () => {
      setOver(window.scrollY < window.innerHeight - 90)
      setSmall(window.scrollY > 60)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      window.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  useEffect(() => {
    const els = LINKS.map(([id]) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), {
      rootMargin: '-40% 0px -55% 0px',
    })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useLockScroll(open)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])
  useEffect(() => {
    if (open) {
      const i = LINKS.findIndex(([id]) => id === active)
      setHover(i >= 0 ? i : 0)
    }
  }, [open, active])

  const goTo = (id) => (e) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
      setTimeout(() => scrollToId(id), 420)
    } else scrollToId(id)
  }

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
              onClick={() => setOpen((o) => !o)}
            >
              <span className="nav__burger" aria-hidden="true">
                <span />
                <span />
              </span>
              <span className="nav__menu-t">{open ? 'Închide' : 'Meniu'}</span>
            </button>
          </div>
          <a href="#top" className="nav__mark" onClick={goTo('top')} aria-label="Pensiunea Baciu, începutul paginii">
            <span className="nav__name">Pensiunea Baciu</span>
            <span className="nav__place">Toplița · 850 m</span>
          </a>
          <div className="nav__end">
            <a className="nav__tel" href={CONTACT.phoneHref} aria-label={`Sună: ${CONTACT.phone}`}>
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
              Rezervă
            </button>
          </div>
        </div>
      </header>

      <div id="meniu-site" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        <div className="sheet__grid">
          <nav className="sheet__links" aria-label="Secțiuni">
            {LINKS.map(([id, label, , line], i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={goTo(id)}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                className={`${hover === i ? 'is-hover' : ''} ${active === id ? 'is-active' : ''}`}
                style={{ '--i': i }}
                tabIndex={open ? 0 : -1}
              >
                <span className="sheet__label">{label}</span>
                <span className="sheet__line">{line}</span>
              </a>
            ))}
          </nav>
          <div className="sheet__pic" aria-hidden="true">
            {LINKS.map(([id, , img], i) => (
              <div key={id} className={`sheet__img ${hover === i ? 'on' : ''}`}>
                <Img name={img} alt="" sizes="40vw" />
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
          <button
            type="button"
            className="btn btn--brass"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false)
              openBooking()
            }}
          >
            Rezervă o cameră
          </button>
        </div>
      </div>
    </>
  )
}
