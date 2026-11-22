// Calendarul: alegi sosirea și plecarea (interval) sau o singură zi (single).
//
//   <DatePicker from={from} to={to} months={2} onChange={({ from, to }) => ...} />
//
// Datele intră și ies ca text 'AAAA-LL-ZZ' (vezi src/lib/format.js). Zilele trecute nu se pot alege.
// La interval: primul click = sosirea, al doilea (după sosire) = plecarea; un click înainte de sosire o ia de la capăt.
// Folosit în bara de rezervare de pe prima pagină (Hero.jsx) și în fereastra de rezervare.
import { useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import { CUR, locale, useLang } from '../../i18n.jsx'
import { toISO, fromISO, todayISO } from '../../lib/format.js'


// săptămâna începe luni
const WEEK = { ro: ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'], en: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] }
const monthName = (y, m) => {
  const t = new Date(y, m, 1).toLocaleDateString(locale(), { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/** O lună din calendar. `hover` = ziua de sub mouse, ca să se vadă intervalul înainte de al doilea click. */
function Month({ y, m, from, to, hover, single, onPick, onHover }) {
  const first = new Date(y, m, 1)
  const lead = (first.getDay() + 6) % 7 // luni = prima zi
  const days = new Date(y, m + 1, 0).getDate()
  const today = todayISO()
  const end = to || (!single && from && hover && hover > from ? hover : '')
  const cells = []
  for (let i = 0; i < lead; i++) cells.push(<span key={`e${i}`} />)
  for (let d = 1; d <= days; d++) {
    const iso = toISO(new Date(y, m, d))
    const past = iso < today
    const isStart = iso === from
    const isEnd = iso === end && !single
    const inRange = !single && from && end && iso > from && iso < end
    cells.push(
      <button
        key={iso}
        type="button"
        disabled={past}
        className={`dp__day ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''} ${inRange ? 'is-in' : ''} ${
          iso === today ? 'is-today' : ''
        } ${isStart && end && !single ? 'has-end' : ''} ${!to && hover && iso === end ? 'is-preview' : ''}`}
        onClick={() => onPick(iso)}
        onMouseEnter={() => onHover(iso)}
        aria-label={new Date(y, m, d).toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        aria-pressed={isStart || isEnd}
      >
        <span>{d}</span>
      </button>,
    )
  }
  return (
    <div className="dp__month">
      <p className="dp__title">{monthName(y, m)}</p>
      <div className="dp__week" aria-hidden="true">
        {WEEK[CUR.lang].map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="dp__grid" onMouseLeave={() => onHover('')}>
        {cells}
      </div>
    </div>
  )
}

/**
 * from, to   datele alese ('' = încă nealese)
 * onChange   primește { from, to } la fiecare click
 * onDone     opțional: chemat după ce intervalul e complet (sau ziua aleasă, la single)
 * single     o singură zi în loc de interval
 * months     câte luni se văd odată (2 pe ecran lat, 1 în fereastra de rezervare pentru masă/călărie)
 */
export default function DatePicker({ from = '', to = '', onChange, onDone, single = false, months = 2 }) {
  const lang = useLang()
  // luna de la care pornește calendarul: a datei alese sau luna curentă (doar la deschidere)
  const start = useMemo(() => {
    const d = from ? fromISO(from) : new Date()
    return { y: d.getFullYear(), m: d.getMonth() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [view, setView] = useState(start)
  const [hover, setHover] = useState('')
  const now = new Date()
  const atMin = view.y === now.getFullYear() && view.m === now.getMonth()

  const move = (n) =>
    setView((v) => {
      const d = new Date(v.y, v.m + n, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  const pick = (iso) => {
    // o singură zi: gata
    if (single) {
      onChange({ from: iso, to: '' })
      onDone?.()
      return
    }
    // începem un interval nou dacă nu e nimic ales, dacă era deja complet sau dacă ziua e înaintea sosirii
    if (!from || (from && to) || iso <= from) {
      onChange({ from: iso, to: '' })
    } else {
      onChange({ from, to: iso })
      onDone?.()
    }
  }

  const list = Array.from({ length: months }, (_, i) => {
    const d = new Date(view.y, view.m + i, 1)
    return { y: d.getFullYear(), m: d.getMonth() }
  })

  return (
    <div className={`dp dp--${months}`}>
      <button type="button" className="dp__nav dp__nav--l" onClick={() => move(-1)} disabled={atMin} aria-label={lang === 'en' ? 'Previous month' : 'Luna anterioară'}>
        <Icon name="left" size={20} />
      </button>
      <button type="button" className="dp__nav dp__nav--r" onClick={() => move(1)} aria-label={lang === 'en' ? 'Next month' : 'Luna următoare'}>
        <Icon name="right" size={20} />
      </button>
      <div className="dp__months">
        {list.map(({ y, m }) => (
          <Month key={`${y}-${m}`} y={y} m={m} from={from} to={to} hover={hover} single={single} onPick={pick} onHover={setHover} />
        ))}
      </div>
    </div>
  )
}
