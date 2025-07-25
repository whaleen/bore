// apps/web/src/components/features/node/ProxySubmissionForm/index.tsx
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { getCountriesList } from '../../../../utils/location'
import { Button } from '../../../ui/button/Button'
import { InputField } from '../../../ui/form/InputField'
import { SelectField } from '../../../ui/form/SelectField'
import { Checkbox } from '../../../ui/form/Checkbox'
import { Textarea } from '../../../ui/form/Textarea'
import { ProxyFormData, ProxySubmissionFormProps, CountryData } from './types'

const PROTOCOLS = ['HTTP', 'HTTPS', 'SOCKS5'] as const
type Protocol = typeof PROTOCOLS[number]

function ProxySubmissionForm({ onSuccess, onError }: ProxySubmissionFormProps) {
  const { publicKey } = useWallet()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null
  const countries: CountryData[] = getCountriesList()

  const [formData, setFormData] = useState<ProxyFormData>({
    name: '',
    country: '',
    ipAddress: '',
    protocol: 'HTTP' as Protocol,
    port: '',
    username: '',
    password: '',
    supportsUDP: false,
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value as Protocol,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      supportsUDP: e.target.checked
    }))
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      notes: e.target.value
    }))
  }

  const handleSubmit = async () => {
    if (!publicKeyBase58) {
      setError('Please connect your wallet to submit a node')
      return
    }

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
        headers: { 'Content-Type': 'application/json' },
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

      onSuccess?.(data.nodeId)
      alert('Node submitted successfully!')
      setFormData({
        name: '',
        country: '',
        ipAddress: '',
        protocol: 'HTTP' as Protocol,
        port: '',
        username: '',
        password: '',
        supportsUDP: false,
        notes: '',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit node'
      console.error('Error submitting node:', error)
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!publicKeyBase58) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>Please Connect Your Wallet</h2>
        <p className='text-gray-400'>You need to connect your wallet to submit nodes.</p>
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

      <div className='space-y-6'>
        <InputField
          value={formData.name}
          onChange={handleInputChange}
          placeholder='e.g., US East Node 1'
          label='Node Name'
        />

        <SelectField
          value={formData.country}
          onChange={handleSelectChange}
          options={countries.map(c => c.name)}
        />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <InputField
            value={formData.ipAddress}
            onChange={handleInputChange}
            placeholder='192.168.1.1'
            label='IP Address'
          />

          <SelectField
            value={formData.protocol}
            onChange={handleSelectChange}
            options={Array.from(PROTOCOLS)}
          />

          <InputField
            type="number"
            value={formData.port}
            onChange={handleInputChange}
            placeholder='8080'
            label='Port'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <InputField
            value={formData.username}
            onChange={handleInputChange}
            placeholder='username'
            label='Username (Optional)'
          />

          <InputField
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder='password'
            label='Password (Optional)'
          />
        </div>

        <Checkbox
          checked={formData.supportsUDP}
          onChange={handleCheckboxChange}
          label='Supports UDP'
        />

        <Textarea
          value={formData.notes}
          onChange={handleTextareaChange}
          placeholder='Additional information about the node'
          label='Notes (Optional)'
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={loading ? 'opacity-50' : ''}
          label={loading ? 'Submitting...' : 'Submit Node'}
        />
      </div>
    </div>
  )
}

export default ProxySubmissionForm
