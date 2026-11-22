// Rezumatul din dreapta ferestrei de rezervare: o poză, ce s-a ales până acum și, la cazare, prețul pe rânduri
// (nopți × preț, reducere, pat suplimentar, total, avans). Pe telefon e un panou care urcă de jos (bk__mini).
import { Img } from '../../lib/Img.jsx'
import { lei } from '../../lib/format.js'
import { CONTACT } from '../../data/content.js'
import Icon from '../ui/Icon.jsx'
import { fmt } from './rules.js'

// poza rezumatului cât timp nu e aleasă o cameră
const PICTURE_FOR_TYPE = { 'Masă la restaurant': 'restaurant', Echitație: 'calarie-instructor', Eveniment: 'masa-festiva' }

export default function Summary({ bk }) {
  const { form, txt, lang, stay, nights, room, price, peopleText } = bk
  const picture = room?.img || (stay ? 'camera-tripla' : PICTURE_FOR_TYPE[form.type])
  return (
    <div className="bk-sum__in">
      <div className="bk-sum__pic">
        <Img key={picture} name={picture} alt="" sizes="360px" />
      </div>
      <p className="bk-sum__h">{stay ? txt.summary : txt.summaryOther}</p>
      <dl className="bk-sum__dl">
        {stay ? (
          <>
            <div>
              <dt>{txt.arrive}</dt>
              <dd>{form.from ? fmt(form.from, lang) : '–'}</dd>
            </div>
            <div>
              <dt>{txt.leave}</dt>
              <dd>{form.to ? fmt(form.to, lang) : '–'}</dd>
            </div>
            <div>
              <dt>{txt.guests}</dt>
              <dd>{peopleText}</dd>
            </div>
            <div>
              <dt>{txt.room}</dt>
              <dd>{room ? room.name : '–'}</dd>
            </div>
          </>
        ) : (
          <>
            <div>
              <dt>{txt.types[form.type]}</dt>
              <dd>{form.from ? `${fmt(form.from, lang)}${form.time ? ` · ${form.time}` : ''}` : '–'}</dd>
            </div>
            <div>
              <dt>{txt.guests}</dt>
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
                {txt.nights(nights)} × {lei(price.perNight)}
              </span>
              <span className="num">{lei(price.base)}</span>
            </div>
            {price.pct > 0 && (
              <div className="est__row est__row--off">
                <span>{txt.off(price.pct)}</span>
                <span className="num">−{lei(price.discount)}</span>
              </div>
            )}
            {price.bedOn && (
              <div className="est__row">
                <span>{txt.extra}</span>
                <span className="num">{lei(price.bed)}</span>
              </div>
            )}
            <div className="est__total">
              <span>{txt.total}</span>
              <strong className="num">{lei(price.total)}</strong>
            </div>
            <div className="est__row bk-sum__dep">
              <span>{txt.deposit}</span>
              <span className="num">{lei(price.deposit)}</span>
            </div>
            {/* sub 3 nopți, spunem că de la 3 nopți e reducere */}
            {!price.pct && nights < 3 && <p className="est__note">{txt.hintOff}</p>}
          </div>
        ) : (
          <p className="est__note">{nights && !room ? txt.notRoom : txt.notYet}</p>
        ))}
      <a className="bk-sum__call" href={CONTACT.phoneHref}>
        <Icon name="phone" size={16} /> {CONTACT.phone}
      </a>
    </div>
  )
}
