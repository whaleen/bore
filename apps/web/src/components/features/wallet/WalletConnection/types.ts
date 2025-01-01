export interface WalletConnectionProps {
  className?: string
}

export interface DropdownState {
  isDropdownOpen: boolean
  isWalletModalOpen: boolean
}

export interface WalletInfo {
  publicKey: string
  displayAddress: string
}
