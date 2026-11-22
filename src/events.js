// Evenimentele globale ale site-ului.
//
// Câteva ferestre (rezervarea, paginile legale, setările de cookie-uri) și cortina dintre pagini
// sunt montate o singură dată, în App.jsx. Orice buton de oriunde le deschide trimițând un
// eveniment pe window, așa că nu trebuie pasate funcții prin zece componente.
//
//   eveniment          cine îl ascultă                       cum îl trimiți
//   baciu:book         components/booking/Booking.jsx        openBooking({ type, room, from, to, people })
//   baciu:legal        components/legal/LegalPages.jsx       openLegal('confidentialitate' | 'cookie-uri' | 'termeni')
//   baciu:cookies      components/legal/Consent.jsx          openCookieSettings()
//   baciu:curtain      components/layout/Curtain.jsx         îl trimite router.jsx (navigate) când schimbă pagina

export const EVENTS = {
  book: 'baciu:book',
  legal: 'baciu:legal',
  cookies: 'baciu:cookies',
  curtain: 'baciu:curtain',
}

/**
 * Deschide fereastra de rezervare. Tot ce dai e opțional și doar precompletează formularul:
 *   type    'Cazare' | 'Masă la restaurant' | 'Echitație' | 'Eveniment'
 *   room    id-ul camerei din data/content.js (matrimonial, twin, tripla)
 *   from/to datele, ca 'AAAA-LL-ZZ'
 *   people  numărul de persoane
 * Pentru cazare cu ambele date completate, fereastra sare direct la alegerea camerei.
 */
export function openBooking(prefill = {}) {
  window.dispatchEvent(new CustomEvent(EVENTS.book, { detail: prefill }))
}

/** Deschide o pagină legală peste site. */
export function openLegal(page) {
  window.dispatchEvent(new CustomEvent(EVENTS.legal, { detail: page }))
}

/** Deschide fereastra cu setările de cookie-uri. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(EVENTS.cookies))
}
