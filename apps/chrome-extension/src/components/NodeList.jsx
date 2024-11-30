// chrome-extension/src/components/NodeList.jsx
import React from 'react'

function NodeList({ nodes, onSetPrimary }) {
  if (!nodes.length) {
    return (
      <div className='nodes-list p-4'>
        <h3 className='text-2xl font-semibold'>Saved Nodes</h3>
        <p className='text-gray-600'>No nodes saved yet</p>
      </div>
    )
  }

  return (
    <div className='nodes-list p-4'>
      <h3 className='text-2xl font-semibold mb-4'>Saved Nodes</h3>
      <div className='nodes-container grid grid-cols-1 gap-4'>
        {nodes.map((node) => (
          <div
            key={node.id}
            className='node-item p-4 border rounded-lg shadow-md hover:bg-gray-50'
          >
            <div className='node-details'>
              <h4 className='text-xl font-semibold'>{node.name}</h4>
              <p className='text-gray-600'>
                {node.country} - {node.region}
              </p>
              <span className='protocol inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full'>
                {node.protocol}
              </span>
            </div>
            {!node.isPrimary && (
              <button
                onClick={() => onSetPrimary(node)}
                className='set-primary-btn mt-4 btn btn-primary'
              >
                Set Primary
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NodeList
