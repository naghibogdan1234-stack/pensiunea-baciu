import { useEffect, useRef, useState } from 'react'
import { Img, MaskText, useLockScroll } from '../lib.jsx'
import Icon from './Icon.jsx'

const PHOTOS = [
  ['panorama', 'Panoramă de vară peste pajiștile și pădurile din jurul Topliței'],
  ['terasa-apus', 'Masă pe terasă la apus, cu platou de mezeluri și vedere spre dealuri'],
  ['calarie-manej', 'Copii călare în manej, cu munții în fundal'],
  ['iarna-drona', 'Pista de bob și câmpul înzăpezit, văzute de sus'],
  ['restaurant-geamuri', 'Colțul cu ferestre mari al restaurantului'],
  ['masa-festiva', 'Masă rotundă aranjată festiv, lângă fereastra cu brazi'],
  ['partie-vedere', 'Schiori pe pârtie, cu munți înzăpeziți în depărtare'],
  ['ponei', 'Copil pe ponei, condus de instructor în manej'],
  ['camera-twin-2', 'Cameră cu două paturi și cuverturi roșii'],
  ['iarna-padure', 'Pădurea de brazi înzăpezită, de sus'],
  ['calarie-copil', 'Un copil călare, ajutat de instructor'],
  ['terasa', 'Terasa de lemn cu mese lungi'],
]
// module: înalt, pereche, lat
const MODULES = [[0], [1], [2, 3], [4], [5], [6, 7], [9], [8, 10], [11]]
const kind = (m, idx) => (m.length === 2 ? 'pair' : idx === 0 || idx === 6 ? 'wide' : 'tall')

function Lightbox({ index, onClose, onMove }) {
  useLockScroll(index !== null)
  const touch = useRef(null)
  useEffect(() => {
    const k = (e) => {
      if (index === null) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onMove(1)
      if (e.key === 'ArrowLeft') onMove(-1)
    }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [index, onClose, onMove])
  if (index === null) return null
  const [name, alt] = PHOTOS[index]
  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label="Fotografie mărită"
      onClick={onClose}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - (touch.current ?? 0)
        if (Math.abs(dx) > 40) onMove(dx < 0 ? 1 : -1)
      }}
    >
      <figure className="lb__fig" key={name} onClick={(e) => e.stopPropagation()}>
        <Img name={name} alt={alt} sizes="92vw" eager />
        <figcaption>
          {alt} <span className="num">· {index + 1} / {PHOTOS.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="lb__btn lb__btn--l" onClick={(e) => (e.stopPropagation(), onMove(-1))} aria-label="Fotografia anterioară">
        <Icon name="left" size={26} />
      </button>
      <button type="button" className="lb__btn lb__btn--r" onClick={(e) => (e.stopPropagation(), onMove(1))} aria-label="Fotografia următoare">
        <Icon name="right" size={26} />
      </button>
      <button type="button" className="x lb__x" onClick={onClose} aria-label="Închide">
        <Icon name="close" />
      </button>
    </div>
  )
}

export default function Gallery() {
  const row = useRef(null)
  const [lb, setLb] = useState(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 })

  // tragere cu mouse-ul, cu inerție
  useEffect(() => {
    const el = row.current
    if (!el) return
    let v = 0
    let raf
    let lastX = 0
    let lastT = 0
    const glide = () => {
      v *= 0.94
      el.scrollLeft -= v
      if (Math.abs(v) > 0.3) raf = requestAnimationFrame(glide)
      else el.classList.remove('is-gliding')
    }
    const down = (e) => {
      if (e.pointerType !== 'mouse') return
      cancelAnimationFrame(raf)
      drag.current = { down: true, x: e.clientX, left: el.scrollLeft, moved: 0 }
      lastX = e.clientX
      lastT = performance.now()
      el.classList.add('is-drag')
    }
    const move = (e) => {
      const d = drag.current
      if (!d.down) return
      const dx = e.clientX - d.x
      d.moved = Math.max(d.moved, Math.abs(dx))
      el.scrollLeft = d.left - dx
      const t = performance.now()
      v = ((e.clientX - lastX) / Math.max(1, t - lastT)) * 16
      lastX = e.clientX
      lastT = t
    }
    const up = () => {
      if (!drag.current.down) return
      drag.current.down = false
      el.classList.remove('is-drag')
      el.classList.add('is-gliding')
      raf = requestAnimationFrame(glide)
    }
    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  const open = (i) => () => {
    if (drag.current.moved > 6) return
    setLb(i)
  }
  const nudge = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <section id="galerie" className="gallery section" aria-labelledby="gal-h">
      <div className="gallery__head wrap">
        <MaskText id="gal-h" className="h2" text="Galerie" />
        <div className="gallery__ctl">
          <p className="muted">{PHOTOS.length} fotografii · trage sau apasă pe una</p>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(-1)} aria-label="Înapoi">
            <Icon name="left" size={22} />
          </button>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(1)} aria-label="Înainte">
            <Icon name="right" size={22} />
          </button>
        </div>
      </div>
      <div className="gallery__row" ref={row} data-lenis-prevent-wheel>
        {MODULES.map((m, idx) => (
          <div key={idx} className={`gm gm--${kind(m, idx)}`}>
            {m.map((i) => (
              <button key={i} type="button" className="gm__btn" onClick={open(i)} aria-label={`Mărește: ${PHOTOS[i][1]}`}>
                <Img name={PHOTOS[i][0]} alt={PHOTOS[i][1]} sizes="(max-width: 760px) 80vw, 40vw" />
              </button>
            ))}
          </div>
        ))}
      </div>
      <Lightbox
        index={lb}
        onClose={() => setLb(null)}
        onMove={(d) => setLb((i) => (i === null ? null : (i + d + PHOTOS.length) % PHOTOS.length))}
      />
    </section>
  )
}
