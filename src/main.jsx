// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { WalletContextProvider } from './components/WalletContext.jsx'
import { ThemeProvider } from './components/ThemeContext.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <WalletContextProvider>
        <App />
      </WalletContextProvider>
    </ThemeProvider>
  </React.StrictMode>
)
