// „Ce faci la Baciu”: activitățile, pe anotimp (vara / iarna), plus lista cu toate tarifele.
//
// Pe ecran lat: poza din stânga stă pe loc, iar activitatea din mijlocul ecranului devine activă
// pe măsură ce derulezi (sau când treci cu mouse-ul peste ea). Pe telefon fiecare activitate are poza ei
// și se deschide la apăsare. Datele (texte, prețuri, butoane) sunt în ACTIVITIES și TARIFFS, în data/content.js.
import { useEffect, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { Reveal, MaskText } from '../../lib/motion.jsx'
import { useMedia } from '../../lib/hooks.js'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'
import CtaButton from '../ui/CtaButton.jsx'

const TEXT = {
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

// anotimpul arătat la început: iarna din noiembrie până în martie
const defaultSeason = () => {
  const m = new Date().getMonth()
  return m >= 10 || m <= 2 ? 'iarna' : 'vara'
}

/** Comutatorul Vara / Iarna; bulina (season__pill) alunecă sub opțiunea aleasă, din CSS (data-active). */
function SeasonSwitch({ season, onChange }) {
  const txt = useTexts(TEXT)
  return (
    <div className="season" role="radiogroup" aria-label={txt.season} data-active={season}>
      <span className="season__pill" aria-hidden="true" />
      {[
        ['vara', txt.vara, 'sun'],
        ['iarna', txt.iarna, 'snow'],
      ].map(([key, label, icon]) => (
        <button key={key} type="button" role="radio" aria-checked={season === key} className={season === key ? 'on' : ''} onClick={() => onChange(key)}>
          <Icon name={icon} size={17} /> {label}
        </button>
      ))}
    </div>
  )
}

export default function Activities() {
  const { ACTIVITIES, TARIFFS } = useData()
  const txt = useTexts(TEXT)
  const [season, setSeason] = useState(defaultSeason)
  const list = ACTIVITIES[season]
  const [active, setActive] = useState(0) // a câta activitate din listă e deschisă
  const [tariffsOpen, setTariffsOpen] = useState(false)
  const phone = useMedia('(max-width: 900px)')
  const rows = useRef([])

  // la schimbarea anotimpului, se deschide prima activitate
  useEffect(() => setActive(0), [season])

  // pe ecran lat, activitatea care trece prin mijlocul ecranului devine activă la scroll
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

  // pozele tuturor activităților stau una peste alta; se vede doar cea activă (trecere lină între ele)
  const all = [...ACTIVITIES.vara, ...ACTIVITIES.iarna]
  const tariffsRef = useRef(null)
  // butonul „Toate tarifele” dintr-o activitate: deschide lista și coboară la ea
  const showTariffs = () => {
    setTariffsOpen(true)
    setTimeout(() => {
      const el = tariffsRef.current
      if (!el) return
      if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90, duration: 1.2 })
      else el.scrollIntoView({ behavior: 'smooth' })
    }, 80)
  }
  const current = list[active] || list[0]

  return (
    <section id="activitati" className="acts" aria-labelledby="act-h">
      <div className="acts__head wrap">
        <div>
          <MaskText id="act-h" className="h2" text={txt.h} />
          <Reveal as="p" className="lead acts__lead" i={1}>
            {season === 'iarna' ? txt.winter : txt.summer}
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
                        {/* primul buton e plin, restul cu contur; „Toate tarifele” e mereu cu contur */}
                        {a.cta.map((cta, k) => (
                          <CtaButton
                            key={k}
                            cta={cta}
                            className={`btn ${k || cta.action === 'tariffs' ? 'btn--line' : ''}`}
                            tabIndex={on ? 0 : -1}
                            onTariffs={showTariffs}
                          />
                        ))}
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
        <button type="button" className="tariffs__toggle" aria-expanded={tariffsOpen} aria-controls="tarife" onClick={() => setTariffsOpen((o) => !o)}>
          <span>{txt.tariffs}</span>
          <span className={`tariffs__plus ${tariffsOpen ? 'on' : ''}`} aria-hidden="true" />
        </button>
        <div id="tarife" className={`tariffs__panel ${tariffsOpen ? 'is-open' : ''}`} aria-hidden={!tariffsOpen}>
          <div className="tariffs__inner">
            {TARIFFS.map((g) => (
              <div className="tgroup" key={g.title}>
                <h3>{g.title}</h3>
                <p className="tgroup__note">{g.note}</p>
                <ul>
                  {g.rows.map((row) => (
                    <li key={row.item}>
                      <span>{row.item}</span>
                      <span className="num">{row.price}</span>
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
