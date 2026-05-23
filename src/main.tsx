import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import AppRoute from './Route/Route'
import { store } from './app/store'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
          <AppRoute />
     </BrowserRouter>
    </Provider>
  </StrictMode>,
)
       
