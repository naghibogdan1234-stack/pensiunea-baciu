// La capătul fiecărei pagini separate: o legătură mare, cu poză, spre pagina următoare.
// Ordinea e cea din LINKS (data/content.js); după ultima pagină urmează iar prima.
import { Img } from '../../lib/Img.jsx'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'
import { Link, ROUTES } from '../../router.jsx'
import Icon from '../ui/Icon.jsx'

const TEXT = { ro: { next: 'Mai departe' }, en: { next: 'Next' } }

export default function NextPage({ page }) {
  const { LINKS, PAGE_HEAD } = useData()
  const txt = useTexts(TEXT)
  const next = LINKS[(ROUTES.indexOf(page) + 1) % LINKS.length]
  const img = PAGE_HEAD[next.page].img // aceeași poză ca în capul paginii următoare
  return (
    <Link to={next.page} className="nextp">
      <span className="nextp__pic" aria-hidden="true">
        <Img name={img} alt="" sizes="100vw" />
      </span>
      <span className="nextp__txt wrap">
        <span className="nextp__k">{txt.next}</span>
        <span className="nextp__t">
          {next.label} <Icon name="arrow" size={28} />
        </span>
        <span className="nextp__l">{next.line}</span>
      </span>
    </Link>
  )
}
