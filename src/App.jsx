import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import { scrollToId, openBooking, takePendingScroll, Img } from './lib.jsx'
import { LangProvider, useT, useLang } from './i18n.jsx'
import { RouterProvider, usePage, Link, ROUTES, COVER } from './router.jsx'
import { useData } from './data/index.js'
import { ConsentProvider, CookieBanner, CookieSettings, LegalPages } from './components/Legal.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Rooms from './components/Rooms.jsx'
import Offers from './components/Offers.jsx'
import Restaurant from './components/Restaurant.jsx'
import Activities from './components/Activities.jsx'
import Reviews from './components/Reviews.jsx'
import Gallery from './components/Gallery.jsx'
import Faq from './components/Faq.jsx'
import Visit from './components/Visit.jsx'
import Footer from './components/Footer.jsx'
import Booking from './components/Booking.jsx'
import PageHead from './components/PageHead.jsx'
import Icon from './components/Icon.jsx'
import { CONTACT } from './data/content.js'

// cartea-meniu (cu biblioteca de răsfoit) se încarcă separat, ca prima pagină să apară mai repede
const loadBook = () => import('./components/MenuBook.jsx')
const LazyBook = lazy(loadBook)
function MenuBook() {
  useEffect(() => {
    const t = setTimeout(loadBook, 1500)
    return () => clearTimeout(t)
  }, [])
  return (
    <Suspense fallback={<section id="meniu" className="menu menu--wait" aria-hidden="true" />}>
      <LazyBook />
    </Suspense>
  )
}

const L = {
  ro: { call: 'Sună', book: 'Rezervă', skip: 'Sari la conținut', next: 'Mai departe', quick: 'Acțiuni rapide' },
  en: { call: 'Call', book: 'Book', skip: 'Skip to content', next: 'Next', quick: 'Quick actions' },
}
const TITLE = { ro: 'Pensiunea Baciu, Toplița · cazare, restaurant, echitație și schi', en: 'Pensiunea Baciu, Toplița · rooms, restaurant, riding and skiing' }

function MobileBar() {
  const l = useT(L)
  return (
    <div className="mbar" role="navigation" aria-label={l.quick}>
      <a className="btn btn--line" href={CONTACT.phoneHref}>
        <Icon name="phone" size={18} /> {l.call}
      </a>
      <button type="button" className="btn" onClick={() => openBooking()}>
        {l.book}
      </button>
    </div>
  )
}

// la capătul fiecărei pagini separate: următoarea pagină, cu poza ei
function NextPage({ page }) {
  const { LINKS, PAGE_HEAD } = useData()
  const l = useT(L)
  const i = ROUTES.indexOf(page)
  const [id, label, , line] = LINKS[(i + 1) % LINKS.length]
  const img = PAGE_HEAD[id].img // poza mare a paginii următoare
  return (
    <Link to={id} className="nextp">
      <span className="nextp__pic" aria-hidden="true">
        <Img name={img} alt="" sizes="100vw" />
      </span>
      <span className="nextp__txt wrap">
        <span className="nextp__k">{l.next}</span>
        <span className="nextp__t">
          {label} <Icon name="arrow" size={28} />
        </span>
        <span className="nextp__l">{line}</span>
      </span>
    </Link>
  )
}

// pe calculator, peste caruselele care se trag, cursorul devine un cerc cu „Trage”
function DragCursor() {
  const lang = useLang()
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    let x = -100,
      y = -100,
      cx = x,
      cy = y,
      on = false,
      raf = 0
    const loop = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const move = (e) => {
      x = e.clientX
      y = e.clientY
      // pozele mari care se pot apăsa rămân „Trage”; butoanele mici („Vezi camera”) au cursorul obișnuit
      const c = e.target.closest?.('a, button')
      const t = e.target.closest?.('[data-drag]') && !(c && c.offsetWidth < 280)
      if (!!t !== on) {
        on = !!t
        el.classList.toggle('is-on', on)
        document.documentElement.classList.toggle('drag-on', on)
        if (on) {
          cx = x
          cy = y
        }
      }
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])
  return (
    <div className="dragc" ref={ref} aria-hidden="true">
      <span>{lang === 'en' ? 'Drag' : 'Trage'}</span>
    </div>
  )
}

// cortina verde cu numele paginii, între pagini
function Curtain() {
  const { LINKS } = useData()
  const [st, setSt] = useState({ phase: '', label: '' })
  useEffect(() => {
    const timers = []
    const on = (e) => {
      const p = e.detail.page
      const label = p ? LINKS.find(([id]) => id === p)?.[1] : 'Pensiunea Baciu'
      timers.forEach(clearTimeout)
      setSt({ phase: 'in', label })
      timers.push(setTimeout(() => setSt((s) => ({ ...s, phase: 'out' })), COVER + 260))
      timers.push(setTimeout(() => setSt({ phase: '', label: '' }), COVER + 260 + 760))
    }
    window.addEventListener('baciu:curtain', on)
    return () => {
      window.removeEventListener('baciu:curtain', on)
      timers.forEach(clearTimeout)
    }
  }, [LINKS])
  return (
    <div className={`curtain ${st.phase ? `is-${st.phase}` : ''}`} aria-hidden="true">
      <span className="curtain__t">{st.label}</span>
    </div>
  )
}

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Rooms />
      <Offers />
      <Restaurant />
      <MenuBook />
      <Activities />
      <Reviews />
      <Gallery />
      <Faq limit={5} />
      <Visit />
    </>
  )
}

const SUB = {
  camere: () => (
    <>
      <Rooms />
      <Offers />
      <Faq only="camere" />
    </>
  ),
  restaurant: () => (
    <>
      <Restaurant />
      <MenuBook />
      <Faq only="restaurant" />
    </>
  ),
  activitati: () => (
    <>
      <Activities />
      <Faq only="activitati" />
    </>
  ),
  galerie: () => (
    <>
      <Gallery />
      <Reviews />
    </>
  ),
  contact: () => (
    <>
      <Visit />
      <Faq />
    </>
  ),
}

function Pages() {
  const page = usePage()
  const lang = useLang()
  const { PAGE_HEAD } = useData()
  const l = useT(L)

  // la fiecare pagină nouă: sus de tot, titlul ferestrei, apoi secțiunea cerută (dacă e cazul)
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = takePendingScroll()
    if (id) setTimeout(() => scrollToId(id), 450)
  }, [page])
  useEffect(() => {
    document.title = page ? `${PAGE_HEAD[page].title} · Pensiunea Baciu` : TITLE[lang]
  }, [page, lang, PAGE_HEAD])

  const Sub = SUB[page]
  return (
    <>
      <a className="skip" href="#continut">
        {l.skip}
      </a>
      <Nav />
      <main id="continut" className="page" key={page}>
        {Sub ? (
          <>
            <PageHead page={page} />
            <Sub />
            <NextPage page={page} />
          </>
        ) : (
          <Home />
        )}
      </main>
      <Footer />
      <MobileBar />
    </>
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
    // adrese vechi de forma #camere duc la secțiunea respectivă
    const h = location.hash.slice(1)
    if (h && !h.startsWith('/') && document.getElementById(h)) setTimeout(() => scrollToId(h), 400)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  return (
    <LangProvider>
      <RouterProvider>
        <ConsentProvider>
          <Pages />
          <Curtain />
          <DragCursor />
          <Booking />
          <CookieBanner />
          <CookieSettings />
          <LegalPages />
        </ConsentProvider>
      </RouterProvider>
    </LangProvider>
  )
}
