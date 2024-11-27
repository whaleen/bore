import { useEffect, useState, useContext } from 'react'
import { WalletContext } from './WalletContext'

function AccountSettings() {
  const [savedNodes, setSavedNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [linkCode, setLinkCode] = useState(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const { publicKey } = useContext(WalletContext)
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  useEffect(() => {
    fetchSavedNodes()
  }, [publicKeyBase58])

  const fetchSavedNodes = async () => {
    if (!publicKeyBase58) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(
        `/.netlify/functions/user-nodes?userId=${publicKeyBase58}`
      )
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch saved nodes')
      }

      setSavedNodes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
      setSavedNodes([])
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateLinkCode = async () => {
    if (!publicKeyBase58) return

    try {
      setIsGeneratingCode(true)
      setError(null)

      const response = await fetch('/.netlify/functions/generate-link-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
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

  const handleSetPrimary = async (nodeId) => {
    try {
      const response = await fetch('/.netlify/functions/set-primary-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          nodeId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set primary node')
      }

      // Refresh nodes list
      await fetchSavedNodes()
    } catch (error) {
      console.error('Error setting primary node:', error)
      setError(error.message)
    }
  }

  const handleRemoveNode = async (nodeId) => {
    try {
      const response = await fetch('/.netlify/functions/remove-saved-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          nodeId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove node')
      }

      setSavedNodes(savedNodes.filter((saved) => saved.nodeId !== nodeId))
    } catch (error) {
      console.error('Error removing node:', error)
      setError(error.message)
    }
  }

  if (!publicKeyBase58) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>
          Please Connect Your Wallet
        </h2>
        <p className='text-gray-400'>
          You need to connect your wallet to view your account settings.
        </p>
      </div>
    )
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Account Settings</h1>

      {error && (
        <div className='bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6'>
          {error}
        </div>
      )}

      {/* Extension Linking Section */}
      <div className='mb-8 p-6 bg-base-200 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Chrome Extension</h2>
        {linkCode ? (
          <div className='text-center'>
            <p className='mb-4'>Your linking code:</p>
            <div className='text-3xl font-mono bg-base-300 p-4 rounded-lg mb-4'>
              {linkCode}
            </div>
            <p className='text-sm text-gray-400'>
              This code will expire in 15 minutes
            </p>
          </div>
        ) : (
          <div className='text-center'>
            <p className='mb-4'>
              Generate a code to link the Bore Proxy Chrome extension
            </p>
            <button
              onClick={handleGenerateLinkCode}
              disabled={isGeneratingCode}
              className='btn btn-primary'
            >
              {isGeneratingCode ? 'Generating...' : 'Generate Link Code'}
            </button>
          </div>
        )}
      </div>

      {/* Saved Nodes Section */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Saved Nodes</h2>
        {savedNodes.length === 0 ? (
          <p className='text-gray-400'>You haven't saved any nodes yet.</p>
        ) : (
          <div className='space-y-4'>
            {savedNodes.map((saved) => (
              <div
                key={saved.node.id}
                className='border border-base-300 rounded-lg p-4 flex justify-between items-center'
              >
                <div>
                  <h3 className='text-lg font-semibold'>{saved.node.name}</h3>
                  <p className='text-gray-400'>
                    {saved.node.country} ({saved.node.countryCode}) -{' '}
                    {saved.node.region}
                  </p>
                  {saved.isPrimary && (
                    <span className='inline-block bg-success text-white text-sm px-2 py-1 rounded mt-2'>
                      Primary Node
                    </span>
                  )}
                </div>
                <div className='flex gap-2'>
                  {!saved.isPrimary && (
                    <button
                      onClick={() => handleSetPrimary(saved.node.id)}
                      className='btn btn-success btn-sm'
                    >
                      Set as Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleRemoveNode(saved.node.id)}
                    className='btn btn-error btn-sm'
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountSettings
