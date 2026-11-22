import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollToId, openBooking } from './lib.jsx'
import { ConsentProvider, CookieBanner, CookieSettings, LegalPages } from './components/Legal.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Rooms from './components/Rooms.jsx'
import Restaurant from './components/Restaurant.jsx'
import MenuBook from './components/MenuBook.jsx'
import Activities from './components/Activities.jsx'
import Gallery from './components/Gallery.jsx'
import Visit from './components/Visit.jsx'
import Footer from './components/Footer.jsx'
import Booking from './components/Booking.jsx'
import Icon from './components/Icon.jsx'
import { CONTACT } from './data/content.js'

function MobileBar() {
  return (
    <div className="mbar" role="navigation" aria-label="Acțiuni rapide">
      <a className="btn btn--line" href={CONTACT.phoneHref}>
        <Icon name="phone" size={18} /> Sună
      </a>
      <button type="button" className="btn" onClick={() => openBooking()}>
        Rezervă
      </button>
    </div>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    window.__lenis = lenis
    let raf
    const loop = (t) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const h = location.hash.slice(1)
    if (h && document.getElementById(h)) setTimeout(() => scrollToId(h), 400)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return (
    <ConsentProvider>
      <a className="skip" href="#camere">
        Sari la conținut
      </a>
      <Nav />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Restaurant />
        <MenuBook />
        <Activities />
        <Gallery />
        <Visit />
      </main>
      <Footer />
      <MobileBar />
      <Booking />
      <CookieBanner />
      <CookieSettings />
      <LegalPages />
    </ConsentProvider>
  )
}
