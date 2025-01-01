import { Wallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-base'

export interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface WalletOption {
  name: string
  icon?: string
  adapter: {
    name: string
    icon: string
    readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported'
  }
}

// We'll use the actual Wallet type from wallet-adapter
export type WalletWithReadyState = Wallet & {
  adapter: {
    name: WalletName
    icon: string
    readyState: 'Installed' | 'NotDetected' | 'Loadable' | 'Unsupported'
  }
}
