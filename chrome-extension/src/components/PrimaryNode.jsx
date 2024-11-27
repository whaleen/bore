// chrome-extension/src/components/PrimaryNode.jsx
import React from 'react'

function PrimaryNode({ node }) {
  if (!node) {
    return (
      <div className='primary-node p-6 bg-base-200 rounded-xl shadow-lg hover:shadow-2xl transition-all'>
        <h3 className='text-2xl font-semibold text-primary mb-4'>
          Primary Node
        </h3>
        <p className='text-lg text-neutral'>No primary node selected</p>
      </div>
    )
  }

  return (
    <div className='primary-node p-6 bg-base-100 rounded-xl shadow-lg hover:shadow-2xl transition-all'>
      <h3 className='text-2xl font-semibold text-primary mb-4'>Primary Node</h3>
      <div className='node-info'>
        <h4 className='text-xl font-medium text-secondary'>{node.name}</h4>
        <p className='text-lg text-neutral mb-2'>
          {node.country} - {node.region}
        </p>
        <p className='text-sm text-accent'>
          {node.protocol} - {node.ipAddress}:{node.port}
        </p>
      </div>
    </div>
  )
}

export default PrimaryNode
