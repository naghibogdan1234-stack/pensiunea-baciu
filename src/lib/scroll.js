// Scroll-ul paginii.
//
// Scroll-ul lin îl face biblioteca Lenis, pornită în App.jsx și pusă în window.__lenis.
// Orice cod care vrea să deruleze pagina trece prin window.__lenis (dacă există), altfel
// Lenis și browserul s-ar contrazice.
import { useEffect } from 'react'

// pe ce pagină stă fiecare secțiune (id-ul secțiunii → pagina din router.jsx; '' = prima pagină)
const SECTION_PAGE = {
  camere: 'camere',
  oferte: 'camere',
  restaurant: 'restaurant',
  meniu: 'restaurant',
  activitati: 'activitati',
  tarife: 'activitati',
  galerie: 'galerie',
  recenzii: 'galerie',
  contact: 'contact',
  intrebari: 'contact',
}

// secțiunea la care coborâm după ce se schimbă pagina (o citește App.jsx, în Pages)
let pendingScroll = null
export function takePendingScroll() {
  const id = pendingScroll
  pendingScroll = null
  return id
}

/**
 * Coboară lin la secțiunea cu id-ul dat.
 * Dacă secțiunea nu e pe pagina curentă, schimbă întâi pagina, apoi coboară la ea.
 */
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) {
    const page = SECTION_PAGE[id]
    if (page !== undefined) {
      pendingScroll = id
      location.hash = page ? `#/${page}` : '#/'
    }
    return
  }
  // -70 = sub bara de sus
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === 'top' ? 0 : -70, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}

/** Pentru linkuri <a href="#meniu" onClick={scrollLink('meniu')}>: scroll lin în loc de salt. */
export const scrollLink = (id) => (event) => {
  event.preventDefault()
  scrollToId(id)
}

/** Oprește scroll-ul paginii cât timp e deschis un panou (meniu, rezervare, poză mărită...). */
export function useLockScroll(open) {
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    document.documentElement.classList.add('locked')
    return () => {
      window.__lenis?.start()
      document.documentElement.classList.remove('locked')
    }
  }, [open])
}
