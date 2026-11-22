// Galeria: un rând de poze care se trage (cu mouse-ul pe calculator, cu degetul pe telefon)
// și poza mărită (Lightbox) cu săgeți, tastele ← → și swipe. Pozele și textele: PHOTOS (data/content.js).
import { useEffect, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { MaskText } from '../../lib/motion.jsx'
import { useLockScroll } from '../../lib/scroll.js'
import Icon from '../ui/Icon.jsx'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'

const TEXT = {
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
// Cum se așază pozele în rând, de la stânga la dreapta. Fiecare grup e o coloană:
//   wide = o poză lată, tall = o poză înaltă, pair = două poze una sub alta.
// Numele sunt cele din PHOTOS; o poză nouă din PHOTOS trebuie pusă și aici, altfel nu apare în rând
// (apare doar în poza mărită, la răsfoit).
const LAYOUT = [
  { shape: 'wide', photos: ['panorama'] },
  { shape: 'tall', photos: ['terasa-apus'] },
  { shape: 'pair', photos: ['calarie-manej', 'iarna-drona'] },
  { shape: 'tall', photos: ['restaurant-geamuri'] },
  { shape: 'tall', photos: ['masa-festiva'] },
  { shape: 'pair', photos: ['partie-vedere', 'ponei'] },
  { shape: 'wide', photos: ['caprioara'] },
  { shape: 'pair', photos: ['camera-twin', 'calarie-copil'] },
  { shape: 'tall', photos: ['terasa'] },
]

/** Poza mărită. index = a câta poză din PHOTOS (null = închisă); onMove(+1 / -1) = următoarea / anterioara. */
function Lightbox({ index, onClose, onMove }) {
  const { PHOTOS } = useData()
  const txt = useTexts(TEXT)
  useLockScroll(index !== null)
  const touchStartX = useRef(null)
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
  const photo = PHOTOS[index]
  return (
    <div
      className="lb"
      role="dialog"
      aria-modal="true"
      aria-label={txt.big}
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        // swipe de cel puțin 40 px: spre stânga = următoarea
        const dx = e.changedTouches[0].clientX - (touchStartX.current ?? 0)
        if (Math.abs(dx) > 40) onMove(dx < 0 ? 1 : -1)
      }}
    >
      <figure className="lb__fig" key={photo.img} onClick={(e) => e.stopPropagation()}>
        <Img name={photo.img} alt={photo.desc} sizes="92vw" eager />
        <figcaption>
          <strong>{photo.title}</strong> · {photo.desc} <span className="num">· {index + 1} / {PHOTOS.length}</span>
        </figcaption>
      </figure>
      <button type="button" className="lb__btn lb__btn--l" onClick={(e) => (e.stopPropagation(), onMove(-1))} aria-label={txt.prev}>
        <Icon name="left" size={26} />
      </button>
      <button type="button" className="lb__btn lb__btn--r" onClick={(e) => (e.stopPropagation(), onMove(1))} aria-label={txt.next}>
        <Icon name="right" size={26} />
      </button>
      <button type="button" className="x lb__x" onClick={onClose} aria-label={txt.close}>
        <Icon name="close" />
      </button>
    </div>
  )
}

export default function Gallery() {
  const { PHOTOS } = useData()
  const txt = useTexts(TEXT)
  const row = useRef(null)
  const [lightbox, setLightbox] = useState(null) // indexul pozei mărite, sau null
  // starea tragerii cu mouse-ul: moved = cât s-a mișcat, ca un click după tragere să nu deschidă poza
  const drag = useRef({ down: false, x: 0, left: 0, moved: 0 })

  // tragere cu mouse-ul, cu inerție: după ce dai drumul, rândul mai alunecă puțin și încetinește
  // (pe telefon, derularea cu degetul e cea nativă a browserului)
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
    if (drag.current.moved > 6) return // a fost tragere, nu click
    setLightbox(i)
  }
  // săgețile de sus: mută rândul cu 70% din lățimea lui
  const nudge = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.7, behavior: 'smooth' })

  return (
    <section id="galerie" className="gallery section" aria-labelledby="gal-h">
      <div className="gallery__head wrap">
        <MaskText id="gal-h" className="h2" text={txt.h} />
        <div className="gallery__ctl">
          <p className="muted">{txt.count(PHOTOS.length)}</p>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(-1)} aria-label={txt.back}>
            <Icon name="left" size={22} />
          </button>
          <button type="button" className="pbtn pbtn--light" onClick={() => nudge(1)} aria-label={txt.fwd}>
            <Icon name="right" size={22} />
          </button>
        </div>
      </div>
      <div className="gallery__row" ref={row} data-lenis-prevent-wheel data-drag>
        {LAYOUT.map((column, c) => (
          <div key={c} className={`gm gm--${column.shape}`}>
            {column.photos.map((img) => {
              const i = PHOTOS.findIndex((p) => p.img === img)
              const photo = PHOTOS[i]
              return (
                <button key={i} type="button" className="gm__btn" onClick={open(i)} aria-label={txt.zoom(photo.title)}>
                  <Img
                    name={photo.img}
                    alt={photo.desc}
                    sizes="(max-width: 760px) 80vw, 40vw"
                    style={photo.pos ? { objectPosition: photo.pos } : undefined}
                  />
                  <span className="gm__cap" aria-hidden="true">
                    <span className="gm__t">{photo.title}</span>
                    <span className="gm__d">{photo.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
        ))}
      </div>
      <Lightbox
        index={lightbox}
        onClose={() => setLightbox(null)}
        onMove={(step) => setLightbox((i) => (i === null ? null : (i + step + PHOTOS.length) % PHOTOS.length))}
      />
    </section>
  )
}
