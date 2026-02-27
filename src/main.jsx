import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './hooks/useUser.jsx'
import { ProjectProvider } from './hooks/useProject.jsx'
import { ChessProvider } from './hooks/useChess.jsx'
import { TemplatesProvider } from './hooks/useTemplates.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ProjectProvider>
        <ChessProvider>
          <TemplatesProvider>
            <App />
          </TemplatesProvider>
        </ChessProvider>
      </ProjectProvider>
    </UserProvider>
  </StrictMode>,
)
