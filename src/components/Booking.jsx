// Rezervarea: un ecran întreg, pe pași, cu rezumatul alături.
// Cazare: perioada → camera → datele tale → confirmare. Masă, echitație, eveniment: detalii → datele tale → confirmare.
// Trimiterea și disponibilitatea trec prin src/api/booking.js (acolo se leagă backend-ul).
import { useEffect, useMemo, useRef, useState } from 'react'
import { CONTACT, ROOMS, EXTRA_BED, discountFor } from '../data/content.js'
import { useData } from '../data/index.js'
import { lei, useLockScroll, openLegal, Img } from '../lib.jsx'
import { useT, useLang, locale } from '../i18n.jsx'
import { getAvailability, createBooking, BOOKING_API } from '../api/booking.js'
import Icon from './Icon.jsx'
import DatePicker, { todayISO, addDaysISO, nightsBetween, fromISO } from './DatePicker.jsx'

// valorile rămân în română (le citește pensiunea); etichetele se traduc
const TYPES = ['Cazare', 'Masă la restaurant', 'Echitație', 'Eveniment']
const FLOW = { stay: ['dates', 'room', 'you', 'check'], other: ['details', 'you', 'check'] }

const fmt = (s, lang) => (s ? fromISO(s).toLocaleDateString(locale(lang), { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : '')
const isWeekend = (s) => [0, 6].includes(fromISO(s).getDay())

// orele propuse, după programul pensiunii
function timesFor(type, day) {
  const out = []
  if (type === 'Masă la restaurant') for (let h = 12; h <= 21; h++) out.push(`${h}:00`, ...(h < 21 ? [`${h}:30`] : []))
  if (type === 'Echitație') {
    const last = day && isWeekend(day) ? 16 : 14
    for (let h = 10; h <= last; h++) out.push(`${h}:00`)
  }
  return out
}

const L = {
  ro: {
    title: 'Rezervare',
    close: 'Închide',
    types: { Cazare: 'Cazare', 'Masă la restaurant': 'Masă la restaurant', Echitație: 'Echitație', Eveniment: 'Eveniment' },
    steps: { dates: 'Perioada', room: 'Camera', you: 'Datele tale', check: 'Confirmare', details: 'Detalii' },
    stepOf: (a, b) => `Pasul ${a} din ${b}`,
    hDates: 'Când vii?',
    hRoom: 'Alege camera',
    hYou: 'Datele tale',
    hCheck: 'Verifică și trimite',
    hDetails: {
      'Masă la restaurant': 'Masa ta la restaurant',
      Echitație: 'Plimbarea călare',
      Eveniment: 'Evenimentul tău',
    },
    what: 'Ce rezervi',
    adults: 'Adulți',
    children: 'Copii',
    childNote: 'sub 14 ani',
    people: 'Persoane',
    guests: 'Persoane',
    date: 'Data',
    time: 'Ora',
    pickTime: 'Alege ora',
    noTime: 'Ora o stabilim la telefon.',
    arrive: 'Sosire',
    leave: 'Plecare',
    pick: 'Alege data',
    nights: (n) => `${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    pers: (n) => `${n} ${n === 1 ? 'persoană' : 'persoane'}`,
    ppl: (a, c) => `${a} ${a === 1 ? 'adult' : 'adulți'}${c ? `, ${c} ${c === 1 ? 'copil' : 'copii'}` : ''}`,
    hintDates: 'Alege ziua sosirii, apoi ziua plecării.',
    hintOut: 'Acum alege ziua plecării.',
    perNight: 'lei / noapte',
    forStay: (n) => `pentru ${n} ${n === 1 ? 'noapte' : 'nopți'}`,
    breakfast: 'mic dejun inclus',
    upTo: (n) => `până la ${n} persoane`,
    free: 'Disponibilă',
    few: (n) => `Mai ${n === 1 ? 'e doar una' : `sunt doar ${n}`}`,
    taken: 'Ocupată în perioada aleasă',
    tooMany: (n) => `Pentru ${n} persoane e prea mică`,
    group: 'Pentru grupuri mai mari, sună-ne: împărțim grupul în mai multe camere.',
    choose: 'Alege',
    chosen: 'Aleasă',
    extra: 'Pat suplimentar',
    extraNote: `${EXTRA_BED} lei / noapte, fără mic dejun`,
    extraAuto: 'Adăugat automat, pentru numărul de persoane ales.',
    demo: 'Disponibilitatea exactă ți-o confirmăm la telefon sau pe email.',
    name: 'Nume și prenume',
    phone: 'Telefon',
    email: 'Email',
    emailOpt: 'Email (opțional)',
    msg: 'Mesaj (opțional)',
    msgPh: 'Ora sosirii, cereri speciale, alergii…',
    read: 'Am citit',
    privacy: 'politica de confidențialitate',
    and: 'și',
    terms: 'termenii de rezervare',
    errName: 'Scrie-ți numele.',
    errPhone: 'Scrie un număr de telefon la care te putem suna.',
    errAgree: 'Bifează că ai citit politica și termenii.',
    errDate: 'Alege data.',
    errTime: 'Alege ora.',
    back: 'Înapoi',
    next: 'Continuă',
    send: 'Trimite rezervarea',
    sending: 'Se trimite…',
    edit: 'Modifică',
    summary: 'Sejurul tău',
    summaryOther: 'Rezervarea ta',
    room: 'Camera',
    total: 'Total',
    deposit: 'Avans pentru confirmare (50%)',
    off: (p) => `Reducere ${p}%`,
    hintOff: 'De la 3 nopți ai 6% reducere, de la 5 nopți 12%.',
    notYet: 'Alege perioada ca să vezi prețul.',
    notRoom: 'Alege camera ca să vezi prețul.',
    withBed: 'cu pat suplimentar inclus',
    showSum: 'Vezi detaliile',
    hideSum: 'Ascunde detaliile',
    payNote: 'Nu plătești nimic acum. Pensiunea îți confirmă disponibilitatea, apoi rezervarea devine fermă după avansul de 50%.',
    payOther: 'Nu plătești nimic acum. Pensiunea te sună să confirme.',
    okApi: 'Rezervarea a fost trimisă',
    okApiP: (ref) => `Codul cererii tale este ${ref}. Pensiunea te contactează în curând pentru confirmare și avans.`,
    okMail: 'Mai ai un pas: trimite emailul',
    okMailP: 'Ți s-a deschis aplicația de email cu cererea scrisă. Apasă „Trimite” acolo și pensiunea îți răspunde cu confirmarea.',
    okMailP2: 'Nu s-a deschis emailul? Copiază cererea sau sună-ne direct.',
    copy: 'Copiază cererea',
    copied: 'Copiată',
    again: 'Rezervare nouă',
    fail: 'Nu am putut trimite cererea. Încearcă din nou sau sună-ne.',
    mailSubject: (type, name) => `Cerere ${type.toLowerCase()} – ${name}`,
    mailIntro: 'Bună ziua,',
    mailWant: (t) => `Aș dori: ${t.toLowerCase()}.`,
    mailStay: (a, b, n) => `Perioada: ${a} – ${b} (${n})`,
    mailDate: (a, t) => `Data: ${a}${t ? `, ora ${t}` : ''}`,
    mailPeople: (p) => `Persoane: ${p}`,
    mailRoom: (r, x) => `Camera: ${r}${x ? ', cu pat suplimentar' : ''}`,
    mailPrice: (t, p) => `Estimarea de pe site: ${t}${p ? ` (cu reducerea de ${p}%)` : ''}`,
    mailName: 'Nume',
    mailPhone: 'Telefon',
    mailEmail: 'Email',
  },
  en: {
    title: 'Booking',
    close: 'Close',
    types: { Cazare: 'Stay', 'Masă la restaurant': 'Restaurant table', Echitație: 'Horse riding', Eveniment: 'Event' },
    steps: { dates: 'Dates', room: 'Room', you: 'Your details', check: 'Confirm', details: 'Details' },
    stepOf: (a, b) => `Step ${a} of ${b}`,
    hDates: 'When are you coming?',
    hRoom: 'Choose your room',
    hYou: 'Your details',
    hCheck: 'Check and send',
    hDetails: {
      'Masă la restaurant': 'Your table at the restaurant',
      Echitație: 'Your ride',
      Eveniment: 'Your event',
    },
    what: 'What are you booking',
    adults: 'Adults',
    children: 'Children',
    childNote: 'under 14',
    people: 'Guests',
    guests: 'Guests',
    date: 'Date',
    time: 'Time',
    pickTime: 'Choose a time',
    noTime: 'We’ll agree the time by phone.',
    arrive: 'Arrival',
    leave: 'Departure',
    pick: 'Pick a date',
    nights: (n) => `${n} ${n === 1 ? 'night' : 'nights'}`,
    pers: (n) => `${n} ${n === 1 ? 'guest' : 'guests'}`,
    ppl: (a, c) => `${a} ${a === 1 ? 'adult' : 'adults'}${c ? `, ${c} ${c === 1 ? 'child' : 'children'}` : ''}`,
    hintDates: 'Pick your arrival day, then your departure day.',
    hintOut: 'Now pick your departure day.',
    perNight: 'lei a night',
    forStay: (n) => `for ${n} ${n === 1 ? 'night' : 'nights'}`,
    breakfast: 'breakfast included',
    upTo: (n) => `up to ${n} guests`,
    free: 'Available',
    few: (n) => (n === 1 ? 'Only one left' : `Only ${n} left`),
    taken: 'Booked for these dates',
    tooMany: (n) => `Too small for ${n} guests`,
    group: 'For larger groups, call us: we’ll split the group across several rooms.',
    choose: 'Choose',
    chosen: 'Chosen',
    extra: 'Extra bed',
    extraNote: `${EXTRA_BED} lei a night, without breakfast`,
    extraAuto: 'Added automatically for the number of guests you chose.',
    demo: 'We confirm exact availability by phone or email.',
    name: 'Full name',
    phone: 'Phone',
    email: 'Email',
    emailOpt: 'Email (optional)',
    msg: 'Message (optional)',
    msgPh: 'Arrival time, special requests, allergies…',
    read: 'I have read the',
    privacy: 'privacy policy',
    and: 'and the',
    terms: 'booking terms',
    errName: 'Please write your name.',
    errPhone: 'Please write a phone number we can call.',
    errAgree: 'Please confirm you have read the policy and terms.',
    errDate: 'Please choose a date.',
    errTime: 'Please choose a time.',
    back: 'Back',
    next: 'Continue',
    send: 'Send the booking',
    sending: 'Sending…',
    edit: 'Change',
    summary: 'Your stay',
    summaryOther: 'Your booking',
    room: 'Room',
    total: 'Total',
    deposit: 'Deposit to confirm (50%)',
    off: (p) => `${p}% discount`,
    hintOff: 'From 3 nights you get 6% off, from 5 nights 12%.',
    notYet: 'Choose your dates to see the price.',
    notRoom: 'Choose a room to see the price.',
    withBed: 'extra bed included',
    showSum: 'See details',
    hideSum: 'Hide details',
    payNote: 'You pay nothing now. The guesthouse confirms availability, and the booking is final once the 50% deposit is paid.',
    payOther: 'You pay nothing now. The guesthouse will call you to confirm.',
    okApi: 'Your booking has been sent',
    okApiP: (ref) => `Your request code is ${ref}. The guesthouse will contact you soon to confirm and arrange the deposit.`,
    okMail: 'One more step: send the email',
    okMailP: 'Your email app has opened with the request written for you. Press “Send” there, and the guesthouse will reply with confirmation.',
    okMailP2: 'Email app didn’t open? Copy the request or call us directly.',
    copy: 'Copy the request',
    copied: 'Copied',
    again: 'New booking',
    fail: 'We couldn’t send your request. Please try again or call us.',
    mailSubject: (type, name) => `${type} request – ${name}`,
    mailIntro: 'Hello,',
    mailWant: (t) => `I would like: ${t.toLowerCase()}.`,
    mailStay: (a, b, n) => `Dates: ${a} – ${b} (${n})`,
    mailDate: (a, t) => `Date: ${a}${t ? `, at ${t}` : ''}`,
    mailPeople: (p) => `Guests: ${p}`,
    mailRoom: (r, x) => `Room: ${r}${x ? ', with an extra bed' : ''}`,
    mailPrice: (t, p) => `Estimate from the website: ${t}${p ? ` (with the ${p}% discount)` : ''}`,
    mailName: 'Name',
    mailPhone: 'Phone',
    mailEmail: 'Email',
  },
}

function Stepper({ label, note, value, min, max, onChange }) {
  return (
    <div className="bk-count">
      <span className="bk-count__l">
        {label}
        {note && <span className="bk-count__n">{note}</span>}
      </span>
      <div className="step" role="group" aria-label={label}>
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${label} −1`}>
          −
        </button>
        <output className="num" aria-live="polite">
          {value}
        </output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${label} +1`}>
          +
        </button>
      </div>
    </div>
  )
}

const BLANK = {
  type: 'Cazare',
  from: '',
  to: '',
  time: '',
  adults: 2,
  children: 0,
  people: 2,
  room: '',
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
  const [f, setF] = useState(BLANK)
  const [step, setStep] = useState(0)
  const [tried, setTried] = useState(false)
  const [avail, setAvail] = useState({ rooms: {}, demo: true })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null) // { mode, ref, text }
  const [fail, setFail] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sumOpen, setSumOpen] = useState(false)
  const head = useRef(null)
  const body = useRef(null)
  const back = useRef(null)
  useLockScroll(open)

  const stay = f.type === 'Cazare'
  const flow = stay ? FLOW.stay : FLOW.other
  const cur = flow[Math.min(step, flow.length - 1)]
  const nights = useMemo(() => Math.max(0, nightsBetween(f.from, f.to)), [f.from, f.to])
  const guests = f.adults + f.children
  const room = ROOMS_L.find((r) => r.id === f.room)
  const roomPrice = (r) => avail.rooms[r.id]?.price ?? r.price
  const pct = discountFor(nights)
  const base = room ? roomPrice(room) * nights : 0
  const off = Math.round((base * pct) / 100)
  const bedOn = !!room && (f.extra || guests > room.guests)
  const bed = bedOn ? EXTRA_BED * nights : 0
  const total = base - off + bed
  const times = timesFor(f.type, f.from)

  // deschidere din orice buton „Rezervă”, cu ce știm deja (camera, datele, tipul)
  useEffect(() => {
    const on = (e) => {
      const d = e.detail || {}
      back.current = document.activeElement
      setDone(null)
      setFail(false)
      setTried(false)
      setSumOpen(false)
      setF((s) => {
        const n = { ...s }
        if (d.type) n.type = d.type
        if (d.from) n.from = d.from
        if (d.to) n.to = d.to
        if (d.people) n.adults = Math.max(1, Math.min(6, Number(d.people)))
        if (d.room) {
          n.room = d.room
          const r = ROOMS.find((x) => x.id === d.room)
          if (r && n.adults + n.children > r.guests + 1) n.adults = r.guests
        }
        if (n.from && n.from < todayISO()) n.from = n.to = ''
        return n
      })
      const type = d.type || 'Cazare'
      setStep(type === 'Cazare' && d.from && d.to ? 1 : 0)
      setOpen(true)
    }
    window.addEventListener('baciu:book', on)
    return () => window.removeEventListener('baciu:book', on)
  }, [])

  useEffect(() => {
    if (!open) {
      back.current?.focus?.({ preventScroll: true })
      return
    }
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  // la fiecare pas nou: sus și focus pe titlu
  useEffect(() => {
    if (!open) return
    body.current?.scrollTo({ top: 0 })
    const t = setTimeout(() => head.current?.focus({ preventScroll: true }), 80)
    return () => clearTimeout(t)
  }, [step, open, done])

  // disponibilitatea, când se schimbă perioada sau persoanele
  useEffect(() => {
    if (!open || !stay || !f.from || !f.to) return
    let on = true
    getAvailability({ from: f.from, to: f.to, guests })
      .then((a) => on && setAvail(a || { rooms: {} }))
      .catch(() => on && setAvail({ rooms: {}, demo: true }))
    return () => {
      on = false
    }
  }, [open, stay, f.from, f.to, guests])

  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const fits = (r) => guests <= r.guests + 1
  const free = (r) => avail.rooms[r.id]?.available !== false

  const errors = {
    from: !f.from,
    time: times.length > 0 && !f.time,
    name: f.name.trim().length < 3,
    phone: f.phone.replace(/\D/g, '').length < 9,
    agree: !f.agree,
  }
  const valid = {
    dates: !!f.from && !!f.to && nights > 0,
    room: !!room && fits(room) && free(room),
    details: !errors.from && !errors.time && f.people > 0,
    you: !errors.name && !errors.phone && !errors.agree,
    check: true,
  }

  const go = (n) => {
    setTried(false)
    setStep(Math.max(0, Math.min(flow.length - 1, n)))
  }
  const next = () => {
    if (!valid[cur]) {
      setTried(true)
      return
    }
    go(step + 1)
  }

  const peopleText = stay || f.type === 'Echitație' ? l.ppl(f.adults, f.children) : l.pers(f.people)
  const text = () =>
    [
      l.mailIntro,
      '',
      l.mailWant(l.types[f.type]),
      stay ? l.mailStay(fmt(f.from, lang), fmt(f.to, lang), l.nights(nights)) : l.mailDate(fmt(f.from, lang), f.time),
      l.mailPeople(peopleText),
      stay && room ? l.mailRoom(room.name, bedOn) : null,
      stay && room ? l.mailPrice(lei(total), pct) : null,
      f.msg ? '' : null,
      f.msg || null,
      '',
      `${l.mailName}: ${f.name}`,
      `${l.mailPhone}: ${f.phone}`,
      f.email ? `${l.mailEmail}: ${f.email}` : null,
    ]
      .filter((x) => x !== null)
      .join('\n')

  const send = async () => {
    setSending(true)
    setFail(false)
    const t = text()
    try {
      const res = await createBooking({
        type: f.type,
        lang,
        from: f.from,
        to: stay ? f.to : undefined,
        time: f.time || undefined,
        adults: stay || f.type === 'Echitație' ? f.adults : f.people,
        children: stay || f.type === 'Echitație' ? f.children : 0,
        room: stay ? f.room : undefined,
        extraBed: stay ? bedOn : undefined,
        price: stay
          ? { perNight: room ? roomPrice(room) : 0, nights, base, discountPct: pct, discount: off, extraBed: bed, total, deposit: Math.round(total / 2) }
          : undefined,
        guest: { name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), message: f.msg.trim() },
        text: t,
        subject: l.mailSubject(l.types[f.type], f.name.trim()),
      })
      if (res.ok === false) throw new Error(res.error || 'fail')
      setDone({ mode: res.mode, ref: res.ref, text: t })
    } catch {
      setFail(true)
    } finally {
      setSending(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(done.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* copierea nu e permisă aici */
    }
  }

  const reset = () => {
    setF((s) => ({ ...BLANK, name: s.name, phone: s.phone, email: s.email, agree: s.agree }))
    setDone(null)
    setStep(0)
  }

  const err = (k, msg) => tried && errors[k] && <span className="bk-err">{msg}</span>

  /* ---------- pașii ---------- */
  const stepDates = (
    <>
      <fieldset className="form__types">
        <legend className="sr-only">{l.what}</legend>
        {TYPES.map((t) => (
          <label key={t} className={`chip ${f.type === t ? 'on' : ''}`}>
            <input
              type="radio"
              name="bk-type"
              value={t}
              checked={f.type === t}
              onChange={() => {
                setF((x) => ({ ...x, type: t, time: '', people: t === 'Eveniment' ? Math.max(x.people, 30) : Math.min(x.people, 12) }))
                setTried(false)
              }}
            />
            {l.types[t]}
          </label>
        ))}
      </fieldset>
      {stay ? (
        <>
          <div className="bk-when">
            <div className={`bk-when__c ${f.from && !f.to ? '' : 'on'}`}>
              <span>{l.arrive}</span>
              <strong>{f.from ? fmt(f.from, lang) : l.pick}</strong>
            </div>
            <div className={`bk-when__c ${f.from && !f.to ? 'on' : ''}`}>
              <span>{l.leave}</span>
              <strong>{f.to ? fmt(f.to, lang) : l.pick}</strong>
            </div>
          </div>
          <div className="bk-cal">
            <DatePicker
              key={`${lang}-${open}`}
              from={f.from}
              to={f.to}
              months={2}
              onChange={({ from, to }) => setF((s) => ({ ...s, from, to }))}
            />
            <p className="bk-hint" aria-live="polite">
              {f.from && f.to ? `${l.nights(nights)}${pct ? ` · ${l.off(pct)}` : ''}` : f.from ? l.hintOut : l.hintDates}
            </p>
          </div>
          <div className="bk-counts">
            <Stepper label={l.adults} value={f.adults} min={1} max={6} onChange={(v) => set('adults', v)} />
            <Stepper label={l.children} note={l.childNote} value={f.children} min={0} max={4} onChange={(v) => set('children', v)} />
          </div>
          {tried && !valid.dates && <span className="bk-err">{l.hintDates}</span>}
        </>
      ) : null}
    </>
  )

  const stepRoom = (
    <>
      <ul className="bk-rooms">
        {ROOMS_L.map((r) => {
          const ok = fits(r)
          const isFree = free(r)
          const left = avail.rooms[r.id]?.left
          const price = roomPrice(r)
          const sub = price * nights
          const t = sub - Math.round((sub * pct) / 100) + (guests > r.guests ? EXTRA_BED * nights : 0)
          const on = f.room === r.id
          const dis = !ok || !isFree
          return (
            <li key={r.id} className={`bk-room ${on ? 'on' : ''} ${dis ? 'off' : ''}`}>
              <button type="button" className="bk-room__b" disabled={dis} aria-pressed={on} onClick={() => set('room', r.id)}>
                <span className="bk-room__pic">
                  <Img name={r.img} alt="" sizes="(max-width: 760px) 40vw, 220px" />
                </span>
                <span className="bk-room__txt">
                  <span className="bk-room__name">{r.name}</span>
                  <span className="bk-room__meta">
                    {r.beds} · {l.upTo(r.guests)} · {l.breakfast}
                  </span>
                  <span className={`bk-room__st ${dis ? 'is-no' : left && left < 3 ? 'is-few' : ''}`}>
                    {!ok ? l.tooMany(guests) : !isFree ? l.taken : left && left < 3 ? l.few(left) : l.free}
                  </span>
                </span>
                <span className="bk-room__price">
                  <strong className="num">{lei(t)}</strong>
                  <span>{l.forStay(nights)}</span>
                  <span className="bk-room__pn num">
                    {price} {l.perNight}
                  </span>
                  {ok && guests > r.guests && <span className="bk-room__pn">{l.withBed}</span>}
                  <span className="bk-room__cta" aria-hidden="true">
                    {on ? (
                      <>
                        <Icon name="check" size={16} /> {l.chosen}
                      </>
                    ) : (
                      l.choose
                    )}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {guests > 4 && <p className="bk-note">{l.group}</p>}
      {room && (
        <label className="check bk-extra">
          <input type="checkbox" checked={bedOn} disabled={guests > room.guests} onChange={(e) => set('extra', e.target.checked)} />
          <span className="toggle" aria-hidden="true" />
          <span>
            {l.extra} <span className="muted">· {l.extraNote}</span>
            {guests > room.guests && <span className="bk-note bk-note--in">{l.extraAuto}</span>}
          </span>
        </label>
      )}
      {(avail.demo || !BOOKING_API) && <p className="bk-note">{l.demo}</p>}
      {tried && !valid.room && <span className="bk-err">{l.hRoom}</span>}
    </>
  )

  const stepDetails = (
    <>
      <fieldset className="form__types">
        <legend className="sr-only">{l.what}</legend>
        {TYPES.map((t) => (
          <label key={t} className={`chip ${f.type === t ? 'on' : ''}`}>
            <input
              type="radio"
              name="bk-type2"
              value={t}
              checked={f.type === t}
              onChange={() => setF((x) => ({ ...x, type: t, time: '', people: t === 'Eveniment' ? Math.max(x.people, 30) : Math.min(x.people, 12) }))}
            />
            {l.types[t]}
          </label>
        ))}
      </fieldset>
      <div className="bk-cal bk-cal--one">
        <p className="bk-lbl">
          {l.date}
          {f.from ? <strong> · {fmt(f.from, lang)}</strong> : null}
        </p>
        <DatePicker
          key={`${lang}-${f.type}-${open}`}
          from={f.from}
          to=""
          single
          months={1}
          onChange={({ from }) => setF((s) => ({ ...s, from, time: '' }))}
        />
        {err('from', l.errDate)}
      </div>
      {f.type !== 'Eveniment' ? (
        <div className="bk-times">
          <p className="bk-lbl">{l.time}</p>
          {f.from ? (
            <div className="bk-times__list" role="radiogroup" aria-label={l.pickTime}>
              {times.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={f.time === t} className={`bk-time ${f.time === t ? 'on' : ''}`} onClick={() => set('time', t)}>
                  <span className="num">{t}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="bk-note">{l.errDate}</p>
          )}
          {err('time', l.errTime)}
        </div>
      ) : (
        <p className="bk-note">{l.noTime}</p>
      )}
      {f.type === 'Echitație' ? (
        <div className="bk-counts">
          <Stepper label={l.adults} value={f.adults} min={1} max={6} onChange={(v) => set('adults', v)} />
          <Stepper label={l.children} note={l.childNote} value={f.children} min={0} max={6} onChange={(v) => set('children', v)} />
        </div>
      ) : (
        <label className="field bk-num">
          <span>{l.people}</span>
          <input type="number" min="1" max="300" inputMode="numeric" value={f.people} onChange={(e) => set('people', Math.max(1, Number(e.target.value) || 1))} />
        </label>
      )}
    </>
  )

  const stepYou = (
    <div className="form__grid">
      <label className="field field--wide">
        <span>{l.name}</span>
        <input autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} aria-invalid={tried && errors.name} />
        {err('name', l.errName)}
      </label>
      <label className="field">
        <span>{l.phone}</span>
        <input type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} aria-invalid={tried && errors.phone} />
        {err('phone', l.errPhone)}
      </label>
      <label className="field">
        <span>{l.emailOpt}</span>
        <input type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
      </label>
      <label className="field field--wide">
        <span>{l.msg}</span>
        <textarea rows="3" placeholder={l.msgPh} value={f.msg} onChange={(e) => set('msg', e.target.value)} />
      </label>
      <label className="agree field--wide">
        <input type="checkbox" checked={f.agree} onChange={(e) => set('agree', e.target.checked)} aria-invalid={tried && errors.agree} />
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
      {err('agree', l.errAgree)}
    </div>
  )

  const Row = ({ k, v, to }) => (
    <div className="bk-rev__r">
      <dt>{k}</dt>
      <dd>{v}</dd>
      {to !== undefined && (
        <button type="button" className="link" onClick={() => go(to)}>
          {l.edit}
        </button>
      )}
    </div>
  )
  const stepCheck = (
    <>
      <dl className="bk-rev">
        <Row k={l.what} v={l.types[f.type]} to={0} />
        {stay ? (
          <>
            <Row k={l.arrive} v={fmt(f.from, lang)} to={0} />
            <Row k={l.leave} v={`${fmt(f.to, lang)} · ${l.nights(nights)}`} to={0} />
            <Row k={l.guests} v={peopleText} to={0} />
            <Row k={l.room} v={`${room?.name || ''}${bedOn ? ` + ${l.extra.toLowerCase()}` : ''}`} to={1} />
          </>
        ) : (
          <>
            <Row k={l.date} v={`${fmt(f.from, lang)}${f.time ? ` · ${f.time}` : ''}`} to={0} />
            <Row k={l.guests} v={peopleText} to={0} />
          </>
        )}
        <Row k={l.name} v={f.name} to={flow.indexOf('you')} />
        <Row k={l.phone} v={f.phone} to={flow.indexOf('you')} />
        {f.email && <Row k={l.email} v={f.email} to={flow.indexOf('you')} />}
        {f.msg && <Row k={l.msg.replace(/ \(.*\)/, '')} v={f.msg} to={flow.indexOf('you')} />}
      </dl>
      <p className="bk-note">{stay ? l.payNote : l.payOther}</p>
      {fail && (
        <p className="bk-err" role="alert">
          {l.fail}
        </p>
      )}
    </>
  )

  const content = { dates: stepDates, room: stepRoom, details: stepDetails, you: stepYou, check: stepCheck }
  const heading = { dates: l.hDates, room: l.hRoom, you: l.hYou, check: l.hCheck, details: l.hDetails[f.type] }

  /* ---------- rezumatul ---------- */
  const sumPic = room?.img || (stay ? 'camera-tripla' : f.type === 'Echitație' ? 'calarie-instructor' : f.type === 'Eveniment' ? 'masa-festiva' : 'restaurant')
  const summary = (
    <div className="bk-sum__in">
      <div className="bk-sum__pic">
        <Img key={sumPic} name={sumPic} alt="" sizes="360px" />
      </div>
      <p className="bk-sum__h">{stay ? l.summary : l.summaryOther}</p>
      <dl className="bk-sum__dl">
        {stay ? (
          <>
            <div>
              <dt>{l.arrive}</dt>
              <dd>{f.from ? fmt(f.from, lang) : '–'}</dd>
            </div>
            <div>
              <dt>{l.leave}</dt>
              <dd>{f.to ? fmt(f.to, lang) : '–'}</dd>
            </div>
            <div>
              <dt>{l.guests}</dt>
              <dd>{peopleText}</dd>
            </div>
            <div>
              <dt>{l.room}</dt>
              <dd>{room ? room.name : '–'}</dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt>{l.types[f.type]}</dt>
              <dd>{f.from ? `${fmt(f.from, lang)}${f.time ? ` · ${f.time}` : ''}` : '–'}</dd>
            </div>
            <div>
              <dt>{l.guests}</dt>
              <dd>{peopleText}</dd>
            </div>
          </>
        )}
      </dl>
      {stay &&
        (room && nights > 0 ? (
          <div className="bk-sum__price">
            <div className="est__row">
              <span>
                {l.nights(nights)} × {lei(roomPrice(room))}
              </span>
              <span className="num">{lei(base)}</span>
            </div>
            {pct > 0 && (
              <div className="est__row est__row--off">
                <span>{l.off(pct)}</span>
                <span className="num">−{lei(off)}</span>
              </div>
            )}
            {bedOn && (
              <div className="est__row">
                <span>{l.extra}</span>
                <span className="num">{lei(bed)}</span>
              </div>
            )}
            <div className="est__total">
              <span>{l.total}</span>
              <strong className="num">{lei(total)}</strong>
            </div>
            <div className="est__row bk-sum__dep">
              <span>{l.deposit}</span>
              <span className="num">{lei(Math.round(total / 2))}</span>
            </div>
            {!pct && nights < 3 && <p className="est__note">{l.hintOff}</p>}
          </div>
        ) : (
          <p className="est__note">{nights && stay && !room ? l.notRoom : l.notYet}</p>
        ))}
      <a className="bk-sum__call" href={CONTACT.phoneHref}>
        <Icon name="phone" size={16} /> {CONTACT.phone}
      </a>
    </div>
  )

  const last = step === flow.length - 1

  return (
    <div className={`bk ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={l.title}>
      <header className="bk__bar">
        <p className="bk__brand">
          Pensiunea Baciu <span>· {l.title}</span>
        </p>
        {!done && (
          <ol className="bk__steps">
            {flow.map((s, i) => (
              <li key={s} className={`${i === step ? 'on' : ''} ${i < step ? 'ok' : ''}`}>
                <button type="button" disabled={i > step} onClick={() => go(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className="bk__dot num">{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
                  <span className="bk__sl">{l.steps[s]}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
        <button type="button" className="x x--static" onClick={() => setOpen(false)} aria-label={l.close}>
          <Icon name="close" />
        </button>
      </header>

      <div className="bk__grid">
        <main className="bk__main" ref={body} data-lenis-prevent>
          {done ? (
            <div className="bk-done">
              <span className="bk-done__ico" aria-hidden="true">
                <Icon name={done.mode === 'api' ? 'check' : 'mail'} size={30} />
              </span>
              <h2 className="bk__h" ref={head} tabIndex={-1}>
                {done.mode === 'api' ? l.okApi : l.okMail}
              </h2>
              <p className="bk-done__p">{done.mode === 'api' ? l.okApiP(done.ref || '–') : l.okMailP}</p>
              {done.mode === 'api' && (
                <div className="bk-done__btns">
                  <a className="btn btn--line" href={CONTACT.phoneHref}>
                    <Icon name="phone" size={18} /> {CONTACT.phone}
                  </a>
                </div>
              )}
              {done.mode !== 'api' && (
                <>
                  <p className="muted">{l.okMailP2}</p>
                  <pre className="sent__msg">{done.text}</pre>
                  <div className="bk-done__btns">
                    <button type="button" className="btn btn--line" onClick={copy}>
                      {copied ? l.copied : l.copy}
                    </button>
                    <a className="btn" href={CONTACT.phoneHref}>
                      <Icon name="phone" size={18} /> {CONTACT.phone}
                    </a>
                  </div>
                </>
              )}
              <button type="button" className="link" onClick={reset}>
                {l.again}
              </button>
            </div>
          ) : (
            <div className="bk-step" key={`${cur}-${f.type}`}>
              <p className="bk__k">{l.stepOf(step + 1, flow.length)}</p>
              <h2 className="bk__h" ref={head} tabIndex={-1}>
                {heading[cur]}
              </h2>
              {content[cur]}
            </div>
          )}
        </main>

        {!done && (
          <aside className={`bk-sum ${sumOpen ? 'is-open' : ''}`} aria-label={stay ? l.summary : l.summaryOther}>
            {summary}
          </aside>
        )}
      </div>

      {!done && (
        <footer className="bk__foot">
          <button type="button" className="bk__mini" onClick={() => setSumOpen((o) => !o)} aria-expanded={sumOpen}>
            {stay && room && nights > 0 ? (
              <>
                <strong className="num">{lei(total)}</strong>
                <span className="bk__mn">{l.nights(nights)}</span>
              </>
            ) : (
              <span>{sumOpen ? l.hideSum : l.showSum}</span>
            )}
            <Icon name="down" size={16} />
          </button>
          <div className="bk__nav">
            {step > 0 && (
              <button type="button" className="btn btn--line bk__back" onClick={() => go(step - 1)} aria-label={l.back}>
                <Icon name="left" size={18} />
                <span className="bk__bl">{l.back}</span>
              </button>
            )}
            {last ? (
              <button type="button" className="btn btn--brass" onClick={send} disabled={sending}>
                {sending ? l.sending : l.send} {!sending && <Icon name="arrow" size={18} />}
              </button>
            ) : (
              <button type="button" className="btn" onClick={next}>
                {l.next} <Icon name="arrow" size={18} />
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}
