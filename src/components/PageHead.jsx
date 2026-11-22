import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Img } from '../lib.jsx'
import { Link } from '../router.jsx'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'

const L = { ro: { home: 'Acasă' }, en: { home: 'Home' } }

// capul paginilor separate: poză, titlu mare, firul de pagini
export default function PageHead({ page }) {
  const { PAGE_HEAD } = useData()
  const h = PAGE_HEAD[page]
  const l = useT(L)
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  return (
    <section className="phead" ref={ref} id="top" aria-labelledby="phead-h">
      <motion.div className="phead__media" style={{ y }}>
        <Img name={h.img} alt={h.alt} sizes="100vw" eager />
      </motion.div>
      <div className="phead__scrim" aria-hidden="true" />
      <div className="phead__body wrap">
        <nav className="phead__crumbs" aria-label="Fir">
          <Link to="">{l.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{h.title}</span>
        </nav>
        <h1 id="phead-h" className="phead__title">
          <span>{h.title}</span>
        </h1>
        <p className="phead__lead">{h.lead}</p>
      </div>
    </section>
  )
}
