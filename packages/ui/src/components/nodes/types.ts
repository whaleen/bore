// packages/ui/src/components/nodes/types.ts
export interface Node {
  id: string
  name: string
  country: string
  countryCode: string
  region: string
  protocol?: string
  ipAddress?: string
  supportsUDP?: boolean
  port?: number
  isPrimary: boolean
  isActive: boolean
}

export interface PrimaryNodeProps {
  node: Node | null
}

// SavedNodeList:

// new shit bwelow - refactor above when done!

export interface NodeCardProps {
  node: Node
  isPrimary?: boolean
  onSave?: () => void
  onSetPrimary?: () => void
  showActions?: boolean
  className?: string
}

export interface NodeListItemProps {
  node: Node
  isPrimary?: boolean
  onRemove?: () => void
  onSetPrimary?: () => void
  className?: string
}

export interface NodeDirectoryProps {
  nodes: Node[]
  onSaveNode?: (nodeId: string) => void
  onSetPrimary?: (nodeId: string) => void
  filters?: {
    status?: 'all' | 'active' | 'inactive'
    search?: string
    country?: string
  }
  className?: string
}

export interface NodeListProps {
  nodes: Node[]
  primaryNodeId?: string
  onRemoveNode?: (nodeId: string) => void
  onSetPrimary?: (nodeId: string) => void
  className?: string
}
