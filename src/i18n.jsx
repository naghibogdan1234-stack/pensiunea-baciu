// Limba site-ului (română / engleză). Alegerea se ține minte în browser.
import { createContext, useContext, useEffect, useState } from 'react'

const KEY = 'baciu-lang'
export const LANGS = ['ro', 'en']
// limba curentă, citită și de funcțiile care formatează numere (lei, date)
export const CUR = { lang: 'ro' }

const read = () => {
  try {
    const v = localStorage.getItem(KEY)
    if (LANGS.includes(v)) return v
  } catch {
    /* fără stocare */
  }
  return 'ro'
}

const Ctx = createContext({ lang: 'ro', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, set] = useState(read)
  CUR.lang = lang
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  const setLang = (l) => {
    set(l)
    try {
      localStorage.setItem(KEY, l)
    } catch {
      /* fără stocare: alegerea ține până se închide pagina */
    }
  }
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx).lang
export const useSetLang = () => useContext(Ctx).setLang
// textele unei componente: { ro: {...}, en: {...} }
export const useT = (dict) => dict[useLang()] || dict.ro
export const locale = (l = CUR.lang) => (l === 'en' ? 'en-GB' : 'ro-RO')
