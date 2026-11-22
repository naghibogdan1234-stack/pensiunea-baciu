// Pagini separate, cu adrese de forma #/camere. Merge pe orice găzduire, fără setări de server.
import { createContext, useContext, useEffect, useState } from 'react'

export const ROUTES = ['camere', 'restaurant', 'activitati', 'galerie', 'contact']

const parse = (h) => {
  if (!h.startsWith('#/')) return null
  const slug = h.slice(2).split(/[/?]/)[0]
  return ROUTES.includes(slug) ? slug : ''
}

const Ctx = createContext({ page: '' })

export function RouterProvider({ children }) {
  const [page, setPage] = useState(() => parse(location.hash) ?? '')
  useEffect(() => {
    // alte ancore (#meniu, paginile legale) nu schimbă pagina
    const on = () => {
      const p = parse(location.hash)
      if (p !== null) setPage(p)
    }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return <Ctx.Provider value={{ page }}>{children}</Ctx.Provider>
}

export const usePage = () => useContext(Ctx).page
export const href = (page) => (page ? `#/${page}` : '#/')

// cortina dintre pagini: acoperă ecranul (COVER ms), schimbă pagina, apoi se ridică
export const COVER = 560
let busy = false
export function navigate(page) {
  const h = href(page)
  if (location.hash === h || (!page && !location.hash.startsWith('#/') && document.querySelector('.hero'))) {
    window.__lenis ? window.__lenis.scrollTo(0, { duration: 1 }) : window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  if (busy) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.hash = h
    return
  }
  busy = true
  window.dispatchEvent(new CustomEvent('baciu:curtain', { detail: { page } }))
  setTimeout(() => {
    location.hash = h
    busy = false
  }, COVER)
}

// link către o pagină; dacă pagina e deja deschisă, urcă sus
export function Link({ to, children, onClick, ...rest }) {
  return (
    <a
      href={href(to)}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}
