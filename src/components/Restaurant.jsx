import { Reveal, MaskText, Shutter, go, openBooking } from '../lib.jsx'
import Icon from './Icon.jsx'

export default function Restaurant() {
  return (
    <section id="restaurant" className="resto section wrap" aria-labelledby="resto-h">
      <div className="resto__top">
        <div className="resto__text">
          <MaskText id="resto-h" className="h2" text="Bucate românești, cu munții în geam" />
          <Reveal as="p" className="lead" i={1}>
            Ciorbe, mămăligă cu brânză, tochitură, păstrăv și papanași. Mănânci în sala cu grinzi de lemn sau pe terasa
            cu vedere spre manej și munți.
          </Reveal>
          <Reveal as="dl" className="resto__info" i={2}>
            <div>
              <dt>Deschis zilnic</dt>
              <dd className="num">10:00 – 22:00</dd>
            </div>
            <div>
              <dt>În sală</dt>
              <dd>90 de locuri</dd>
            </div>
            <div>
              <dt>Pe terasă</dt>
              <dd>40 de locuri</dd>
            </div>
          </Reveal>
          <Reveal className="resto__btns" i={3}>
            <a href="#meniu" className="btn" onClick={go('meniu')}>
              Deschide meniul <Icon name="arrow" size={18} />
            </a>
            <button type="button" className="btn btn--line" onClick={() => openBooking({ type: 'Masă la restaurant' })}>
              Rezervă o masă
            </button>
          </Reveal>
        </div>
        <div className="resto__big">
          <Shutter name="terasa-vedere" alt="Terasa de lemn a pensiunii, cu mese și vedere largă spre munți și brazi" sizes="(max-width: 760px) 100vw, 50vw" from="right" />
          <p className="cap">Terasa panoramică</p>
        </div>
      </div>

      <div className="resto__pair">
        <div className="resto__hall">
          <Shutter name="restaurant" alt="Sala restaurantului, cu tavan și grinzi de lemn și mese aranjate" sizes="(max-width: 760px) 100vw, 56vw" from="left" />
          <p className="cap">Sala restaurantului</p>
        </div>
        <div className="resto__events">
          <Shutter name="sala-evenimente" alt="Sala de evenimente cu tavan boltit, candelabre și mese rotunde" sizes="(max-width: 760px) 70vw, 26vw" />
          <Reveal as="h3" className="h3">
            Nunți, botezuri, mese festive
          </Reveal>
          <Reveal as="p" i={1}>
            Sala de evenimente are vedere spre manej și munți. Vă propunem un meniu standard sau unul făcut pe gustul
            dumneavoastră.
          </Reveal>
          <Reveal i={2}>
            <button type="button" className="link link--strong" onClick={() => openBooking({ type: 'Eveniment' })}>
              Întreabă de o dată liberă →
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
