import { Img } from '../../lib/Img.jsx'
import { useParallax } from '../../lib/motion.jsx'
import { Link } from '../../router.jsx'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'

const TEXT = { ro: { home: 'Acasă' }, en: { home: 'Home' } }

// Capul paginilor separate (#/camere, #/restaurant...): poza mare cu parallax, titlul și „Acasă / Pagina”.
// Titlul, textul și poza vin din PAGE_HEAD, în data/content.js.
export default function PageHead({ page }) {
  const { PAGE_HEAD } = useData()
  const head = PAGE_HEAD[page]
  const txt = useTexts(TEXT)
  const [ref, media] = useParallax(22)
  return (
    <section className="phead" ref={ref} id="top" aria-labelledby="phead-h">
      <div className="phead__media" ref={media}>
        <Img name={head.img} alt={head.alt} sizes="100vw" eager />
      </div>
      <div className="phead__scrim" aria-hidden="true" />
      <div className="phead__body wrap">
        <nav className="phead__crumbs" aria-label="Fir">
          <Link to="">{txt.home}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{head.title}</span>
        </nav>
        <h1 id="phead-h" className="phead__title">
          <span>{head.title}</span>
        </h1>
        <p className="phead__lead">{head.lead}</p>
      </div>
    </section>
  )
}
