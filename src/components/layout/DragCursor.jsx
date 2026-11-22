// Pe calculator, peste caruselele care se trag (camere, galerie), cursorul devine un cerc cu „Trage”.
//
// Un carusel se marchează cu atributul data-drag pe elementul lui. Cercul urmează mouse-ul cu o mică
// întârziere (se apropie cu 22% din distanță la fiecare cadru), ca să pară că plutește.
// Pe telefon și tabletă (fără mouse) componenta nu face nimic.
import { useEffect, useRef } from 'react'
import { useLang } from '../../i18n.jsx'

const FOLLOW = 0.22 // cât de repede ajunge cercul din urmă mouse-ul (1 = imediat)
const SMALL_CONTROL = 280 // butoanele mai înguste de atât („Vezi camera”) păstrează cursorul obișnuit

export default function DragCursor() {
  const lang = useLang()
  const ref = useRef(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    let mouseX = -100
    let mouseY = -100
    let circleX = mouseX
    let circleY = mouseY
    let visible = false
    let raf = 0

    const follow = () => {
      circleX += (mouseX - circleX) * FOLLOW
      circleY += (mouseY - circleY) * FOLLOW
      el.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`
      const stillMoving = Math.abs(mouseX - circleX) + Math.abs(mouseY - circleY) > 0.3
      raf = stillMoving ? requestAnimationFrame(follow) : 0
    }
    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      const control = e.target.closest?.('a, button')
      const overCarousel = e.target.closest?.('[data-drag]') && !(control && control.offsetWidth < SMALL_CONTROL)
      if (!!overCarousel !== visible) {
        visible = !!overCarousel
        el.classList.toggle('is-on', visible)
        document.documentElement.classList.toggle('drag-on', visible) // ascunde săgeata obișnuită (CSS)
        if (visible) {
          // apare direct sub mouse, nu zboară din colț
          circleX = mouseX
          circleY = mouseY
        }
      }
      if (!raf) raf = requestAnimationFrame(follow)
    }
    const onDown = () => el.classList.add('is-down') // se strânge puțin cât ții apăsat
    const onUp = () => el.classList.remove('is-down')
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])
  return (
    <div className="dragc" ref={ref} aria-hidden="true">
      <span>{lang === 'en' ? 'Drag' : 'Trage'}</span>
    </div>
  )
}
