import { useMemo, useState } from 'react'
import Icon from './Icon.jsx'

/* Date ca text „AAAA-LL-ZZ”, în ora locală (fără decalaje de fus orar). */
const pad = (n) => String(n).padStart(2, '0') // taste-skill-ignore: format ISO de dată
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const fromISO = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
export const todayISO = () => toISO(new Date())
export const addDaysISO = (s, n) => {
  const d = fromISO(s)
  d.setDate(d.getDate() + n)
  return toISO(d)
}
export const nightsBetween = (a, b) => (a && b ? Math.round((fromISO(b) - fromISO(a)) / 86400000) : 0)
export const shortDate = (s) =>
  s ? fromISO(s).toLocaleDateString('ro-RO', { day: 'numeric', month: 'short' }).replace('.', '') : ''
export const longDate = (s) =>
  s ? fromISO(s).toLocaleDateString('ro-RO', { weekday: 'short', day: 'numeric', month: 'short' }) : ''

const WEEK = ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D']
const monthName = (y, m) => {
  const t = new Date(y, m, 1).toLocaleDateString('ro-RO', { month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1)
}

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
        aria-label={new Date(y, m, d).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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
        {WEEK.map((w) => (
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
 * Calendar cu interval (sosire–plecare) sau cu o singură zi.
 * onChange({ from, to }); onDone() după ce intervalul e complet.
 */
export default function DatePicker({ from = '', to = '', onChange, onDone, single = false, months = 2 }) {
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
    if (single) {
      onChange({ from: iso, to: '' })
      onDone?.()
      return
    }
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
      <button type="button" className="dp__nav dp__nav--l" onClick={() => move(-1)} disabled={atMin} aria-label="Luna anterioară">
        <Icon name="left" size={20} />
      </button>
      <button type="button" className="dp__nav dp__nav--r" onClick={() => move(1)} aria-label="Luna următoare">
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
