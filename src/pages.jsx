// Ce secțiuni are fiecare pagină. Aici se adaugă, se scot sau se mută secțiuni.
//
// Prima pagină (#/) le arată pe toate, pe scurt. Paginile separate (#/camere...) au în plus un cap
// cu poză (PageHead) și, la final, legătura spre pagina următoare (NextPage); le pune App.jsx.
// Fiecare secțiune e o componentă din components/sections/.
import { lazy, Suspense } from 'react'
import Hero from './components/sections/Hero.jsx'
import About from './components/sections/About.jsx'
import Rooms from './components/sections/Rooms.jsx'
import Offers from './components/sections/Offers.jsx'
import Restaurant from './components/sections/Restaurant.jsx'
import Activities from './components/sections/Activities.jsx'
import Reviews from './components/sections/Reviews.jsx'
import Gallery from './components/sections/Gallery.jsx'
import Faq from './components/sections/Faq.jsx'
import Visit from './components/sections/Visit.jsx'

// Meniul-carte vine cu biblioteca de răsfoit (page-flip), care e mare. E pus într-un fișier JS separat
// (lazy), ca restul site-ului să pornească fără să-l aștepte. Până sosește, locul lui e ținut de o
// secțiune goală de aceeași mărime (menu--wait), ca pagina să nu sară.
const LazyMenuBook = lazy(() => import('./components/sections/MenuBook.jsx'))
function MenuBook() {
  return (
    <Suspense fallback={<section id="meniu" className="menu menu--wait" aria-hidden="true" />}>
      <LazyMenuBook />
    </Suspense>
  )
}

/** Prima pagină */
export function Home() {
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

/**
 * Paginile separate. Cheile sunt adresele din router.jsx (ROUTES).
 * Faq only="camere" = doar întrebările care au 'camere' în `pages` (data/content.js).
 */
export const PAGE_SECTIONS = {
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
