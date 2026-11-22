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
import './styles/base.css'
import './styles/site.css'
import './styles/book.css'
import './styles/more.css'
import App from './App.jsx'

// primul ecran e deja desenat din index.html; animațiile lui continuă din același punct, fără să o ia de la capăt
const since = window.__t0 != null ? Math.round(performance.now() - window.__t0) : 0
document.documentElement.style.setProperty('--since', `${since}ms`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
