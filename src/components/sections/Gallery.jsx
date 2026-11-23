// Galeria: o grilă de poze (3 coloane pe calculator, 2 pe tabletă și telefon), câteva mai mari,
// și poza mărită (Lightbox) cu săgeți, tastele ← → și swipe. Pozele și textele: PHOTOS (data/content.js).
import { useEffect, useRef, useState } from 'react'
import { Img } from '../../lib/Img.jsx'
import { MaskText, Reveal } from '../../lib/motion.jsx'
import { useLockScroll } from '../../lib/scroll.js'
import Icon from '../ui/Icon.jsx'
import { useData } from '../../data/index.js'
import { useTexts } from '../../i18n.jsx'

const TEXT = {
  ro: {
    h: 'Locul, în fotografii',
    count: (n) => `${n} fotografii · apasă pe una ca s-o vezi mare`,
    big: 'Fotografie mărită',
    prev: 'Fotografia anterioară',
    next: 'Fotografia următoare',
    close: 'Închide',
    zoom: (c) => `Mărește: ${c}`,
  },
  en: {
    h: 'The place in pictures',
    count: (n) => `${n} photographs · tap one to see it large`,
    big: 'Enlarged photograph',
    prev: 'Previous photograph',
    next: 'Next photograph',
    close: 'Close',
    zoom: (c) => `Enlarge: ${c}`,
  },
}
// Pozele mai mari din grilă (restul ocupă câte o căsuță):
//   big = 2 coloane × 2 rânduri, tall = 1 coloană × 2 rânduri, wide = 2 coloane × 1 rând.
// Grila umple singură golurile (grid-auto-flow: dense), dar ordinea din PHOTOS contează pentru aspect.
const TILE = {
  panorama: 'big',
  'terasa-apus': 'tall',
  'masa-festiva': 'tall',
  caprioara: 'wide',
}

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
  const [lightbox, setLightbox] = useState(null) // indexul pozei mărite, sau null

  return (
    <section id="galerie" className="gallery section" aria-labelledby="gal-h">
      <div className="gallery__head wrap">
        <MaskText id="gal-h" className="h2" text={txt.h} />
        <p className="muted gallery__count">{txt.count(PHOTOS.length)}</p>
      </div>
      <ul className="gallery__grid wrap">
        {PHOTOS.map((photo, i) => {
          const tile = TILE[photo.img]
          return (
            <Reveal as="li" key={photo.img} className={`gm ${tile ? `gm--${tile}` : ''}`} i={i % 3}>
              <button type="button" className="gm__btn" onClick={() => setLightbox(i)} aria-label={txt.zoom(photo.title)}>
                <Img
                  name={photo.img}
                  alt={photo.desc}
                  sizes={tile === 'big' || tile === 'wide' ? '(max-width: 980px) 100vw, 66vw' : '(max-width: 980px) 50vw, 33vw'}
                  style={photo.pos ? { objectPosition: photo.pos } : undefined}
                />
                <span className="gm__cap" aria-hidden="true">
                  <span className="gm__t">{photo.title}</span>
                  <span className="gm__d">{photo.desc}</span>
                </span>
              </button>
            </Reveal>
          )
        })}
      </ul>
      <Lightbox
        index={lightbox}
        onClose={() => setLightbox(null)}
        onMove={(step) => setLightbox((i) => (i === null ? null : (i + step + PHOTOS.length) % PHOTOS.length))}
      />
    </section>
  )
}
