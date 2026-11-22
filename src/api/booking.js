// Legătura dintre site și sistemul de rezervări.
//
// Pentru cine face backend-ul: setează VITE_BOOKING_API în .env (de ex. https://api.pensiuneabaciu.ro)
// și implementează cele două rute de mai jos. Cât timp VITE_BOOKING_API e gol, site-ul merge singur:
// toate camerele apar libere, iar cererea se trimite pe email (se deschide aplicația de email a vizitatorului).
//
// GET  {API}/availability?from=AAAA-LL-ZZ&to=AAAA-LL-ZZ&guests=2
//      răspuns: { rooms: { matrimonial: { available: true, left: 3 }, twin: {...}, tripla: {...} } }
//      „left” e opțional: numărul de camere libere de acel tip (sub 3 apare „Mai sunt doar N”).
//      Un preț trimis aici („price”, lei pe noapte) înlocuiește prețul din content.js.
//
// POST {API}/bookings   (JSON, vezi BookingPayload mai jos)
//      răspuns: { ok: true, ref: "BAC-2412" }   sau   { ok: false, error: "mesaj pentru vizitator" }
//
// Payload-ul îl construiește bookingPayload() din components/booking/rules.js; prețul din el e estimarea
// arătată vizitatorului, nu un preț garantat: backend-ul trebuie să-l recalculeze, nu să aibă încredere în el.

import { CONTACT } from '../data/content.js'

export const BOOKING_API = (import.meta.env.VITE_BOOKING_API || '').replace(/\/$/, '')

/**
 * @typedef {Object} BookingPayload
 * @property {'Cazare'|'Masă la restaurant'|'Echitație'|'Eveniment'} type
 * @property {'ro'|'en'} lang        limba în care a scris vizitatorul
 * @property {string} from           AAAA-LL-ZZ (sosire sau data aleasă)
 * @property {string} [to]           AAAA-LL-ZZ (plecare, doar la cazare)
 * @property {string} [time]         HH:MM (masă, echitație)
 * @property {number} adults
 * @property {number} children
 * @property {string} [room]         id-ul camerei din content.js (matrimonial, twin, tripla)
 * @property {boolean} [extraBed]
 * @property {{perNight:number, nights:number, base:number, discountPct:number, discount:number, extraBed:number, total:number, deposit:number}} [price]
 * @property {{name:string, phone:string, email:string, message:string}} guest
 * @property {string} text           cererea scrisă ca text, gata de trimis pe email
 */

// răspunsurile care nu sunt 2xx devin erori (fereastra arată „Nu am putut trimite cererea”)
async function json(res) {
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}

/** Ce camere sunt libere în perioada aleasă. Fără backend: { rooms: {}, demo: true } = toate apar libere. */
export async function getAvailability({ from, to, guests }) {
  if (!BOOKING_API) return { rooms: {}, demo: true }
  const q = new URLSearchParams({ from, to, guests: String(guests) })
  return json(await fetch(`${BOOKING_API}/availability?${q}`, { headers: { Accept: 'application/json' } }))
}

/**
 * Trimite cererea. Întoarce { mode: 'api', ok, ref } cu backend,
 * sau { mode: 'email', ok: true } fără backend (deschide aplicația de email cu cererea scrisă).
 * @param {BookingPayload} payload
 */
export async function createBooking(payload) {
  if (!BOOKING_API) {
    const subject = payload.subject || 'Cerere de rezervare'
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(payload.text)}`
    return { ok: true, mode: 'email' }
  }
  const res = await fetch(`${BOOKING_API}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await json(res)
  return { mode: 'api', ...data }
}
