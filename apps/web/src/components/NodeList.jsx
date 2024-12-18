// src/components/NodeList.jsx
import React from 'react'
import { useEffect, useState } from 'react'
import NodeDirectoryNavigation from './NodeDirectoryNavigation'
import { useWallet } from '@solana/wallet-adapter-react'
import { getFlag } from '../utils/flags'
import Flags from 'country-flag-icons/react/3x2'

function NodeList() {
  const [nodes, setNodes] = useState([])
  const [filteredNodes, setFilteredNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { publicKey } = useWallet()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/.netlify/functions/nodes')
        const data = await response.json()
        setNodes(data)
        setFilteredNodes(data)
      } catch (error) {
        console.error('Error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [])

  const handleFiltersChange = (filters) => {
    let filtered = [...nodes]

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((node) =>
        filters.status === 'active' ? node.isActive : !node.isActive
      )
    }

    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter((node) => node.countryCode === filters.country)
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (node) =>
          node.name.toLowerCase().includes(searchLower) ||
          node.country.toLowerCase().includes(searchLower) ||
          node.region.toLowerCase().includes(searchLower)
      )
    }

    setFilteredNodes(filtered)
  }

  const handleSaveNode = async (node) => {
    try {
      if (!publicKeyBase58) {
        alert('Please connect your wallet to save nodes')
        return
      }

      const response = await fetch('/.netlify/functions/save-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          nodeId: node.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save node')
      }

      alert('Node saved successfully')
    } catch (error) {
      console.error('Error saving node:', error)
      alert(error.message)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <>
      <NodeDirectoryNavigation
        onFiltersChange={handleFiltersChange}
        nodes={nodes}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className={`shadow-md  ${
              node.isActive
                ? 'border border-base-300 '
                : 'border border-base-100 opacity-70'
            }`}
          >
            <div className='card-body'>
              <h3 className='card-title'>{node.name}</h3>
              <div className='mt-2'>
                <div className='flex items-center gap-2'>
                  {node.countryCode &&
                    React.createElement(Flags[node.countryCode], {
                      className: 'w-5 h-5',
                    })}
                  <span>
                    {node.country} ({node.countryCode})
                  </span>
                </div>
                <p className='text-gray-400'>{node.ipAddress}</p>
                <p className='text-gray-400'>
                  Protocol: {node.protocol || 'N/A'}
                </p>
                <p className='text-gray-400'>Region: {node.region}</p>
                {node.supportsUDP && (
                  <p className='text-green-400'>UDP Supported</p>
                )}
              </div>
              {publicKeyBase58 && (
                <button
                  onClick={() => handleSaveNode(node)}
                  className={`btn btn-block mt-4 ${
                    node.isActive ? 'btn-success' : 'btn-disabled'
                  }`}
                  disabled={!node.isActive}
                >
                  {node.isActive ? 'Save Node' : 'Unavailable'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default NodeList
