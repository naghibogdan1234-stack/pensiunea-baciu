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
    slope: 'Pârtia Bradul',
    sketch: 'schiță, nu la scară',
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
    slope: 'Bradul slope',
    sketch: 'sketch, not to scale',
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
          <svg className="map__sketch" viewBox="0 0 400 500" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
            <g className="map__contour">
              {Array.from({ length: 11 }, (_, i) => (
                <path key={i} d={`M-20 ${30 + i * 34} C 90 ${8 + i * 33}, 170 ${62 + i * 30}, 250 ${28 + i * 33} S 380 ${52 + i * 31}, 430 ${20 + i * 34}`} />
              ))}
            </g>
            <path className="map__river" d="M-10 318 C 60 300, 120 334, 190 314 S 320 296, 410 320" />
            <text className="map__lbl map__lbl--river" x="330" y="296">Mureș</text>
            <path className="map__road" d="M86 292 C 120 260, 110 228, 160 210 S 210 168, 232 140 S 250 112, 262 104" />
            <path className="map__slope" d="M296 160 L 270 112" />
            <text className="map__lbl" x="300" y="176">{l.slope}</text>
            <text className="map__lbl" x="168" y="236">Băile Banffy</text>
            <circle className="map__dot" cx="86" cy="292" r="5" />
            <text className="map__lbl map__lbl--town" x="24" y="282">Toplița</text>
            <g className="map__spin">
              <path className="map__pinpath" d="M262 98c-9 0-16 7-16 16 0 12 16 26 16 26s16-14 16-26c0-9-7-16-16-16Zm0 22a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z" transform="translate(0 -42)" />
            </g>
            <text className="map__lbl map__lbl--here" x="284" y="84">Pensiunea Baciu</text>
            <text className="map__lbl map__lbl--alt" x="284" y="100">850 m</text>
            <text className="map__note" x="380" y="24" textAnchor="end">{l.sketch}</text>
          </svg>
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
