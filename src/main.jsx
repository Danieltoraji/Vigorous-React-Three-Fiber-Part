import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserContextProvider } from './contexts/UserContext.jsx'
import { ProjectContextProvider } from './contexts/ProjectContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <ProjectContextProvider>
        <App />
      </ProjectContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
