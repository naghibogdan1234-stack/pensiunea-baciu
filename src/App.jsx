// Scheletul site-ului: ce se pornește o singură dată și ce stă mereu pe ecran.
//
//   App            pornește scroll-ul lin (Lenis) și pune „furnizorii” (limba, pagina, cookie-urile)
//   └─ Pages       bara de sus + pagina curentă + subsolul + bara de jos de pe telefon
//   └─ ferestrele globale, montate o singură dată și deschise prin evenimente (vezi events.js):
//      Curtain, DragCursor, Booking, CookieBanner, CookieSettings, LegalPages
//
// Ce secțiuni are fiecare pagină se hotărăște în pages.jsx.
import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollToId, takePendingScroll } from './lib/scroll.js'
import { LangProvider, useTexts, useLang } from './i18n.jsx'
import { RouterProvider, usePage } from './router.jsx'
import { useData } from './data/index.js'
import { Home, PAGE_SECTIONS } from './pages.jsx'
import { ConsentProvider, CookieBanner, CookieSettings } from './components/legal/Consent.jsx'
import LegalPages from './components/legal/LegalPages.jsx'
import Nav from './components/layout/Nav.jsx'
import Footer from './components/layout/Footer.jsx'
import MobileBar from './components/layout/MobileBar.jsx'
import PageHead from './components/layout/PageHead.jsx'
import NextPage from './components/layout/NextPage.jsx'
import Curtain from './components/layout/Curtain.jsx'
import DragCursor from './components/layout/DragCursor.jsx'
import Booking from './components/booking/Booking.jsx'

const TEXT = {
  ro: { skip: 'Sari la conținut' },
  en: { skip: 'Skip to content' },
}
// titlul ferestrei pe prima pagină; paginile separate îl iau din PAGE_HEAD (data/content.js)
const HOME_TITLE = {
  ro: 'Pensiunea Baciu, Toplița · cazare, restaurant, echitație și schi',
  en: 'Pensiunea Baciu, Toplița · rooms, restaurant, riding and skiing',
}

function Pages() {
  const page = usePage()
  const lang = useLang()
  const { PAGE_HEAD } = useData()
  const txt = useTexts(TEXT)

  // la fiecare pagină nouă: sus de tot, apoi, dacă s-a cerut, coborâm la o secțiune (vezi lib/scroll.js)
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = takePendingScroll()
    if (id) setTimeout(() => scrollToId(id), 450)
  }, [page])
  useEffect(() => {
    document.title = page ? `${PAGE_HEAD[page].title} · Pensiunea Baciu` : HOME_TITLE[lang]
  }, [page, lang, PAGE_HEAD])

  const Sections = PAGE_SECTIONS[page]
  return (
    <>
      <a className="skip" href="#continut">
        {txt.skip}
      </a>
      <Nav />
      {/* key={page}: la schimbarea paginii, conținutul se montează din nou (animațiile pornesc iar) */}
      <main id="continut" className="page" key={page}>
        {Sections ? (
          <>
            <PageHead page={page} />
            <Sections />
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
  // scroll lin cu Lenis; e pus în window.__lenis ca restul codului să poată derula pagina prin el
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    window.__lenis = lenis
    let raf
    const loop = (time) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    // adresele vechi de forma #camere (fără /) duc la secțiunea respectivă
    const hash = location.hash.slice(1)
    if (hash && !hash.startsWith('/') && document.getElementById(hash)) setTimeout(() => scrollToId(hash), 400)
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
