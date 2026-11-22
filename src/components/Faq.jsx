import { useState } from 'react'
import { Reveal, MaskText } from '../lib.jsx'
import { useData } from '../data/index.js'
import { CONTACT } from '../data/content.js'
import { useT } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: { h: 'Întrebări frecvente', more: 'Nu găsești răspunsul? Sună-ne, zilnic între 9 și 21.' },
  en: { h: 'Common questions', more: 'Can’t find your answer? Call us, daily between 9:00 and 21:00.' },
}

export default function Faq({ only }) {
  const { FAQ } = useData()
  const l = useT(L)
  const list = only ? FAQ.filter((f) => f.t.includes(only)) : FAQ
  const [open, setOpen] = useState(0)
  return (
    <section id="intrebari" className="faq section" aria-labelledby="faq-h">
      <div className="faq__in wrap">
        <div className="faq__side">
          <MaskText id="faq-h" className="h2" text={l.h} />
          <Reveal as="p" className="faq__more" i={1}>
            {l.more}
          </Reveal>
          <Reveal i={2}>
            <a className="btn btn--line" href={CONTACT.phoneHref}>
              <Icon name="phone" size={17} /> {CONTACT.phone}
            </a>
          </Reveal>
        </div>
        <ul className="faq__list">
          {list.map((f, i) => {
            const on = open === i
            return (
              <Reveal as="li" key={f.q} className={`qa ${on ? 'on' : ''}`} i={Math.min(i, 4)}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`qa-${i}`} onClick={() => setOpen(on ? -1 : i)}>
                    <span>{f.q}</span>
                    <span className="qa__plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`qa-${i}`} className="qa__a" role="region" aria-hidden={!on}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
