import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { MetaMaskProvider } from './contexts/MetaMaskContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
  </BrowserRouter>
);
