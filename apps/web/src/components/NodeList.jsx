// apps/web/src/components/NodeList.jsx
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { NodeDirectory } from '@bore/ui'
import NodeDirectoryNavigation from './NodeDirectoryNavigation'

const NodeList = () => {
  const [nodes, setNodes] = useState([])
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    country: '',
  })
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
      } catch (error) {
        console.error('Error:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [])

  const handleSaveNode = async (nodeId) => {
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
          nodeId,
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
        onFiltersChange={setFilters}
        nodes={nodes}
      />

      <NodeDirectory
        nodes={nodes}
        onSaveNode={handleSaveNode}
        filters={filters}
        className='mt-6'
      />
    </>
  )
}

export default NodeList
