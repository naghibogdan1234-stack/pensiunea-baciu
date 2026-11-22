// „Întrebări frecvente”, din FAQ (data/content.js).
//   <Faq />               toate întrebările (pagina Contact)
//   <Faq only="camere" /> doar cele care au 'camere' în `pages`
//   <Faq limit={5} />     primele 5 și legătura „Toate cele N întrebări” (prima pagină)
import { useState } from 'react'
import { Reveal, MaskText } from '../../lib/motion.jsx'
import { useData } from '../../data/index.js'
import { CONTACT } from '../../data/content.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'
import { Link } from '../../router.jsx'

const TEXT = {
  ro: { h: 'Întrebări frecvente', more: 'Nu găsești răspunsul? Sună-ne, zilnic între 9 și 21.', all: (n) => `Toate cele ${n} întrebări` },
  en: { h: 'Common questions', more: 'Can’t find your answer? Call us, daily between 9:00 and 21:00.', all: (n) => `All ${n} questions` },
}

export default function Faq({ only, limit }) {
  const { FAQ } = useData()
  const txt = useTexts(TEXT)
  const all = only ? FAQ.filter((f) => f.pages.includes(only)) : FAQ
  const list = limit ? all.slice(0, limit) : all
  const [open, setOpen] = useState(0) // a câta întrebare e deschisă (-1 = niciuna); prima e deschisă din start
  return (
    <section id="intrebari" className="faq section" aria-labelledby="faq-h">
      <div className="faq__in wrap">
        <div className="faq__side">
          <MaskText id="faq-h" className="h2" text={txt.h} />
          <Reveal as="p" className="faq__more" i={1}>
            {txt.more}
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
          {limit && all.length > limit && (
            <li className="faq__all">
              <Link to="contact" className="link link--strong">
                {txt.all(all.length)} →
              </Link>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
