import { useEffect, useRef, useState } from 'react'
import { Img, Reveal, MaskText, openBooking, lei, useLockScroll } from '../lib.jsx'
import { EXTRA_BED, DISCOUNTS, STAY, discountFor } from '../data/content.js'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    h: 'Camere calde, cu mic dejun inclus',
    lead: 'Toate cele 14 camere au baie proprie, smart TV, frigider și WiFi gratuit. Alege o cameră ca să vezi pozele și prețul pentru câte nopți stai.',
    deal: (d) => (d.nights === 5 ? 'reducere de la 5 nopți' : `reducere la ${d.nights} nopți`),
    cardAria: (r) => `${r.name}, ${r.price} lei pe noapte. Vezi detalii`,
    see: 'Vezi camera',
    meta: (r) => `${r.guests} persoane · ${r.beds.toLowerCase()}`,
    night: '/ noapte, cu mic dejun',
    track: 'Camerele pensiunii',
    know: 'Bine de știut',
    k1: `Check-in de la ${STAY.checkIn}, check-out până la ${STAY.checkOut}`,
    k2: `Pat suplimentar la cerere, ${EXTRA_BED} lei / noapte, fără mic dejun`,
    k3: 'Rezervarea se confirmă cu un avans de 50%',
    k4: 'Animalele de companie nu au acces în camere',
    check: 'Verifică datele libere',
    prev: 'Camera anterioară',
    next: 'Camera următoare',
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
    h: 'Warm rooms, breakfast included',
    lead: 'All 14 rooms have a private bathroom, smart TV, fridge and free WiFi. Open a room to see the photos and the price for your stay.',
    deal: (d) => (d.nights === 5 ? 'off from 5 nights' : `off for ${d.nights} nights`),
    cardAria: (r) => `${r.name}, ${r.price} lei a night. See details`,
    see: 'See the room',
    meta: (r) => `${r.guests} guests · ${r.beds.toLowerCase()}`,
    night: 'a night, with breakfast',
    track: 'The guesthouse rooms',
    know: 'Good to know',
    k1: `Check-in from ${STAY.checkIn}, check-out by ${STAY.checkOut}`,
    k2: `Extra bed on request, ${EXTRA_BED} lei a night, without breakfast`,
    k3: 'Bookings are confirmed with a 50% deposit',
    k4: 'Pets are not allowed in the rooms',
    check: 'Check availability',
    prev: 'Previous room',
    next: 'Next room',
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

/* ---------- caruselul: scroll nativ + tras cu mouse-ul pe desktop ---------- */
function useDragScroll(ref) {
  const moved = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let down = false
    let x0 = 0
    let s0 = 0
    let last = 0
    let lastT = 0
    let v = 0
    let raf = 0
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      cancelAnimationFrame(raf)
      down = true
      moved.current = false
      x0 = e.clientX
      s0 = el.scrollLeft
      last = e.clientX
      lastT = performance.now()
      v = 0
    }
    const onMove = (e) => {
      if (!down) return
      const dx = e.clientX - x0
      if (!moved.current && Math.abs(dx) > 6) {
        moved.current = true
        el.classList.add('is-drag')
        el.setPointerCapture(e.pointerId)
      }
      if (!moved.current) return
      el.scrollLeft = s0 - dx
      const t = performance.now()
      v = (e.clientX - last) / Math.max(1, t - lastT)
      last = e.clientX
      lastT = t
    }
    const onUp = () => {
      if (!down) return
      down = false
      el.classList.remove('is-drag')
      // inerție scurtă, apoi lăsăm scroll-snap să așeze cardul
      let vel = -v * 16
      const step = () => {
        if (Math.abs(vel) < 0.6) {
          el.classList.remove('is-coast')
          return
        }
        el.scrollLeft += vel
        vel *= 0.92
        raf = requestAnimationFrame(step)
      }
      if (moved.current && Math.abs(vel) > 2) {
        el.classList.add('is-coast')
        raf = requestAnimationFrame(step)
      }
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
    }
  }, [ref])
  return moved
}

