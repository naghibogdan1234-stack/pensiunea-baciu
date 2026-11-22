// „Acum la Baciu”: ora și vremea de acum la pensiune.
//
// Vremea vine de la Open-Meteo (gratuit, fără cheie, fără cookie-uri), pentru coordonatele din CONTACT.
// Se cere o singură dată la 20 de minute și se ține în sessionStorage, ca schimbarea paginilor să nu refacă cererea.
// Dacă serviciul nu răspunde în 8 secunde, se arată doar ora locală.
//
//   <WeatherChip />   varianta mică, pe poza de sus (Hero.jsx)
//   <WeatherPanel />  varianta mare, la „Despre” (About.jsx)
import { useEffect, useState } from 'react'
import { CONTACT } from '../../data/content.js'
import { useData } from '../../data/index.js'
import { useLang, useTexts, locale } from '../../i18n.jsx'

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${CONTACT.lat.toFixed(4)}&longitude=${CONTACT.lng.toFixed(4)}` +
  '&elevation=850&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,snow_depth,is_day' +
  '&daily=sunset,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBucharest&forecast_days=1'

let cache = null // vremea deja primită; o împart ambele variante
let pending = null // cererea în curs, ca două componente să nu ceară de două ori
const STORAGE_KEY = 'baciu-weather'
const FRESH = 20 * 60 * 1000 // după 20 de minute cerem din nou
try {
  // vremea salvată în această vizită, dacă e destul de nouă
  const v = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null')
  if (v && Date.now() - v.t < FRESH) cache = v.w
} catch {
  /* fără stocare */
}
/** Întoarce vremea (din cache sau de la Open-Meteo), sau null dacă nu se poate. */
function load() {
  if (cache) return Promise.resolve(cache)
  if (!pending) {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 8000) // renunțăm după 8 secunde
    pending = fetch(URL, { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        clearTimeout(t)
        // păstrăm doar ce afișăm, deja rotunjit
        const c = j.current || {}
        cache = {
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          code: c.weather_code,
          wind: Math.round(c.wind_speed_10m),
          snow: c.snow_depth != null ? Math.round(c.snow_depth * 100) : null,
          day: c.is_day === 1,
          sunset: j.daily?.sunset?.[0]?.slice(11, 16) || null,
          max: Math.round(j.daily?.temperature_2m_max?.[0]),
          min: Math.round(j.daily?.temperature_2m_min?.[0]),
        }
        if (!Number.isFinite(cache.temp)) {
          cache = null
          return null
        }
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ t: Date.now(), w: cache }))
        } catch {
          /* fără stocare */
        }
        return cache
      })
      .catch(() => {
        pending = null
        return null
      })
  }
  return pending
}

/** vremea curentă sau null (cât se încarcă / dacă n-a mers) */
export function useWeather() {
  const [w, setW] = useState(cache)
  useEffect(() => {
    let on = true
    load().then((v) => on && setW(v))
    return () => {
      on = false
    }
  }, [])
  return w
}

/** ora din Toplița (nu a vizitatorului), actualizată la 20 de secunde */
export function useClock() {
  const lang = useLang()
  const get = () => new Date().toLocaleTimeString(locale(lang), { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Bucharest' })
  const [t, setT] = useState(get)
  useEffect(() => {
    setT(get())
    const id = setInterval(() => setT(get()), 20000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])
  return t
}

// iconiță simplă după cod: soare, nor, ploaie, zăpadă
function Sky({ code, day }) {
  const snow = [71, 73, 75, 77, 85, 86].includes(code)
  const rain = (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95
  const cloud = code >= 2
  return (
    <svg className="sky" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      {!cloud && (day ? (
        <g className="sky__sun">
          <circle cx="16" cy="16" r="5.5" />
          <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2 2M22.5 22.5l2 2M24.5 7.5l-2 2M9.5 22.5l-2 2" />
        </g>
      ) : (
        <path d="M20 6a10 10 0 1 0 6 16 8 8 0 0 1-6-16Z" />
      ))}
      {cloud && <path d="M9 22h14a5 5 0 0 0 .4-10A7 7 0 0 0 10 13a4.5 4.5 0 0 0-1 9Z" />}
      {rain && <path className="sky__drops" d="M12 25l-1 3M17 25l-1 3M22 25l-1 3" />}
      {snow && <path className="sky__drops" d="M12 26h.01M17 27h.01M22 26h.01M14.5 29h.01M19.5 29h.01" strokeWidth="2.4" />}
    </svg>
  )
}

const TEXT = {
  ro: { now: 'Acum la Baciu', snow: 'zăpadă', sunset: 'apus', feels: 'se simt', wind: 'vânt' },
  en: { now: 'Now at Baciu', snow: 'snow', sunset: 'sunset', feels: 'feels like', wind: 'wind' },
}

// varianta mică, pe poza de sus
export function WeatherChip() {
  const weather = useWeather()
  const time = useClock()
  const { WEATHER } = useData()
  const txt = useTexts(TEXT)
  return (
    <p className={`wchip ${weather ? 'is-in' : ''}`}>
      <span className="wchip__l">{txt.now}</span>
      <span className="wchip__v">
        <span className="num">{time}</span>
        {weather && (
          <>
            <span className="wchip__dot" aria-hidden="true" />
            <Sky code={weather.code} day={weather.day} />
            <span className="num">{weather.temp}°</span>
            <span className="wchip__d">{WEATHER[weather.code] || ''}</span>
          </>
        )}
      </span>
    </p>
  )
}

// varianta mare, în plăcuța de la „Despre”
export function WeatherPanel() {
  const weather = useWeather()
  const time = useClock()
  const { WEATHER } = useData()
  const txt = useTexts(TEXT)
  return (
    <div className="wpanel" aria-live="polite">
      <p className="wpanel__l">
        {txt.now} · <span className="num">{time}</span>
      </p>
      {weather ? (
        <>
          <p className="wpanel__main">
            <Sky code={weather.code} day={weather.day} />
            <span className="wpanel__t num">{weather.temp}°</span>
            <span className="wpanel__d">{WEATHER[weather.code] || ''}</span>
          </p>
          <ul className="wpanel__more">
            <li>
              {txt.feels} <span className="num">{weather.feels}°</span>
            </li>
            <li>
              <span className="num">
                {weather.min}° / {weather.max}°
              </span>
            </li>
            {weather.snow > 0 && (
              <li>
                {txt.snow} <span className="num">{weather.snow} cm</span>
              </li>
            )}
            {weather.sunset && (
              <li>
                {txt.sunset} <span className="num">{weather.sunset}</span>
              </li>
            )}
          </ul>
        </>
      ) : null}
    </div>
  )
}
