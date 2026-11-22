// Pașii ferestrei de rezervare. Fiecare pas e o componentă și primește un singur obiect, `bk`,
// cu tot ce știe Booking.jsx: formularul, funcția de schimbat un câmp, textele, prețul, erorile...
//
//   cazare:                StepDates → StepRoom → StepYou → StepCheck
//   masă / călărie / ev.:  StepDetails → StepYou → StepCheck
//
// Erorile apar doar după ce vizitatorul a încercat să treacă mai departe (bk.tried), nu cât încă scrie.
import { Img } from '../../lib/Img.jsx'
import { lei } from '../../lib/format.js'
import { openLegal } from '../../events.js'
import { BOOKING_API } from '../../api/booking.js'
import Icon from '../ui/Icon.jsx'
import DatePicker from '../ui/DatePicker.jsx'
import { TYPES, LIMITS, peopleForType, fitsRoom, priceFor, fmt } from './rules.js'

/** − număr + (persoane). */
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

/** Ce rezervi: Cazare / Masă / Echitație / Eveniment. Apare în primul pas al fiecărui drum. */
function TypePicker({ bk, name }) {
  const { form, setForm, setTried, txt } = bk
  return (
    <fieldset className="form__types">
      <legend className="sr-only">{txt.what}</legend>
      {TYPES.map((type) => (
        <label key={type} className={`chip ${form.type === type ? 'on' : ''}`}>
          <input
            type="radio"
            name={name}
            value={type}
            checked={form.type === type}
            onChange={() => {
              // alt tip: ora se golește, persoanele se potrivesc (un eveniment are cel puțin 30)
              setForm((f) => ({ ...f, type, time: '', people: peopleForType(type, f.people) }))
              setTried(false)
            }}
          />
          {txt.types[type]}
        </label>
      ))}
    </fieldset>
  )
}

/** Cazare, pasul 1: tipul, sosirea și plecarea, adulți și copii. */
export function StepDates({ bk }) {
  const { form, setForm, update, txt, lang, open, nights, price, tried, valid } = bk
  const pickingDeparture = form.from && !form.to
  return (
    <>
      <TypePicker bk={bk} name="bk-type" />
      {/* cele două căsuțe de deasupra calendarului; cea care se alege acum e evidențiată */}
      <div className="bk-when">
        <div className={`bk-when__c ${pickingDeparture ? '' : 'on'}`}>
          <span>{txt.arrive}</span>
          <strong>{form.from ? fmt(form.from, lang) : txt.pick}</strong>
        </div>
        <div className={`bk-when__c ${pickingDeparture ? 'on' : ''}`}>
          <span>{txt.leave}</span>
          <strong>{form.to ? fmt(form.to, lang) : txt.pick}</strong>
        </div>
      </div>
      <div className="bk-cal">
        {/* key: calendarul o ia de la luna aleasă la fiecare deschidere a ferestrei și la schimbarea limbii */}
        <DatePicker key={`${lang}-${open}`} from={form.from} to={form.to} months={2} onChange={({ from, to }) => setForm((f) => ({ ...f, from, to }))} />
        <p className="bk-hint" aria-live="polite">
          {form.from && form.to ? `${txt.nights(nights)}${price.pct ? ` · ${txt.off(price.pct)}` : ''}` : form.from ? txt.hintOut : txt.hintDates}
        </p>
      </div>
      <div className="bk-counts">
        <Stepper label={txt.adults} value={form.adults} min={LIMITS.adults[0]} max={LIMITS.adults[1]} onChange={(v) => update('adults', v)} />
        <Stepper label={txt.children} note={txt.childNote} value={form.children} min={LIMITS.stayChildren[0]} max={LIMITS.stayChildren[1]} onChange={(v) => update('children', v)} />
      </div>
      {tried && !valid.dates && <span className="bk-err">{txt.hintDates}</span>}
    </>
  )
}

