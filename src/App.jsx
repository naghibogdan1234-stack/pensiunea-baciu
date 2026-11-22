import { useEffect, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import { scrollToId, openBooking, takePendingScroll, Img } from './lib.jsx'
import { LangProvider, useT, useLang } from './i18n.jsx'
import { RouterProvider, usePage, Link, ROUTES } from './router.jsx'
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
          <Booking />
          <CookieBanner />
          <CookieSettings />
          <LegalPages />
        </ConsentProvider>
      </RouterProvider>
    </LangProvider>
  )
}
