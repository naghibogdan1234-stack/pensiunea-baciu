// Fereastra de rezervare: pe tot ecranul, pe pași, cu rezumatul alături.
//
//   Cazare:                   Perioada → Camera → Datele tale → Confirmare
//   Masă, echitație, eveniment: Detalii → Datele tale → Confirmare
//
// Se deschide de oriunde cu openBooking({ type, room, from, to, people }) (events.js).
// Legătura cu backend-ul e în src/api/booking.js: getAvailability() când se schimbă perioada,
// createBooking() la „Trimite”. Fără backend, cererea pleacă pe email.
//
// Fișierele rezervării:
//   Booking.jsx   starea formularului, pașii, trimiterea și scheletul ferestrei (acest fișier)
//   steps.jsx     conținutul fiecărui pas
//   Summary.jsx   rezumatul cu prețul
//   rules.js      tipuri, pași, ore, calculul prețului, ce se trimite
//   texts.js      textele în română și engleză
import { useEffect, useMemo, useRef, useState } from 'react'
import { CONTACT, ROOMS } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { lei, todayISO, nightsBetween } from '../../lib/format.js'
import { useLockScroll } from '../../lib/scroll.js'
import { EVENTS } from '../../events.js'
import { useTexts, useLang } from '../../i18n.jsx'
import { getAvailability, createBooking } from '../../api/booking.js'
import Icon from '../ui/Icon.jsx'
import { TEXT } from './texts.js'
import { FLOW, BLANK_FORM, LIMITS, isStay, timesFor, fitsRoom, priceFor, noRoomPrice, requestText, bookingPayload } from './rules.js'
import { StepDates, StepRoom, StepDetails, StepYou, StepCheck } from './steps.jsx'
import Summary from './Summary.jsx'

const STEPS = { dates: StepDates, room: StepRoom, details: StepDetails, you: StepYou, check: StepCheck }

