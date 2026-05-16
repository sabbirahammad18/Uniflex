import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import AppRoute from './Route/Route'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <AppRoute />
     </BrowserRouter>
  </StrictMode>,
)
