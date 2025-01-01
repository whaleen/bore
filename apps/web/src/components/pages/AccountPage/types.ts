// apps/web/src/components/pages/AccountPage/types.ts
import { Node } from '@bore/ui'

export interface DeviceConnection {
  id: string
  deviceName: string | null
  deviceType: string
  lastSeen: string
  createdAt: string
  isActive: boolean
}

export interface SavedNode {
  id: string
  isPrimary: boolean
  createdAt: string
  node: Node
}

export interface AccountPageProps {
  initialNodes?: SavedNode[]
  initialPreferences?: {
    theme: 'light' | 'dark'
    devices: DeviceConnection[]
  }
}
