import { useEffect, useMemo, useRef, useState } from 'react'
import { useLockScroll, lei, openLegal } from '../lib.jsx'
import { CONTACT, ROOMS, EXTRA_BED, discountFor } from '../data/content.js'
import { useData } from '../data/index.js'
import { useT, useLang, locale } from '../i18n.jsx'
import Icon from './Icon.jsx'
import DatePicker, { todayISO, addDaysISO, nightsBetween, longDate } from './DatePicker.jsx'

// valorile rămân în română (le citește pensiunea); etichetele se traduc
const TYPES = ['Cazare', 'Masă la restaurant', 'Echitație', 'Eveniment']
const iso = (add = 0) => addDaysISO(todayISO(), add)
const addDays = addDaysISO
const fmt = (s, lang) => {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale(lang), { day: 'numeric', month: 'long', year: 'numeric' })
}

const L = {
  ro: {
    types: { Cazare: 'Cazare', 'Masă la restaurant': 'Masă la restaurant', Echitație: 'Echitație', Eveniment: 'Eveniment' },
    nights: (n) => `${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    mail: ({ f, type, stay, nights, room, total, pct, lang }) => [
      'Bună ziua,',
      '',
      `Aș dori: ${type.toLowerCase()}.`,
      stay ? `Perioada: ${fmt(f.from, lang)} – ${fmt(f.to, lang)} (${nights} ${nights === 1 ? 'noapte' : 'nopți'})` : f.from ? `Data: ${fmt(f.from, lang)}` : null,
      `Persoane: ${f.people}`,
      stay ? `Camera: ${room.name}${f.extra ? ', cu pat suplimentar' : ''}` : null,
      stay && nights ? `Estimarea de pe site: ${lei(total)}${pct ? ` (cu reducerea de ${pct}%)` : ''}` : null,
      f.msg ? '' : null,
      f.msg || null,
      '',
      `Nume: ${f.name}`,
      `Telefon: ${f.phone}`,
      f.email ? `Email: ${f.email}` : null,
    ],
    subject: (type, name) => `Cerere ${type.toLowerCase()} – ${name}`,
    ready: 'Cererea e pregătită',
    title: 'Cerere de rezervare',
    close: 'Închide',
    sent1: 'Ți s-a deschis emailul cu mesajul scris. Apasă „Trimite” acolo și pensiunea îți răspunde cu confirmarea și avansul.',
    sent2: 'Dacă nu s-a deschis emailul, copiază mesajul de mai jos sau sună direct.',
    copied: 'Copiat',
    copy: 'Copiază mesajul',
    back: '← Înapoi la formular',
    what: 'Ce dorești',
    arrive: 'Sosire',
    date: 'Data',
    leave: 'Plecare',
    pick: 'Alege',
    people: 'Persoane',
    room: 'Camera',
    pers: 'pers.',
    extra: 'Pat suplimentar',
    perNight: 'lei / noapte',
    off: (p) => `Reducere ${p}%`,
    total: 'Total estimat',
    note: (d) => `Mic dejun inclus. Avans pentru confirmare: 50%, adică ${d}.`,
    hint: ' De la 3 nopți ai 6% reducere.',
    empty: 'Alege datele și vezi prețul aici.',
    name: 'Nume',
    phone: 'Telefon',
    email: 'Email (opțional)',
    msg: 'Mesaj (opțional)',
    read: 'Am citit',
    privacy: 'politica de confidențialitate',
    and: 'și',
    terms: 'termenii de rezervare',
    send: 'Trimite cererea',
    call: 'Sună',
    foot: 'Cererea nu e încă o rezervare. Pensiunea îți confirmă disponibilitatea și prețul, iar rezervarea devine fermă după avansul de 50%.',
  },
  en: {
    types: { Cazare: 'Stay', 'Masă la restaurant': 'Restaurant table', Echitație: 'Horse riding', Eveniment: 'Event' },
    nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    mail: ({ f, type, stay, nights, room, total, pct, lang }) => [
      'Hello,',
      '',
      `I would like: ${type.toLowerCase()}.`,
      stay ? `Dates: ${fmt(f.from, lang)} – ${fmt(f.to, lang)} (${nights} ${nights === 1 ? 'night' : 'nights'})` : f.from ? `Date: ${fmt(f.from, lang)}` : null,
      `Guests: ${f.people}`,
      stay ? `Room: ${room.name}${f.extra ? ', with an extra bed' : ''}` : null,
      stay && nights ? `Estimate from the website: ${lei(total)}${pct ? ` (with the ${pct}% discount)` : ''}` : null,
      f.msg ? '' : null,
      f.msg || null,
      '',
      `Name: ${f.name}`,
      `Phone: ${f.phone}`,
      f.email ? `Email: ${f.email}` : null,
    ],
    subject: (type, name) => `${type} request – ${name}`,
    ready: 'Your request is ready',
    title: 'Booking request',
    close: 'Close',
    sent1: 'Your email app has opened with the message written for you. Press “Send” there, and the guesthouse will reply with confirmation and deposit details.',
    sent2: 'If your email app did not open, copy the message below or call us directly.',
    copied: 'Copied',
    copy: 'Copy the message',
    back: '← Back to the form',
    what: 'What would you like',
    arrive: 'Arrival',
    date: 'Date',
    leave: 'Departure',
    pick: 'Choose',
    people: 'Guests',
    room: 'Room',
    pers: 'guests',
    extra: 'Extra bed',
    perNight: 'lei a night',
    off: (p) => `${p}% discount`,
    total: 'Estimated total',
    note: (d) => `Breakfast included. Deposit to confirm: 50%, that is ${d}.`,
    hint: ' From 3 nights you get 6% off.',
    empty: 'Choose your dates to see the price here.',
    name: 'Name',
    phone: 'Phone',
    email: 'Email (optional)',
    msg: 'Message (optional)',
    read: 'I have read the',
    privacy: 'privacy policy',
    and: 'and the',
    terms: 'booking terms',
    send: 'Send the request',
    call: 'Call',
    foot: 'A request is not yet a booking. The guesthouse confirms availability and price, and the booking is final once the 50% deposit is paid.',
  },
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
  const { ROOMS: ROOMS_L } = useData()
  const l = useT(L)
  const lang = useLang()
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
  const room = ROOMS_L.find((r) => r.id === f.room) || ROOMS_L[0]
  const nights = useMemo(() => Math.max(0, nightsBetween(f.from, f.to)), [f.from, f.to])
  const pct = discountFor(nights)
  const base = room.price * nights
  const off = Math.round((base * pct) / 100)
  const bed = f.extra ? EXTRA_BED * nights : 0
  const total = base - off + bed

  const message = () =>
    l
      .mail({ f, type: l.types[f.type], stay, nights, room, total, pct, lang })
      .filter((x) => x !== null)
      .join('\n')

  const submit = (e) => {
    e.preventDefault()
    if (stay && (!f.from || !f.to)) {
      setCal(true)
      return
    }
    const text = message()
    const subject = l.subject(l.types[f.type], f.name)
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
            {sent ? l.ready : l.title}
          </h2>
          <button type="button" className="x x--static" onClick={() => setOpen(false)} aria-label={l.close}>
            <Icon name="close" />
          </button>
        </div>

        {sent ? (
          <div className="sent">
            <p>{l.sent1}</p>
            <p className="muted">{l.sent2}</p>
            <pre className="sent__msg">{sent}</pre>
            <div className="drawer__actions">
              <button type="button" className="btn btn--line" onClick={copy}>
                {copied ? l.copied : l.copy}
              </button>
              <a className="btn" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> {CONTACT.phone}
              </a>
            </div>
            <p className="small muted">
              Email: <span className="sel">{CONTACT.email}</span>
            </p>
            <button type="button" className="link" onClick={() => setSent(null)}>
              {l.back}
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={submit}>
            <fieldset className="form__types">
              <legend className="sr-only">{l.what}</legend>
              {TYPES.map((t, n) => (
                <label key={t} className={`chip ${f.type === t ? 'on' : ''}`}>
                  <input ref={n === 0 ? first : undefined} type="radio" name="bk-type" value={t} checked={f.type === t} onChange={set('type')} />
                  {l.types[t]}
                </label>
              ))}
            </fieldset>

            <div className="dates">
              <button type="button" className={`dates__box ${cal ? 'is-open' : ''}`} onClick={() => setCal((c) => !c)} aria-expanded={cal}>
                <span className="dates__cell">
                  <span className="dates__l">{stay ? l.arrive : l.date}</span>
                  <span className="dates__v">{f.from ? longDate(f.from) : l.pick}</span>
                </span>
                {stay && (
                  <span className="dates__cell">
                    <span className="dates__l">{l.leave}</span>
                    <span className="dates__v">{f.to ? longDate(f.to) : l.pick}</span>
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
                  <span>{l.people}</span>
                  <input type="number" min="1" max="300" value={f.people} onChange={set('people')} />
                </label>
              )}
              {stay && (
                <>
                  <label className="field field--wide">
                    <span>{l.room}</span>
                    <select value={f.room} onChange={set('room')}>
                      {ROOMS_L.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.short} · {r.guests} {l.pers} · {r.price} lei
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>{l.people}</span>
                    <input type="number" min="1" max="6" value={f.people} onChange={set('people')} />
                  </label>
                  <label className="check">
                    <input type="checkbox" checked={f.extra} onChange={set('extra')} />
                    <span className="toggle" aria-hidden="true" />
                    <span>
                      {l.extra} <span className="muted">· {EXTRA_BED} {l.perNight}</span>
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
                        {l.nights(nights)} × {lei(room.price)}
                      </span>
                      <span className="num">{lei(base)}</span>
                    </div>
                    {pct > 0 && (
                      <div className="est__row est__row--off">
                        <span>{l.off(pct)}</span>
                        <span className="num">−{lei(off)}</span>
                      </div>
                    )}
                    {f.extra && (
                      <div className="est__row">
                        <span>{l.extra}</span>
                        <span className="num">{lei(bed)}</span>
                      </div>
                    )}
                    <div className="est__total">
                      <span>{l.total}</span>
                      <strong className="num">{lei(total)}</strong>
                    </div>
                    <p className="est__note">
                      {l.note(lei(total / 2))}
                      {!pct && nights < 3 ? l.hint : ''}
                    </p>
                  </>
                ) : (
                  <p className="est__note">{l.empty}</p>
                )}
              </div>
            )}

            <div className="form__grid">
              <label className="field">
                <span>{l.name}</span>
                <input required autoComplete="name" value={f.name} onChange={set('name')} />
              </label>
              <label className="field">
                <span>{l.phone}</span>
                <input required type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={set('phone')} />
              </label>
              <label className="field field--wide">
                <span>{l.email}</span>
                <input type="email" autoComplete="email" value={f.email} onChange={set('email')} />
              </label>
              <label className="field field--wide">
                <span>{l.msg}</span>
                <textarea rows="3" value={f.msg} onChange={set('msg')} />
              </label>
            </div>

            <label className="agree">
              <input type="checkbox" required checked={f.agree} onChange={set('agree')} />
              <span>
                {l.read}{' '}
                <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
                  {l.privacy}
                </button>{' '}
                {l.and}{' '}
                <button type="button" className="link" onClick={() => openLegal('termeni')}>
                  {l.terms}
                </button>
                .
              </span>
            </label>

            <div className="drawer__actions">
              <button type="submit" className="btn">
                {l.send} <Icon name="arrow" size={18} />
              </button>
              <a className="btn btn--line" href={CONTACT.phoneHref}>
                <Icon name="phone" size={18} /> {l.call}
              </a>
            </div>
            <p className="small muted">
              {l.foot}
            </p>
          </form>
        )}
      </aside>
    </div>
  )
}
