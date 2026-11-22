import { useState } from 'react'
import { Reveal, MaskText, openBooking } from '../lib.jsx'
import { CONTACT, MAPS_LINK, MAPS_EMBED, STAY } from '../data/content.js'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'
import { useConsent } from './Legal.jsx'
import Icon from './Icon.jsx'

const L = {
  ro: {
    h: 'Vă așteptăm',
    lead: 'Pensiunea e în partea de sus a domeniului schiabil din Toplița, la 850 m.',
    addr: 'Adresa',
    access: 'Drumul',
    accessV: 'Pe drumul asfaltat prin stațiunea Băile Banffy, vara și iarna. Parcare gratuită, iluminată, lângă pensiune.',
    gps: 'Coordonate GPS',
    hours: 'Program',
    stay: 'Cazare',
    stayV: `check-in de la ${STAY.checkIn}, check-out până la ${STAY.checkOut}`,
    reception: 'Recepție',
    write: 'Trimite o cerere de rezervare',
    open: 'Deschide în Google Maps',
    mapTitle: 'Harta Google: Pensiunea Baciu, Toplița',
    off: 'Harta e oprită',
    offP: 'Harta vine de la Google Maps. Dacă o pornești, Google poate seta cookie-uri și îți primește adresa IP.',
    once: 'Arată harta o dată',
    always: 'Arată mereu',
  },
  en: {
    h: 'Find us',
    lead: 'The guesthouse sits at the top of the Toplița ski area, at 850 m.',
    addr: 'Address',
    access: 'The road',
    accessV: 'Up the asphalt road through the Băile Banffy resort, in summer and winter. Free, lit parking next to the guesthouse.',
    gps: 'GPS coordinates',
    hours: 'Opening hours',
    stay: 'Stay',
    stayV: `check-in from ${STAY.checkIn}, check-out by ${STAY.checkOut}`,
    reception: 'Reception',
    write: 'Send a booking request',
    open: 'Open in Google Maps',
    mapTitle: 'Google map: Pensiunea Baciu, Toplița',
    off: 'The map is off',
    offP: 'The map comes from Google Maps. If you turn it on, Google may set cookies and receives your IP address.',
    once: 'Show the map once',
    always: 'Always show',
  },
}

function MapBlock() {
  const { maps, save } = useConsent()
  const l = useT(L)
  const [once, setOnce] = useState(false)
  const show = maps || once
  return (
    <div className="map">
      {show ? (
        <iframe title={l.mapTitle} src={MAPS_EMBED} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      ) : (
        <div className="map__off">
          <svg className="map__lines" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => (
              <path key={i} d={`M-20 ${40 + i * 30} C 80 ${10 + i * 32}, 160 ${70 + i * 28}, 240 ${36 + i * 31} S 380 ${60 + i * 29}, 430 ${30 + i * 30}`} />
            ))}
          </svg>
          <span className="map__pin" aria-hidden="true">
            <Icon name="pin" size={30} />
          </span>
          <div className="map__msg">
            <p className="map__t">{l.off}</p>
            <p>{l.offP}</p>
            <div className="map__btns">
              <button type="button" className="btn btn--brass" onClick={() => setOnce(true)}>
                {l.once}
              </button>
              <button type="button" className="btn btn--line-light" onClick={() => save(true)}>
                {l.always}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Visit() {
  const { HOURS } = useData()
  const l = useT(L)
  return (
    <section id="contact" className="visit section" aria-labelledby="visit-h">
      <div className="visit__in wrap">
        <div className="visit__info">
          <MaskText id="visit-h" className="h2" text={l.h} />
          <Reveal as="p" className="lead" i={1}>
            {l.lead}
          </Reveal>
          <Reveal as="dl" className="visit__dl" i={2}>
            <div>
              <dt>{l.addr}</dt>
              <dd>
                {CONTACT.street}
                <br />
                {CONTACT.city}
              </dd>
            </div>
            <div>
              <dt>{l.access}</dt>
              <dd>{l.accessV}</dd>
            </div>
            <div>
              <dt>{l.gps}</dt>
              <dd className="num">46.90114 N, 25.32829 E</dd>
            </div>
          </Reveal>
          <Reveal as="dl" className="visit__hours" i={3}>
            {HOURS.map(([d, h]) => (
              <div key={d}>
                <dt>{d}</dt>
                <dd className="num">{h}</dd>
              </div>
            ))}
            <div>
              <dt>{l.stay}</dt>
              <dd className="num">{l.stayV}</dd>
            </div>
            <div>
              <dt>{l.reception}</dt>
              <dd className="num">{STAY.reception}</dd>
            </div>
          </Reveal>
          <Reveal className="visit__links" i={4}>
            <a className="visit__tel" href={CONTACT.phoneHref}>
              <Icon name="phone" size={18} /> {CONTACT.phone}
            </a>
            <a className="visit__tel" href={`mailto:${CONTACT.email}`}>
              <Icon name="mail" size={18} /> {CONTACT.email}
            </a>
          </Reveal>
          <Reveal className="visit__btns" i={5}>
            <button type="button" className="btn" onClick={() => openBooking()}>
              {l.write}
            </button>
            <a className="btn btn--line" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} /> {l.open}
            </a>
          </Reveal>
        </div>
        <Reveal className="visit__map" i={2}>
          <MapBlock />
        </Reveal>
      </div>
    </section>
  )
}
