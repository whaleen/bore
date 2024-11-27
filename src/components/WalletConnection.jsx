// src/components/WalletConnection.jsx
import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { PublicKey } from '@solana/web3.js'
import { WalletContext } from './WalletContext'
import { ChevronDown } from 'lucide-react'

const WalletConnection = () => {
  const { publicKey, setPublicKey } = useContext(WalletContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const connectWallet = async () => {
    try {
      const { solana } = window
      if (solana && solana.isPhantom) {
        const response = await solana.connect({ onlyIfTrusted: true })
        const pubKey = new PublicKey(response.publicKey.toString())
        setPublicKey(pubKey)
      } else {
        alert('Please install the Phantom wallet extension')
      }
    } catch (error) {
      console.error('Error connecting to wallet:', error)
    }
  }

  const disconnectWallet = async () => {
    try {
      const { solana } = window
      if (solana) {
        await solana.disconnect()
        setPublicKey(null)
        setIsDropdownOpen(false) // Close dropdown when disconnecting
      }
    } catch (error) {
      console.error('Error disconnecting from wallet:', error)
    }
  }

  const truncatePublicKey = (key) => `${key.slice(0, 4)}...${key.slice(-4)}`

  const handleAccountSettings = () => {
    setIsDropdownOpen(false)
    navigate('/account') // Navigate to the /account route
  }

  return (
    <div className='relative'>
      {publicKey ? (
        <>
          {/* Connected State */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className='btn btn-sm btn-outline flex items-center gap-2'
          >
            {truncatePublicKey(publicKey.toBase58())}
            <ChevronDown
              className={`transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isDropdownOpen && (
            <ul className='menu menu-compact dropdown-content bg-base-200 rounded-lg shadow-lg mt-1 absolute right-0 z-50'>
              <li>
                <button onClick={disconnectWallet}>Disconnect</button>
              </li>
              <li>
                <button onClick={handleAccountSettings}>
                  Account Settings
                </button>
              </li>
            </ul>
          )}
        </>
      ) : (
        // Disconnected State
        <button
          onClick={connectWallet}
          className='btn btn-sm btn-primary'
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}

export default WalletConnection
