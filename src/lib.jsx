import { locale } from './i18n.jsx'
import { Fragment, useEffect, useRef, useState } from 'react'
import dims from './imgdims.json'

/* ---------- Imagini ---------- */
export function Img({ name, alt, sizes = '100vw', className, eager = false, style, draggable = false }) {
  const [w, h] = dims[name] || [1200, 800]
  const small = w > 800
  return (
    <img
      className={className}
      src={`img/${name}.webp`}
      srcSet={small ? `img/${name}-s.webp 800w, img/${name}.webp ${w}w` : undefined}
      sizes={small ? sizes : undefined}
      width={w}
      height={h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={style}
      draggable={draggable}
    />
  )
}

/* ---------- Apariție la scroll, o singură dată ---------- */
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
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return [ref, inView]
}

export function Reveal({ as: Tag = 'div', i = 0, className = '', children, style, ...rest }) {
  const [ref, inView] = useInViewOnce()
  return (
    <Tag ref={ref} className={`rv ${inView ? 'is-in' : ''} ${className}`} style={{ '--i': i, ...style }} {...rest}>
      {children}
    </Tag>
  )
}

// Titlu care urcă cuvânt cu cuvânt din spatele unei măști
export function MaskText({ as: Tag = 'h2', text, className = '', delay = 0, ...rest }) {
  const [ref, inView] = useInViewOnce({ rootMargin: '0px 0px -8% 0px', threshold: 0.2 })
  const words = text.split(' ')
  return (
    <Tag ref={ref} className={`mask ${inView ? 'is-in' : ''} ${className}`} aria-label={text} {...rest}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="mask__w" aria-hidden="true">
            <span style={{ '--d': `${delay + i * 55}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

// Poză care se deschide ca un oblon
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

export function CountUp({ to, duration = 1600, format = (n) => n.toLocaleString(locale()) }) {
  const [ref, inView] = useInViewOnce()
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / duration)
      setVal(Math.round(to * (1 - Math.pow(1 - k, 4))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])
  return (
    <span ref={ref} className="num">
      {format(val)}
    </span>
  )
}

/* ---------- Navigare ---------- */
// pe ce pagină separată stă fiecare secțiune
const SECTION_PAGE = {
  camere: 'camere',
  oferte: 'camere',
  restaurant: 'restaurant',
  meniu: 'restaurant',
  activitati: 'activitati',
  tarife: 'activitati',
  galerie: 'galerie',
  recenzii: 'galerie',
  contact: 'contact',
  intrebari: 'contact',
}
let pendingScroll = null
export function takePendingScroll() {
  const id = pendingScroll
  pendingScroll = null
  return id
}
export function scrollToId(id) {
  const el = document.getElementById(id)
  if (!el) {
    // secțiunea e pe altă pagină: mergem acolo, apoi coborâm la ea
    const page = SECTION_PAGE[id]
    if (page !== undefined) {
      pendingScroll = id
      location.hash = page ? `#/${page}` : '#/'
    }
    return
  }
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === 'top' ? 0 : -70, duration: 1.4 })
  else el.scrollIntoView({ behavior: 'smooth' })
}
export const go = (id) => (e) => {
  e.preventDefault()
  scrollToId(id)
}
export function openBooking(prefill = {}) {
  window.dispatchEvent(new CustomEvent('baciu:book', { detail: prefill }))
}
export function openLegal(page) {
  window.dispatchEvent(new CustomEvent('baciu:legal', { detail: page }))
}

// oprește scroll-ul paginii cât timp e deschis un panou
export function useLockScroll(open) {
  useEffect(() => {
    if (!open) return
    window.__lenis?.stop()
    document.documentElement.classList.add('locked')
    return () => {
      window.__lenis?.start()
      document.documentElement.classList.remove('locked')
    }
  }, [open])
}

export function useMedia(q) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(q).matches : false))
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [q])
  return m
}

export const lei = (n) => `${Math.round(n).toLocaleString(locale())} lei`
