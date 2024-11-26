import { useState } from 'react'
import NodeList from './components/NodeList'

function App() {
  const [connectedNode, setConnectedNode] = useState(null)

  const handleConnect = async (node) => {
    try {
      const userId = 'test-solana-pubkey' // Will come from wallet later
      const response = await fetch('/.netlify/functions/select-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          node,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save node selection')
      }

      setConnectedNode(node)
    } catch (error) {
      console.error('Error saving node selection:', error)
    }
  }

  const handleDisconnect = () => {
    setConnectedNode(null)
  }

  return (
    <div className='min-h-screen bg-gray-950 text-white'>
      <div className='container mx-auto p-4'>
        {connectedNode && (
          <div className='bg-green-600 p-4 rounded-lg mb-6 flex justify-between items-center'>
            <span>Connected to {connectedNode.name}</span>
            <button
              onClick={handleDisconnect}
              className='bg-gray-800 px-4 py-2 rounded hover:bg-gray-700'
            >
              Disconnect
            </button>
          </div>
        )}
        <h1 className='text-2xl font-bold mb-6'>Available Nodes</h1>
        <NodeList onConnect={handleConnect} />
      </div>
    </div>
  )
}

export default App