export default function Booking() {
  const { ROOMS: rooms } = useData() // camerele în limba curentă
  const txt = useTexts(TEXT)
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(BLANK_FORM)
  const [step, setStep] = useState(0) // indexul în FLOW.stay sau FLOW.other
  const [tried, setTried] = useState(false) // a încercat „Continuă” cu erori: acum le arătăm
  const [avail, setAvail] = useState({ rooms: {}, demo: true }) // răspunsul de la backend (demo = fără backend)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(null) // după trimitere: { mode: 'api' | 'email', ref, text }
  const [failed, setFailed] = useState(false)
  const [copied, setCopied] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false) // panoul cu rezumatul, pe telefon
  const headingRef = useRef(null)
  const bodyRef = useRef(null)
  const returnFocus = useRef(null) // butonul care a deschis fereastra; primește focusul înapoi la închidere
  useLockScroll(open)

  /* ---------- ce rezultă din formular ---------- */
  const stay = isStay(form.type)
  const flow = stay ? FLOW.stay : FLOW.other
  const current = flow[Math.min(step, flow.length - 1)] // numele pasului: 'dates', 'room'...
  const nights = useMemo(() => Math.max(0, nightsBetween(form.from, form.to)), [form.from, form.to])
  const guests = form.adults + form.children
  const room = rooms.find((r) => r.id === form.room)
  const perNightOf = (r) => avail.rooms[r.id]?.price ?? r.price // prețul de la backend are întâietate
  const isFree = (r) => avail.rooms[r.id]?.available !== false
  const price = room ? priceFor({ room, nights, guests, extra: form.extra, perNight: perNightOf(room) }) : noRoomPrice(nights)
  const times = timesFor(form.type, form.from)
  const peopleText = stay || form.type === 'Echitație' ? txt.ppl(form.adults, form.children) : txt.pers(form.people)

  /* ---------- deschiderea, din orice buton „Rezervă” ---------- */
  useEffect(() => {
    const onOpen = (e) => {
      const prefill = e.detail || {}
      returnFocus.current = document.activeElement
      setDone(null)
      setFailed(false)
      setTried(false)
      setSummaryOpen(false)
      // păstrăm ce scrisese vizitatorul înainte și punem peste ce vine din butonul apăsat
      setForm((f) => {
        const next = { ...f }
        if (prefill.type) next.type = prefill.type
        if (prefill.from) next.from = prefill.from
        if (prefill.to) next.to = prefill.to
        if (prefill.people) next.adults = Math.max(LIMITS.adults[0], Math.min(LIMITS.adults[1], Number(prefill.people)))
        if (prefill.room) {
          next.room = prefill.room
          const r = ROOMS.find((x) => x.id === prefill.room)
          if (r && !fitsRoom(r, next.adults + next.children)) next.adults = r.guests
        }
        if (next.from && next.from < todayISO()) next.from = next.to = '' // date vechi, rămase de data trecută
        return next
      })
      // cazare cu ambele date deja alese: sărim direct la camere
      const type = prefill.type || 'Cazare'
      setStep(isStay(type) && prefill.from && prefill.to ? 1 : 0)
      setOpen(true)
    }
    window.addEventListener(EVENTS.book, onOpen)
    return () => window.removeEventListener(EVENTS.book, onOpen)
  }, [])

  // Escape închide; la închidere, focusul revine pe butonul de unde s-a deschis
  useEffect(() => {
    if (!open) {
      returnFocus.current?.focus?.({ preventScroll: true })
      return
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // la fiecare pas nou: sus, și focus pe titlu (cititoarele de ecran anunță pasul)
  useEffect(() => {
    if (!open) return
    bodyRef.current?.scrollTo({ top: 0 })
    const t = setTimeout(() => headingRef.current?.focus({ preventScroll: true }), 80)
    return () => clearTimeout(t)
  }, [step, open, done])

  // disponibilitatea camerelor, de fiecare dată când se schimbă perioada sau numărul de persoane
  useEffect(() => {
    if (!open || !stay || !form.from || !form.to) return
    let current = true // un răspuns vechi, venit după unul nou, se ignoră
    getAvailability({ from: form.from, to: form.to, guests })
      .then((a) => current && setAvail(a || { rooms: {} }))
      .catch(() => current && setAvail({ rooms: {}, demo: true }))
    return () => {
      current = false
    }
  }, [open, stay, form.from, form.to, guests])

  /* ---------- validarea ---------- */
  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))
  const errors = {
    from: !form.from,
    time: times.length > 0 && !form.time,
    name: form.name.trim().length < 3,
    phone: form.phone.replace(/\D/g, '').length < 9, // cel puțin 9 cifre
    agree: !form.agree,
  }
  // poate trece de pasul acesta?
  const valid = {
    dates: !!form.from && !!form.to && nights > 0,
    room: !!room && fitsRoom(room, guests) && isFree(room),
    details: !errors.from && !errors.time && form.people > 0,
    you: !errors.name && !errors.phone && !errors.agree,
    check: true,
  }
  const errorFor = (field, message) => tried && errors[field] && <span className="bk-err">{message}</span>

  /* ---------- navigarea între pași ---------- */
  const goTo = (n) => {
    setTried(false)
    setStep(Math.max(0, Math.min(flow.length - 1, n)))
  }
  const next = () => {
    if (!valid[current]) {
      setTried(true) // arătăm erorile
      return
    }
    goTo(step + 1)
  }
  const isLast = step === flow.length - 1

  /* ---------- trimiterea ---------- */
  const send = async () => {
    setSending(true)
    setFailed(false)
    const text = requestText({ form, txt, lang, nights, room, price, peopleText })
    try {
      const res = await createBooking(bookingPayload({ form, txt, lang, nights, price, text }))
      if (res.ok === false) throw new Error(res.error || 'fail')
      setDone({ mode: res.mode, ref: res.ref, text })
    } catch {
      setFailed(true)
    } finally {
      setSending(false)
    }
  }

  // ecranul de după trimitere, fără backend: cererea se poate copia, dacă nu s-a deschis aplicația de email
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(done.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* copierea nu e permisă aici */
    }
  }

  // „Rezervare nouă”: păstrăm numele, telefonul, emailul și acordul
  const reset = () => {
    setForm((f) => ({ ...BLANK_FORM, name: f.name, phone: f.phone, email: f.email, agree: f.agree }))
    setDone(null)
    setStep(0)
  }

  // tot ce le trebuie pașilor și rezumatului
  const bk = {
    form, setForm, update, setTried, txt, lang, open, stay, flow, goTo,
    rooms, avail, nights, guests, room, price, times, peopleText, perNightOf, isFree,
    tried, errors, valid, errorFor, failed,
  }
  const headings = { dates: txt.hDates, room: txt.hRoom, you: txt.hYou, check: txt.hCheck, details: txt.hDetails[form.type] }
  const CurrentStep = STEPS[current]

  return (
    <div className={`bk ${open ? 'is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label={txt.title}>
      {/* sus: numele, pașii (se poate sări înapoi la un pas făcut), închide */}
      <header className="bk__bar">
        <p className="bk__brand">
          Pensiunea Baciu <span>· {txt.title}</span>
        </p>
        {!done && (
          <ol className="bk__steps">
            {flow.map((s, i) => (
              <li key={s} className={`${i === step ? 'on' : ''} ${i < step ? 'ok' : ''}`}>
                <button type="button" disabled={i > step} onClick={() => goTo(i)} aria-current={i === step ? 'step' : undefined}>
                  <span className="bk__dot num">{i < step ? <Icon name="check" size={13} /> : i + 1}</span>
                  <span className="bk__sl">{txt.steps[s]}</span>
                </button>
              </li>
            ))}
          </ol>
        )}
        <button type="button" className="x x--static" onClick={() => setOpen(false)} aria-label={txt.close}>
          <Icon name="close" />
        </button>
      </header>

      <div className="bk__grid">
        <main className="bk__main" ref={bodyRef} data-lenis-prevent>
          {done ? (
            <Done done={done} txt={txt} headingRef={headingRef} copied={copied} onCopy={copy} onReset={reset} />
          ) : (
            // key: la alt pas (sau alt tip) conținutul pornește de la zero, cu animația de intrare
            <div className="bk-step" key={`${current}-${form.type}`}>
              <p className="bk__k">{txt.stepOf(step + 1, flow.length)}</p>
              <h2 className="bk__h" ref={headingRef} tabIndex={-1}>
                {headings[current]}
              </h2>
              <CurrentStep bk={bk} />
            </div>
          )}
        </main>

        {!done && (
          <aside className={`bk-sum ${summaryOpen ? 'is-open' : ''}`} aria-label={stay ? txt.summary : txt.summaryOther}>
            <Summary bk={bk} />
          </aside>
        )}
      </div>

      {/* jos: pe telefon totalul (deschide rezumatul), apoi Înapoi și Continuă / Trimite */}
      {!done && (
        <footer className="bk__foot">
          <button type="button" className="bk__mini" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen}>
            {stay && room && nights > 0 ? (
              <>
                <strong className="num">{lei(price.total)}</strong>
                <span className="bk__mn">{txt.nights(nights)}</span>
              </>
            ) : (
              <span>{summaryOpen ? txt.hideSum : txt.showSum}</span>
            )}
            <Icon name="down" size={16} />
          </button>
          <div className="bk__nav">
            {step > 0 && (
              <button type="button" className="btn btn--line bk__back" onClick={() => goTo(step - 1)} aria-label={txt.back}>
                <Icon name="left" size={18} />
                <span className="bk__bl">{txt.back}</span>
              </button>
            )}
            {isLast ? (
              <button type="button" className="btn btn--brass" onClick={send} disabled={sending}>
                {sending ? txt.sending : txt.send} {!sending && <Icon name="arrow" size={18} />}
              </button>
            ) : (
              <button type="button" className="btn" onClick={next}>
                {txt.next} <Icon name="arrow" size={18} />
              </button>
            )}
          </div>
        </footer>
      )}
    </div>
  )
}

/**
 * Ecranul de după trimitere.
 *   mode 'api'    backend-ul a primit cererea: arătăm codul ei (ref) și telefonul
 *   mode 'email'  s-a deschis aplicația de email: arătăm cererea, cu „Copiază” și telefonul
 */
function Done({ done, txt, headingRef, copied, onCopy, onReset }) {
  const api = done.mode === 'api'
  return (
    <div className="bk-done">
      <span className="bk-done__ico" aria-hidden="true">
        <Icon name={api ? 'check' : 'mail'} size={30} />
      </span>
      <h2 className="bk__h" ref={headingRef} tabIndex={-1}>
        {api ? txt.okApi : txt.okMail}
      </h2>
      <p className="bk-done__p">{api ? txt.okApiP(done.ref || '–') : txt.okMailP}</p>
      {api && (
        <div className="bk-done__btns">
          <a className="btn btn--line" href={CONTACT.phoneHref}>
            <Icon name="phone" size={18} /> {CONTACT.phone}
          </a>
        </div>
      )}
      {!api && (
        <>
          <p className="muted">{txt.okMailP2}</p>
          <pre className="sent__msg">{done.text}</pre>
          <div className="bk-done__btns">
            <button type="button" className="btn btn--line" onClick={onCopy}>
              {copied ? txt.copied : txt.copy}
            </button>
            <a className="btn" href={CONTACT.phoneHref}>
              <Icon name="phone" size={18} /> {CONTACT.phone}
            </a>
          </div>
        </>
      )}
      <button type="button" className="link" onClick={onReset}>
        {txt.again}
      </button>
    </div>
  )
}
