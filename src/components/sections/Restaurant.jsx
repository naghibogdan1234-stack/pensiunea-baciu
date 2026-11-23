// Secțiunea restaurantului: text, program, locuri, trei poze și sala de evenimente.
// Pe ecran lat, textul din stânga coboară odată cu pagina pe lângă poza înaltă (position: sticky, în CSS).
// Butonul „Deschide meniul” coboară la meniul-carte (MenuBook.jsx), care vine imediat după.
import { Reveal, MaskText, Shutter } from '../../lib/motion.jsx'
import { scrollLink } from '../../lib/scroll.js'
import { openBooking } from '../../events.js'
import { useTexts } from '../../i18n.jsx'
import Icon from '../ui/Icon.jsx'

const TEXT = {
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
    altHall: 'Sala restaurantului, cu tavan de lemn, stâlpi sculptați și o masă aranjată cu flori',
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
    altHall: 'The restaurant dining room, with a wooden ceiling, carved pillars and a table laid with flowers',
    capHall: 'The dining room',
    altEvents: 'The event hall with a vaulted ceiling, chandeliers and round tables',
    events: 'Weddings, christenings, celebrations',
    eventsP: 'The event hall looks out over the arena and the mountains. We offer a set menu or one made to your taste.',
    ask: 'Ask about a free date →',
  },
}

export default function Restaurant() {
  const txt = useTexts(TEXT)
  return (
    <section id="restaurant" className="resto section wrap" aria-labelledby="resto-h">
      <div className="resto__top">
        <div className="resto__text">
          <MaskText id="resto-h" className="h2" text={txt.h} />
          <Reveal as="p" className="lead" i={1}>
            {txt.lead}
          </Reveal>
          <Reveal as="dl" className="resto__info" i={2}>
            <div>
              <dt>{txt.open}</dt>
              <dd className="num">10:00 – 22:00</dd>
            </div>
            <div>
              <dt>{txt.inside}</dt>
              <dd>{txt.insideV}</dd>
            </div>
            <div>
              <dt>{txt.terrace}</dt>
              <dd>{txt.terraceV}</dd>
            </div>
          </Reveal>
          <Reveal className="resto__btns" i={3}>
            <a href="#meniu" className="btn" onClick={scrollLink('meniu')}>
              {txt.menu} <Icon name="arrow" size={18} />
            </a>
            <button type="button" className="btn btn--line" onClick={() => openBooking({ type: 'Masă la restaurant' })}>
              {txt.table}
            </button>
          </Reveal>
        </div>
        <div className="resto__big">
          <Shutter name="terasa-vedere" alt={txt.altTerrace} sizes="(max-width: 760px) 100vw, 50vw" from="right" />
          <p className="cap">{txt.capTerrace}</p>
        </div>
      </div>

      {/* sala și sala de evenimente: pozele una lângă alta, la aceeași înălțime; textele dedesubt */}
      <div className="resto__pair">
        <Shutter className="resto__hall" name="restaurant" alt={txt.altHall} sizes="(max-width: 760px) 100vw, 56vw" from="left" />
        <Shutter className="resto__evpic" name="sala-evenimente" alt={txt.altEvents} sizes="(max-width: 760px) 100vw, 34vw" />
        <p className="cap resto__hallcap">{txt.capHall}</p>
        <div className="resto__events">
          <Reveal as="h3" className="h3">
            {txt.events}
          </Reveal>
          <Reveal as="p" i={1}>
            {txt.eventsP}
          </Reveal>
          <Reveal i={2}>
            <button type="button" className="link link--strong" onClick={() => openBooking({ type: 'Eveniment' })}>
              {txt.ask}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
