// chrome-extension/src/components/PrimaryNode.jsx
import React from 'react'

function PrimaryNode({ node }) {
  if (!node) {
    return (
      <div className='primary-node empty'>
        <h3>Primary Node</h3>
        <p>No primary node selected</p>
      </div>
    )
  }

  return (
    <div className='primary-node'>
      <h3>Primary Node</h3>
      <div className='node-info'>
        <h4>{node.name}</h4>
        <p>
          {node.country} - {node.region}
        </p>
        <p className='protocol'>
          {node.protocol} - {node.ipAddress}:{node.port}
        </p>
      </div>
    </div>
  )
}

export default PrimaryNode
