// Punctul de pornire: fonturile, stilurile și aplicația (App.jsx), montată în <div id="root"> din index.html.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// fonturi găzduite local (fără cereri către Google Fonts)
import '@fontsource/eb-garamond/400.css'
import '@fontsource/eb-garamond/500.css'
import '@fontsource/eb-garamond/600.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
// toate stilurile, în ordine (vezi styles/index.css)
import './styles/index.css'
import App from './App.jsx'

// Primul ecran e deja desenat din index.html, cu animațiile pornite. Când React îl desenează din nou,
// --since spune CSS-ului cât timp a trecut, ca animațiile să continue din același punct, nu de la capăt.
const since = window.__t0 != null ? Math.round(performance.now() - window.__t0) : 0
document.documentElement.style.setProperty('--since', `${since}ms`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
