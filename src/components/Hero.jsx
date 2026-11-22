import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Img, openBooking } from '../lib.jsx'
import Icon from './Icon.jsx'

const SLIDES = [
  { img: 'vara-drona', alt: 'Pensiunea Baciu văzută de sus, vara, cu manejul și pădurea de brazi', cap: 'Pensiunea și manejul, vara' },
  { img: 'iarna-padure', alt: 'Pădurea de brazi înzăpezită, cu pista de bob printre copaci', cap: 'Pista de bob, iarna' },
  { img: 'manej', alt: 'Doi călăreți în manejul pensiunii, cu brazi și cer senin', cap: 'Manejul, cu cei 16 cai' },
  { img: 'bob-vara', alt: 'Pista de bob coborând prin pădure, vara, văzută din dronă', cap: 'Bobul, prin pădure' },
]
const DUR = 7000

const todayISO = (add = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + add)
  return d.toISOString().slice(0, 10)
}

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [guests, setGuests] = useState('2')
  const ref = useRef(null)

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => setI((v) => (v + 1) % SLIDES.length), DUR)
    return () => clearTimeout(t)
  }, [i, paused])

  // pauză când fila nu e vizibilă
  useEffect(() => {
    const on = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  const submit = (e) => {
    e.preventDefault()
    openBooking({ type: 'Cazare', from, to, people: guests })
  }

  return (
    <section className="hero" id="top" ref={ref} aria-label="Pensiunea Baciu">
      <motion.div className="hero__media" style={{ y }}>
        <div className="hero__open">
          {SLIDES.map((s, n) => (
            <div key={s.img} className={`hero__slide ${n === i ? 'on' : ''}`} aria-hidden={n !== i}>
              <Img name={s.img} alt={s.alt} eager={n === 0} sizes="100vw" />
            </div>
          ))}
        </div>
        <div className="hero__scrim" aria-hidden="true" />
      </motion.div>

      <div className="hero__body wrap">
        <div className="hero__text">
          <h1 className="hero__title" aria-label="Pensiunea Baciu">
            <span className="hero__line">
              <span>Pensiunea</span>
            </span>
            <span className="hero__line">
              <span>Baciu</span>
            </span>
          </h1>
          <p className="hero__sub">Cazare, bucătărie românească și aventură la 850 m, deasupra Topliței.</p>
        </div>

        <form className="bookbar" onSubmit={submit} aria-label="Cerere rapidă de rezervare">
          <label className="bookbar__f">
            <span>Sosire</span>
            <input type="date" value={from} min={todayISO()} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label className="bookbar__f">
            <span>Plecare</span>
            <input type="date" value={to} min={from || todayISO(1)} onChange={(e) => setTo(e.target.value)} />
          </label>
          <label className="bookbar__f bookbar__f--s">
            <span>Persoane</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--brass bookbar__go">
            Vezi prețul <Icon name="arrow" size={18} />
          </button>
        </form>

        <div className="hero__dots" role="group" aria-label="Fotografii">
          <p className="hero__cap" aria-live="polite">
            {SLIDES[i].cap}
          </p>
          <div className="hero__bars">
            {SLIDES.map((s, n) => (
              <button
                key={s.img}
                type="button"
                className={`hero__bar ${n === i ? 'on' : ''} ${n < i ? 'done' : ''}`}
                onClick={() => setI(n)}
                aria-label={`Fotografia ${n + 1}: ${s.cap}`}
                aria-pressed={n === i}
              >
                <span style={{ animationDuration: `${DUR}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
