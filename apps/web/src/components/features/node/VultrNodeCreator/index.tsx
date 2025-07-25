import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { SelectField } from '../../../ui/form/SelectField'
import { InputField } from '../../../ui/form/InputField'
import { Button } from '../../../ui/button/Button'
import { Textarea } from '../../../ui/form/Textarea'

interface VultrPlan {
  id: string
  name: string
  vcpu_count: number
  ram: number
  disk: number
  bandwidth: number
  monthly_cost: number
  type: string
  locations: string[]
}

interface VultrRegion {
  id: string
  country: string
  continent: string
  city: string
  options: string[]
}

interface VultrOS {
  id: number
  name: string
  arch: string
  family: string
}

interface VultrInstance {
  id: string
  vultrId: string
  label: string
  region: string
  plan: string
  osId: number
  status: string
  powerStatus: string
  mainIp?: string
  createdAt: string
}

const VultrNodeCreator = () => {
  const { publicKey } = useWallet()
  const userId = publicKey?.toBase58()

  // Form state
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [selectedOS, setSelectedOS] = useState('')
  const [instanceLabel, setInstanceLabel] = useState('')
  const [userData, setUserData] = useState('')
  
  // Data state
  const [regions, setRegions] = useState<VultrRegion[]>([])
  const [plans, setPlans] = useState<VultrPlan[]>([])
  const [osList, setOsList] = useState<VultrOS[]>([])
  const [instances, setInstances] = useState<VultrInstance[]>([])
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      setDataLoading(true)
      try {
        const [regionsRes, plansRes, osRes] = await Promise.all([
          fetch('/.netlify/functions/vultr-regions'),
          fetch('/.netlify/functions/vultr-plans?type=vc2'), // Focus on cloud compute plans
          fetch('/.netlify/functions/vultr-os')
        ])

        if (!regionsRes.ok || !plansRes.ok || !osRes.ok) {
          throw new Error('Failed to fetch reference data')
        }

        const [regionsData, plansData, osData] = await Promise.all([
          regionsRes.json(),
          plansRes.json(),
          osRes.json()
        ])

        setRegions(regionsData.regions || [])
        setPlans(plansData.plans || [])
        setOsList(osData.os || [])
      } catch (err) {
        console.error('Error fetching reference data:', err)
        setError('Failed to load Vultr data. Please refresh the page.')
      } finally {
        setDataLoading(false)
      }
    }

    fetchReferenceData()
  }, [])

  // Fetch user instances when component mounts or after creating an instance
  useEffect(() => {
    if (userId) {
      fetchUserInstances()
    }
  }, [userId])

  const fetchUserInstances = async () => {
    if (!userId) return

    try {
      const response = await fetch(`/.netlify/functions/vultr-instances?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setInstances(data.instances || [])
      }
    } catch (err) {
      console.error('Error fetching user instances:', err)
    }
  }

  // Filter plans based on selected region
  const availablePlans = plans.filter(plan => 
    !selectedRegion || plan.locations.includes(selectedRegion)
  )

  const createInstance = async () => {
    if (!userId) {
      setError('Please connect your wallet to create instances.')
      return
    }

    if (!selectedRegion || !selectedPlan || !selectedOS) {
      setError('Please select a region, plan, and operating system.')
      return
    }

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/.netlify/functions/vultr-instances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          region: selectedRegion,
          plan: selectedPlan,
          osId: parseInt(selectedOS),
          label: instanceLabel || `Bore Node ${Date.now()}`,
          userData: userData || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create instance')
      }

      setMessage(`Instance created successfully! ID: ${data.instance.vultrId}`)
      
      // Reset form
      setSelectedRegion('')
      setSelectedPlan('')
      setSelectedOS('')
      setInstanceLabel('')
      setUserData('')
      
      // Refresh instances list
      await fetchUserInstances()

    } catch (err) {
      console.error('Error creating instance:', err)
      setError(err instanceof Error ? err.message : 'Failed to create instance')
    } finally {
      setLoading(false)
    }
  }

  const deleteInstance = async (instanceId: string) => {
    if (!confirm('Are you sure you want to delete this instance? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/.netlify/functions/vultr-instances/${instanceId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete instance')
      }

      setMessage('Instance deleted successfully')
      await fetchUserInstances()
    } catch (err) {
      console.error('Error deleting instance:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete instance')
    }
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400">You need to connect your wallet to manage Vultr instances.</p>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Vultr Instance Manager</h1>
      
      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
        </div>
      )}
      
      {message && (
        <div className="alert alert-success mb-6">
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Instance Form */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Create New Instance</h2>
            
            <div className="space-y-4">
              <InputField
                id="instanceLabel"
                label="Instance Label (Optional)"
                value={instanceLabel}
                onChange={(e) => setInstanceLabel(e.target.value)}
                placeholder="My Bore Node"
              />

              <SelectField
                id="selectedRegion"
                label="Region"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                options={['', ...regions.map(r => r.id)]}
                optionLabels={['Select a region', ...regions.map(r => `${r.city}, ${r.country}`)]}
              />

              <SelectField
                id="selectedPlan"
                label="Plan"
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                options={['', ...availablePlans.map(p => p.id)]}
                optionLabels={[
                  'Select a plan',
                  ...availablePlans.map(p => 
                    `${p.name} - ${p.vcpu_count} CPU, ${p.ram}MB RAM - $${p.monthly_cost}/mo`
                  )
                ]}
                disabled={!selectedRegion}
              />

              <SelectField
                id="selectedOS"
                label="Operating System"
                value={selectedOS}
                onChange={(e) => setSelectedOS(e.target.value)}
                options={['', ...osList.map(os => os.id.toString())]}
                optionLabels={['Select an OS', ...osList.map(os => `${os.name} (${os.arch})`)]}
              />

              <Textarea
                id="userData"
                label="User Data (Optional)"
                value={userData}
                onChange={(e) => setUserData(e.target.value)}
                placeholder="#!/bin/bash&#10;# Your startup script here"
                rows={4}
              />

              <Button
                onClick={createInstance}
                disabled={loading || !selectedRegion || !selectedPlan || !selectedOS}
                className={`w-full ${loading ? 'loading' : ''}`}
                label={loading ? 'Creating...' : 'Create Instance'}
              />
            </div>
          </div>
        </div>

        {/* Instances List */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Instances</h2>
            
            {instances.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No instances found. Create your first instance!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {instances.map((instance) => (
                  <div key={instance.id} className="card bg-base-100 shadow">
                    <div className="card-body p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{instance.label}</h3>
                          <p className="text-sm text-gray-400">ID: {instance.vultrId}</p>
                          <p className="text-sm">Region: {instance.region}</p>
                          <p className="text-sm">Plan: {instance.plan}</p>
                          {instance.mainIp && (
                            <p className="text-sm">IP: {instance.mainIp}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`badge ${
                            instance.status === 'active' ? 'badge-success' : 
                            instance.status === 'pending' ? 'badge-warning' : 
                            'badge-error'
                          }`}>
                            {instance.status}
                          </div>
                          <div className={`badge ml-2 ${
                            instance.powerStatus === 'running' ? 'badge-success' : 
                            'badge-error'
                          }`}>
                            {instance.powerStatus}
                          </div>
                          <button 
                            className="btn btn-error btn-sm mt-2"
                            onClick={() => deleteInstance(instance.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VultrNodeCreator