import { useEffect, useState } from 'react'
import { scrollToId, openBooking, useLockScroll } from '../lib.jsx'
import { CONTACT } from '../data/content.js'
import Icon from './Icon.jsx'

export const LINKS = [
  ['camere', 'Camere'],
  ['restaurant', 'Restaurant'],
  ['meniu', 'Meniu'],
  ['activitati', 'Activități'],
  ['galerie', 'Galerie'],
  ['contact', 'Contact'],
]

export default function Nav() {
  const [over, setOver] = useState(true) // deasupra pozei mari de sus
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const on = () => setOver(window.scrollY < window.innerHeight - 90)
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
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useLockScroll(open)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [])

  const goTo = (id) => (e) => {
    e.preventDefault()
    if (open) {
      setOpen(false)
      setTimeout(() => scrollToId(id), 380)
    } else scrollToId(id)
  }

  return (
    <>
      <header className={`nav ${over && !open ? 'nav--over' : ''} ${open ? 'nav--open' : ''}`}>
        <div className="nav__in">
          <a href="#top" className="nav__mark" onClick={goTo('top')}>
            Pensiunea Baciu
            <span className="nav__place">Toplița · 850 m</span>
          </a>
          <nav className="nav__links" aria-label="Secțiuni">
            {LINKS.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={goTo(id)} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined}>
                {label}
              </a>
            ))}
          </nav>
          <div className="nav__end">
            <a className="nav__tel" href={CONTACT.phoneHref}>
              <Icon name="phone" size={17} />
              <span>{CONTACT.phone}</span>
            </a>
            <button type="button" className="btn nav__cta" onClick={() => openBooking()}>
              Rezervă
            </button>
            <button
              type="button"
              className="nav__burger"
              aria-expanded={open}
              aria-controls="meniu-mobil"
              aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="meniu-mobil" className={`sheet ${open ? 'is-open' : ''}`} aria-hidden={!open} data-lenis-prevent>
        <nav className="sheet__links" aria-label="Meniu">
          {LINKS.map(([id, label], i) => (
            <a key={id} href={`#${id}`} onClick={goTo(id)} style={{ '--i': i }} tabIndex={open ? 0 : -1}>
              {label}
            </a>
          ))}
        </nav>
        <div className="sheet__foot">
          <a className="btn btn--line-light" href={CONTACT.phoneHref} tabIndex={open ? 0 : -1}>
            <Icon name="phone" size={18} /> {CONTACT.phone}
          </a>
          <button
            type="button"
            className="btn btn--brass"
            tabIndex={open ? 0 : -1}
            onClick={() => {
              setOpen(false)
              openBooking()
            }}
          >
            Rezervă
          </button>
        </div>
      </div>
    </>
  )
}
