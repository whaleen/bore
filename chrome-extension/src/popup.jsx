// chrome-extension/src/popup.jsx
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import NodeList from './components/NodeList'
import PrimaryNode from './components/PrimaryNode'
import ToggleSwitch from './components/ToggleSwitch'
import {
  getStoredApiKey,
  getStoredUserId,
  setStoredCredentials,
} from './utils/storage'
import './styles/tailwind.css'
import './styles/popup.css'

const API_URL = 'https://bore.nil.computer'

function App() {
  const [isLinked, setIsLinked] = useState(false)
  const [linkCode, setLinkCode] = useState('')
  const [apiKey, setApiKey] = useState(null)
  const [userId, setUserId] = useState(null)
  const [nodes, setNodes] = useState([])
  const [primaryNode, setPrimaryNode] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        console.log('Fetching latest data...')
        const [storedApiKey, storedUserId] = await Promise.all([
          getStoredApiKey(),
          getStoredUserId(),
        ])

        if (storedApiKey && storedUserId) {
          setApiKey(storedApiKey)
          setUserId(storedUserId)
          setIsLinked(true)
          await fetchUserNodes(storedUserId, storedApiKey)
          await fetchUserPreferences(storedUserId)
        }
      } catch (err) {
        console.error('Init error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLatestData()
  }, [])

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <span className='loading loading-spinner text-primary'></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className='alert alert-error shadow-lg rounded-lg p-4 mb-6'>
        <span>{error}</span>
      </div>
    )
  }

  const fetchUserNodes = async (currentUserId, currentApiKey) => {
    try {
      setError(null)
      const response = await fetch(
        `${API_URL}/.netlify/functions/user-nodes?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${currentApiKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch nodes')
      }

      const data = await response.json()
      setNodes(data)

      // Find and set primary node
      const primary = data.find((node) => node.isPrimary)
      if (primary) {
        setPrimaryNode(primary.node)
      }
    } catch (err) {
      console.error('Error fetching nodes:', err)
      setError('Failed to load your nodes')
    }
  }

  const fetchUserPreferences = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/.netlify/functions/get-user-preferences?userId=${userId}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch user preferences')
      }

      const data = await response.json()
      setTheme(data.theme)
    } catch (err) {
      console.error('Error fetching user preferences:', err)
      setError('Failed to load user preferences')
    }
  }

  const handleVerifyCode = async () => {
    if (linkCode.length !== 6) return

    try {
      setError(null)
      const response = await fetch(
        `${API_URL}/.netlify/functions/verify-link-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: linkCode }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code')
      }

      // Store API key and userId
      await setStoredCredentials(data.apiKey, data.userId)
      setApiKey(data.apiKey)
      setUserId(data.userId)
      setIsLinked(true)

      // Store connection ID if available
      if (data.connection?.id) {
        await chrome.storage.local.set({ connectionId: data.connection.id })
      }

      // Fetch initial nodes
      await fetchUserNodes(data.userId, data.apiKey)
    } catch (err) {
      console.error('Verification error:', err)
      setError(err.message || 'Failed to verify code')
    }
  }

  const handleToggleProxy = async (enabled) => {
    if (!primaryNode) {
      setError('No primary node selected')
      return
    }

    try {
      if (enabled) {
        // Configure Chrome proxy settings
        const config = {
          mode: 'fixed_servers',
          rules: {
            singleProxy: {
              scheme: primaryNode.protocol.toLowerCase(),
              host: primaryNode.ipAddress,
              port: primaryNode.port,
            },
          },
        }

        await chrome.proxy.settings.set({
          value: config,
          scope: 'regular',
        })
      } else {
        // Clear proxy settings
        await chrome.proxy.settings.clear({
          scope: 'regular',
        })
      }
      setIsEnabled(enabled)
    } catch (err) {
      console.error('Proxy toggle error:', err)
      setError(`Failed to ${enabled ? 'enable' : 'disable'} proxy`)
    }
  }

  const handleUnlink = async () => {
    try {
      if (userId && apiKey) {
        const storage = await chrome.storage.local.get('connectionId')
        const response = await fetch(
          `${API_URL}/.netlify/functions/manage-extension-connection`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              action: 'revoke',
              userId,
              connectionId: storage.connectionId,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to revoke connection')
        }
      }

      // Clear stored credentials
      await chrome.storage.local.clear()
      setApiKey(null)
      setUserId(null)
      setIsLinked(false)
      setPrimaryNode(null)
      setNodes([])
    } catch (error) {
      console.error('Error unlinking:', error)
      setError('Failed to unlink extension')
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <span className='loading loading-spinner text-primary'></span>
      </div>
    )
  }

  return (
    <ThemeProvider initialTheme={theme}>
      <div className='bore-proxy-extension min-h-screen bg-base-100 text-base-content p-6 rounded-xl shadow-lg'>
        <h1 className='text-3xl font-bold mb-6 text-primary'>Bore Proxy</h1>

        {error && (
          <div className='alert alert-error shadow-lg rounded-lg p-4 mb-6'>
            <span>{error}</span>
          </div>
        )}

        {isLinked ? (
          <div>
            <button
              onClick={handleUnlink}
              className='btn btn-error btn-block mb-6'
            >
              Unlink Extension
            </button>

            <div className='mb-6'>
              <ToggleSwitch
                enabled={isEnabled}
                onToggle={handleToggleProxy}
              />
            </div>

            <div className='mb-6'>
              <PrimaryNode node={primaryNode} />
            </div>

            <div className='mb-6'>
              <NodeList
                nodes={nodes}
                onSetPrimary={async (node) => {
                  try {
                    const response = await fetch(
                      `${API_URL}/.netlify/functions/set-primary-node`,
                      {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${apiKey}`,
                        },
                        body: JSON.stringify({
                          userId,
                          nodeId: node.id,
                        }),
                      }
                    )

                    if (!response.ok) {
                      throw new Error('Failed to set primary node')
                    }

                    await fetchUserNodes(userId, apiKey)
                  } catch (err) {
                    console.error('Error setting primary node:', err)
                    setError('Failed to set primary node')
                  }
                }}
              />
            </div>
          </div>
        ) : (
          <div className='linking-view p-6 rounded-lg shadow-lg bg-base-200'>
            <h2 className='text-xl font-semibold mb-4 text-primary'>
              Link Your Account
            </h2>
            <p className='text-base mb-4'>
              Enter the 6-digit code from your account settings
            </p>
            <input
              type='text'
              className='input input-bordered input-primary w-full mb-4'
              placeholder='Enter code'
              value={linkCode}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '')
                if (value.length <= 6) {
                  setLinkCode(value)
                }
              }}
              maxLength={6}
            />
            <button
              className='btn btn-primary w-full'
              onClick={handleVerifyCode}
              disabled={linkCode.length !== 6}
            >
              Link Account
            </button>
          </div>
        )}
      </div>
    </ThemeProvider>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root')
  if (!container) {
    console.error('Root element not found!')
    return
  }
  const root = createRoot(container)
  root.render(<App />)
})