function RoomCard({ room, i, onOpen, dragged }) {
  const l = useT(L)
  return (
    <Reveal as="li" className="rcard" i={i}>
      <button
        type="button"
        className="rcard__btn"
        onClick={() => !dragged.current && onOpen(room.id)}
        aria-label={l.cardAria(room)}
      >
        <span className="rcard__pic">
          <Img name={room.img} alt="" sizes="(max-width: 760px) 84vw, 40vw" />
          <span className="rcard__more">
            {l.see} <Icon name="arrow" size={16} />
          </span>
        </span>
        <span className="rcard__txt">
          <span className="rcard__name">{room.name}</span>
          <span className="rcard__meta">
            {l.meta(room)}
          </span>
          <span className="rcard__price">
            <strong className="num">{lei(room.price)}</strong> {l.night}
          </span>
        </span>
      </button>
    </Reveal>
  )
}

/* ---------- panoul cu detaliile camerei ---------- */
function RoomPanel({ id, onClose }) {
  const { ROOMS, AMENITIES } = useData()
  const l = useT(L)
  const open = !!id
  const [shown, setShown] = useState(id)
  const [pic, setPic] = useState(0)
  const [n, setN] = useState(3)
  const closeRef = useRef(null)
  useLockScroll(open)

  useEffect(() => {
    if (id) {
      setShown(id)
      setPic(0)
      setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 380)
    }
  }, [id])
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open, onClose])

  const room = ROOMS.find((r) => r.id === shown) || ROOMS[0]
  const pics = [room.img, ...(room.more || [])]
  const pct = discountFor(n)
  const base = room.price * n
  const total = base - Math.round((base * pct) / 100)

  return (
    <div className={`drawer rpanel ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer__back" onClick={onClose} />
      <aside className="drawer__panel rpanel__panel" role="dialog" aria-modal="true" aria-labelledby="rp-h" data-lenis-prevent>
        <div className="rpanel__pics">
          {pics.map((p, k) => (
            <Img
              key={p}
              name={p}
              alt={k === 0 ? l.alt0(room) : l.alt1(room)}
              sizes="580px"
              className={k === pic ? 'is-on' : ''}
            />
          ))}
          <button ref={closeRef} type="button" className="x rpanel__x" onClick={onClose} aria-label={l.close}>
            <Icon name="close" size={20} />
          </button>
          {pics.length > 1 && (
            <div className="rpanel__dots" role="group" aria-label={l.photos}>
              {pics.map((p, k) => (
                <button
                  key={p}
                  type="button"
                  className={k === pic ? 'is-on' : ''}
                  aria-label={l.photoN(k + 1, pics.length)}
                  aria-pressed={k === pic}
                  onClick={() => setPic(k)}
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
              <Icon name="user" size={18} /> {room.guests} {l.people}
            </li>
            <li>
              <Icon name="bed" size={18} /> {room.beds}
            </li>
          </ul>
          <p className="rpanel__desc">{room.desc}</p>

          <h4 className="rpanel__h">{l.inRoom}</h4>
          <ul className="rpanel__am">
            {AMENITIES.map(([ic, t]) => (
              <li key={t}>
                <Icon name={ic} size={18} />
                {t}
              </li>
            ))}
          </ul>

          <div className="rpanel__calc">
            <div className="rpanel__row">
              <span className="rpanel__l">{l.howMany}</span>
              <div className="step" role="group" aria-label={l.nightsAria}>
                <button type="button" onClick={() => setN((v) => Math.max(1, v - 1))} disabled={n <= 1} aria-label={l.less}>
                  −
                </button>
                <output className="num" aria-live="polite">
                  {n}
                </output>
                <button type="button" onClick={() => setN((v) => Math.min(14, v + 1))} disabled={n >= 14} aria-label={l.more}>
                  +
                </button>
              </div>
            </div>
            <div className="rpanel__row rpanel__row--sum">
              <span>
                {l.nights(n)} × {lei(room.price)}
                {pct > 0 && <em> · {l.off(pct)}</em>}
              </span>
              <strong className="num">{lei(total)}</strong>
            </div>
            <p className="rpanel__note">
              {pct > 0 ? l.noteOn : l.noteOff(DISCOUNTS[DISCOUNTS.length - 1].pct)} {l.bed}
            </p>
          </div>

          <button
            type="button"
            className="btn rpanel__go"
            onClick={() => {
              onClose()
              setTimeout(() => openBooking({ type: 'Cazare', room: room.id }), 320)
            }}
          >
            {l.go} <Icon name="arrow" size={18} />
          </button>
        </div>
      </aside>
    </div>
  )
}

export default function Rooms() {
  const { ROOMS } = useData()
  const l = useT(L)
  const track = useRef(null)
  const dragged = useDragScroll(track)
  const [prog, setProg] = useState(0)
  const [ends, setEnds] = useState([true, false])
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    const upd = () => {
      raf = 0
      const max = el.scrollWidth - el.clientWidth
      const p = max > 0 ? el.scrollLeft / max : 0
      setProg(p)
      setEnds([el.scrollLeft < 8, el.scrollLeft > max - 8])
      // pozele alunecă puțin în cadru cât timp rândul se mișcă
      el.querySelectorAll('.rcard__pic img').forEach((img) => {
        const r = img.parentElement.getBoundingClientRect()
        const c = (r.left + r.width / 2 - window.innerWidth / 2) / window.innerWidth
        img.style.transform = `translateX(${(-c * 6).toFixed(2)}%) scale(1.12)`
      })
    }
    const on = () => raf || (raf = requestAnimationFrame(upd))
    upd()
    el.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('scroll', on)
      window.removeEventListener('resize', on)
    }
  }, [])

  const by = (dir) => {
    const el = track.current
    const card = el?.querySelector('.rcard')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' })
  }

  return (
    <section id="camere" className="rooms" aria-labelledby="camere-h">
      <div className="rooms__intro section wrap">
        <MaskText id="camere-h" className="h2" text={l.h} />
        <div className="rooms__side">
          <Reveal as="p" className="lead" i={1}>
            {l.lead}
          </Reveal>
          <Reveal as="ul" className="rooms__deals" i={2}>
            {[...DISCOUNTS].reverse().map((d) => (
              <li key={d.nights}>
                <strong>{d.pct}%</strong> {l.deal(d)}
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      <ul ref={track} className="rooms__track" aria-label={l.track}>
        {ROOMS.map((r, i) => (
          <RoomCard key={r.id} room={r} i={i} onOpen={setOpenId} dragged={dragged} />
        ))}
        <Reveal as="li" className="rcard rcard--info" i={3}>
          <div className="rinfo">
            <p className="rinfo__h">{l.know}</p>
            <ul className="rinfo__list">
              <li>
                <Icon name="clock" size={18} /> {l.k1}
              </li>
              <li>
                <Icon name="bed" size={18} /> {l.k2}
              </li>
              <li>
                <Icon name="check" size={18} /> {l.k3}
              </li>
              <li>
                <Icon name="paw" size={18} /> {l.k4}
              </li>
            </ul>
            <button type="button" className="btn btn--line rinfo__go" onClick={() => openBooking({ type: 'Cazare' })}>
              {l.check}
            </button>
          </div>
        </Reveal>
      </ul>

      <div className="rooms__ctrl wrap">
        <div className="rooms__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.25 + prog * 0.75})` }} />
        </div>
        <div className="rooms__arrows">
          <button type="button" className="rarrow" onClick={() => by(-1)} disabled={ends[0]} aria-label={l.prev}>
            <Icon name="left" size={20} />
          </button>
          <button type="button" className="rarrow" onClick={() => by(1)} disabled={ends[1]} aria-label={l.next}>
            <Icon name="right" size={20} />
          </button>
        </div>
      </div>

      <RoomPanel id={openId} onClose={() => setOpenId(null)} />
    </section>
  )
}
