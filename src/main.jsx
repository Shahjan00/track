import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './ai_engineer_roadmap_v2'
import App from './v3'
import RoleComparison from './role_comparison'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <RoleComparison/> */}
  </StrictMode>,
)
