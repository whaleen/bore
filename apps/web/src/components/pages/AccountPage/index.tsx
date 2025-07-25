// app/web/src/components/pages/AccountPage/index.tsx
import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { NodeList, PrimaryNode } from '../../ui/nodes'
import { EmptySavedNodes, NoDevice } from '../../ui/empty-states'
import { DeviceConnection, SavedNode } from './types'

import { useNavigate } from 'react-router-dom'

interface SectionProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

const Section = ({ title, className, children }: SectionProps) => (
  <div className={className}>
    <h2 className='text-xl font-semibold mb-4'>{title}</h2>
    {children}
  </div>
)

const LinkCodeDisplay = ({ code }: { code: string }) => (
  <div className='text-center'>
    <p className='mb-4'>Your linking code:</p>
    <div className='text-3xl font-mono bg-base-300 p-4  mb-4'>
      {code}
    </div>
    <p className='text-sm text-gray-400'>
      This code will expire in 15 minutes
    </p>
  </div>
)

const DeviceLinker = ({
  linkCode,
  isGeneratingCode,
  onGenerateCode
}: {
  linkCode: string | null;
  isGeneratingCode: boolean;
  onGenerateCode: () => void;
}) => {
  if (linkCode) {
    return <LinkCodeDisplay code={linkCode} />
  }

  return (
    <div className="mt-6 pt-6 border-t border-base-300">
      <h3 className="text-lg font-semibold mb-2">Link Another Device</h3>
      <p className="text-gray-400 mb-4">
        Generate a code to link another device with your account.
      </p>
      <button
        onClick={onGenerateCode}
        disabled={isGeneratingCode}
        className="btn btn-primary"
      >
        {isGeneratingCode ? 'Generating Code...' : 'Generate Link Code'}
      </button>
    </div>
  )
}

const DeviceList = ({ devices }: { devices: DeviceConnection[] }) => {
  if (devices.length === 0) {
    return null;
  }

  return (
    <div className='space-y-4'>
      <h3 className="text-lg font-semibold mb-4">Linked Devices</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(device => (
          <div
            key={device.id}
            className="flex items-center justify-between p-4 bg-base-300 rounded-md shadow"
          >
            <div className="text-sm">
              <p className="font-medium">{device.deviceName || 'Generic Device'}</p>
              <p className="text-base-content/70">
                Connected {new Date(device.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

const DeviceContent = ({
  devices,
  linkCode,
  isGeneratingCode,
  onGenerateCode
}: {
  devices: DeviceConnection[];
  linkCode: string | null;
  isGeneratingCode: boolean;
  onGenerateCode: () => void;
}) => {
  return (
    <div>
      {devices.length === 0 ? (
        <NoDevice
          onGenerateCode={onGenerateCode}
          isGeneratingCode={isGeneratingCode}
        />
      ) : (
        <>
          <DeviceList devices={devices} />
          <DeviceLinker
            linkCode={linkCode}
            isGeneratingCode={isGeneratingCode}
            onGenerateCode={onGenerateCode}
          />
        </>
      )}
    </div>
  );
}

export default function AccountPage() {
  const [savedNodes, setSavedNodes] = useState<SavedNode[]>([])
  const [devices, setDevices] = useState<DeviceConnection[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [linkCode, setLinkCode] = useState<string | null>(null)
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)

  const { publicKey } = useWallet()
  const navigate = useNavigate()
  const publicKeyBase58 = publicKey ? publicKey.toBase58() : null

  const fetchSavedNodes = async () => {
    try {
      setError(null)
      const response = await fetch(`/.netlify/functions/nodes-saved?userId=${publicKeyBase58}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to fetch nodes')
      setSavedNodes(data.nodes)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch nodes')
      setSavedNodes([])
    }
  }

  const fetchDevices = async () => {
    try {
      const response = await fetch(`/.netlify/functions/auth-users?userId=${publicKeyBase58}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)
      setDevices(data.devices || []);
    } catch (err) {
      console.error('Error fetching devices:', err)
      setError('Failed to load extension devices')
    }
  }

  const handleGenerateLinkCode = async () => {
    if (!publicKeyBase58) return

    try {
      setIsGeneratingCode(true)
      setError(null)

      const response = await fetch('/.netlify/functions/auth-link-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate link code')
      }

      setLinkCode(data.code)
    } catch (err) {
      console.error('Error generating link code:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate link code')
    } finally {
      setIsGeneratingCode(false)
    }
  }

  const handleSetPrimary = async (nodeId: string) => {
    try {
      const response = await fetch('/.netlify/functions/nodes-saved', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          nodeId,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set primary node')
      }

      await fetchSavedNodes()  // Refresh the list after update
    } catch (err) {
      console.error('Error setting primary node:', err)
      setError(err instanceof Error ? err.message : 'Failed to set primary node')
    }
  }

  const handleRemoveNode = async (nodeId: string) => {
    try {
      const response = await fetch('/.netlify/functions/nodes-saved', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: publicKeyBase58,
          nodeId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove node')
      }

      // Update local state after successful removal
      setSavedNodes(savedNodes.filter(saved => saved.node.id !== nodeId))
    } catch (err) {
      console.error('Error removing node:', err)
      setError(err instanceof Error ? err.message : 'Failed to remove node')
    }
  }

  useEffect(() => {
    if (publicKeyBase58) {
      Promise.all([fetchSavedNodes(), fetchDevices()]).finally(() =>
        setLoading(false)
      )
    } else {
      setLoading(false)
    }
  }, [publicKeyBase58])

  if (!publicKeyBase58) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>Please Connect Your Wallet</h2>
        <p className='text-gray-400'>
          You need to connect your wallet to view your account settings.
        </p>
      </div>
    )
  }

  if (loading) return (<div className='flex justify-center items-center h-screen'>
    <span className='loading loading-spinner text-content'></span>
  </div>)



  const primaryNode = savedNodes.find((node) => node.isPrimary)?.node || null

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-6'>Account</h1>

      {error && (
        <div className='bg-red-500/10 border border-red-500 text-red-500 p-4  mb-6'>
          {error}
        </div>
      )}

      <Section
        title="Default Connection"
        className="mb-8"
      >
        <PrimaryNode
          node={primaryNode}
          onBrowse={() => navigate('/directory')}
        />
      </Section>

      <Section
        title="Devices"
        className="mb-8 p-6 border border-base-300 "
      >
        <DeviceContent
          devices={devices}
          linkCode={linkCode}
          isGeneratingCode={isGeneratingCode}
          onGenerateCode={handleGenerateLinkCode}
        />
      </Section>

      <Section title="Saved Nodes" className="mb-8">
        {savedNodes.length === 0 ? (
          <EmptySavedNodes onBrowse={() => navigate('/directory')} />
        ) : (
          <NodeList
            nodes={savedNodes.map(saved => saved.node)}
            primaryNodeId={primaryNode?.id}
            onRemoveNode={handleRemoveNode}
            onSetPrimary={handleSetPrimary}
            className='mt-4'
          />
        )}
      </Section>
    </div>
  )
}
