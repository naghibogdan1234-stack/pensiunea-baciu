import { useEffect, useRef, useState } from 'react'
import { Img, Reveal, MaskText, openBooking, useMedia } from '../lib.jsx'
import { CONTACT } from '../data/content.js'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    h: 'Ce faci la Baciu',
    winter: 'Iarna: pârtie la ușă, schi și seara, bob printre brazi.',
    summer: 'Vara: cai, bob prin pădure și aer de munte.',
    season: 'Alege anotimpul',
    vara: 'Vara',
    iarna: 'Iarna',
    tariffs: 'Toate tarifele pentru activități',
  },
  en: {
    h: 'Things to do at Baciu',
    winter: 'Winter: the slope at the door, night skiing, a coaster through the firs.',
    summer: 'Summer: horses, a coaster through the forest and mountain air.',
    season: 'Choose the season',
    vara: 'Summer',
    iarna: 'Winter',
    tariffs: 'All activity prices',
  },
}

const defaultSeason = () => {
  const m = new Date().getMonth()
  return m >= 10 || m <= 2 ? 'iarna' : 'vara'
}

function SeasonSwitch({ season, onChange }) {
  const l = useT(L)
  return (
    <div className="season" role="radiogroup" aria-label={l.season} data-active={season}>
      <span className="season__pill" aria-hidden="true" />
      {[
        ['vara', l.vara, 'sun'],
        ['iarna', l.iarna, 'snow'],
      ].map(([k, l, ic]) => (
        <button key={k} type="button" role="radio" aria-checked={season === k} className={season === k ? 'on' : ''} onClick={() => onChange(k)}>
          <Icon name={ic} size={17} /> {l}
        </button>
      ))}
    </div>
  )
}

export default function Activities() {
  const { ACTIVITIES, TARIFFS } = useData()
  const l = useT(L)
  const [season, setSeason] = useState(defaultSeason)
  const list = ACTIVITIES[season]
  const [active, setActive] = useState(0)
  const [tariffs, setTariffs] = useState(false)
  const phone = useMedia('(max-width: 900px)')
  const rows = useRef([])

  useEffect(() => setActive(0), [season])

  // pe ecran lat, rândul din mijlocul ecranului devine activ la scroll
  useEffect(() => {
    if (phone) return
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        }),
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rows.current.forEach((r) => r && io.observe(r))
    return () => io.disconnect()
  }, [season, phone])

  const all = [...ACTIVITIES.vara, ...ACTIVITIES.iarna]
  const tariffsRef = useRef(null)
  const showTariffs = () => {
    setTariffs(true)
    setTimeout(() => {
      const el = tariffsRef.current
      if (el) window.__lenis ? window.__lenis.scrollTo(el, { offset: -90, duration: 1.2 }) : el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }
  const current = list[active] || list[0]

  return (
    <section id="activitati" className="acts" aria-labelledby="act-h">
      <div className="acts__head wrap">
        <div>
          <MaskText id="act-h" className="h2" text={l.h} />
          <Reveal as="p" className="lead acts__lead" i={1}>
            {season === 'iarna' ? l.winter : l.summer}
          </Reveal>
        </div>
        <Reveal i={2}>
          <SeasonSwitch season={season} onChange={setSeason} />
        </Reveal>
      </div>

      <div className="acts__body wrap">
        <div className="acts__photo" aria-hidden="true">
          {all.map((a) => (
            <div key={a.id} className={`acts__img ${a.id === current.id ? 'on' : ''}`}>
              <Img name={a.img} alt="" sizes="(max-width: 900px) 100vw, 42vw" />
            </div>
          ))}
          <p className="acts__tag">{current.tag}</p>
        </div>

        <ol className="acts__list" key={season}>
          {list.map((a, i) => {
            const on = i === active
            return (
              <li
                key={a.id}
                ref={(el) => (rows.current[i] = el)}
                data-i={i}
                className={`act ${on ? 'on' : ''}`}
                style={{ '--i': i }}
                onMouseEnter={() => !phone && setActive(i)}
              >
                <button type="button" className="act__head" aria-expanded={on} onClick={() => setActive(i)}>
                  <span className="act__name">{a.name}</span>
                  <span className="act__tag">{a.tag}</span>
                </button>
                <div className="act__body" aria-hidden={!on}>
                  <div className="act__inner">
                    {phone && (
                      <div className="act__ph">
                        <Img name={a.img} alt={a.alt} sizes="100vw" />
                      </div>
                    )}
                    <p className="act__text">{a.text}</p>
                    <ul className="act__chips">
                      {a.chips.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    {a.note && <p className="act__note">{a.note}</p>}
                    {a.cta && (
                      <div className="act__btns">
                        {a.cta.map(([kind, label, type], k) =>
                          kind === 'call' ? (
                            <a key={k} className={`btn ${k ? 'btn--line' : ''}`} href={CONTACT.phoneHref} tabIndex={on ? 0 : -1}>
                              <Icon name="phone" size={17} /> {label}
                            </a>
                          ) : kind === 'book' ? (
                            <button key={k} type="button" className={`btn ${k ? 'btn--line' : ''}`} tabIndex={on ? 0 : -1} onClick={() => openBooking({ type })}>
                              {label} <Icon name="arrow" size={17} />
                            </button>
                          ) : (
                            <button key={k} type="button" className={`btn ${k ? 'btn--line' : 'btn--line'}`} tabIndex={on ? 0 : -1} onClick={showTariffs}>
                              {label}
                            </button>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="tariffs wrap" ref={tariffsRef}>
        <button type="button" className="tariffs__toggle" aria-expanded={tariffs} aria-controls="tarife" onClick={() => setTariffs((t) => !t)}>
          <span>{l.tariffs}</span>
          <span className={`tariffs__plus ${tariffs ? 'on' : ''}`} aria-hidden="true" />
        </button>
        <div id="tarife" className={`tariffs__panel ${tariffs ? 'is-open' : ''}`} aria-hidden={!tariffs}>
          <div className="tariffs__inner">
            {TARIFFS.map((g) => (
              <div className="tgroup" key={g.title}>
                <h3>{g.title}</h3>
                <p className="tgroup__note">{g.note}</p>
                <ul>
                  {g.rows.map(([n, p]) => (
                    <li key={n}>
                      <span>{n}</span>
                      <span className="num">{p}</span>
                    </li>
                  ))}
                </ul>
                {g.foot && <p className="tgroup__note">{g.foot}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
