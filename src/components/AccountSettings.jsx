import { useEffect, useState, useContext } from 'react'
import { WalletContext } from './WalletContext'
import { useTheme } from './ThemeContext'
import { Sun, Moon, Laptop, X, RefreshCw } from 'lucide-react'

function AccountSettings() {
  const [savedNodes, setSavedNodes] = useState([])
  const [connections, setConnections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [linkCode, setLinkCode] = useState(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const { publicKey } = useContext(WalletContext)
  const { theme, toggleTheme } = useTheme()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  useEffect(() => {
    if (publicKeyBase58) {
      Promise.all([fetchSavedNodes(), fetchConnections()]).finally(() =>
        setLoading(false)
      )
    } else {
      setLoading(false)
    }
  }, [publicKeyBase58])

  const fetchConnections = async () => {
    try {
      const response = await fetch(
        `/.netlify/functions/get-user-preferences?userId=${publicKeyBase58}`
      )
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      setConnections(data.connections || [])
    } catch (error) {
      console.error('Error fetching connections:', error)
      setError('Failed to load extension connections')
    }
  }

  const handleRevokeConnection = async (connectionId) => {
    try {
      const response = await fetch(
        '/.netlify/functions/manage-extension-connection',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'revoke',
            connectionId,
            userId: publicKeyBase58,
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to revoke connection')

      setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))
    } catch (error) {
      console.error('Error revoking connection:', error)
      setError('Failed to revoke connection')
    }
  }

  // ... (keeping all existing functions: fetchSavedNodes, handleGenerateLinkCode,
  //      handleSetPrimary, handleRemoveNode)

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

  // Separate primary node from saved nodes
  const primaryNode = savedNodes.find((node) => node.isPrimary)
  const otherNodes = savedNodes.filter((node) => !node.isPrimary)

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Account Settings</h1>

      {error && (
        <div className='bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6'>
          {error}
        </div>
      )}

      {/* Theme Settings Section */}
      <div className='mb-8 p-6 bg-base-200 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Theme Preferences</h2>
        <div className='flex gap-4'>
          <button
            onClick={() => toggleTheme()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg 
              ${theme === 'light' ? 'bg-primary text-white' : 'bg-base-300'}`}
          >
            <Sun size={20} />
            Light
          </button>
          <button
            onClick={() => toggleTheme()}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg
              ${theme === 'dark' ? 'bg-primary text-white' : 'bg-base-300'}`}
          >
            <Moon size={20} />
            Dark
          </button>
        </div>
      </div>

      {/* Extension Management Section */}
      <div className='mb-8 p-6 bg-base-200 rounded-lg'>
        <h2 className='text-xl font-semibold mb-4'>Chrome Extension</h2>

        {connections.length > 0 ? (
          <div className='space-y-4'>
            <h3 className='text-lg font-medium mb-2'>Connected Devices</h3>
            {connections.map((connection) => (
              <div
                key={connection.id}
                className='flex items-center justify-between p-4 bg-base-300 rounded-lg'
              >
                <div className='flex items-center gap-3'>
                  <Laptop className='w-5 h-5' />
                  <div>
                    <p className='font-medium'>
                      {connection.deviceName || 'Chrome Extension'}
                    </p>
                    <p className='text-sm text-gray-400'>
                      Connected{' '}
                      {new Date(connection.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRevokeConnection(connection.id)}
                  className='btn btn-error btn-sm'
                >
                  <X
                    size={16}
                    className='mr-1'
                  />
                  Revoke Access
                </button>
              </div>
            ))}
          </div>
        ) : linkCode ? (
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
              {isGeneratingCode ? (
                <>
                  <RefreshCw className='animate-spin mr-2' />
                  Generating...
                </>
              ) : (
                'Generate Link Code'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Primary Node Section */}
      {primaryNode && (
        <div className='mb-8 p-6 bg-base-200 rounded-lg'>
          <h2 className='text-xl font-semibold mb-4'>Primary Node</h2>
          <div className='border border-base-300 rounded-lg p-4'>
            <div>
              <h3 className='text-lg font-semibold'>{primaryNode.node.name}</h3>
              <p className='text-gray-400'>
                {primaryNode.node.country} ({primaryNode.node.countryCode}) -{' '}
                {primaryNode.node.region}
              </p>
              <span className='inline-block bg-success text-white text-sm px-2 py-1 rounded mt-2'>
                Primary Node
              </span>
            </div>
            <div className='mt-4'>
              <button
                onClick={() => handleRemoveNode(primaryNode.node.id)}
                className='btn btn-error btn-sm'
              >
                Remove Primary Node
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Nodes Section */}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-4'>Saved Nodes</h2>
        {otherNodes.length === 0 ? (
          <p className='text-gray-400'>
            You haven't saved any other nodes yet.
          </p>
        ) : (
          <div className='space-y-4'>
            {otherNodes.map((saved) => (
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
