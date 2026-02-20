import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
          <Toaster richColors position="top-right" />
    </Provider>
  </StrictMode>,
)
