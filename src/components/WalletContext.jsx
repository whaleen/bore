// src/components/WalletContext.
import { createContext, useState } from 'react'

export const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
  const [publicKey, setPublicKey] = useState(null)

  return (
    <WalletContext.Provider value={{ publicKey, setPublicKey }}>
      {children}
    </WalletContext.Provider>
  )
}
