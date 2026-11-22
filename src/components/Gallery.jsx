import { useEffect, useRef, useState } from 'react'
import { Img, MaskText, useLockScroll } from '../lib.jsx'
import Icon from './Icon.jsx'
import { useData } from '../data/index.js'
import { useT } from '../i18n.jsx'

const L = {
  ro: {
    h: 'Locul, în fotografii',
    count: (n) => `${n} fotografii · trage sau apasă pe una`,
    back: 'Înapoi',
    fwd: 'Înainte',
    big: 'Fotografie mărită',
    prev: 'Fotografia anterioară',
    next: 'Fotografia următoare',
    close: 'Închide',
    zoom: (c) => `Mărește: ${c}`,
  },
  en: {
    h: 'The place in pictures',
    count: (n) => `${n} photographs · drag, or tap one`,
    back: 'Back',
    fwd: 'Forward',
    big: 'Enlarged photograph',
    prev: 'Previous photograph',
    next: 'Next photograph',
    close: 'Close',
    zoom: (c) => `Enlarge: ${c}`,
  },
}
// module: înalt, pereche, lat
const MODULES = [[0], [1], [2, 3], [4], [5], [6, 7], [9], [8, 10], [11]]
const kind = (m, idx) => (m.length === 2 ? 'pair' : idx === 0 || idx === 6 ? 'wide' : 'tall')

function Lightbox({ index, onClose, onMove }) {
  const { PHOTOS } = useData()
  const l = useT(L)
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
  const [name, cap, alt] = PHOTOS[index]
  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={l.big}
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
          <strong>{cap}</strong> · {alt} <span className="num">· {index + 1} / {PHOTOS.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="lb__btn lb__btn--l" onClick={(e) => (e.stopPropagation(), onMove(-1))} aria-label={l.prev}>
        <Icon name="left" size={26} />
      </button>
      <button type="button" className="lb__btn lb__btn--r" onClick={(e) => (e.stopPropagation(), onMove(1))} aria-label={l.next}>
        <Icon name="right" size={26} />
      </button>
      <button type="button" className="x lb__x" onClick={onClose} aria-label={l.close}>
        <Icon name="close" />
      </button>
    </div>
  )
}

export default function Gallery() {
  const { PHOTOS } = useData()
  const l = useT(L)
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
        <MaskText id="gal-h" className="h2" text={l.h} />
        <div className="gallery__ctl">
          <p className="muted">{l.count(PHOTOS.length)}</p>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(-1)} aria-label={l.back}>
            <Icon name="left" size={22} />
          </button>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(1)} aria-label={l.fwd}>
            <Icon name="right" size={22} />
          </button>
        </div>
      </div>
      <div className="gallery__row" ref={row} data-lenis-prevent-wheel>
        {MODULES.map((m, idx) => (
          <div key={idx} className={`gm gm--${kind(m, idx)}`}>
            {m.map((i) => (
              <button key={i} type="button" className="gm__btn" onClick={open(i)} aria-label={l.zoom(PHOTOS[i][1])}>
                <Img
                  name={PHOTOS[i][0]}
                  alt={PHOTOS[i][2]}
                  sizes="(max-width: 760px) 80vw, 40vw"
                  style={PHOTOS[i][3] ? { objectPosition: PHOTOS[i][3] } : undefined}
                />
                <span className="gm__cap" aria-hidden="true">
                  <span className="gm__t">{PHOTOS[i][1]}</span>
                  <span className="gm__d">{PHOTOS[i][2]}</span>
                </span>
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
