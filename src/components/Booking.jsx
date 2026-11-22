import { useEffect, useMemo, useRef, useState } from 'react'
import { useLockScroll, lei, openLegal } from '../lib.jsx'
import { CONTACT, ROOMS, EXTRA_BED, discountFor } from '../data/content.js'
import Icon from './Icon.jsx'
import DatePicker, { todayISO, addDaysISO, nightsBetween, longDate } from './DatePicker.jsx'

const TYPES = ['Cazare', 'Masă la restaurant', 'Echitație', 'Eveniment']
const iso = (add = 0) => addDaysISO(todayISO(), add)
const addDays = addDaysISO
const fmt = (s) => {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })
}

const EMPTY = {
  type: 'Cazare',
  from: '',
  to: '',
  people: '2',
  room: ROOMS[0].id,
  extra: false,
  name: '',
  phone: '',
  email: '',
  msg: '',
  agree: false,
}

export default function Booking() {
  const [open, setOpen] = useState(false)
  const [f, setF] = useState(EMPTY)
  const [sent, setSent] = useState(null)
  const [copied, setCopied] = useState(false)
  const [cal, setCal] = useState(false)
  const first = useRef(null)
  useLockScroll(open)

  useEffect(() => {
    const on = (e) => {
      const d = e.detail || {}
      setSent(null)
      setF((s) => {
        const n = { ...s, ...Object.fromEntries(Object.entries(d).filter(([, v]) => v !== undefined && v !== '')) }
        if (n.type === 'Cazare') {
          if (!n.from) n.from = iso(7)
          if (!n.to || n.to <= n.from) n.to = addDays(n.from, 2)
          if (d.room) {
            const r = ROOMS.find((x) => x.id === d.room)
            if (r) n.people = String(r.guests)
          }
        }
        return n
      })
      setCal(false)
      setOpen(true)
    }
    window.addEventListener('baciu:book', on)
    return () => window.removeEventListener('baciu:book', on)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => first.current?.focus({ preventScroll: true }), 420)
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const stay = f.type === 'Cazare'
  const room = ROOMS.find((r) => r.id === f.room) || ROOMS[0]
  const nights = useMemo(() => Math.max(0, nightsBetween(f.from, f.to)), [f.from, f.to])
  const pct = discountFor(nights)
  const base = room.price * nights
  const off = Math.round((base * pct) / 100)
  const bed = f.extra ? EXTRA_BED * nights : 0
  const total = base - off + bed

  const message = () =>
    [
      'Bună ziua,',
      '',
      `Aș dori: ${f.type.toLowerCase()}.`,
      stay ? `Perioada: ${fmt(f.from)} – ${fmt(f.to)} (${nights} ${nights === 1 ? 'noapte' : 'nopți'})` : f.from ? `Data: ${fmt(f.from)}` : null,
      `Persoane: ${f.people}`,
      stay ? `Camera: ${room.name}${f.extra ? ', cu pat suplimentar' : ''}` : null,
      stay && nights ? `Estimarea de pe site: ${lei(total)}${pct ? ` (cu reducerea de ${pct}%)` : ''}` : null,
      f.msg ? '' : null,
      f.msg || null,
      '',
      `Nume: ${f.name}`,
      `Telefon: ${f.phone}`,
      f.email ? `Email: ${f.email}` : null,
    ]
      .filter((l) => l !== null)
      .join('\n')

  const submit = (e) => {
    e.preventDefault()
    if (stay && (!f.from || !f.to)) {
      setCal(true)
      return
    }
    const text = message()
    const subject = `Cerere ${f.type.toLowerCase()} – ${f.name}`
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    setSent(text)
  }
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* copierea nu e permisă aici */
    }
  }

  return (
    <div className={`drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="drawer__back" onClick={() => setOpen(false)} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="bk-h" data-lenis-prevent>
        <div className="drawer__bar">
          <h2 id="bk-h" className="h3">
            {sent ? 'Cererea e pregătită' : 'Cerere de rezervare'}
          </h2>
          <button type="button" className="x x--static" onClick={() => setOpen(false)} aria-label="Închide">
            <Icon name="close" />
          </button>
        </div>

        {sent ? (
          <div className="sent">
            <p>
              Ți s-a deschis emailul cu mesajul scris. Apasă „Trimite” acolo și pensiunea îți răspunde cu confirmarea și
              avansul.
            </p>
            <p className="muted">Dacă nu s-a deschis emailul, copiază mesajul de mai jos sau sună direct.</p>
            <pre className="sent__msg">{sent}</pre>
            <div className="drawer__actions">
              <button type="button" className="btn btn--line" onClick={copy}>
                {copied ? 'Copiat' : 'Copiază mesajul'}
              </button>
              <a className="btn" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> {CONTACT.phone}
              </a>
            </div>
            <p className="small muted">
              Email: <span className="sel">{CONTACT.email}</span>
            </p>
            <button type="button" className="link" onClick={() => setSent(null)}>
              ← Înapoi la formular
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <fieldset className="form__types">
              <legend className="sr-only">Ce dorești</legend>
              {TYPES.map((t, n) => (
                <label key={t} className={`chip ${f.type === t ? 'on' : ''}`}>
                  <input ref={n === 0 ? first : undefined} type="radio" name="bk-type" value={t} checked={f.type === t} onChange={set('type')} />
                  {t}
                </label>
              ))}
            </fieldset>

            <div className="dates">
              <button type="button" className={`dates__box ${cal ? 'is-open' : ''}`} onClick={() => setCal((c) => !c)} aria-expanded={cal}>
                <span className="dates__cell">
                  <span className="dates__l">{stay ? 'Sosire' : 'Data'}</span>
                  <span className="dates__v">{f.from ? longDate(f.from) : 'Alege'}</span>
                </span>
                {stay && (
                  <span className="dates__cell">
                    <span className="dates__l">Plecare</span>
                    <span className="dates__v">{f.to ? longDate(f.to) : 'Alege'}</span>
                  </span>
                )}
                <span className="dates__ico" aria-hidden="true">
                  <Icon name="cal" size={18} />
                </span>
              </button>
              <div className={`dates__cal ${cal ? 'is-open' : ''}`}>
                <div className="dates__inner">
                  {cal && (
                    <DatePicker
                      from={f.from}
                      to={stay ? f.to : ''}
                      single={!stay}
                      months={1}
                      onChange={({ from, to }) => setF((s) => ({ ...s, from, to }))}
                      onDone={() => setTimeout(() => setCal(false), 260)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form__grid">
              {!stay && (
                <label className="field">
                  <span>Persoane</span>
                  <input type="number" min="1" max="300" value={f.people} onChange={set('people')} />
                </label>
              )}
              {stay && (
                <>
                  <label className="field field--wide">
                    <span>Camera</span>
                    <select value={f.room} onChange={set('room')}>
                      {ROOMS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.short} · {r.guests} pers. · {r.price} lei
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>Persoane</span>
                    <input type="number" min="1" max="6" value={f.people} onChange={set('people')} />
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={f.extra} onChange={set('extra')} />
                    <span className="toggle" aria-hidden="true" />
                    <span>
                      Pat suplimentar <span className="muted">· {EXTRA_BED} lei / noapte</span>
                    </span>
                  </label>
                </>
              )}
            </div>

            {stay && (
              <div className="est" aria-live="polite">
                {nights > 0 ? (
                  <>
                    <div className="est__row">
                      <span>
                        {nights} {nights === 1 ? 'noapte' : 'nopți'} × {lei(room.price)}
                      </span>
                      <span className="num">{lei(base)}</span>
                    </div>
                    {pct > 0 && (
                      <div className="est__row est__row--off">
                        <span>Reducere {pct}%</span>
                        <span className="num">−{lei(off)}</span>
                      </div>
                    )}
                    {f.extra && (
                      <div className="est__row">
                        <span>Pat suplimentar</span>
                        <span className="num">{lei(bed)}</span>
                      </div>
                    )}
                    <div className="est__total">
                      <span>Total estimat</span>
                      <strong className="num">{lei(total)}</strong>
                    </div>
                    <p className="est__note">
                      Mic dejun inclus. Avans pentru confirmare: 50%, adică <span className="num">{lei(total / 2)}</span>.
                      {!pct && nights < 3 ? ' De la 3 nopți ai 6% reducere.' : ''}
                    </p>
                  </>
                ) : (
                  <p className="est__note">Alege datele și vezi prețul aici.</p>
                )}
              </div>
            )}

            <div className="form__grid">
              <label className="field">
                <span>Nume</span>
                <input required autoComplete="name" value={f.name} onChange={set('name')} />
              </label>
              <label className="field">
                <span>Telefon</span>
                <input required type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
              </label>
              <label className="field field--wide">
                <span>Email (opțional)</span>
                <input type="email" autoComplete="email" value={f.email} onChange={set('email')} />
              </label>
              <label className="field field--wide">
                <span>Mesaj (opțional)</span>
                <textarea rows="3" value={f.msg} onChange={set('msg')} />
              </label>
            </div>

            <label className="agree">
              <input type="checkbox" required checked={f.agree} onChange={set('agree')} />
              <span>
                Am citit{' '}
                <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
                  politica de confidențialitate
                </button>{' '}
                și{' '}
                <button type="button" className="link" onClick={() => openLegal('termeni')}>
                  termenii de rezervare
                </button>
                .
              </span>
            </label>

            <div className="drawer__actions">
              <button type="submit" className="btn">
                Trimite cererea <Icon name="arrow" size={18} />
              </button>
              <a className="btn btn--line" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> Sună
              </a>
            </div>
            <p className="small muted">
              Cererea nu e încă o rezervare. Pensiunea îți confirmă disponibilitatea și prețul, iar rezervarea devine fermă
              după avansul de 50%.
            </p>
          </form>
        )}
      </aside>
    </div>
  )
}
