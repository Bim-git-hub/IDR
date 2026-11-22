import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (err) {
  root.innerHTML = `<pre style="background:#ecebe8;color:#141414;padding:24px;white-space:pre-wrap;font:14px/1.5 monospace">${String(err)}</pre>`
}

window.addEventListener('error', (e) => {
  const el = document.getElementById('root')
  if (el && el.childElementCount === 0) {
    el.innerHTML = `<pre style="background:#ecebe8;color:#141414;padding:24px;white-space:pre-wrap;font:14px/1.5 monospace">${e.message}\n${e.filename}:${e.lineno}</pre>`
  }
})
window.addEventListener('unhandledrejection', (e) => {
  const el = document.getElementById('root')
  if (el && el.childElementCount === 0) {
    el.innerHTML = `<pre style="background:#ecebe8;color:#141414;padding:24px;white-space:pre-wrap;font:14px/1.5 monospace">Unhandled rejection: ${String(e.reason)}</pre>`
  }
})
