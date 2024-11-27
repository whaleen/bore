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
        <div className='alert alert-error mb-6'>
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-6'
      >
        {/* Node Name */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Node Name</span>
          </label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., US East Node 1'
            className='input input-bordered'
            required
          />
        </div>

        {/* Country Select */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Country</span>
          </label>
          <select
            name='country'
            value={formData.country}
            onChange={handleChange}
            className='select select-bordered'
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

        {/* IP, Protocol, Port */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>IP Address</span>
            </label>
            <input
              type='text'
              name='ipAddress'
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder='192.168.1.1'
              className='input input-bordered'
              required
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Protocol</span>
            </label>
            <select
              name='protocol'
              value={formData.protocol}
              onChange={handleChange}
              className='select select-bordered'
            >
              <option value='HTTP'>HTTP</option>
              <option value='HTTPS'>HTTPS</option>
              <option value='SOCKS5'>SOCKS5</option>
            </select>
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Port</span>
            </label>
            <input
              type='number'
              name='port'
              value={formData.port}
              onChange={handleChange}
              placeholder='8080'
              className='input input-bordered'
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Username (Optional)</span>
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='username'
              className='input input-bordered'
            />
          </div>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Password (Optional)</span>
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='password'
              className='input input-bordered'
            />
          </div>
        </div>

        {/* UDP Support */}
        <div className='form-control'>
          <label className='cursor-pointer flex items-center space-x-2'>
            <input
              type='checkbox'
              name='supportsUDP'
              checked={formData.supportsUDP}
              onChange={handleChange}
              className='checkbox'
            />
            <span className='label-text'>Supports UDP</span>
          </label>
        </div>

        {/* Notes */}
        <div className='form-control'>
          <label className='label'>
            <span className='label-text'>Notes (Optional)</span>
          </label>
          <textarea
            name='notes'
            value={formData.notes}
            onChange={handleChange}
            placeholder='Additional information about the node'
            className='textarea textarea-bordered'
            rows={4}
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={loading}
          className={`btn btn-block ${
            loading ? 'btn-disabled' : 'btn-success'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Node'}
        </button>
      </form>
    </div>
  )
}

export default ProxySubmissionForm
