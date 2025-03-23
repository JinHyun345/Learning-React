import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import Appp from './App.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Appp />
  </StrictMode>,
)
