import { useState } from 'react'
import { getCountriesList } from '../utils/location'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, InputField, SelectField, Checkbox, Textarea } from '@bore/ui' // Import Textarea

function ProxySubmissionForm() {
  const { publicKey } = useWallet()
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
          <InputField
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='e.g., US East Node 1'
            label='Node Name'
            required
          />
        </div>

        {/* Country Select */}
        <SelectField
          name='country'
          value={formData.country}
          onChange={handleChange}
          label='Country'
          options={countries.map((country) => country.name)} // Pass country names as options
          required
        />

        {/* IP, Protocol, Port */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='form-control'>
            <InputField
              type='text'
              name='ipAddress'
              value={formData.ipAddress}
              onChange={handleChange}
              placeholder='192.168.1.1'
              label='IP Address'
              required
            />
          </div>
          <div className='form-control'>
            <SelectField
              name='protocol'
              value={formData.protocol}
              onChange={handleChange}
              label='Protocol'
              options={['HTTP', 'HTTPS', 'SOCKS5']} // Protocol options
            />
          </div>
          <div className='form-control'>
            <InputField
              type='number'
              name='port'
              value={formData.port}
              onChange={handleChange}
              placeholder='8080'
              label='Port'
              required
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='form-control'>
            <InputField
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='username'
              label='Username (Optional)'
            />
          </div>
          <div className='form-control'>
            <InputField
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='password'
              label='Password (Optional)'
            />
          </div>
        </div>

        {/* UDP Support */}
        <div className='form-control'>
          <Checkbox
            label='Supports UDP'
            checked={formData.supportsUDP}
            onChange={handleChange}
            name='supportsUDP'
          />
        </div>

        {/* Notes */}
        <div className='form-control'>
          <Textarea
            placeholder='Additional information about the node'
            value={formData.notes}
            onChange={handleChange}
            label='Notes (Optional)'
          />
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          disabled={loading}
          className={`btn btn-block ${
            loading ? 'btn-disabled' : 'btn-success'
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Node'}
        </Button>
      </form>
    </div>
  )
}

export default ProxySubmissionForm
