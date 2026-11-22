// Mici ajutoare React folosite în mai multe locuri.
import { useEffect, useState } from 'react'

/** true cât timp media query-ul se potrivește, de ex. useMedia('(max-width: 900px)') = „suntem pe telefon”. */
export function useMedia(query) {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** Închide ceva la tasta Escape, cât timp `active` e true. */
export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => e.key === 'Escape' && onEscape()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, onEscape])
}
