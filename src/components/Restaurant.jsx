import { Reveal, MaskText, Shutter, go, openBooking } from '../lib.jsx'
import { useT } from '../i18n.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    h: 'Bucate românești, cu munții în geam',
    lead: 'Ciorbe, mămăligă cu brânză, tochitură, păstrăv și papanași. Mănânci în sala cu grinzi de lemn sau pe terasa cu vedere spre manej și munți.',
    open: 'Deschis zilnic',
    inside: 'În sală',
    insideV: '90 de locuri',
    terrace: 'Pe terasă',
    terraceV: '40 de locuri',
    menu: 'Deschide meniul',
    table: 'Rezervă o masă',
    altTerrace: 'Terasa de lemn a pensiunii, cu mese și vedere largă spre munți și brazi',
    capTerrace: 'Terasa panoramică',
    altHall: 'Sala restaurantului, cu tavan și grinzi de lemn și mese aranjate',
    capHall: 'Sala restaurantului',
    altEvents: 'Sala de evenimente cu tavan boltit, candelabre și mese rotunde',
    events: 'Nunți, botezuri, mese festive',
    eventsP: 'Sala de evenimente are vedere spre manej și munți. Vă propunem un meniu standard sau unul făcut pe gustul dumneavoastră.',
    ask: 'Întreabă de o dată liberă →',
  },
  en: {
    h: 'Romanian cooking, with the mountains in the window',
    lead: 'Sour soups, polenta with cheese, pork stew, trout and papanași. Eat in the timber-beamed dining room or on the terrace overlooking the arena and the mountains.',
    open: 'Open daily',
    inside: 'Inside',
    insideV: '90 seats',
    terrace: 'On the terrace',
    terraceV: '40 seats',
    menu: 'Open the menu',
    table: 'Book a table',
    altTerrace: 'The guesthouse’s wooden terrace, with tables and a wide view of mountains and fir trees',
    capTerrace: 'The panoramic terrace',
    altHall: 'The restaurant dining room, with a timber ceiling and beams and laid tables',
    capHall: 'The dining room',
    altEvents: 'The event hall with a vaulted ceiling, chandeliers and round tables',
    events: 'Weddings, christenings, celebrations',
    eventsP: 'The event hall looks out over the arena and the mountains. We offer a set menu or one made to your taste.',
    ask: 'Ask about a free date →',
  },
}

export default function Restaurant() {
  const l = useT(L)
  return (
    <section id="restaurant" className="resto section wrap" aria-labelledby="resto-h">
      <div className="resto__top">
        <div className="resto__text">
          <MaskText id="resto-h" className="h2" text={l.h} />
          <Reveal as="p" className="lead" i={1}>
            {l.lead}
          </Reveal>
          <Reveal as="dl" className="resto__info" i={2}>
            <div>
              <dt>{l.open}</dt>
              <dd className="num">10:00 – 22:00</dd>
            </div>
            <div>
              <dt>{l.inside}</dt>
              <dd>{l.insideV}</dd>
            </div>
            <div>
              <dt>{l.terrace}</dt>
              <dd>{l.terraceV}</dd>
            </div>
          </Reveal>
          <Reveal className="resto__btns" i={3}>
            <a href="#meniu" className="btn" onClick={go('meniu')}>
              {l.menu} <Icon name="arrow" size={18} />
            </a>
            <button type="button" className="btn btn--line" onClick={() => openBooking({ type: 'Masă la restaurant' })}>
              {l.table}
            </button>
          </Reveal>
        </div>
        <div className="resto__big">
          <Shutter name="terasa-vedere" alt={l.altTerrace} sizes="(max-width: 760px) 100vw, 50vw" from="right" />
          <p className="cap">{l.capTerrace}</p>
        </div>
      </div>

      <div className="resto__pair">
        <div className="resto__hall">
          <Shutter name="restaurant" alt={l.altHall} sizes="(max-width: 760px) 100vw, 56vw" from="left" />
          <p className="cap">{l.capHall}</p>
        </div>
        <div className="resto__events">
          <Shutter name="sala-evenimente" alt={l.altEvents} sizes="(max-width: 760px) 70vw, 26vw" />
          <Reveal as="h3" className="h3">
            {l.events}
          </Reveal>
          <Reveal as="p" i={1}>
            {l.eventsP}
          </Reveal>
          <Reveal i={2}>
            <button type="button" className="link link--strong" onClick={() => openBooking({ type: 'Eveniment' })}>
              {l.ask}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
