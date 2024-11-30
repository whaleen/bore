// src/components/WalletConnection.jsx
import { useState, useRef, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Wallet } from 'lucide-react'
import WalletModal from './WalletModal'

const WalletConnection = () => {
  const { publicKey, connected, disconnect } = useWallet()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleConnect = () => {
    setIsWalletModalOpen(true)
  }

  const handleDisconnect = () => {
    disconnect()
    setIsDropdownOpen(false)
  }

  const navigateToAccount = () => {
    navigate('/account')
    setIsDropdownOpen(false)
  }

  const truncatePublicKey = (key) => {
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
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='btn btn-sm btn-outline flex items-center gap-2'
          >
            <Wallet className='w-4 h-4' />
            {truncatePublicKey(publicKey)}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-56 rounded-lg bg-base-200 shadow-xl z-50'>
              <ul className='py-2'>
                <li>
                  <button
                    onClick={navigateToAccount}
                    className='w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-base-300'
                  >
                    {/* <Settings className='w-4 h-4' /> */}
                    Account
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleDisconnect}
                    className='w-full px-4 py-2 text-left text-error hover:bg-base-300'
                  >
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
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  )
}

export default WalletConnection
