import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Img, openBooking } from '../lib.jsx'
import Icon from './Icon.jsx'
import DatePicker, { shortDate, nightsBetween } from './DatePicker.jsx'
import { discountFor } from '../data/content.js'

const SLIDES = [
  { img: 'vara-drona', alt: 'Pensiunea Baciu văzută de sus, vara, cu manejul și pădurea de brazi', cap: 'Pensiunea și manejul, vara' },
  { img: 'iarna-padure', alt: 'Pădurea de brazi înzăpezită, cu pista de bob printre copaci', cap: 'Pista de bob, iarna' },
  { img: 'manej', alt: 'Doi călăreți în manejul pensiunii, cu brazi și cer senin', cap: 'Manejul, cu cei 16 cai' },
  { img: 'bob-vara', alt: 'Pista de bob coborând prin pădure, vara, văzută din dronă', cap: 'Bobul, prin pădure' },
]
const DUR = 7000

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [guests, setGuests] = useState('2')
  const [cal, setCal] = useState(false)
  const ref = useRef(null)
  const barRef = useRef(null)

  // închide calendarul la click în afara barei sau la Escape
  useEffect(() => {
    if (!cal) return
    const out = (e) => barRef.current && !barRef.current.contains(e.target) && setCal(false)
    const key = (e) => e.key === 'Escape' && setCal(false)
    document.addEventListener('pointerdown', out)
    window.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', out)
      window.removeEventListener('keydown', key)
    }
  }, [cal])
  const nights = nightsBetween(from, to)
  const pct = discountFor(nights)

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

        <form className={`bookbar ${cal ? 'is-cal' : ''}`} onSubmit={submit} aria-label="Cerere rapidă de rezervare" ref={barRef}>
          <button type="button" className={`bookbar__f ${cal && !from ? 'is-focus' : ''}`} onClick={() => setCal(true)} aria-expanded={cal} aria-haspopup="dialog">
            <span className="bookbar__l">Sosire</span>
            <span className={`bookbar__v ${from ? '' : 'is-empty'}`}>{from ? shortDate(from) : 'Alege data'}</span>
          </button>
          <button type="button" className={`bookbar__f ${cal && from && !to ? 'is-focus' : ''}`} onClick={() => setCal(true)} aria-expanded={cal} aria-haspopup="dialog">
            <span className="bookbar__l">Plecare</span>
            <span className={`bookbar__v ${to ? '' : 'is-empty'}`}>{to ? shortDate(to) : 'Alege data'}</span>
          </button>
          <label className="bookbar__f bookbar__f--s">
            <span className="bookbar__l">Persoane</span>
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

          <div className={`bookpop ${cal ? 'is-open' : ''}`} role="dialog" aria-label="Alege perioada" aria-hidden={!cal}>
            {cal && (
              <>
                <DatePicker
                  from={from}
                  to={to}
                  months={2}
                  onChange={({ from: f, to: t }) => {
                    setFrom(f)
                    setTo(t)
                  }}
                />
                <div className="bookpop__foot">
                  <p className="bookpop__sum">
                    {nights > 0 ? (
                      <>
                        <strong>
                          {nights} {nights === 1 ? 'noapte' : 'nopți'}
                        </strong>
                        {pct ? <span> · {pct}% reducere inclusă</span> : <span> · de la 3 nopți ai 6% reducere</span>}
                      </>
                    ) : from ? (
                      'Acum alege ziua plecării'
                    ) : (
                      'Alege ziua sosirii'
                    )}
                  </p>
                  <div className="bookpop__btns">
                    {(from || to) && (
                      <button
                        type="button"
                        className="link"
                        onClick={() => {
                          setFrom('')
                          setTo('')
                        }}
                      >
                        Șterge
                      </button>
                    )}
                    <button type="button" className="btn" onClick={() => setCal(false)} disabled={!!from && !to}>
                      Gata
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
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
