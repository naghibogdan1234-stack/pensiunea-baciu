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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
