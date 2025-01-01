// apps/web/src/components/features/node/VultrNodeCreator/index.tsx
// import axios from 'axios'
// We'll use a netlify function and not axios. So we don't need axios. Bruh. 

import { useState } from "react"

// We still need to build this. Not important now. We don't know what the Vultr API expects so let's reasearch that later. 

const VultrNodeCreator = () => {
  const [region, setRegion] = useState('')
  const [plan, setPlan] = useState('')
  const [os, setOs] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // const vultrApiKey = 'YOUR_VULTR_API_KEY' // Replace with your API key

  const createNode = async () => {
    if (!region || !plan || !os) {
      setMessage('Please select a region, plan, and OS.')
      return
    }

    setLoading(true)
    setMessage('')

    //   try {
    //     const response = await axios.post(
    //       'https://api.vultr.com/v2/instances',
    //       {
    //         region,
    //         plan,
    //         os_id: os,
    //       },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${vultrApiKey}`,
    //           'Content-Type': 'application/json',
    //         },
    //       }
    //     )

    //     setMessage(`Node created! Instance ID: ${response.data.instance.id}`)
    //   } catch (error) {
    //     console.error('Error creating node:', error)
    //     setMessage('Failed to create node. Please try again.')
    //   } finally {
    //     setLoading(false)
    //   }
    // }

    return (
      <div className='p-4'>
        <h2 className='text-lg font-bold'>Create a Vultr Node</h2>
        <div className='mt-4'>
          <label className='block mb-2'>Region:</label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className='border p-2 rounded w-full'
          >
            <option value=''>Select a region</option>
            <option value='ewr'>New Jersey</option>
            <option value='lax'>Los Angeles</option>
            <option value='sgp'>Singapore</option>
            {/* Add more regions as needed */}
          </select>
        </div>
        <div className='mt-4'>
          <label className='block mb-2'>Plan:</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className='border p-2 rounded w-full'
          >
            <option value=''>Select a plan</option>
            <option value='vc2-1c-1gb'>1 CPU, 1 GB RAM</option>
            <option value='vc2-2c-2gb'>2 CPUs, 2 GB RAM</option>
            <option value='vc2-4c-8gb'>4 CPUs, 8 GB RAM</option>
            {/* Add more plans as needed */}
          </select>
        </div>
        <div className='mt-4'>
          <label className='block mb-2'>Operating System:</label>
          <select
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className='border p-2 rounded w-full'
          >
            <option value=''>Select an OS</option>
            <option value='387'>Ubuntu 20.04 x64</option>
            <option value='401'>Debian 11 x64</option>
            <option value='215'>CentOS 7 x64</option>
            {/* Add more OS IDs as needed */}
          </select>
        </div>
        <button
          onClick={createNode}
          className='bg-blue-500 text-white px-4 py-2 mt-4 rounded'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Node'}
        </button>
        {message && <p className='mt-4'>{message}</p>}
      </div>
    )
  }
}

export default VultrNodeCreator
