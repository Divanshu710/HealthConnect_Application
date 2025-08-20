import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProviderPatient } from './ContextAPI/AuthContextPatient.jsx'
import App from './App.jsx'
import { AuthProviderDoctor } from './ContextAPI/AuthContextDoctor.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProviderPatient>
    <AuthProviderDoctor>
    <App />
    </AuthProviderDoctor>
    </AuthProviderPatient>
  </StrictMode>,
)
