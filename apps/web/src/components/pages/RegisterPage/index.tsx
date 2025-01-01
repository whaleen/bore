// src/components/RegisterPage.jsx
import { useWallet } from '@solana/wallet-adapter-react'
import { useState } from 'react'

const RegisterPage = () => {
  const { publicKey } = useWallet()
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [linkCode, setLinkCode] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerateLinkCode = async () => {
    if (!publicKey) return

    try {
      setIsGeneratingCode(true)
      setError(null)

      const response = await fetch('/.netlify/functions/generate-link-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKey.toBase58(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate link code')
      }

      setLinkCode(data.code)

      // Clear code after 15 minutes
      setTimeout(() => {
        setLinkCode(null)
      }, 15 * 60 * 1000)
    } catch (error) {
      console.error('Error generating link code:', error)
      setError(error.message)
    } finally {
      setIsGeneratingCode(false)
    }
  }

  return (
    <div className='text-center py-8'>
      <h2 className='text-xl font-semibold mb-4'>
        {publicKey ? 'Link Your Account' : 'Please Connect Your Wallet'}
      </h2>
      {publicKey ? (
        <>
          <p className='mb-4'>
            Generate a code to link the Bore Proxy Chrome extension
          </p>
          <button
            onClick={handleGenerateLinkCode}
            disabled={isGeneratingCode}
            className='btn btn-primary'
          >
            {isGeneratingCode ? (
              <>
                <span className='animate-spin mr-2'>🔄</span>
                Generating...
              </>
            ) : (
              'Generate Link Code'
            )}
          </button>
          {linkCode && (
            <div className='text-3xl font-mono bg-base-300 p-4 rounded-lg mb-4'>
              {linkCode}
            </div>
          )}
          {error && <p className='text-red-500'>{error}</p>}
        </>
      ) : (
        <p className='text-gray-400'>
          You need to connect your wallet to proceed.
        </p>
      )}
    </div>
  )
}

export default RegisterPage
