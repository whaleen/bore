// apps/web/src/components/pages/NodeDirectoryPage/index.tsx
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { NodeDirectory, NodeDirectoryNavigation } from '@bore/ui'
import type { Node } from '@bore/ui'

type NodeFilters = {
  status: 'all' | 'active' | 'inactive';
  search: string;
  country: string;
}

interface NodesResponse {
  nodes: Node[]
}

const NodeDirectoryPage = () => {
  const [nodesData, setNodesData] = useState<NodesResponse>({ nodes: [] })
  const [filters, setFilters] = useState<NodeFilters>({
    status: 'all',
    search: '',
    country: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { publicKey } = useWallet()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/.netlify/functions/nodes')
        const data: NodesResponse = await response.json()
        setNodesData(data)
      } catch (err) {
        console.error('Error:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch nodes')
      } finally {
        setLoading(false)
      }
    }

    fetchNodes()
  }, [])

  const handleSaveNode = async (nodeId: string) => {
    try {
      if (!publicKeyBase58) {
        alert('Please connect your wallet to save nodes')
        return
      }

      const response = await fetch('/.netlify/functions/nodes', {
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

      alert('Node saved successfully broseph')
    } catch (err) {
      console.error('Error saving node:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to save node'
      alert(errorMessage)
    }
  }

  if (loading) return (<div className='flex justify-center items-center h-screen'>
    <span className='loading loading-spinner text-content'></span>
  </div>)

  if (error) return <div>Error: {error}</div>

  return (
    <>
      <NodeDirectoryNavigation
        onFiltersChange={setFilters}
        nodes={nodesData}
      />

      <NodeDirectory
        nodes={nodesData.nodes}
        onSaveNode={handleSaveNode}
        filters={filters}
        className='mt-6'
      />
    </>
  )
}

export default NodeDirectoryPage