/** Cazare, pasul 2: camerele, cu prețul pentru perioada aleasă și disponibilitatea de la backend. */
export function StepRoom({ bk }) {
  const { form, update, txt, rooms, avail, nights, guests, room, price, tried, valid, perNightOf, isFree } = bk
  return (
    <>
      <ul className="bk-rooms">
        {rooms.map((r) => {
          const fits = fitsRoom(r, guests)
          const free = isFree(r)
          const left = avail.rooms[r.id]?.left // „Mai sunt doar N”, dacă backend-ul îl trimite
          const perNight = perNightOf(r)
          const total = priceFor({ room: r, nights, guests, perNight }).total
          const chosen = form.room === r.id
          const disabled = !fits || !free
          const fewLeft = left && left < 3
          return (
            <li key={r.id} className={`bk-room ${chosen ? 'on' : ''} ${disabled ? 'off' : ''}`}>
              <button type="button" className="bk-room__b" disabled={disabled} aria-pressed={chosen} onClick={() => update('room', r.id)}>
                <span className="bk-room__pic">
                  <Img name={r.img} alt="" sizes="(max-width: 760px) 40vw, 220px" />
                </span>
                <span className="bk-room__txt">
                  <span className="bk-room__name">{r.name}</span>
                  <span className="bk-room__meta">
                    {r.beds} · {txt.upTo(r.guests)} · {txt.breakfast}
                  </span>
                  <span className={`bk-room__st ${disabled ? 'is-no' : fewLeft ? 'is-few' : ''}`}>
                    {!fits ? txt.tooMany(guests) : !free ? txt.taken : fewLeft ? txt.few(left) : txt.free}
                  </span>
                </span>
                <span className="bk-room__price">
                  <strong className="num">{lei(total)}</strong>
                  <span>{txt.forStay(nights)}</span>
                  <span className="bk-room__pn num">
                    {perNight} {txt.perNight}
                  </span>
                  {fits && guests > r.guests && <span className="bk-room__pn">{txt.withBed}</span>}
                  <span className="bk-room__cta" aria-hidden="true">
                    {chosen ? (
                      <>
                        <Icon name="check" size={16} /> {txt.chosen}
                      </>
                    ) : (
                      txt.choose
                    )}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {guests > 4 && <p className="bk-note">{txt.group}</p>}
      {room && (
        <label className="check bk-extra">
          {/* bifat și blocat când sunt mai mulți oaspeți decât încap în cameră */}
          <input type="checkbox" checked={price.bedOn} disabled={guests > room.guests} onChange={(e) => update('extra', e.target.checked)} />
          <span className="toggle" aria-hidden="true" />
          <span>
            {txt.extra} <span className="muted">· {txt.extraNote}</span>
            {guests > room.guests && <span className="bk-note bk-note--in">{txt.extraAuto}</span>}
          </span>
        </label>
      )}
      {/* fără backend nu știm ce e liber: spunem asta deschis */}
      {(avail.demo || !BOOKING_API) && <p className="bk-note">{txt.demo}</p>}
      {tried && !valid.room && <span className="bk-err">{txt.hRoom}</span>}
    </>
  )
}

/** Masă, călărie, eveniment — pasul 1: tipul, ziua, ora, câte persoane. */
export function StepDetails({ bk }) {
  const { form, setForm, update, txt, lang, open, times, errorFor } = bk
  return (
    <>
      <TypePicker bk={bk} name="bk-type2" />
      <div className="bk-cal bk-cal--one">
        <p className="bk-lbl">
          {txt.date}
          {form.from ? <strong> · {fmt(form.from, lang)}</strong> : null}
        </p>
        <DatePicker
          key={`${lang}-${form.type}-${open}`}
          from={form.from}
          to=""
          single
          months={1}
          onChange={({ from }) => setForm((f) => ({ ...f, from, time: '' }))}
        />
        {errorFor('from', txt.errDate)}
      </div>
      {form.type !== 'Eveniment' ? (
        <div className="bk-times">
          <p className="bk-lbl">{txt.time}</p>
          {form.from ? (
            <div className="bk-times__list" role="radiogroup" aria-label={txt.pickTime}>
              {times.map((t) => (
                <button key={t} type="button" role="radio" aria-checked={form.time === t} className={`bk-time ${form.time === t ? 'on' : ''}`} onClick={() => update('time', t)}>
                  <span className="num">{t}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="bk-note">{txt.errDate}</p>
          )}
          {errorFor('time', txt.errTime)}
        </div>
      ) : (
        <p className="bk-note">{txt.noTime}</p>
      )}
      {form.type === 'Echitație' ? (
        <div className="bk-counts">
          <Stepper label={txt.adults} value={form.adults} min={LIMITS.adults[0]} max={LIMITS.adults[1]} onChange={(v) => update('adults', v)} />
          <Stepper label={txt.children} note={txt.childNote} value={form.children} min={LIMITS.rideChildren[0]} max={LIMITS.rideChildren[1]} onChange={(v) => update('children', v)} />
        </div>
      ) : (
        <label className="field bk-num">
          <span>{txt.people}</span>
          <input type="number" min="1" max="300" inputMode="numeric" value={form.people} onChange={(e) => update('people', Math.max(1, Number(e.target.value) || 1))} />
        </label>
      )}
    </>
  )
}

/** Pasul „Datele tale”: nume, telefon, email, mesaj, acordul. */
export function StepYou({ bk }) {
  const { form, update, txt, tried, errors, errorFor } = bk
  return (
    <div className="form__grid">
      <label className="field field--wide">
        <span>{txt.name}</span>
        <input autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} aria-invalid={tried && errors.name} />
        {errorFor('name', txt.errName)}
      </label>
      <label className="field">
        <span>{txt.phone}</span>
        <input type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} aria-invalid={tried && errors.phone} />
        {errorFor('phone', txt.errPhone)}
      </label>
      <label className="field">
        <span>{txt.emailOpt}</span>
        <input type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} />
      </label>
      <label className="field field--wide">
        <span>{txt.msg}</span>
        <textarea rows="3" placeholder={txt.msgPh} value={form.msg} onChange={(e) => update('msg', e.target.value)} />
      </label>
      <label className="agree field--wide">
        <input type="checkbox" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} aria-invalid={tried && errors.agree} />
        <span>
          {txt.read}{' '}
          <button type="button" className="link" onClick={() => openLegal('confidentialitate')}>
            {txt.privacy}
          </button>{' '}
          {txt.and}{' '}
          <button type="button" className="link" onClick={() => openLegal('termeni')}>
            {txt.terms}
          </button>
          .
        </span>
      </label>
      {errorFor('agree', txt.errAgree)}
    </div>
  )
}

/** Un rând din verificarea finală, cu „Modifică” care te duce înapoi la pasul `to`. */
function ReviewRow({ label, value, to, onEdit, editText }) {
  return (
    <div className="bk-rev__r">
      <dt>{label}</dt>
      <dd>{value}</dd>
      {to !== undefined && (
        <button type="button" className="link" onClick={() => onEdit(to)}>
          {editText}
        </button>
      )}
    </div>
  )
}

/** Ultimul pas: tot ce s-a ales, de verificat înainte de „Trimite”. */
export function StepCheck({ bk }) {
  const { form, txt, lang, stay, nights, room, price, peopleText, flow, goTo, failed } = bk
  const youStep = flow.indexOf('you')
  const row = (label, value, to) => <ReviewRow label={label} value={value} to={to} onEdit={goTo} editText={txt.edit} />
  return (
    <>
      <dl className="bk-rev">
        {row(txt.what, txt.types[form.type], 0)}
        {stay ? (
          <>
            {row(txt.arrive, fmt(form.from, lang), 0)}
            {row(txt.leave, `${fmt(form.to, lang)} · ${txt.nights(nights)}`, 0)}
            {row(txt.guests, peopleText, 0)}
            {row(txt.room, `${room?.name || ''}${price.bedOn ? ` + ${txt.extra.toLowerCase()}` : ''}`, 1)}
          </>
        ) : (
          <>
            {row(txt.date, `${fmt(form.from, lang)}${form.time ? ` · ${form.time}` : ''}`, 0)}
            {row(txt.guests, peopleText, 0)}
          </>
        )}
        {row(txt.name, form.name, youStep)}
        {row(txt.phone, form.phone, youStep)}
        {form.email && row(txt.email, form.email, youStep)}
        {form.msg && row(txt.msg.replace(/ \(.*\)/, ''), form.msg, youStep)}
      </dl>
      <p className="bk-note">{stay ? txt.payNote : txt.payOther}</p>
      {failed && (
        <p className="bk-err" role="alert">
          {txt.fail}
        </p>
      )}
    </>
  )
}
