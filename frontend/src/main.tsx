import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { MetaMaskProvider } from './contexts/MetaMaskContext'
import { UserProvider } from './contexts/UserContext'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MetaMaskProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MetaMaskProvider>
  </BrowserRouter>
);
