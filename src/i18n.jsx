// Limba site-ului: română (implicit) sau engleză. Alegerea se ține minte în browser (localStorage).
//
// Cum e tradus site-ul:
//   1. Textele fixe ale unei componente stau chiar în componentă, într-un obiect TEXT:
//        const TEXT = { ro: { title: 'Camere' }, en: { title: 'Rooms' } }
//        const txt = useTexts(TEXT)   →   txt.title
//      Unele texte sunt funcții, pentru numere: txt.nights(3) → „3 nopți”.
//   2. Conținutul (camere, prețuri, activități, recenzii...) stă în src/data/ și vine din useData(),
//      care dă automat varianta în limba aleasă.
import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'baciu-lang'
export const LANGS = ['ro', 'en']

// Limba curentă, pentru funcțiile care nu sunt componente React (formatarea datelor și a prețurilor).
// O actualizează LangProvider la fiecare schimbare.
export const CUR = { lang: 'ro' }

const readSaved = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    /* browser fără stocare (mod privat strict): rămâne româna */
  }
  return 'ro'
}

const LangContext = createContext({ lang: 'ro', setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(readSaved)
  CUR.lang = lang
  useEffect(() => {
    document.documentElement.lang = lang // pentru cititoarele de ecran și despărțirea în silabe
  }, [lang])
  const setLang = (next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* fără stocare: alegerea ține până se închide pagina */
    }
  }
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
}

/** 'ro' sau 'en' */
export const useLang = () => useContext(LangContext).lang
/** funcția care schimbă limba */
export const useSetLang = () => useContext(LangContext).setLang
/** textele unei componente în limba curentă: useTexts({ ro: {...}, en: {...} }) */
export const useTexts = (texts) => texts[useLang()] || texts.ro
/** codul folosit la formatarea numerelor și datelor */
export const locale = (lang = CUR.lang) => (lang === 'en' ? 'en-GB' : 'ro-RO')
