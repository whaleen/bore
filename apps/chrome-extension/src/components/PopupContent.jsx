// chrome-extension/src/components/PopupContent.jsx
import React, { useState, useEffect } from 'react'

const STORAGE_KEY = 'bore_selected_node'

const PopupContent = () => {
  const [selectedNode, setSelectedNode] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load both the selected node and connection state when popup opens
    const loadInitialState = async () => {
      // Get selected node
      const storedNode = localStorage.getItem(STORAGE_KEY)
      if (storedNode) {
        setSelectedNode(JSON.parse(storedNode))
      }

      // Get connection state
      chrome.runtime.sendMessage(
        { type: 'GET_CONNECTION_STATE' },
        (response) => {
          setIsConnected(response.isConnected)
          setIsLoading(false)
        }
      )
    }

    loadInitialState()
  }, [])

  const handleToggle = () => {
    const newConnectionState = !isConnected
    setIsConnected(newConnectionState)

    chrome.runtime.sendMessage({
      type: newConnectionState ? 'CONNECT' : 'DISCONNECT',
      node: selectedNode,
    })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='text-gray-600'>Loading...</div>
      </div>
    )
  }

  if (!selectedNode) {
    return (
      <div className='flex flex-col items-center justify-center p-4 space-y-4'>
        <div className='text-center text-gray-600'>
          No node selected. Please select a node in the BORE dVPN dashboard.
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col p-4 space-y-4 w-80'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>BORE dVPN</h2>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            className='sr-only peer'
            checked={isConnected}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <div className='bg-white rounded-lg shadow p-4 space-y-2'>
        <div className='flex items-center space-x-2'>
          <img
            src={`https://flagcdn.com/16x12/${selectedNode.countryCode.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/32x24/${selectedNode.countryCode.toLowerCase()}.png 2x`}
            width='16'
            height='12'
            alt={`${selectedNode.country} Flag`}
            className='inline'
          />
          <span className='font-medium'>{selectedNode.name}</span>
        </div>
        <div className='text-sm text-gray-600'>
          <div>Country: {selectedNode.country}</div>
          <div>IP: {selectedNode.ipAddress}</div>
        </div>
      </div>

      <div className='text-sm text-gray-500 text-center'>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  )
}

export default PopupContent
