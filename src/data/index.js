// Conținutul site-ului în limba aleasă.
//
//   content.js      tot conținutul în română: contact, camere, prețuri, activități, recenzii, întrebări...
//   content.en.js   traducerea în engleză; pune doar textele, restul (prețuri, poze, id-uri) vine din content.js
//   menu.js         meniul restaurantului (preparate, gramaje, prețuri) și cum se împarte pe paginile cărții
//   menu.en.js      traducerea meniului
//
// În componente:  const { ROOMS, FAQ } = useData()  → lista în limba curentă.
// Ce nu depinde de limbă (CONTACT, EXTRA_BED, DISCOUNTS...) se poate importa direct din content.js.
import * as RO from './content.js'
import * as EN from './content.en.js'
import * as MENU_RO from './menu.js'
import * as MENU_EN from './menu.en.js'
import { useLang } from '../i18n.jsx'

const ro = { ...RO, ...MENU_RO }
// engleza pornește de la română și înlocuiește doar ce are tradus
const en = { ...RO, ...EN, ...MENU_RO, ...MENU_EN }

export const dataFor = (lang) => (lang === 'en' ? en : ro)
export const useData = () => dataFor(useLang())
