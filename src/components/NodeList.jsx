// src/components/NodeList.jsx
import { useEffect, useState, useContext } from 'react'
import { WalletContext } from './WalletContext'
import NodeDirectoryNavigation from './NodeDirectoryNavigation'

function NodeList() {
  const [nodes, setNodes] = useState([])
  const [filteredNodes, setFilteredNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { publicKey } = useContext(WalletContext)
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
      filtered = filtered.filter((node) => node.country === filters.country)
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
        countries={[...new Set(nodes.map((node) => node.country))].sort()}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredNodes.map((node) => (
          <div
            key={node.id}
            className={`border ${
              node.isActive ? 'border-green-500' : 'border-yellow-500'
            } rounded-lg p-4`}
          >
            <h3 className='text-lg font-semibold'>{node.name}</h3>
            <div className='mt-2'>
              <p>
                {node.country} ({node.countryCode})
              </p>
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
                className={`mt-4 w-full px-4 py-2 rounded
                  ${
                    node.isActive
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                disabled={!node.isActive}
              >
                {node.isActive ? 'Save Node' : 'Unavailable'}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  )
}

export default NodeList
