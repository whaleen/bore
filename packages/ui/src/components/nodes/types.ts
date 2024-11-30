// packages/ui/src/components/nodes/types.ts
export interface Node {
  id: string
  name: string
  country: string
  region: string
  protocol?: string
  ipAddress?: string
  port?: number
  isPrimary: boolean
}

export interface PrimaryNodeProps {
  node: Node | null
}

// SavedNodeList:

export interface SavedNodeListProps {
  nodes: Node[]
  onSetPrimary?: (node: Node) => void
  onRemoveNode?: (node: Node) => void
}
