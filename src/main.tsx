import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Materias} from "./components/Materis.tsx";
import { Header } from './components/Header.tsx';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Header />
    <Materias />
  </StrictMode>,
)
