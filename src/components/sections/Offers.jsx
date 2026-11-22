// „Oferte și avantaje”: patru carduri cu poză, din OFFERS (data/content.js).
// Fiecare are un buton (cta) care rezervă sau sună, la fel ca la activități.
import { Img } from '../../lib/Img.jsx'
import { Reveal, MaskText } from '../../lib/motion.jsx'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import CtaButton from '../ui/CtaButton.jsx'

const TEXT = {
  ro: {
    h: 'Oferte și avantaje',
    lead: 'Nu sunt pachete inventate, ci condițiile pe care le ai la noi tot anul.',
  },
  en: {
    h: 'Offers and perks',
    lead: 'No made-up packages: these are the terms you get with us all year round.',
  },
}

export default function Offers() {
  const { OFFERS } = useData()
  const txt = useTexts(TEXT)
  return (
    <section id="oferte" className="offers section" aria-labelledby="off-h">
      <div className="offers__head wrap">
        <MaskText id="off-h" className="h2" text={txt.h} />
        <Reveal as="p" className="lead" i={1}>
          {txt.lead}
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
              <CtaButton cta={o.cta} className="link link--strong offer__go" />
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
