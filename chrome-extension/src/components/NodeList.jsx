// chrome-extension/src/components/NodeList.jsx
import React from 'react'

function NodeList({ nodes, onSetPrimary }) {
  if (!nodes.length) {
    return (
      <div className='nodes-list empty'>
        <h3>Saved Nodes</h3>
        <p>No nodes saved yet</p>
      </div>
    )
  }

  return (
    <div className='nodes-list'>
      <h3>Saved Nodes</h3>
      <div className='nodes-container'>
        {nodes.map((node) => (
          <div
            key={node.id}
            className='node-item'
          >
            <div className='node-details'>
              <h4>{node.name}</h4>
              <p>
                {node.country} - {node.region}
              </p>
              <span className='protocol'>{node.protocol}</span>
            </div>
            {!node.isPrimary && (
              <button
                onClick={() => onSetPrimary(node)}
                className='set-primary-btn'
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
