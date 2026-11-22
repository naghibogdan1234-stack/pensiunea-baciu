import { useEffect, useState } from 'react'
import { Reveal, MaskText, Shutter, CountUp } from '../lib.jsx'

function LocalTime() {
  const get = () =>
    new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })
  const [t, setT] = useState(get)
  useEffect(() => {
    const id = setInterval(() => setT(get()), 20000)
    return () => clearInterval(id)
  }, [])
  return <span className="num">{t}</span>
}

export default function About() {
  return (
    <section className="about section wrap" aria-labelledby="about-h">
      <div className="about__head">
        <MaskText id="about-h" className="h2" text="Un loc pentru fiecare anotimp" />
        <Reveal as="p" className="lead about__lead" i={2}>
          Pensiunea Baciu stă la marginea pădurii, în partea de sus a domeniului schiabil din Toplița. Vara ieși călare
          sau cobori cu bobul printre brazi, iarna ai pârtia la câțiva pași. Seara te așteaptă o masă caldă.
        </Reveal>
      </div>

      <div className="about__tiles">
        <div className="about__photo">
          <Shutter name="fatada" alt="Fațada Pensiunii Baciu, cu acoperiș roșu, balcoane de lemn și un rond de flori" sizes="(max-width: 760px) 100vw, 62vw" />
          <Reveal as="p" className="about__note">
            14 camere cu baie proprie, restaurant cu terasă panoramică, centru de echitație și pârtii chiar lângă
            pensiune.
          </Reveal>
        </div>
        <div className="about__tile">
          <dl className="facts">
            <div>
              <dt>Altitudine</dt>
              <dd>
                <CountUp to={850} /> m
              </dd>
            </div>
            <div>
              <dt>Camere</dt>
              <dd>
                <CountUp to={14} />
              </dd>
            </div>
            <div>
              <dt>Locuri la masă</dt>
              <dd>
                <CountUp to={90} /> + <CountUp to={40} />
              </dd>
            </div>
            <div>
              <dt>Cai în manej</dt>
              <dd>
                <CountUp to={16} />
              </dd>
            </div>
          </dl>
          <p className="about__time">
            Acum în Toplița: <LocalTime />
          </p>
        </div>
      </div>
    </section>
  )
}
