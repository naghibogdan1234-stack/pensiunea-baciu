// Cortina verde dintre pagini, cu numele paginii în mijloc.
//
// Cum merge, pas cu pas (vezi și navigate() din router.jsx):
//   1. un link cheamă navigate('restaurant') → acesta trimite evenimentul baciu:curtain
//   2. aici, faza „in”: cortina urcă de jos și acoperă ecranul (COVER = 560 ms)
//   3. router-ul schimbă pagina pe dedesubt, cât ecranul e acoperit
//   4. faza „out”: cortina continuă în sus și descoperă pagina nouă (760 ms)
// Mișcarea e în styles/layout/curtain.css (clip-path); aici doar se schimbă clasele.
import { useEffect, useState } from 'react'
import { useData } from '../../data/index.js'
import { COVER } from '../../router.jsx'
import { EVENTS } from '../../events.js'

const HOLD = 260 // cât stă cortina pe ecran, cu numele vizibil, după ce s-a schimbat pagina
const OUT = 760 // cât durează ridicarea

export default function Curtain() {
  const { LINKS } = useData()
  const [state, setState] = useState({ phase: '', label: '' })
  useEffect(() => {
    const timers = []
    const onCurtain = (e) => {
      const page = e.detail.page
      const label = page ? LINKS.find((link) => link.page === page)?.label : 'Pensiunea Baciu'
      timers.forEach(clearTimeout)
      setState({ phase: 'in', label })
      timers.push(setTimeout(() => setState((s) => ({ ...s, phase: 'out' })), COVER + HOLD))
      timers.push(setTimeout(() => setState({ phase: '', label: '' }), COVER + HOLD + OUT))
    }
    window.addEventListener(EVENTS.curtain, onCurtain)
    return () => {
      window.removeEventListener(EVENTS.curtain, onCurtain)
      timers.forEach(clearTimeout)
    }
  }, [LINKS])
  return (
    <div className={`curtain ${state.phase ? `is-${state.phase}` : ''}`} aria-hidden="true">
      <span className="curtain__t">{state.label}</span>
    </div>
  )
}
