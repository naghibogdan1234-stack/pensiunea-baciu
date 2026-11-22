import { Img, Reveal, MaskText, openBooking } from '../lib.jsx'
import { useData } from '../data/index.js'
import { CONTACT } from '../data/content.js'
import { useT } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    h: 'Oferte și avantaje',
    lead: 'Nu sunt pachete inventate, ci condițiile pe care le ai la noi tot anul.',
  },
  en: {
    h: 'Offers and perks',
    lead: 'No made-up packages: these are the terms you get with us all year round.',
  },
}

export function Cta({ cta, className = 'btn btn--line' }) {
  const [kind, label, type] = cta
  if (kind === 'call')
    return (
      <a className={className} href={CONTACT.phoneHref}>
        <Icon name="phone" size={17} /> {label}
      </a>
    )
  return (
    <button type="button" className={className} onClick={() => openBooking({ type })}>
      {label} <Icon name="arrow" size={17} />
    </button>
  )
}

export default function Offers() {
  const { OFFERS } = useData()
  const l = useT(L)
  return (
    <section id="oferte" className="offers section" aria-labelledby="off-h">
      <div className="offers__head wrap">
        <MaskText id="off-h" className="h2" text={l.h} />
        <Reveal as="p" className="lead" i={1}>
          {l.lead}
        </Reveal>
      </div>
      <ul className="offers__grid wrap">
        {OFFERS.map((o, i) => (
          <Reveal as="li" key={o.id} className={`offer offer--${o.id}`} i={i % 2}>
            <div className="offer__pic">
              <Img name={o.img} alt="" sizes="(max-width: 760px) 100vw, 46vw" />
              {o.big && <p className="offer__big">{o.big}</p>}
            </div>
            <div className="offer__txt">
              <h3 className="offer__t">{o.title}</h3>
              <p className="offer__p">{o.text}</p>
              <Cta cta={o.cta} className="link link--strong offer__go" />
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
