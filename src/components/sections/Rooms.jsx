// Camerele: cele trei tipuri, în trei coloane, și dedesubt banda verde „Bine de știut”.
// Apăsarea pe o cameră deschide panoul cu detalii (RoomPanel.jsx). Datele: ROOMS, DISCOUNTS (data/content.js).
import { useState } from 'react'
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
  },
}

/** Cardul unei camere: poza, numele, persoanele și paturile, prețul. Deschide panoul cu detalii. */
function RoomCard({ room, i, onOpen }) {
  const txt = useTexts(TEXT)
  return (
    <Reveal as="li" className="rcard" i={i}>
      <button
        type="button"
        className="rcard__btn"
        onClick={() => onOpen(room.id)}
        aria-label={txt.cardAria(room)}
      >
        <span className="rcard__pic">
          <Img name={room.img} alt="" sizes="(max-width: 760px) 92vw, 32vw" />
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
  const [openId, setOpenId] = useState(null) // camera deschisă în panou

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

      {/* cele trei tipuri de cameră, una lângă alta (pe telefon, una sub alta) */}
      <ul className="rooms__grid wrap" aria-label={txt.track}>
        {ROOMS.map((r, i) => (
          <RoomCard key={r.id} room={r} i={i} onOpen={setOpenId} />
        ))}
      </ul>

      {/* banda verde „Bine de știut”: titlul și butonul în stânga, regulile casei alături */}
      <div className="wrap">
        <Reveal className="rinfo">
          <div className="rinfo__head">
            <h3 className="rinfo__h">{txt.know}</h3>
            <button type="button" className="btn btn--line rinfo__go" onClick={() => openBooking({ type: 'Cazare' })}>
              {txt.check}
            </button>
          </div>
          <ul className="rinfo__list">
            <li>
              <Icon name="clock" size={20} /> {txt.k1}
            </li>
            <li>
              <Icon name="bed" size={20} /> {txt.k2}
            </li>
            <li>
              <Icon name="check" size={20} /> {txt.k3}
            </li>
            <li>
              <Icon name="paw" size={20} /> {txt.k4}
            </li>
          </ul>
        </Reveal>
      </div>

      <RoomPanel id={openId} onClose={() => setOpenId(null)} />
    </section>
  )
}
