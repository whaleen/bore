// chrome-extension/src/components/ToggleSwitch.jsx
import React from 'react'

function ToggleSwitch({ enabled, onToggle }) {
  return (
    <div className='flex items-center space-x-4 flex-col justify-center'>
      <label className='toggle toggle-primary'>
        <input
          type='checkbox'
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className='toggle-input'
        />
      </label>
      <span className='mt-2 text-sm text-neutral'>
        {enabled ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  )
}

export default ToggleSwitch
