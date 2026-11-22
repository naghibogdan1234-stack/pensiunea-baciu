// „Un loc pentru fiecare anotimp”: textul de prezentare, poza fațadei, cifrele (850 m, 14 camere...)
// și vremea de acum (WeatherPanel).
import { Reveal, MaskText, Shutter, CountUp } from '../../lib/motion.jsx'
import { useTexts } from '../../i18n.jsx'
import { WeatherPanel } from '../ui/Weather.jsx'

const TEXT = {
  ro: {
    h: 'Un loc pentru fiecare anotimp',
    lead: 'Pensiunea Baciu stă la marginea pădurii, în partea de sus a domeniului schiabil din Toplița. Vara ieși călare sau cobori cu bobul printre brazi, iarna ai pârtia la câțiva pași. Seara te așteaptă o masă caldă.',
    alt: 'Fațada Pensiunii Baciu, cu acoperiș roșu, balcoane de lemn și un rond de flori',
    note: '14 camere cu baie proprie, restaurant cu terasă panoramică, centru de echitație și pârtii chiar lângă pensiune.',
    altitude: 'Altitudine',
    rooms: 'Camere',
    seats: 'Locuri la masă',
    horses: 'Cai în manej',
  },
  en: {
    h: 'A place for every season',
    lead: 'Pensiunea Baciu sits at the edge of the forest, at the top of the Toplița ski area. In summer you ride out on horseback or take the coaster down through the firs; in winter the slope is a few steps away. In the evening, a warm meal is waiting.',
    alt: 'The front of Pensiunea Baciu, with a red roof, wooden balconies and a round flower bed',
    note: '14 rooms with private bathrooms, a restaurant with a panoramic terrace, a riding centre and slopes right next to the guesthouse.',
    altitude: 'Altitude',
    rooms: 'Rooms',
    seats: 'Seats at table',
    horses: 'Horses',
  },
}

export default function About() {
  const txt = useTexts(TEXT)
  return (
    <section className="about section wrap" aria-labelledby="about-h">
      <div className="about__head">
        <MaskText id="about-h" className="h2" text={txt.h} />
        <Reveal as="p" className="lead about__lead" i={2}>
          {txt.lead}
        </Reveal>
      </div>

      <div className="about__tiles">
        <div className="about__photo">
          <Shutter name="fatada" alt={txt.alt} sizes="(max-width: 760px) 100vw, 62vw" />
          <Reveal as="p" className="about__note">
            {txt.note}
          </Reveal>
        </div>
        <div className="about__tile">
          <dl className="facts">
            <div>
              <dt>{txt.altitude}</dt>
              <dd>
                <CountUp to={850} /> m
              </dd>
            </div>
            <div>
              <dt>{txt.rooms}</dt>
              <dd>
                <CountUp to={14} />
              </dd>
            </div>
            <div>
              <dt>{txt.seats}</dt>
              <dd>
                <CountUp to={90} /> + <CountUp to={40} />
              </dd>
            </div>
            <div>
              <dt>{txt.horses}</dt>
              <dd>
                <CountUp to={16} />
              </dd>
            </div>
          </dl>
          <WeatherPanel />
        </div>
      </div>
    </section>
  )
}
