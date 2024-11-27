// chrome-extension/src/components/ToggleSwitch.jsx
import React from 'react'

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <div className='switch-container'>
      <label className='switch'>
        <input
          type='checkbox'
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <span className='slider round'></span>
      </label>
      <span className='switch-label'>
        {enabled ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )
}

export default ToggleSwitch
