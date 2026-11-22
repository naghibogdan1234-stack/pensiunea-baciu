// Butonul de acțiune dintr-o ofertă sau o activitate. Ce face îl spune datele (data/content.js), câmpul `cta`:
//
//   { action: 'book', label: 'Programează', type: 'Echitație' }   deschide rezervarea, cu tipul ales
//   { action: 'call', label: 'Sună la manej' }                      sună la pensiune
//   { action: 'tariffs', label: 'Toate tarifele' }                  deschide lista de tarife (doar la activități: onTariffs)
import { CONTACT } from '../../data/content.js'
import { openBooking } from '../../events.js'
import Icon from './Icon.jsx'

export default function CtaButton({ cta, className = 'btn btn--line', tabIndex, onTariffs }) {
  const { action, label, type } = cta
  if (action === 'call')
    return (
      <a className={className} href={CONTACT.phoneHref} tabIndex={tabIndex}>
        <Icon name="phone" size={17} /> {label}
      </a>
    )
  if (action === 'tariffs')
    return (
      <button type="button" className={className} tabIndex={tabIndex} onClick={onTariffs}>
        {label}
      </button>
    )
  return (
    <button type="button" className={className} tabIndex={tabIndex} onClick={() => openBooking({ type })}>
      {label} <Icon name="arrow" size={17} />
    </button>
  )
}
