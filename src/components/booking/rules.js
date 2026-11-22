// Regulile rezervării, fără nimic de afișat: ce se poate rezerva, ce pași are fiecare tip, ce ore
// se propun, cum se calculează prețul și ce se trimite la backend. Folosite de Booking.jsx și steps.jsx.
import { EXTRA_BED, discountFor } from '../../data/content.js'
import { fromISO, longDate, lei } from '../../lib/format.js'

// Ce se poate rezerva. Valorile rămân în română în orice limbă: așa le primesc pensiunea și backend-ul.
// Etichetele traduse sunt în texts.js (types).
export const TYPES = ['Cazare', 'Masă la restaurant', 'Echitație', 'Eveniment']
export const isStay = (type) => type === 'Cazare'

// Pașii, în ordine. Cazarea are calendar cu interval și alegerea camerei; restul au o singură zi și o oră.
export const FLOW = {
  stay: ['dates', 'room', 'you', 'check'],
  other: ['details', 'you', 'check'],
}

// Formularul gol. `people` e pentru masă și eveniment; la cazare și călărie se folosesc adults + children.
export const BLANK_FORM = {
  type: 'Cazare',
  from: '', // AAAA-LL-ZZ: sosirea sau ziua aleasă
  to: '', // AAAA-LL-ZZ: plecarea (doar la cazare)
  time: '', // HH:MM (masă, călărie)
  adults: 2,
  children: 0,
  people: 2,
  room: '', // id-ul camerei din data/content.js
  extra: false, // pat suplimentar cerut de vizitator (se pune și singur, dacă sunt prea mulți pentru cameră)
  name: '',
  phone: '',
  email: '',
  msg: '',
  agree: false, // a bifat politica de confidențialitate și termenii
}

// Câte persoane se pot alege: adulți 1–6; copii 0–4 la cazare, 0–6 la călărie;
// la masă cel mult 12 din butoane (grupurile mari sună), la eveniment cel puțin 30.
export const LIMITS = { adults: [1, 6], stayChildren: [0, 4], rideChildren: [0, 6], otherMax: 12, eventMin: 30 }

/** când se schimbă tipul, numărul de persoane se potrivește (un eveniment are cel puțin 30) */
export const peopleForType = (type, people) => (type === 'Eveniment' ? Math.max(people, LIMITS.eventMin) : Math.min(people, LIMITS.otherMax))

const isWeekend = (iso) => [0, 6].includes(fromISO(iso).getDay())

/**
 * Orele propuse, după programul pensiunii:
 *   restaurant  12:00 – 21:00, din jumătate în jumătate de oră
 *   călărie     10:00 – 14:00 în timpul săptămânii, până la 16:00 în weekend (ultima plecare)
 *   eveniment   fără oră (se stabilește la telefon)
 */
export function timesFor(type, day) {
  const out = []
  if (type === 'Masă la restaurant') for (let h = 12; h <= 21; h++) out.push(`${h}:00`, ...(h < 21 ? [`${h}:30`] : []))
  if (type === 'Echitație') {
    const last = day && isWeekend(day) ? 16 : 14
    for (let h = 10; h <= last; h++) out.push(`${h}:00`)
  }
  return out
}

/** încap aceste persoane în cameră? (cel mult una în plus, pe patul suplimentar) */
export const fitsRoom = (room, guests) => guests <= room.guests + 1

/**
 * Prețul unei cazări, așa cum îl vede vizitatorul. E doar o estimare: prețul final îl confirmă pensiunea.
 *   perNight  prețul camerei (din backend, dacă l-a trimis, altfel din data/content.js)
 *   base      perNight × nopți
 *   pct       reducerea de sejur (DISCOUNTS), discount = cât se scade
 *   bedOn     patul suplimentar: cerut de vizitator sau pus singur, dacă sunt mai mulți decât încap
 *   total     base − discount + patul suplimentar; deposit = 50% din total
 */
export function priceFor({ room, nights, guests, extra = false, perNight }) {
  const pct = discountFor(nights)
  const base = perNight * nights
  const discount = Math.round((base * pct) / 100)
  const bedOn = extra || guests > room.guests
  const bed = bedOn ? EXTRA_BED * nights : 0
  const total = base - discount + bed
  return { perNight, nights, base, pct, discount, bedOn, bed, total, deposit: Math.round(total / 2) }
}

/** prețul cât timp nu e aleasă camera: doar reducerea (pentru textul de sub calendar), restul 0 */
export const noRoomPrice = (nights) => ({ perNight: 0, nights, base: 0, pct: discountFor(nights), discount: 0, bedOn: false, bed: 0, total: 0, deposit: 0 })

/** data lungă, în limba vizitatorului: „dum., 27 decembrie 2026” */
export const fmt = (iso, lang) => longDate(iso, lang)

/**
 * Cererea scrisă ca text: e corpul email-ului (când nu există backend) și câmpul `text` din payload.
 * Rândurile goale despart salutul, detaliile, mesajul și datele de contact.
 */
export function requestText({ form, txt, lang, nights, room, price, peopleText }) {
  const stay = isStay(form.type)
  return [
    txt.mailIntro,
    '',
    txt.mailWant(txt.types[form.type]),
    stay ? txt.mailStay(fmt(form.from, lang), fmt(form.to, lang), txt.nights(nights)) : txt.mailDate(fmt(form.from, lang), form.time),
    txt.mailPeople(peopleText),
    stay && room ? txt.mailRoom(room.name, price.bedOn) : null,
    stay && room ? txt.mailPrice(lei(price.total), price.pct) : null,
    form.msg ? '' : null,
    form.msg || null,
    '',
    `${txt.mailName}: ${form.name}`,
    `${txt.mailPhone}: ${form.phone}`,
    form.email ? `${txt.mailEmail}: ${form.email}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

/** Ce primește backend-ul (POST /bookings). Forma exactă e descrisă în src/api/booking.js (BookingPayload). */
export function bookingPayload({ form, txt, lang, nights, price, text }) {
  const stay = isStay(form.type)
  const countsAdults = stay || form.type === 'Echitație' // la masă și eveniment avem doar „persoane”
  return {
    type: form.type,
    lang,
    from: form.from,
    to: stay ? form.to : undefined,
    time: form.time || undefined,
    adults: countsAdults ? form.adults : form.people,
    children: countsAdults ? form.children : 0,
    room: stay ? form.room : undefined,
    extraBed: stay ? price.bedOn : undefined,
    price: stay
      ? {
          perNight: price.perNight,
          nights,
          base: price.base,
          discountPct: price.pct,
          discount: price.discount,
          extraBed: price.bed,
          total: price.total,
          deposit: price.deposit,
        }
      : undefined,
    guest: { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), message: form.msg.trim() },
    text,
    subject: txt.mailSubject(txt.types[form.type], form.name.trim()),
  }
}
