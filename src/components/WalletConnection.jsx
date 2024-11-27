// src/components/WalletConnection.jsx
import { useContext } from 'react'
import { PublicKey } from '@solana/web3.js'
import { WalletContext } from './WalletContext'

const WalletConnection = () => {
  const { publicKey, setPublicKey } = useContext(WalletContext)

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
      }
    } catch (error) {
      console.error('Error disconnecting from wallet:', error)
    }
  }

  return (
    <div>
      {publicKey ? (
        <div>
          <p>Connected with public key: {publicKey.toBase58()}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}

export default WalletConnection
