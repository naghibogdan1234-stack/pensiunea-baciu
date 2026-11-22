// Formatarea prețurilor și a datelor.
//
// Datele circulă prin tot site-ul ca text „AAAA-LL-ZZ” (de ex. '2026-12-27'), în ora locală.
// Așa se compară simplu ('2026-12-27' < '2026-12-30') și nu apar decalaje de fus orar.
// Același format îl primește și backend-ul (vezi src/api/booking.js).
import { locale } from '../i18n.jsx'

/** 1026 → „1.026 lei” (în engleză „1,026 lei”) */
export const lei = (n) => `${Math.round(n).toLocaleString(locale())} lei`

const pad = (n) => String(n).padStart(2, '0') // taste-skill-ignore: format ISO de dată

/** Date → '2026-12-27' */
export const toISO = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** '2026-12-27' → Date (la miezul nopții, ora locală) */
export const fromISO = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayISO = () => toISO(new Date())

export const addDaysISO = (iso, days) => {
  const date = fromISO(iso)
  date.setDate(date.getDate() + days)
  return toISO(date)
}

/** Câte nopți sunt între sosire și plecare (0 dacă lipsește una dintre ele). */
export const nightsBetween = (from, to) => (from && to ? Math.round((fromISO(to) - fromISO(from)) / 86400000) : 0)

/** '2026-12-27' → „27 dec.” fără punct (în bara de rezervare de sus) */
export const shortDate = (iso) =>
  iso ? fromISO(iso).toLocaleDateString(locale(), { day: 'numeric', month: 'short' }).replace('.', '') : ''

/** '2026-12-27' → „dum., 27 decembrie 2026” (în rezervare) */
export const longDate = (iso, lang) =>
  iso ? fromISO(iso).toLocaleDateString(locale(lang), { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : ''
