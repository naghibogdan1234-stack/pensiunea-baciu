import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Img, Reveal, MaskText, openBooking, lei } from '../lib.jsx'
import { ROOMS, AMENITIES, EXTRA_BED } from '../data/content.js'
import Icon from './Icon.jsx'

function RoomFrame({ room, index, count }) {
  const ref = useRef(null)
  // poza se apropie ușor cât timp camera e pe ecran; camera de dedesubt se micșorează când vine următoarea
  const { scrollYProgress: inP } = useScroll({ target: ref, offset: ['start end', 'start start'] })
  const { scrollYProgress: outP } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgScale = useTransform(inP, [0, 1], [1.18, 1.02])
  const last = index === count - 1
  const frameScale = useTransform(outP, [0, 1], [1, last ? 1 : 0.92])
  const dim = useTransform(outP, [0, 1], [0, last ? 0 : 0.55])

  return (
    <article ref={ref} className={`room room--${index}`} style={{ zIndex: index + 1 }} aria-labelledby={`room-${room.id}`}>
      <motion.div className="room__frame" style={{ scale: frameScale }}>
        <motion.div className="room__img" style={{ scale: imgScale }}>
          <Img name={room.img} alt={`${room.name} la Pensiunea Baciu`} sizes="100vw" />
        </motion.div>
        <motion.span className="room__dim" style={{ opacity: dim }} aria-hidden="true" />
        <div className="room__card">
          <h3 id={`room-${room.id}`} className="room__name">
            {room.name}
          </h3>
          <ul className="room__meta">
            <li>
              <Icon name="user" size={18} /> {room.guests} persoane
            </li>
            <li>
              <Icon name="bed" size={18} /> {room.beds}
            </li>
          </ul>
          <p className="room__desc">{room.desc}</p>
          <p className="room__price">
            <strong className="num">{lei(room.price)}</strong>
            <span> / noapte, cu mic dejun</span>
          </p>
          <ul className="room__am">
            {AMENITIES.map(([ic, t]) => (
              <li key={t}>
                <Icon name={ic} size={18} />
                {t}
              </li>
            ))}
          </ul>
          <button type="button" className="btn room__go" onClick={() => openBooking({ type: 'Cazare', room: room.id })}>
            Rezervă camera <Icon name="arrow" size={18} />
          </button>
        </div>
      </motion.div>
    </article>
  )
}

export default function Rooms() {
  return (
    <section id="camere" className="rooms" aria-labelledby="camere-h">
      <div className="rooms__intro section wrap">
        <MaskText id="camere-h" className="h2" text="Camere calde, cu mic dejun inclus" />
        <div className="rooms__side">
          <Reveal as="p" className="lead" i={1}>
            Toate cele 14 camere au baie proprie, smart TV, frigider și WiFi gratuit. Alege camera, iar prețul pentru
            perioada ta îl vezi pe loc, cu reducerile incluse.
          </Reveal>
          <Reveal as="ul" className="rooms__deals" i={2}>
            <li>
              <strong>6%</strong> reducere la 3 nopți
            </li>
            <li>
              <strong>9%</strong> la 4 nopți
            </li>
            <li>
              <strong>12%</strong> la 5 nopți
            </li>
          </Reveal>
        </div>
      </div>
      <div className="rooms__stack">
        {ROOMS.map((r, i) => (
          <RoomFrame key={r.id} room={r} index={i} count={ROOMS.length} />
        ))}
      </div>
      <Reveal as="p" className="rooms__foot wrap small muted">
        Pat suplimentar la cerere: {EXTRA_BED} lei / noapte, fără mic dejun. Rezervarea se confirmă cu un avans de 50%.
        Animalele de companie nu au acces în camere.
      </Reveal>
    </section>
  )
}
