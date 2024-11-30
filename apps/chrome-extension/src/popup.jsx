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
  getAuthHeaders,
} from './utils/storage'
import './styles/tailwind.css'
import './styles/popup.css'
console.log('popup.jsx loaded')

// const API_URL = 'https://bore.nil.computer'
const API_URL = 'http://localhost:8888'

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
      console.log(
        'Attempting to verify code at:',
        `${API_URL}/.netlify/functions/verify-link-code`
      )

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

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Complete link response data:', data)

      // Add log for condition that's failing
      if (data.connection) {
        console.log('Connection data received:', data.connection)
      } else {
        console.log('No connection data in response')
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code')
      }

      // Store API key and userId
      await setStoredCredentials(data.apiKey, data.userId)
      console.log('Stored credentials:', {
        apiKey: data.apiKey,
        userId: data.userId,
      })

      setApiKey(data.apiKey)
      setUserId(data.userId)
      setIsLinked(true)

      if (data.connection?.id) {
        console.log('Storing connection ID:', data.connection.id)

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
      const storage = await chrome.storage.local.get(['connectionId', 'apiKey'])
      console.log('Storage before unlink:', storage)

      const headers = await getAuthHeaders()
      console.log('Headers:', headers)

      if (storage.connectionId && storage.apiKey) {
        const response = await fetch(
          `${API_URL}/.netlify/functions/manage-extension-connection`,
          {
            method: 'POST',
            headers,
            body: JSON.stringify({
              action: 'revoke',
              connectionId: storage.connectionId,
              userId: userId,
            }),
          }
        )

        const data = await response.json()
        console.log('Unlink response:', { status: response.status, data })

        if (!response.ok) {
          throw new Error(data.error || 'Failed to revoke connection')
        }
      }

      await chrome.storage.local.clear()
      setApiKey(null)
      setUserId(null)
      setIsLinked(false)
      setPrimaryNode(null)
      setNodes([])
    } catch (error) {
      console.error('Unlink error details:', error)
      setError(error.message || 'Failed to unlink extension')
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
      <div className='min-h-screen'>
        {isLinked && (
          <div className='text-xs mb-4 flex justify-between items-center'>
            <span>{deviceName}</span>
            <button
              onClick={handleEditDeviceName}
              className='text-primary hover:text-primary-focus'
            >
              Edit
            </button>
          </div>
        )}
        {/* <h1 className='text-3xl font-bold mb-12'>Bore Proxy</h1> */}

        {error && (
          <div className='alert alert-error shadow-lg rounded-lg p-4 mb-6'>
            <span>{error}</span>
          </div>
        )}

        {isLinked ? (
          <div>
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
                    console.log('Setting primary node:', node)
                    console.log('Using apiKey:', apiKey)

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

                    const data = await response.json()
                    console.log('Set primary response:', {
                      status: response.status,
                      data,
                    })

                    if (!response.ok) {
                      throw new Error(
                        data.error || 'Failed to set primary node'
                      )
                    }

                    await fetchUserNodes(userId, apiKey, setError)
                  } catch (err) {
                    console.error('Error setting primary node:', err)
                    setError('Failed to set primary node')
                  }
                }}
              />
            </div>
            <button
              onClick={handleUnlink}
              className='btn btn-error btn-block mb-6'
            >
              Unlink Extension
            </button>
          </div>
        ) : (
          <div className='p-6'>
            <svg
              width='24'
              height='24'
              viewBox='0 0 900 900'
              xmlns='http://www.w3.org/2000/svg'
            >
              <g id='Group'>
                <path
                  id='Circular-Outer'
                  fill='#01D452'
                  fill-rule='evenodd'
                  stroke='none'
                  d='M 450 900 C 201.472229 900 0 698.527893 0 450 C 0 201.472107 201.472229 0 450 0 C 698.527832 0 900 201.472107 900 450 C 900 698.527893 698.527832 900 450 900 Z M 450 830.232544 C 659.996399 830.232544 830.232544 659.996399 830.232544 450 C 830.232544 240.003601 659.996399 69.767456 450 69.767456 C 240.003586 69.767456 69.767448 240.003601 69.767448 450 C 69.767448 659.996399 240.003586 830.232544 450 830.232544 Z'
                />
                <path
                  id='Shape-Middle'
                  fill='#01D452'
                  fill-rule='evenodd'
                  stroke='none'
                  d='M 450 668 C 329.602112 668 232 570.397949 232 450 C 232 329.602051 329.602112 232 450 232 C 570.397888 232 668 329.602051 668 450 C 668 570.397949 570.397888 668 450 668 Z M 450 634.201538 C 551.731567 634.201538 634.201599 551.731567 634.201599 450 C 634.201599 348.268433 551.731567 265.798401 450 265.798401 C 348.268402 265.798401 265.798462 348.268433 265.798462 450 C 265.798462 551.731567 348.268402 634.201538 450 634.201538 Z'
                />
              </g>
            </svg>
            <p className='mb-4'>
              Go to{' '}
              <a
                href='http://localhost:8888/register'
                className='link'
              >
                bore.nil.computer/register
              </a>{' '}
              and create your account
            </p>
            <p className='mb-4'>Then enter the 6-digit code below</p>
            <h2 className='text-xl font-semibold mb-4'>Link Your Account</h2>
            <p className='text-base mb-4'>
              Enter the 6-digit code from your account
            </p>
            <input
              type='text'
              className='input input-bordered w-full mb-4'
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
