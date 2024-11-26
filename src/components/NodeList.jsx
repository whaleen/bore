import { useEffect, useState } from 'react'

function NodeList({ onConnect }) {
  const [nodes, setNodes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true)
        const response = await fetch('/.netlify/functions/nodes')
        const data = await response.json()
        console.log('THE DATA MFERS', data)
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

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {nodes.map((node) => (
        <div
          key={node.id}
          className='border border-warning rounded-sm p-4'
        >
          <h3 className='text-lg font-semibold'>{node.name}</h3>
          <div className='mt-2'>
            <p>{node.country}</p>
            <p className='text-gray-600'>{node.ipAddress}</p>
          </div>
          <button
            onClick={() => onConnect(node)}
            className='mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
          >
            Connect
          </button>
        </div>
      ))}
    </div>
  )
}

export default NodeList
