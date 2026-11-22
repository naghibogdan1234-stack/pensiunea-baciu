// Animațiile care pornesc când un element intră pe ecran (o singură dată), plus parallax.
//
//   <Reveal>       textul sau blocul urcă ușor și apare (clasa .rv → .rv.is-in, în styles/base.css)
//   <MaskText>     titlu care urcă cuvânt cu cuvânt din spatele unei măști
//   <Shutter>      poză care se deschide ca un oblon
//   <CountUp>      număr care crește de la 0 (850 m, 14 camere...)
//   useParallax()  poza mare coboară mai încet decât pagina
//
// Toate doar pun o clasă CSS (is-in); mișcarea propriu-zisă e în CSS. Cine are „reduce motion”
// activat în sistem vede totul direct, fără mișcare (tot din CSS).
import { Fragment, useEffect, useRef, useState } from 'react'
import { Img } from './Img.jsx'
import { locale } from '../i18n.jsx'

/** Întoarce [ref, inView]: inView devine true prima dată când elementul cu ref apare pe ecran. */
export function useInViewOnce(options = { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect() // o singură dată
      }
    }, options)
    observer.observe(el)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView]
}

/**
 * Bloc care apare la scroll. `as` = ce tag randează (div, p, li...),
 * `i` = al câtelea e în grup: fiecare vine cu o mică întârziere după cel dinainte (--i în CSS).
 */
export function Reveal({ as: Tag = 'div', i = 0, className = '', children, style, ...rest }) {
  const [ref, inView] = useInViewOnce()
  return (
    <Tag ref={ref} className={`rv ${inView ? 'is-in' : ''} ${className}`} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

/** Titlu care urcă cuvânt cu cuvânt. Cititoarele de ecran citesc textul întreg (aria-label). */
export function MaskText({ as: Tag = 'h2', text, className = '', delay = 0, ...rest }) {
  const [ref, inView] = useInViewOnce({ rootMargin: '0px 0px -8% 0px', threshold: 0.2 })
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`mask ${inView ? 'is-in' : ''} ${className}`} aria-label={text} {...rest}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="mask__w" aria-hidden="true">
            <span style={{ '--d': `${delay + i * 55}ms` }}>{word}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Poză care se deschide ca un oblon. `from` = din ce parte (bottom, left, right). */
export function Shutter({ name, alt, sizes, className = '', from = 'bottom', eager, children }) {
  const [ref, inView] = useInViewOnce({ rootMargin: '0px 0px -6% 0px', threshold: 0.04 })
  return (
    <figure ref={ref} className={`shutter from-${from} ${inView ? 'is-in' : ''} ${className}`}>
      <div className="sh">
        <Img name={name} alt={alt} sizes={sizes} eager={eager} />
      </div>
      {children}
    </figure>
  )
}

/** Număr care crește de la 0 la `to`, cu încetinire la final. */
export function CountUp({ to, duration = 1600, format = (n) => n.toLocaleString(locale()) }) {
  const [ref, inView] = useInViewOnce()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 4)))) // ease-out
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return (
    <span ref={ref} className="num">
      {format(value)}
    </span>
  )
}

/**
 * Parallax: poza coboară mai încet decât pagina.
 * Întoarce [sectionRef, layerRef]: primul pe secțiune, al doilea pe stratul cu poza.
 * `range` = cât coboară poza până iese secțiunea din ecran, în % din înălțimea ei.
 */
export function useParallax(range = 18) {
  const sectionRef = useRef(null)
  const layerRef = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const update = () => {
      raf = 0
      const section = sectionRef.current
      const layer = layerRef.current
      if (!section || !layer) return
      const rect = section.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / rect.height)) // 0 = sus, 1 = a ieșit din ecran
      layer.style.transform = `translate3d(0, ${(progress * range).toFixed(2)}%, 0)`
    }
    const schedule = () => raf || (raf = requestAnimationFrame(update)) // cel mult o dată pe cadru
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [range])
  return [sectionRef, layerRef]
}
