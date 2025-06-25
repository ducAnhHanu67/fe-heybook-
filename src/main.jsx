import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { Provider } from 'react-redux'
import { store } from './redux/store'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'

const persistor = persistStore(store)

// Create a client
export const queryClient = new QueryClient()

// Google OAuth Client ID - you should move this to environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter
            basename="/"
            future={{
              v7_startTransition: false,
              v7_relativeSplatPath: false
            }}
          >
            <App />
            <ToastContainer position="bottom-right" theme="colored" />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
)
