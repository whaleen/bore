import { useState } from 'react'
import NodeList from './components/NodeList'

function App() {
  const [connectedNode, setConnectedNode] = useState(null)

  const handleConnect = (node) => {
    setConnectedNode(node)
    localStorage.setItem('bore_selected_node', JSON.stringify(node))
  }

  const handleDisconnect = () => {
    setConnectedNode(null)
    localStorage.removeItem('bore_selected_node')
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
