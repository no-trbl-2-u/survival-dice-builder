import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import '@fontsource/alfa-slab-one/400.css'
import '@fontsource-variable/bitter/wght.css'
import './styles/tokens.css'
import './styles/wood.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element in index.html')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
