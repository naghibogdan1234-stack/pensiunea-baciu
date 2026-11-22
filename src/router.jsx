// Paginile site-ului, cu adrese de forma #/camere.
//
// Am ales adrese cu # (hash) ca site-ul să meargă pe orice găzduire, fără reguli de server:
// Netlify, GitHub Pages sau un hosting clasic servesc mereu același index.html.
//
//   #/            prima pagină (toate secțiunile, pe scurt)
//   #/camere      #/restaurant   #/activitati   #/galerie   #/contact
//
// Ce secțiuni apar pe fiecare pagină se hotărăște în src/pages.jsx.
// Alte ancore (#meniu, #confidentialitate) nu schimbă pagina: sunt secțiuni sau ferestre.
import { createContext, useContext, useEffect, useState } from 'react'
import { EVENTS } from './events.js'

export const ROUTES = ['camere', 'restaurant', 'activitati', 'galerie', 'contact']

/** '#/camere' → 'camere'; '#/' sau o pagină necunoscută → '' (prima pagină); '#meniu' → null (nu e pagină) */
const pageFromHash = (hash) => {
  if (!hash.startsWith('#/')) return null
  const slug = hash.slice(2).split(/[/?]/)[0]
  return ROUTES.includes(slug) ? slug : ''
}

const RouterContext = createContext({ page: '' })

export function RouterProvider({ children }) {
  const [page, setPage] = useState(() => pageFromHash(location.hash) ?? '')
  useEffect(() => {
    const onHashChange = () => {
      const next = pageFromHash(location.hash)
      if (next !== null) setPage(next)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
  return <RouterContext.Provider value={{ page }}>{children}</RouterContext.Provider>
}

/** pagina curentă: '' sau unul din ROUTES */
export const usePage = () => useContext(RouterContext).page
export const href = (page) => (page ? `#/${page}` : '#/')

// Cortina dintre pagini: coboară peste ecran în COVER ms, apoi schimbăm pagina pe dedesubt,
// apoi se ridică (components/layout/Curtain.jsx). Ritmul e același și în styles/layout/curtain.css.
export const COVER = 560
let busy = false // o schimbare de pagină odată

/** Schimbă pagina, cu cortină. Dacă pagina e deja deschisă, urcă lin sus. */
export function navigate(page) {
  const target = href(page)
  const alreadyHome = !page && !location.hash.startsWith('#/') && document.querySelector('.hero')
  if (location.hash === target || alreadyHome) {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1 })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  if (busy) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.hash = target // fără cortină
    return
  }
  busy = true
  window.dispatchEvent(new CustomEvent(EVENTS.curtain, { detail: { page } }))
  setTimeout(() => {
    location.hash = target
    busy = false
  }, COVER)
}

/**
 * Link către o pagină: <Link to="camere">Camere</Link>.
 * E un <a> obișnuit (merge și „deschide în tab nou”), dar la click normal trece prin navigate().
 */
export function Link({ to, children, onClick, ...rest }) {
  return (
    <a
      href={href(to)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey) return // tab / fereastră nouă: lăsăm browserul
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
