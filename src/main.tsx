import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Start a reload of the landing page at the top; keep section links and history navigation native.
const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
if (location.pathname === '/' && !location.hash && navigation?.type === 'reload') {
  const restoration = history.scrollRestoration
  history.scrollRestoration = 'manual'
  window.addEventListener('pageshow', () => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => { history.scrollRestoration = restoration })
  }, { once: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
