// Panoul care intră din dreapta când apeși pe o cameră: pozele camerei, descrierea, dotările
// și un calculator „Câte nopți?” care arată prețul cu reducere. „Alege datele și rezervă” închide
// panoul și deschide rezervarea cu camera deja aleasă.
import { useEffect, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { lei } from '../../lib/format.js'
import { useLockScroll } from '../../lib/scroll.js'
import { openBooking } from '../../events.js'
import { EXTRA_BED, DISCOUNTS, discountFor } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'

const TEXT = {
  ro: {
    close: 'Închide',
    alt0: (r) => `${r.name} la Pensiunea Baciu`,
    alt1: (r) => `Încă o vedere din ${r.name.toLowerCase()}`,
    photos: 'Poze',
    photoN: (k, n) => `Poza ${k} din ${n}`,
    people: 'persoane',
    inRoom: 'În cameră',
    howMany: 'Câte nopți?',
    nightsAria: 'Număr de nopți',
    less: 'O noapte mai puțin',
    more: 'O noapte în plus',
    nights: (n) => `${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    off: (p) => `${p}% reducere`,
    noteOn: 'Reducerea e deja scăzută din total.',
    noteOff: (p) => `De la 3 nopți primești ${p}% reducere.`,
    bed: `Pat suplimentar: ${EXTRA_BED} lei / noapte.`,
    go: 'Alege datele și rezervă',
  },
  en: {
    close: 'Close',
    alt0: (r) => `${r.name} at Pensiunea Baciu`,
    alt1: (r) => `Another view of the ${r.name.toLowerCase()}`,
    photos: 'Photos',
    photoN: (k, n) => `Photo ${k} of ${n}`,
    people: 'guests',
    inRoom: 'In the room',
    howMany: 'How many nights?',
    nightsAria: 'Number of nights',
    less: 'One night less',
    more: 'One night more',
    nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    off: (p) => `${p}% off`,
    noteOn: 'The discount is already taken off the total.',
    noteOff: (p) => `From 3 nights you get ${p}% off.`,
    bed: `Extra bed: ${EXTRA_BED} lei a night.`,
    go: 'Pick dates and book',
  },
}

const MAX_NIGHTS = 14

/** id = camera deschisă (null = panou închis) */
export default function RoomPanel({ id, onClose }) {
  const { ROOMS, AMENITIES } = useData()
  const txt = useTexts(TEXT)
  const open = !!id
  // camera arătată rămâne pe ecran și cât panoul se închide (altfel ar dispărea conținutul în timpul animației)
  const [shownId, setShownId] = useState(id)
  const [photo, setPhoto] = useState(0) // a câta poză a camerei se vede
  const [nights, setNights] = useState(3)
  const closeRef = useRef(null)
  useLockScroll(open)

  useEffect(() => {
    if (id) {
      setShownId(id)
      setPhoto(0)
      // focus pe „Închide” după ce panoul a intrat, pentru tastatură și cititoare de ecran
      setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 380)
    }
  }, [id])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const room = ROOMS.find((r) => r.id === shownId) || ROOMS[0]
  const photos = [room.img, ...(room.more || [])]
  // prețul pentru câte nopți ai ales, cu reducerea de sejur (fără patul suplimentar)
  const pct = discountFor(nights)
  const base = room.price * nights
  const total = base - Math.round((base * pct) / 100)
  const smallestDiscount = DISCOUNTS[DISCOUNTS.length - 1].pct

  return (
    <div className={`drawer rpanel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer__back" onClick={onClose} />
      <aside className="drawer__panel rpanel__panel" role="dialog" aria-modal="true" aria-labelledby="rp-h" data-lenis-prevent>
        <div className="rpanel__pics">
          {photos.map((name, k) => (
            <Img key={name} name={name} alt={k === 0 ? txt.alt0(room) : txt.alt1(room)} sizes="580px" className={k === photo ? 'is-on' : ''} />
          ))}
          <button ref={closeRef} type="button" className="x rpanel__x" onClick={onClose} aria-label={txt.close}>
            <Icon name="close" size={20} />
          </button>
          {photos.length > 1 && (
            <div className="rpanel__dots" role="group" aria-label={txt.photos}>
              {photos.map((name, k) => (
                <button
                  key={name}
                  type="button"
                  className={k === photo ? 'is-on' : ''}
                  aria-label={txt.photoN(k + 1, photos.length)}
                  aria-pressed={k === photo}
                  onClick={() => setPhoto(k)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="rpanel__body">
          <h3 id="rp-h" className="rpanel__name">
            {room.name}
          </h3>
          <ul className="rpanel__meta">
            <li>
              <Icon name="user" size={18} /> {room.guests} {txt.people}
            </li>
            <li>
              <Icon name="bed" size={18} /> {room.beds}
            </li>
          </ul>
          <p className="rpanel__desc">{room.desc}</p>

          <h4 className="rpanel__h">{txt.inRoom}</h4>
          <ul className="rpanel__am">
            {AMENITIES.map((a) => (
              <li key={a.label}>
                <Icon name={a.icon} size={18} />
                {a.label}
              </li>
            ))}
          </ul>

          <div className="rpanel__calc">
            <div className="rpanel__row">
              <span className="rpanel__l">{txt.howMany}</span>
              <div className="step" role="group" aria-label={txt.nightsAria}>
                <button type="button" onClick={() => setNights((v) => Math.max(1, v - 1))} disabled={nights <= 1} aria-label={txt.less}>
                  −
                </button>
                <output className="num" aria-live="polite">
                  {nights}
                </output>
                <button type="button" onClick={() => setNights((v) => Math.min(MAX_NIGHTS, v + 1))} disabled={nights >= MAX_NIGHTS} aria-label={txt.more}>
                  +
                </button>
              </div>
            </div>
            <div className="rpanel__row rpanel__row--sum">
              <span>
                {txt.nights(nights)} × {lei(room.price)}
                {pct > 0 && <em> · {txt.off(pct)}</em>}
              </span>
              <strong className="num">{lei(total)}</strong>
            </div>
            <p className="rpanel__note">
              {pct > 0 ? txt.noteOn : txt.noteOff(smallestDiscount)} {txt.bed}
            </p>
          </div>

          <button
            type="button"
            className="btn rpanel__go"
            onClick={() => {
              onClose()
              // după ce panoul a ieșit, deschidem rezervarea cu camera aleasă
              setTimeout(() => openBooking({ type: 'Cazare', room: room.id }), 320)
            }}
          >
            {txt.go} <Icon name="arrow" size={18} />
          </button>
        </div>
      </aside>
    </div>
  )
}
