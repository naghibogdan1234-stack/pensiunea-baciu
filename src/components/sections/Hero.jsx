// Primul ecran al primei pagini: pozele mari care se schimbă singure, titlul, bara de rezervare rapidă
// (sosire, plecare, persoane → „Vezi prețul”), vremea și barele care arată a câta poză e.
//
// Primul ecran e desenat o dată și în index.html, ca să apară imediat, înainte să se încarce JavaScript-ul.
// Dacă schimbi aici structura sau prima poză, schimb-o și acolo (vezi DEVELOPER.md, „Primul ecran”).
import { useEffect, useMemo, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { openBooking } from '../../events.js'
import { useParallax } from '../../lib/motion.jsx'
import Icon from '../ui/Icon.jsx'
import DatePicker from '../ui/DatePicker.jsx'
import { shortDate, nightsBetween } from '../../lib/format.js'
import { discountFor } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import { WeatherChip } from '../ui/Weather.jsx'

const TEXT = {
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
const SLIDE_TIME = 7000 // cât stă fiecare poză, în ms (bara de progres folosește aceeași durată)
const SWIPE_TIME = 420 // cât durează trecerea la poza următoare după ce ridici degetul

/**
 * Pe telefon și tabletă, pozele se schimbă trăgând cu degetul la stânga sau la dreapta.
 * Poza urmează degetul, iar cea următoare (sau anterioară) intră din lateral. Dacă ai tras peste 20% din
 * lățime sau repede, rămâne poza nouă; altfel revin amândouă la loc. Derularea paginii în sus și în jos
 * rămâne a browserului (touch-action: pan-y pe .hero, în CSS).
 *
 * În timpul tragerii, pozele se mișcă direct din stil (fără React), ca să țină pasul cu degetul.
 * La final se schimbă poza în React (setSlide) și se șterg stilurile puse aici.
 * Întoarce handler-ele de pus pe secțiune și `holding` (true cât e degetul pe ecran: oprește trecerea automată).
 */
function useSwipeSlides(count, slide, setSlide) {
  const slides = useRef([]) // elementele .hero__slide, în ordine
  const gesture = useRef(null) // tragerea în curs
  const cleanup = useRef(null) // ce rămâne de șters după ce React a schimbat poza
  const [holding, setHolding] = useState(false)

  // ascunde imediat o poză și îi scoate stilurile puse de mână, fără să se vadă o tranziție
  const reset = (el, hidden) => {
    if (!el) return
    el.style.transition = 'none'
    el.style.transform = ''
    el.style.opacity = hidden ? '0' : ''
    requestAnimationFrame(() => {
      el.style.transition = ''
      el.style.opacity = ''
    })
  }
  // după ce React a mutat clasa .on pe poza nouă, curățăm
  useEffect(() => {
    cleanup.current?.()
    cleanup.current = null
  }, [slide])

  const onTouchStart = (e) => {
    if (e.touches.length !== 1 || e.target.closest('.bookbar, .bookpop') || gesture.current?.settling) return
    const t = e.touches[0]
    gesture.current = { x: t.clientX, y: t.clientY, time: performance.now(), axis: null, dx: 0, neighbor: null }
  }

  const onTouchMove = (e) => {
    const g = gesture.current
    if (!g || g.settling) return
    const t = e.touches[0]
    const dx = t.clientX - g.x
    const dy = t.clientY - g.y
    // la primii 8 px aflăm direcția: pe verticală lăsăm pagina să se deruleze
    if (!g.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (g.axis === 'x') setHolding(true)
    }
    if (g.axis !== 'x') return
    const current = slides.current[slide]
    const width = current.offsetWidth
    const neighbor = (slide + (dx < 0 ? 1 : -1) + count) % count
    if (g.neighbor !== null && g.neighbor !== neighbor) reset(slides.current[g.neighbor], true) // a schimbat sensul
    g.neighbor = neighbor
    g.dx = dx
    const next = slides.current[neighbor]
    current.style.transition = 'none'
    current.style.transform = `translate3d(${dx}px, 0, 0)`
    next.style.transition = 'none'
    next.style.opacity = '1'
    next.style.transform = `translate3d(${dx < 0 ? width + dx : -width + dx}px, 0, 0)`
  }

  const onTouchEnd = () => {
    const g = gesture.current
    if (!g || g.settling) return
    if (g.axis !== 'x' || g.neighbor === null) {
      gesture.current = null
      setHolding(false)
      return
    }
    const current = slides.current[slide]
    const next = slides.current[g.neighbor]
    const width = current.offsetWidth
    const speed = Math.abs(g.dx) / (performance.now() - g.time) // px pe ms
    const commit = Math.abs(g.dx) > width * 0.2 || (speed > 0.4 && Math.abs(g.dx) > 20)
    const dir = g.dx < 0 ? -1 : 1
    const move = `transform ${SWIPE_TIME}ms var(--ease-out)`
    current.style.transition = move
    next.style.transition = move
    g.settling = true
    if (commit) {
      current.style.transform = `translate3d(${dir * width}px, 0, 0)`
      next.style.transform = 'translate3d(0, 0, 0)'
    } else {
      current.style.transform = 'translate3d(0, 0, 0)'
      next.style.transform = `translate3d(${-dir * width}px, 0, 0)`
    }
    setTimeout(() => {
      gesture.current = null
      setHolding(false)
      if (commit) {
        cleanup.current = () => {
          reset(current, true)
          reset(next, false)
        }
        setSlide(g.neighbor)
      } else {
        reset(current, false)
        reset(next, true)
      }
    }, SWIPE_TIME)
  }

  const slideRef = (n) => (el) => {
    slides.current[n] = el
  }
  return { slideRef, holding, handlers: { onTouchStart, onTouchMove, onTouchEnd, onTouchCancel: onTouchEnd } }
}

export default function Hero() {
  const { SLIDES: ALL_SLIDES } = useData()
  // iarna (noiembrie – martie) deschidem cu pădurea înzăpezită, vara cu pensiunea văzută de sus.
  // Aceeași regulă e și în scriptul din index.html, ca prima poză să nu se schimbe la pornire.
  const SLIDES = useMemo(() => {
    const month = new Date().getMonth()
    const winter = month >= 10 || month <= 2
    if (!winter) return ALL_SLIDES
    const first = ALL_SLIDES.find((x) => x.img === 'iarna-padure')
    return first ? [first, ...ALL_SLIDES.filter((x) => x !== first)] : ALL_SLIDES
  }, [ALL_SLIDES])
  const txt = useTexts(TEXT)
  const [slide, setSlide] = useState(0) // poza arătată
  const [paused, setPaused] = useState(false) // pauză cât fila browserului nu e vizibilă
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [guests, setGuests] = useState('2')
  const [calendarOpen, setCalendarOpen] = useState(false)
  const barRef = useRef(null)

  // închide calendarul la click în afara barei sau la Escape
  useEffect(() => {
    if (!calendarOpen) return
    const out = (e) => barRef.current && !barRef.current.contains(e.target) && setCalendarOpen(false)
    const key = (e) => e.key === 'Escape' && setCalendarOpen(false)
    document.addEventListener('pointerdown', out)
    window.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', out)
      window.removeEventListener('keydown', key)
    }
  }, [calendarOpen])
  const nights = nightsBetween(from, to)
  const pct = discountFor(nights)

  const swipe = useSwipeSlides(SLIDES.length, slide, setSlide)

  // următoarea poză după SLIDE_TIME (pornește din nou la fiecare schimbare, la click pe o bară și după swipe)
  useEffect(() => {
    if (paused || swipe.holding) return
    const t = setTimeout(() => setSlide((v) => (v + 1) % SLIDES.length), SLIDE_TIME)
    return () => clearTimeout(t)
  }, [slide, paused, swipe.holding, SLIDES.length])

  // pauză când fila nu e vizibilă
  useEffect(() => {
    const on = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', on)
    return () => document.removeEventListener('visibilitychange', on)
  }, [])

  const [ref, media] = useParallax(18) // pozele coboară mai încet decât pagina

  // „Vezi prețul”: deschide rezervarea cu ce s-a ales aici (sare direct la camere dacă sunt ambele date)
  const submit = (e) => {
    e.preventDefault()
    openBooking({ type: 'Cazare', from, to, people: guests })
  }

  return (
    <section className="hero" id="top" ref={ref} aria-label={txt.aria} {...swipe.handlers}>
      <div className="hero__media" ref={media}>
        <div className="hero__open">
          {SLIDES.map((s, n) => (
            <div key={s.img} ref={swipe.slideRef(n)} className={`hero__slide ${n === slide ? 'on' : ''}`} aria-hidden={n !== slide}>
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
          <p className="hero__sub">{txt.sub}</p>
        </div>

        <form className={`bookbar ${calendarOpen ? 'is-cal' : ''}`} onSubmit={submit} aria-label={txt.form} ref={barRef}>
          <button type="button" className={`bookbar__f ${calendarOpen && !from ? 'is-focus' : ''}`} onClick={() => setCalendarOpen(true)} aria-expanded={calendarOpen} aria-haspopup="dialog">
            <span className="bookbar__l">{txt.in}</span>
            <span className={`bookbar__v ${from ? '' : 'is-empty'}`}>{from ? shortDate(from) : txt.pick}</span>
          </button>
          <button type="button" className={`bookbar__f ${calendarOpen && from && !to ? 'is-focus' : ''}`} onClick={() => setCalendarOpen(true)} aria-expanded={calendarOpen} aria-haspopup="dialog">
            <span className="bookbar__l">{txt.out}</span>
            <span className={`bookbar__v ${to ? '' : 'is-empty'}`}>{to ? shortDate(to) : txt.pick}</span>
          </button>
          <label className="bookbar__f bookbar__f--s">
            <span className="bookbar__l">{txt.guests}</span>
            <select value={guests} onChange={(e) => setGuests(e.target.value)}>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn--brass bookbar__go">
            {txt.go} <Icon name="arrow" size={18} />
          </button>

          {/* calendarul care se deschide sub bară */}
          <div className={`bookpop ${calendarOpen ? 'is-open' : ''}`} role="dialog" aria-label={txt.period} aria-hidden={!calendarOpen}>
            {calendarOpen && (
              <>
                <DatePicker
                  from={from}
                  to={to}
                  months={2}
                  onChange={(range) => {
                    setFrom(range.from)
                    setTo(range.to)
                  }}
                />
                <div className="bookpop__foot">
                  <p className="bookpop__sum">
                    {nights > 0 ? (
                      <>
                        <strong>{txt.nights(nights)}</strong>
                        {pct ? <span> · {txt.disc(pct)}</span> : <span> · {txt.hint}</span>}
                      </>
                    ) : from ? (
                      txt.pickOut
                    ) : (
                      txt.pickIn
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
                        {txt.clear}
                      </button>
                    )}
                    <button type="button" className="btn" onClick={() => setCalendarOpen(false)} disabled={!!from && !to}>
                      {txt.done}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </form>

        <WeatherChip />

        {/* textul pozei și barele de progres; un click pe bară arată poza ei */}
        <div className="hero__dots" role="group" aria-label={txt.photos}>
          <p className="hero__cap" aria-live="polite">
            {SLIDES[slide].cap}
          </p>
          <div className="hero__bars">
            {SLIDES.map((s, n) => (
              <button
                key={s.img}
                type="button"
                className={`hero__bar ${n === slide ? 'on' : ''} ${n < slide ? 'done' : ''}`}
                onClick={() => setSlide(n)}
                aria-label={txt.photo(n + 1, s.cap)}
                aria-pressed={n === slide}
              >
                <span style={{ animationDuration: `${SLIDE_TIME}ms`, animationPlayState: paused ? 'paused' : 'running' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
