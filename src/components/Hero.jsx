import { useEffect, useMemo, useRef, useState } from 'react'
import { Img, openBooking, useParallax } from '../lib.jsx'
import Icon from './Icon.jsx'
import DatePicker, { shortDate, nightsBetween } from './DatePicker.jsx'
import { discountFor } from '../data/content.js'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'
import { WeatherChip } from './Weather.jsx'

const L = {
  ro: {
    aria: 'Pensiunea Baciu',
    sub: 'Cazare, bucătărie românească și aventură la 850 m, deasupra Topliței.',
    form: 'Cerere rapidă de rezervare',
    in: 'Sosire',
    out: 'Plecare',
    pick: 'Alege data',
    guests: 'Persoane',
    go: 'Vezi prețul',
    period: 'Alege perioada',
    nights: (n) => `${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    disc: (p) => `${p}% reducere inclusă`,
    hint: 'de la 3 nopți ai 6% reducere',
    pickOut: 'Acum alege ziua plecării',
    pickIn: 'Alege ziua sosirii',
    clear: 'Șterge',
    done: 'Gata',
    photos: 'Fotografii',
    photo: (n, c) => `Fotografia ${n}: ${c}`,
  },
  en: {
    aria: 'Pensiunea Baciu',
    sub: 'Rooms, Romanian cooking and adventure at 850 m, above Toplița.',
    form: 'Quick booking request',
    in: 'Arrival',
    out: 'Departure',
    pick: 'Pick a date',
    guests: 'Guests',
    go: 'See the price',
    period: 'Choose your dates',
    nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    disc: (p) => `${p}% discount included`,
    hint: '6% off from 3 nights',
    pickOut: 'Now pick your departure day',
    pickIn: 'Pick your arrival day',
    clear: 'Clear',
    done: 'Done',
    photos: 'Photographs',
    photo: (n, c) => `Photograph ${n}: ${c}`,
  },
}
const DUR = 7000

export default function Hero() {
  const { SLIDES: ALL } = useData()
  // iarna (noiembrie – martie) deschidem cu pădurea înzăpezită, vara cu pensiunea văzută de sus
  const SLIDES = useMemo(() => {
    const m = new Date().getMonth()
    if (!(m >= 10 || m <= 2)) return ALL
    const w = ALL.find((x) => x.img === 'iarna-padure')
    return w ? [w, ...ALL.filter((x) => x !== w)] : ALL
  }, [ALL])
  const l = useT(L)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [guests, setGuests] = useState('2')
  const [cal, setCal] = useState(false)
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

  const [ref, media] = useParallax(18)

  const submit = (e) => {
    e.preventDefault()
    openBooking({ type: 'Cazare', from, to, people: guests })
  }

  return (
    <section className="hero" id="top" ref={ref} aria-label={l.aria}>
      <div className="hero__media" ref={media}>
        <div className="hero__open">
          {SLIDES.map((s, n) => (
            <div key={s.img} className={`hero__slide ${n === i ? 'on' : ''}`} aria-hidden={n !== i}>
              <Img name={s.img} alt={s.alt} eager={n === 0} sizes="100vw" />
            </div>
          ))}
        </div>
        <div className="hero__scrim" aria-hidden="true" />
      </div>

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
          <p className="hero__sub">{l.sub}</p>
        </div>

        <form className={`bookbar ${cal ? 'is-cal' : ''}`} onSubmit={submit} aria-label={l.form} ref={barRef}>
          <button type="button" className={`bookbar__f ${cal && !from ? 'is-focus' : ''}`} onClick={() => setCal(true)} aria-expanded={cal} aria-haspopup="dialog">
            <span className="bookbar__l">{l.in}</span>
            <span className={`bookbar__v ${from ? '' : 'is-empty'}`}>{from ? shortDate(from) : l.pick}</span>
          </button>
          <button type="button" className={`bookbar__f ${cal && from && !to ? 'is-focus' : ''}`} onClick={() => setCal(true)} aria-expanded={cal} aria-haspopup="dialog">
            <span className="bookbar__l">{l.out}</span>
            <span className={`bookbar__v ${to ? '' : 'is-empty'}`}>{to ? shortDate(to) : l.pick}</span>
          </button>
          <label className="bookbar__f bookbar__f--s">
            <span className="bookbar__l">{l.guests}</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--brass bookbar__go">
            {l.go} <Icon name="arrow" size={18} />
          </button>

          <div className={`bookpop ${cal ? 'is-open' : ''}`} role="dialog" aria-label={l.period} aria-hidden={!cal}>
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
                        <strong>{l.nights(nights)}</strong>
                        {pct ? <span> · {l.disc(pct)}</span> : <span> · {l.hint}</span>}
                      </>
                    ) : from ? (
                      l.pickOut
                    ) : (
                      l.pickIn
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
                        {l.clear}
                      </button>
                    )}
                    <button type="button" className="btn" onClick={() => setCal(false)} disabled={!!from && !to}>
                      {l.done}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>

        <WeatherChip />

        <div className="hero__dots" role="group" aria-label={l.photos}>
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
                aria-label={l.photo(n + 1, s.cap)}
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
