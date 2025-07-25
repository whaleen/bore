// chrome-extension/src/popup.jsx
import { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/ui/theme/ThemeProvider'
import { NodeList } from './components/ui/nodes/NodeList'
import { PrimaryNode } from './components/ui/nodes/PrimaryNode'
import { ToggleSwitch } from './components/ui/toggle/ToggleSwitch'
import {
  getStoredApiKey,
  getStoredUserId,
  setStoredCredentials,
} from './utils/storage'
import './styles/tailwind.css'
import './styles/popup.css'

const API_URL = 'http://localhost:9999'

const fetchUserNodes = async (currentUserId, currentApiKey, setError) => {
  try {
    setError(null)
    const [nodesResponse, instancesResponse] = await Promise.all([
      fetch(
        `${API_URL}/.netlify/functions/nodes-saved?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${currentApiKey}`,
          },
        }
      ),
      fetch(
        `${API_URL}/.netlify/functions/vultr-instances?userId=${currentUserId}`,
        {
          headers: {
            Authorization: `Bearer ${currentApiKey}`,
          },
        }
      )
    ])

    if (!nodesResponse.ok && !instancesResponse.ok) {
      setError('Failed to fetch nodes and instances')
      return null
    }

    const nodesData = nodesResponse.ok ? await nodesResponse.json() : { nodes: [] }
    const instancesData = instancesResponse.ok ? await instancesResponse.json() : { instances: [] }
    
    // Convert Vultr instances to node format for display
    const vultrNodes = instancesData.instances?.map(instance => ({
      node: {
        id: `vultr-${instance.id}`,
        name: instance.label,
        country: instance.region,
        countryCode: instance.region,
        ipAddress: instance.mainIp || 'Pending...',
        protocol: 'SSH',
        port: 22,
        region: instance.region,
        isActive: instance.status === 'active',
        notes: `Vultr Instance: ${instance.vultrId}`,
        type: 'vultr'
      },
      isPrimary: false
    })) || []

    return [...(nodesData.nodes || []), ...vultrNodes]
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
      `${API_URL}/.netlify/functions/auth-users?userId=${userId}`
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
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deviceName, setDeviceName] = useState(null)
  const [initialTheme, setInitialTheme] = useState('dark')

  const handleEditDeviceName = async () => {
    const newName = window.prompt('Device name:', deviceName)
    if (!newName || newName === deviceName) return

    try {
      const storage = await chrome.storage.local.get('connectionId')
      const response = await fetch(
        `${API_URL}/.netlify/functions/auth-devices`,
        {
          method: 'PUT',
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

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update device name')
      }

      setDeviceName(newName)
    } catch (err) {
      console.error('Error updating device name:', err)
      setError('Failed to update device name')
    }
  }

  useEffect(() => {
    const fetchLatestData = async () => {
      try {
        const [storedApiKey, storedUserId] = await Promise.all([
          getStoredApiKey(),
          getStoredUserId(),
        ])

        if (storedApiKey && storedUserId) {
          const prefsData = await fetchUserPreferences(storedUserId, setError)
          if (!prefsData || !prefsData.devices?.length) {
            await chrome.storage.local.clear()
            setApiKey(null)
            setUserId(null)
            setIsLinked(false)
            setPrimaryNode(null)
            setNodes([])
            return
          }

          setInitialTheme(prefsData.theme || 'dark')
          setDeviceName(prefsData.devices[0].deviceName)
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
            const primary = nodesData.find((node) => node.isPrimary)
            if (primary) {
              setPrimaryNode(primary.node)
            }
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

  useEffect(() => {
    if (userId) {
      const refreshTheme = async () => {
        const prefs = await fetchUserPreferences(userId, setError)
        if (prefs?.theme) {
          setInitialTheme(prefs.theme)
        }
      }
      refreshTheme()
    }
  }, [userId])

  if (error) {
    return (
      <div className='alert alert-error shadow-lg p-4 mb-6'>
        <span>{error}</span>
      </div>
    )
  }

  const handleVerifyCode = async () => {
    if (linkCode.length !== 8) return

    try {
      setError(null)

      const response = await fetch(
        `${API_URL}/.netlify/functions/auth-link-verify`,
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

      await setStoredCredentials(data.apiKey, data.userId)

      setApiKey(data.apiKey)
      setUserId(data.userId)
      setIsLinked(true)

      if (data.connection?.id) {
        const platformInfo = await chrome.runtime.getPlatformInfo()
        const browserInfo = navigator.userAgent.match(/Chrome\/([0-9.]+)/)[1]
        const defaultName = `Chrome ${browserInfo} on ${platformInfo.os}`

        const customName = window.prompt('Device name:', defaultName)

        await chrome.storage.local.set({ connectionId: data.connection.id })

        await fetch(`${API_URL}/.netlify/functions/auth-devices`, {
          method: 'PUT',
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

      const nodesData = await fetchUserNodes(data.userId, data.apiKey, setError)
      if (nodesData) {
        setNodes(nodesData)
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

  const handleUnlink = async () => {
    try {
      const storage = await chrome.storage.local.get(['connectionId', 'apiKey'])

      if (storage.connectionId) {
        const response = await fetch(
          `${API_URL}/.netlify/functions/auth-devices`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${storage.apiKey}`,
            },
            body: JSON.stringify({
              userId,
              connectionId: storage.connectionId,
            }),
          }
        )

        if (!response.ok) {
          const data = await response.json()
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
      console.error('Unlink error:', error)
      setError(error.message || 'Failed to unlink extension')
    }
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <span className='loading loading-spinner text-content'></span>
      </div>
    )
  }

  return (
    <ThemeProvider initialTheme={initialTheme}>
      <div className='min-h-screen flex flex-col border-2'>
        <div className='flex-1 pb-16'>
          {isLinked && (
            <div className='text-xs mb-4 flex justify-between items-center'>
              <span>{deviceName}</span>
              <button
                onClick={handleEditDeviceName}
                className='text-primary hover:text-primary-focus'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='0.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='lucide lucide-pencil-line'
                >
                  <path d='M12 20h9' />
                  <path d='M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z' />
                  <path d='m15 5 3 3' />
                </svg>
              </button>
            </div>
          )}
          {error && (
            <div className='alert alert-error shadow-lg p-4 mb-6'>
              <span>{error}</span>
            </div>
          )}
          {isLinked ? (
            <div>
              <div className='sticky top-0 z-10 bg-base-100 mb-4'>
                <PrimaryNode node={primaryNode} />
              </div>

              <div className='overflow-y-scroll max-h-[calc(100vh-10rem)] mb-6 p-4'>
                <NodeList
                  nodes={nodes.map((n) => n.node)}
                  primaryNodeId={nodes.find((n) => n.isPrimary)?.node.id}
                  onSetPrimary={async (nodeId) => {
                    try {
                      const response = await fetch(
                        `${API_URL}/.netlify/functions/nodes-saved`,
                        {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${apiKey}`,
                          },
                          body: JSON.stringify({
                            userId,
                            nodeId,
                          }),
                        }
                      )

                      const data = await response.json()

                      if (!response.ok) {
                        throw new Error(
                          data.error || 'Failed to set primary node'
                        )
                      }

                      const updatedNodes = await fetchUserNodes(
                        userId,
                        apiKey,
                        setError
                      )
                      if (updatedNodes) {
                        setNodes(updatedNodes)
                        const primary = updatedNodes.find(
                          (node) => node.isPrimary
                        )
                        if (primary) {
                          setPrimaryNode(primary.node)
                        }
                      }
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
              <h1 className='text-2xl font-semibold mb-4'>Welcome to Bore</h1>
              <p className='mb-4'>
                Go to{' '}
                <a
                  href='http://localhost:9999/register'
                  className='link'
                >
                  bore.nil.computer/register
                </a>{' '}
                and create your account big guy
              </p>
              <p className='mb-4'>Then enter the 8-digit code below</p>
              <h2 className='text-xl font-semibold mb-4'>Link Your Account</h2>
              <p className='text-base mb-4'>
                Enter the 8-digit code from your account
              </p>
              <input
                type='text'
                className='input input-bordered w-full mb-4'
                placeholder='Enter code'
                value={linkCode}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 8) {
                    setLinkCode(value)
                  }
                }}
                maxLength={8}
              />

              <button
                className='btn btn-primary w-full'
                onClick={handleVerifyCode}
                disabled={linkCode.length !== 8}
              >
                Link Account
              </button>
            </div>
          )}
        </div>

        <div className='navbar bg-base-300 fixed bottom-0 left-0 w-full'>
          <div className='flex justify-around w-full'>
            <button className='btn btn-ghost btn-sm'>Home</button>
            <button className='btn btn-ghost btn-sm'>Nodes</button>
            <button className='btn btn-ghost btn-sm'>Settings</button>
          </div>
        </div>
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
  root.render(<App />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
