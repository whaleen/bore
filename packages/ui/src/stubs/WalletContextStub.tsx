// packages/ui/src/components/theme/WalletContextStub.tsx
import React from 'react'
import { WalletContextState } from '@solana/wallet-adapter-react'

const stubValue: WalletContextState = {
  publicKey: null,
  connected: false,
  disconnect: async () => { },
  select: () => { },
  wallet: null,
  wallets: [],
  connecting: false,
  disconnecting: false,
  connect: async () => { },
  autoConnect: false,
  sendTransaction: async () => ({ signature: '' }),
  signTransaction: async () => ({} as any),
  signAllTransactions: async () => [],
  signMessage: async () => new Uint8Array()
}

export const WalletContext = React.createContext<WalletContextState>(stubValue)

export function WalletContextProvider({ children }: { children: React.ReactNode }) {
  return (
    <WalletContext.Provider value={stubValue}>
      {children}
    </WalletContext.Provider>
  )
}
