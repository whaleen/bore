// apps/web/src/components/features/wallet/WalletConnection/index.tsx
import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Wallet, User, LogOut } from 'lucide-react'
import WalletModal from '../WalletModal'
import { WalletConnectionProps, DropdownState } from './types'
import React from 'react'

const WalletConnection: React.FC<WalletConnectionProps> = () => {
  const { publicKey, connected, disconnect } = useWallet()
  const navigate = useNavigate()
  const [dropdownState, setDropdownState] = useState<DropdownState>({
    isDropdownOpen: false,
    isWalletModalOpen: false
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Add effect to handle user creation on wallet connection
  // In WalletConnection.tsx
  useEffect(() => {
    const initializeUser = async () => {
      if (!publicKey) return

      const userId = publicKey.toBase58()

      try {
        // Single request that will create or get the user
        const response = await fetch('/.netlify/functions/user/initialize', {
          method: 'POST',  // Using POST since we might be creating a resource
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: userId })
        })

        if (!response.ok) {
          console.error('Failed to initialize user:', await response.json())
        }
      } catch (error) {
        console.error('Error initializing user:', error)
      }
    }

    if (connected && publicKey) {
      initializeUser()
    }
  }, [connected, publicKey])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownState(prev => ({ ...prev, isDropdownOpen: false }))
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleConnect = () => {
    setDropdownState(prev => ({ ...prev, isWalletModalOpen: true }))
  }

  const handleDisconnect = () => {
    disconnect()
    setDropdownState(prev => ({ ...prev, isDropdownOpen: false }))
  }

  const navigateToAccount = () => {
    navigate('/account')
    setDropdownState(prev => ({ ...prev, isDropdownOpen: false }))
  }

  const truncatePublicKey = (key: any): string => {
    if (!key) return ''
    const base58 = key.toBase58()
    return `${base58.slice(0, 4)}...${base58.slice(-4)}`
  }

  return (
    <div
      className='relative'
      ref={dropdownRef}
    >
      {connected ? (
        <>
          <button
            onClick={() => setDropdownState(prev => ({
              ...prev,
              isDropdownOpen: !prev.isDropdownOpen
            }))}
            className='btn btn-sm flex items-center gap-2 p-2 rounded-sm bg-base-200 hover:bg-base-300'
          >
            <Wallet className='w-4 h-4' />
            {truncatePublicKey(publicKey)}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${dropdownState.isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownState.isDropdownOpen && (
            <div className='absolute right-0 mt-4 w-56 rounded-sm bg-base-200 z-50 text-sm'>
              <ul className='py-2'>
                <li>
                  <button
                    onClick={navigateToAccount}
                    className='w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-base-300'
                  >
                    <User className='w-4 h-4' /> {/* User icon for Account */}
                    Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDisconnect}
                    className='w-full px-4 py-2 text-left text-error flex items-center gap-2 hover:bg-base-300'
                  >
                    <LogOut className='w-4 h-4' /> {/* LogOut icon for Disconnect */}
                    Disconnect
                  </button>
                </li>
              </ul>

            </div>
          )}
        </>
      ) : (
        <button
          onClick={handleConnect}
          className='btn btn-sm btn-primary flex items-center gap-2'
        >
          <Wallet className='w-4 h-4' />
          Connect Wallet
        </button>
      )}

      <WalletModal
        isOpen={dropdownState.isWalletModalOpen}
        onClose={() => setDropdownState(prev => ({ ...prev, isWalletModalOpen: false }))}
      />
    </div>
  )
}

export default WalletConnection
