import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Prerendered HTML has full page height at first paint, so the browser would
// restore the previous scroll position on reload (landing below the topbar on
// mobile). Always open at the top; hash-fragment scrolling is unaffected.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Production HTML is prerendered (scripts/prerender.mjs), so hydrate it. The dev
// server serves an empty root, so fall back to a plain client render there.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
