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
console.log('popup.jsx loaded')

const API_URL = 'https://bore.nil.computer'

const fetchUserNodes = async (currentUserId, currentApiKey, setError) => {
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
      setError('Failed to fetch nodes')
      return null
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error fetching nodes:', err)
    setError('Failed to load your nodes')
    return null
  }
}

const fetchUserPreferences = async (userId, setError) => {
  try {
    setError(null)
    const response = await fetch(
      `${API_URL}/.netlify/functions/get-user-preferences?userId=${userId}`
    )

    if (!response.ok) {
      setError('Failed to fetch user preferences')
      return null
    }

    const data = await response.json()
    return data
  } catch (err) {
    console.error('Error fetching user preferences:', err)
    setError('Failed to load user preferences')
    return null
  }
}

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
  const [deviceName, setDeviceName] = useState(null)

  const handleEditDeviceName = async () => {
    const newName = window.prompt('Device name:', deviceName)
    if (!newName || newName === deviceName) return

    try {
      const storage = await chrome.storage.local.get('connectionId')
      const response = await fetch(
        `${API_URL}/.netlify/functions/update-device-name`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            userId,
            connectionId: storage.connectionId,
            deviceName: newName,
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update device name')
      setDeviceName(newName)
    } catch (err) {
      console.error('Error updating device name:', err)
      setError('Failed to update device name')
    }
  }

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        console.log('Fetching latest data...')
        const [storedApiKey, storedUserId] = await Promise.all([
          getStoredApiKey(),
          getStoredUserId(),
        ])

        if (storedApiKey && storedUserId) {
          // Check preferences and connection status first
          const prefsData = await fetchUserPreferences(storedUserId, setError)
          if (!prefsData || !prefsData.connections?.length) {
            // No active connections - unlink
            await chrome.storage.local.clear()
            setApiKey(null)
            setUserId(null)
            setIsLinked(false)
            setPrimaryNode(null)
            setNodes([])
            return
          }

          // Add device name here
          setDeviceName(prefsData.connections[0].deviceName)

          setApiKey(storedApiKey)
          setUserId(storedUserId)
          setIsLinked(true)

          const nodesData = await fetchUserNodes(
            storedUserId,
            storedApiKey,
            setError
          )
          if (nodesData) {
            setNodes(nodesData)
            // Find and set primary node
            const primary = nodesData.find((node) => node.isPrimary)
            if (primary) {
              setPrimaryNode(primary.node)
            }
          }

          if (prefsData) {
            setTheme(prefsData.theme)
          }
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

  if (error) {
    return (
      <div className='alert alert-error shadow-lg rounded-lg p-4 mb-6'>
        <span>{error}</span>
      </div>
    )
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
        const platformInfo = await chrome.runtime.getPlatformInfo()
        const browserInfo = navigator.userAgent.match(/Chrome\/([0-9.]+)/)[1]
        const defaultName = `Chrome ${browserInfo} on ${platformInfo.os}`

        // Let user customize the name
        const customName = window.prompt('Device name:', defaultName)

        await chrome.storage.local.set({ connectionId: data.connection.id })

        // Save the device name
        await fetch(`${API_URL}/.netlify/functions/update-device-name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.apiKey}`,
          },
          body: JSON.stringify({
            userId: data.userId,
            connectionId: data.connection.id,
            deviceName: customName || defaultName,
          }),
        })

        setDeviceName(customName || defaultName)
      }

      // Fetch initial nodes
      const nodesData = await fetchUserNodes(data.userId, data.apiKey, setError)
      if (nodesData) {
        setNodes(nodesData)
        // Find and set primary node
        const primary = nodesData.find((node) => node.isPrimary)
        if (primary) {
          setPrimaryNode(primary.node)
        }
      }
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
        try {
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
            console.error('Failed to revoke connection on server')
            // Don't throw here - continue with local cleanup
          }
        } catch (apiError) {
          console.error('API error during unlink:', apiError)
          // Don't rethrow - continue with local cleanup
        }
      }

      // Clear stored credentials regardless of API success
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
        {isLinked && (
          <div className='text-xs text-gray-500 mb-4 flex justify-between items-center'>
            <span>{deviceName}</span>
            <button
              onClick={handleEditDeviceName}
              className='text-primary hover:text-primary-focus'
            >
              Edit
            </button>
          </div>
        )}
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

                    await fetchUserNodes(userId, apiKey, setError)
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
              Enter the 6-digit code from your account
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

const initializeApp = () => {
  const container = document.getElementById('root')
  if (!container) {
    console.log('Container not found, waiting...')
    setTimeout(initializeApp, 10)
    return
  }
  console.log('Mounting React app')
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
