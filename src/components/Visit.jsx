import { useState } from 'react'
import { Img, Reveal, MaskText, openBooking } from '../lib.jsx'
import { CONTACT, MAPS_LINK, MAPS_EMBED, HOURS } from '../data/content.js'
import { useConsent } from './Legal.jsx'
import Icon from './Icon.jsx'

function MapBlock() {
  const { maps, save } = useConsent()
  const [once, setOnce] = useState(false)
  const show = maps || once
  return (
    <div className="map">
      {show ? (
        <iframe title="Harta Google: Pensiunea Baciu, Toplița" src={MAPS_EMBED} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      ) : (
        <div className="map__off">
          <Img name="iarna-drona" alt="" sizes="(max-width: 760px) 100vw, 60vw" />
          <div className="map__msg">
            <Icon name="pin" size={28} />
            <p className="map__t">Harta e oprită</p>
            <p>
              Harta vine de la Google Maps. Dacă o pornești, Google poate seta cookie-uri și îți primește adresa IP.
            </p>
            <div className="map__btns">
              <button type="button" className="btn btn--brass" onClick={() => setOnce(true)}>
                Arată harta o dată
              </button>
              <button type="button" className="btn btn--line-light" onClick={() => save(true)}>
                Arată mereu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Visit() {
  return (
    <section id="contact" className="visit" aria-labelledby="visit-h">
      <div className="visit__photo">
        <Img name="vara-drona" alt="Pensiunea Baciu de sus, cu manejul, terenurile și pădurea din jur" sizes="100vw" />
        <div className="visit__card">
          <h2 id="visit-h" className="h3">
            Vă așteptăm
          </h2>
          <p className="visit__addr">
            {CONTACT.street}
            <br />
            {CONTACT.city}
          </p>
          <p className="visit__acc">Acces pe drumul asfaltat prin stațiunea Băile Banffy, vara și iarna.</p>
          <dl className="visit__hours">
            {HOURS.map(([d, h]) => (
              <div key={d}>
                <dt>{d}</dt>
                <dd className="num">{h}</dd>
              </div>
            ))}
          </dl>
          <a className="visit__tel" href={CONTACT.phoneHref}>
            <Icon name="phone" size={18} /> {CONTACT.phone}
          </a>
          <a className="visit__tel" href={`mailto:${CONTACT.email}`}>
            <Icon name="mail" size={18} /> {CONTACT.email}
          </a>
          <button type="button" className="btn visit__go" onClick={() => openBooking()}>
            Trimite o cerere de rezervare
          </button>
        </div>
      </div>

      <div className="visit__map section wrap">
        <div className="visit__maptext">
          <MaskText as="h2" className="h2" text="Pe hartă" />
          <Reveal as="p" className="lead" i={1}>
            Pensiunea e în partea de sus a domeniului schiabil din Toplița, la 850 m.
          </Reveal>
          <Reveal as="dl" className="visit__gps" i={2}>
            <div>
              <dt>Coordonate GPS</dt>
              <dd className="num">46.90114 N, 25.32829 E</dd>
            </div>
          </Reveal>
          <Reveal i={3}>
            <a className="btn btn--line" href={MAPS_LINK} target="_blank" rel="noopener noreferrer">
              <Icon name="pin" size={18} /> Deschide în Google Maps
            </a>
          </Reveal>
        </div>
        <MapBlock />
      </div>
    </section>
  )
}
