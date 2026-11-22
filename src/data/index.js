// Datele site-ului în limba aleasă
import * as RO from './content.js'
import * as EN from './content.en.js'
import * as MENU_RO from './menu.js'
import * as MENU_EN from './menu.en.js'
import { useLang } from '../i18n.jsx'

const ro = { ...RO, ...MENU_RO }
const en = { ...RO, ...EN, ...MENU_RO, ...MENU_EN }
export const dataFor = (lang) => (lang === 'en' ? en : ro)
export const useData = () => dataFor(useLang())
