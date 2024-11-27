import { useState } from 'react'
import { useContext } from 'react'
import { WalletContext } from './WalletContext'
import { getCountriesList } from '../utils/location'

function ProxySubmissionForm() {
  const { publicKey } = useContext(WalletContext)
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null
  const countries = getCountriesList()

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    ipAddress: '',
    protocol: 'HTTP',
    port: '',
    username: '',
    password: '',
    supportsUDP: false,
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!publicKeyBase58) {
      setError('Please connect your wallet to submit a node')
      return
    }

    // Find the selected country data
    const selectedCountry = countries.find((c) => c.name === formData.country)
    if (!selectedCountry) {
      setError('Please select a valid country')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/.netlify/functions/add-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          node: {
            ...formData,
            countryCode: selectedCountry.code,
          },
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit node')
      }

      alert('Node submitted successfully!')
      // Reset form
      setFormData({
        name: '',
        country: '',
        ipAddress: '',
        protocol: 'HTTP',
        port: '',
        username: '',
        password: '',
        supportsUDP: false,
        notes: '',
      })
    } catch (error) {
      console.error('Error submitting node:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKeyBase58) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>
          Please Connect Your Wallet
        </h2>
        <p className='text-gray-400'>
          You need to connect your wallet to submit nodes.
        </p>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Submit Node to Directory</h1>

      {error && (
        <div className='bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6'>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        {/* Node Name */}
        <div>
          <label className='block text-sm font-medium mb-1'>Node Name</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='e.g., US East Node 1'
            required
          />
        </div>

        {/* Country Select */}
        <div>
          <label className='block text-sm font-medium mb-1'>Country</label>
          <select
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            required
          >
            <option value=''>Select a country</option>
            {countries.map((country) => (
              <option
                key={country.code}
                value={country.name}
              >
                {country.name} ({country.region})
              </option>
            ))}
          </select>
        </div>

        {/* IP & Protocol & Port */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>IP Address</label>
            <input
              type='text'
              name='ipAddress'
              value={formData.ipAddress}
              onChange={handleChange}
              className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='192.168.1.1'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Protocol</label>
            <select
              name='protocol'
              value={formData.protocol}
              onChange={handleChange}
              className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            >
              <option value='HTTP'>HTTP</option>
              <option value='HTTPS'>HTTPS</option>
              <option value='SOCKS5'>SOCKS5</option>
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Port</label>
            <input
              type='number'
              name='port'
              value={formData.port}
              onChange={handleChange}
              className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='8080'
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Username (Optional)
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='username'
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>
              Password (Optional)
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
              placeholder='password'
            />
          </div>
        </div>

        {/* UDP Support */}
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            name='supportsUDP'
            checked={formData.supportsUDP}
            onChange={handleChange}
            className='w-4 h-4 bg-gray-800 rounded focus:ring-2 focus:ring-blue-500'
          />
          <label className='text-sm font-medium'>Supports UDP</label>
        </div>

        {/* Notes */}
        <div>
          <label className='block text-sm font-medium mb-1'>
            Notes (Optional)
          </label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            className='w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none'
            placeholder='Additional information about the node'
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className={`w-full px-4 py-2 rounded-lg ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Node'}
        </button>
      </form>
    </div>
  )
}

export default ProxySubmissionForm
