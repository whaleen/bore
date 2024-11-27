// chrome-extension/src/components/NodeList.jsx
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import NodeList from './components/NodeList'
import PrimaryNode from './components/PrimaryNode'
import ToggleSwitch from './components/ToggleSwitch'
import {
  getStoredApiKey,
  getStoredUserId,
  setStoredCredentials,
} from './utils/storage'
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

  useEffect(() => {
    const init = async () => {
      try {
        const [storedApiKey, storedUserId] = await Promise.all([
          getStoredApiKey(),
          getStoredUserId(),
        ])

        if (storedApiKey && storedUserId) {
          setApiKey(storedApiKey)
          setUserId(storedUserId)
          setIsLinked(true)
          await fetchUserNodes(storedUserId, storedApiKey)
        }
      } catch (err) {
        console.error('Init error:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

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

      // Store both API key and userId
      await setStoredCredentials(data.apiKey, data.userId)
      setApiKey(data.apiKey)
      setUserId(data.userId)
      setIsLinked(true)

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

  if (isLoading) {
    return <div className='loading'>Loading...</div>
  }

  return (
    <div className='bore-proxy-extension'>
      <h1>Bore Proxy</h1>

      {error && <div className='error-message'>{error}</div>}

      {isLinked ? (
        <div>
          <ToggleSwitch
            enabled={isEnabled}
            onToggle={handleToggleProxy}
          />
          <PrimaryNode node={primaryNode} />
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
      ) : (
        <div className='linking-view'>
          <h2>Link Your Account</h2>
          <p>Enter the 6-digit code from your account settings</p>
          <input
            type='text'
            className='linking-input'
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
            className='link-button'
            onClick={handleVerifyCode}
            disabled={linkCode.length !== 6}
          >
            Link Account
          </button>
        </div>
      )}
    </div>
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
