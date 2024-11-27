// chrome-extension/src/components/NodeList.jsx
import React, { useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import NodeList from './components/NodeList'
import PrimaryNode from './components/PrimaryNode'
import ToggleSwitch from './components/ToggleSwitch'
import { getStoredApiKey, setStoredApiKey } from './utils/storage'
import './styles/popup.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='error-container'>
          <h3>Something went wrong</h3>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  const [isLinked, setIsLinked] = useState(false)
  const [linkCode, setLinkCode] = useState('')
  const [apiKey, setApiKey] = useState(null)
  const [nodes, setNodes] = useState([])
  const [primaryNode, setPrimaryNode] = useState(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const API_URL = process.env.SITE_URL || 'https://bore.nil.computer'

  useEffect(() => {
    const init = async () => {
      try {
        const storedApiKey = await getStoredApiKey()
        if (storedApiKey) {
          setApiKey(storedApiKey)
          setIsLinked(true)
          // Fetch nodes will be implemented later
        }
      } catch (err) {
        console.error('Init error:', err)
        setError(err.message)
      }
    }
    init()
  }, [])

  const handleVerifyCode = async () => {
    if (!linkCode || linkCode.length !== 6) {
      setError('Please enter a valid 6-digit code')
      return
    }

    try {
      setIsVerifying(true)
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

      // Store the API key
      await setStoredApiKey(data.apiKey)
      setApiKey(data.apiKey)
      setIsLinked(true)
    } catch (err) {
      console.error('Verification error:', err)
      setError(
        'Failed to verify code. Please check your internet connection and try again.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const handleToggleProxy = async (enabled) => {
    setIsEnabled(enabled)

    if (enabled && primaryNode) {
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

      try {
        await chrome.proxy.settings.set({
          value: config,
          scope: 'regular',
        })
      } catch (err) {
        console.error('Error setting proxy:', err)
        setError('Failed to enable proxy')
        setIsEnabled(false)
      }
    } else {
      // Clear proxy settings
      try {
        await chrome.proxy.settings.clear({
          scope: 'regular',
        })
      } catch (err) {
        console.error('Error clearing proxy:', err)
        setError('Failed to disable proxy')
        setIsEnabled(true)
      }
    }
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
            onSetPrimary={(node) => setPrimaryNode(node)}
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
            disabled={isVerifying || linkCode.length !== 6}
          >
            {isVerifying ? 'Verifying...' : 'Link Account'}
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
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  )
})
