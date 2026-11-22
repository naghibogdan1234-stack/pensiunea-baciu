import { Reveal, MaskText, useInViewOnce } from '../lib.jsx'
import { useData } from '../data/index.js'
import { useT, useLang } from '../i18n.jsx'

const L = {
  ro: {
    h: 'Ce spun oaspeții',
    lead: 'Note publice, verificate în noiembrie 2026. Citatele sunt luate din recenzii, cu numele scurtate.',
    of: 'din',
    read: 'Vezi recenziile',
    sub: 'Pe Travelminit, pe criterii',
    pause: 'Recenziile se derulează singure. Treci cu mouse-ul peste ele ca să le oprești.',
  },
  en: {
    h: 'What guests say',
    lead: 'Public ratings, checked in November 2026. Quotes come from reviews, with names shortened.',
    of: 'out of',
    read: 'See the reviews',
    sub: 'On Travelminit, by category',
    pause: 'Reviews scroll on their own. Hover over them to pause.',
  },
}

const STAR = 'M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8Z'
function Row() {
  return (
    <svg viewBox="0 0 120 24" width="110" height="22">
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={STAR} transform={`translate(${k * 24} 0)`} />
      ))}
    </svg>
  )
}
function Stars({ value, of }) {
  const pct = Math.max(0, Math.min(1, value / of)) * 100
  return (
    <span className="stars" aria-hidden="true">
      <span className="stars__base">
        <Row />
      </span>
      <span className="stars__fill" style={{ width: `${pct}%` }}>
        <Row />
      </span>
    </span>
  )
}

function Bar({ label, value, i }) {
  const [ref, inView] = useInViewOnce()
  const lang = useLang()
  return (
    <li ref={ref} className={`sbar ${inView ? 'is-in' : ''}`} style={{ '--i': i }}>
      <span className="sbar__l">{label}</span>
      <span className="sbar__track">
        <span style={{ transform: `scaleX(${inView ? value / 10 : 0})` }} />
      </span>
      <span className="sbar__v num">{value.toLocaleString(lang === 'en' ? 'en-GB' : 'ro-RO', { minimumFractionDigits: 1 })}</span>
    </li>
  )
}

function Quote({ r }) {
  const en = useLang() === 'en'
  return (
    <figure className="quote">
      <blockquote>
        <p>{en ? '“' : '„'}{r.text}”</p>
      </blockquote>
      <figcaption>
        <span className="quote__name">{r.name}</span>
        <span className="quote__meta">
          {r.who}
          {r.date ? ` · ${r.date}` : ''}
        </span>
        <span className="quote__src">
          {r.src}
          {r.score ? <span className="num"> · {r.score}</span> : null}
          {r.tr ? <em> · {r.tr}</em> : null}
        </span>
      </figcaption>
    </figure>
  )
}

export default function Reviews() {
  const { RATINGS, SUBSCORES, REVIEWS } = useData()
  const l = useT(L)
  const lang = useLang()
  return (
    <section id="recenzii" className="reviews section" aria-labelledby="rev-h">
      <div className="reviews__top wrap">
        <div className="reviews__head">
          <MaskText id="rev-h" className="h2" text={l.h} />
          <Reveal as="p" className="lead" i={1}>
            {l.lead}
          </Reveal>
        </div>
        <div className="reviews__scores">
          {RATINGS.map((r, i) => (
            <Reveal key={r.src} className="score" i={i + 1}>
              <p className="score__src">{r.src}</p>
              <p className="score__n">
                <span className="num">{r.score}</span>
                <span className="score__of">
                  {l.of} {r.of}
                </span>
              </p>
              <Stars value={parseFloat(r.score.replace(',', '.'))} of={Number(r.of)} />
              <p className="score__c">
                <span className="num">{r.count.toLocaleString(lang === 'en' ? 'en-GB' : 'ro-RO')}</span> {r.note}
              </p>
              <a className="link score__a" href={r.url} target="_blank" rel="noopener noreferrer">
                {l.read} ↗
              </a>
            </Reveal>
          ))}
          <Reveal className="score score--bars" i={3}>
            <p className="score__src">{l.sub}</p>
            <ul className="sbars">
              {SUBSCORES.map(([k, v], i) => (
                <Bar key={k} label={k} value={v} i={i} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <div className="marquee" aria-label={l.h}>
        <p className="sr-only">{l.pause}</p>
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <div className="marquee__set" key={k} aria-hidden={k === 1}>
              {REVIEWS.map((r, i) => (
                <Quote key={i} r={r} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
