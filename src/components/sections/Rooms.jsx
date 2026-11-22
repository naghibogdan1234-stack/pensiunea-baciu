// Camerele: un carusel orizontal cu cardurile camerelor și un card „Bine de știut”.
// Pe calculator se trage cu mouse-ul (useDragScroll), pe telefon cu degetul; săgețile mută câte un card.
// Apăsarea pe o cameră deschide panoul cu detalii (RoomPanel.jsx). Datele: ROOMS, DISCOUNTS (data/content.js).
import { useEffect, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { Reveal, MaskText } from '../../lib/motion.jsx'
import { openBooking } from '../../events.js'
import { lei } from '../../lib/format.js'
import { EXTRA_BED, DISCOUNTS, STAY } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'
import RoomPanel from './RoomPanel.jsx'

const TEXT = {
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
  },
}

/**
 * Carusel tras cu mouse-ul (pe telefon merge derularea nativă cu degetul).
 * Tragerea pornește după 6 px, ca un click simplu să rămână click. După ce dai drumul, rândul mai
 * alunecă puțin (inerție), apoi CSS-ul (scroll-snap) așază cardul cel mai apropiat.
 * Întoarce un ref `moved`: true dacă ultima apăsare a fost tragere (atunci nu deschidem camera).
 */
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

/** Cardul unei camere din carusel. */
function RoomCard({ room, i, onOpen, dragged }) {
  const txt = useTexts(TEXT)
  return (
    <Reveal as="li" className="rcard" i={i}>
      <button
        type="button"
        className="rcard__btn"
        onClick={() => !dragged.current && onOpen(room.id)}
        aria-label={txt.cardAria(room)}
      >
        <span className="rcard__pic">
          <Img name={room.img} alt="" sizes="(max-width: 760px) 84vw, 40vw" />
          <span className="rcard__more">
            {txt.see} <Icon name="arrow" size={16} />
          </span>
        </span>
        <span className="rcard__txt">
          <span className="rcard__name">{room.name}</span>
          <span className="rcard__meta">
            {txt.meta(room)}
          </span>
          <span className="rcard__price">
            <strong className="num">{lei(room.price)}</strong> {txt.night}
          </span>
        </span>
      </button>
    </Reveal>
  )
}

export default function Rooms() {
  const { ROOMS } = useData()
  const txt = useTexts(TEXT)
  const track = useRef(null)
  const dragged = useDragScroll(track)
  const [progress, setProgress] = useState(0) // cât s-a derulat caruselul, 0 – 1 (bara de sub el)
  const [atStart, setAtStart] = useState(true) // dezactivează săgeata stângă
  const [atEnd, setAtEnd] = useState(false) // dezactivează săgeata dreaptă
  const [openId, setOpenId] = useState(null) // camera deschisă în panou

  useEffect(() => {
    const el = track.current
    if (!el) return
    let raf = 0
    const upd = () => {
      raf = 0
      const max = el.scrollWidth - el.clientWidth
      setProgress(max > 0 ? el.scrollLeft / max : 0)
      setAtStart(el.scrollLeft < 8)
      setAtEnd(el.scrollLeft > max - 8)
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

  // săgețile: un card la stânga (-1) sau la dreapta (+1); 24 = spațiul dintre carduri
  const scrollByCard = (dir) => {
    const el = track.current
    const card = el?.querySelector('.rcard')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' })
  }

  return (
    <section id="camere" className="rooms" aria-labelledby="camere-h">
      <div className="rooms__intro section wrap">
        <MaskText id="camere-h" className="h2" text={txt.h} />
        <div className="rooms__side">
          <Reveal as="p" className="lead" i={1}>
            {txt.lead}
          </Reveal>
          <Reveal as="ul" className="rooms__deals" i={2}>
            {[...DISCOUNTS].reverse().map((d) => (
              <li key={d.nights}>
                <strong>{d.pct}%</strong> {txt.deal(d)}
              </li>
            ))}
          </Reveal>
        </div>
      </div>

      <ul ref={track} className="rooms__track" aria-label={txt.track} data-drag>
        {ROOMS.map((r, i) => (
          <RoomCard key={r.id} room={r} i={i} onOpen={setOpenId} dragged={dragged} />
        ))}
        <Reveal as="li" className="rcard rcard--info" i={3}>
          <div className="rinfo">
            <p className="rinfo__h">{txt.know}</p>
            <ul className="rinfo__list">
              <li>
                <Icon name="clock" size={18} /> {txt.k1}
              </li>
              <li>
                <Icon name="bed" size={18} /> {txt.k2}
              </li>
              <li>
                <Icon name="check" size={18} /> {txt.k3}
              </li>
              <li>
                <Icon name="paw" size={18} /> {txt.k4}
              </li>
            </ul>
            <button type="button" className="btn btn--line rinfo__go" onClick={() => openBooking({ type: 'Cazare' })}>
              {txt.check}
            </button>
          </div>
        </Reveal>
      </ul>

      <div className="rooms__ctrl wrap">
        <div className="rooms__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${0.25 + progress * 0.75})` }} />
        </div>
        <div className="rooms__arrows">
          <button type="button" className="rarrow" onClick={() => scrollByCard(-1)} disabled={atStart} aria-label={txt.prev}>
            <Icon name="left" size={20} />
          </button>
          <button type="button" className="rarrow" onClick={() => scrollByCard(1)} disabled={atEnd} aria-label={txt.next}>
            <Icon name="right" size={20} />
          </button>
        </div>
      </div>

      <RoomPanel id={openId} onClose={() => setOpenId(null)} />
    </section>
  )
}
