import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' = site-ul merge din orice folder sau domeniu (Netlify, GitHub Pages, hosting clasic)
export default defineConfig({
  base: './',
  plugins: [react()],
})
