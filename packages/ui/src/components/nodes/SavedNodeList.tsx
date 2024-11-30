// packages/ui/src/components/nodes/SavedNodeList.tsx
import { SavedNodeListProps } from './types'

export function SavedNodeList({ nodes, onSetPrimary, onRemoveNode }: SavedNodeListProps) {
  if (!nodes.length) {
    return (
      <div className="p-4">
        <h3 className="text-2xl font-semibold">Saved Nodes</h3>
        <p className="text-gray-600">No nodes saved yet</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      {/* <h3 className="text-2xl mb-4">Saved Nodes</h3> */}
      <div className="grid grid-cols-1 gap-4">
        {nodes.map((node) => (
          <div key={node.id} className="p-4 border border-base-300 rounded-lg shadow-md hover:bg-base-200 transition-all">
            <div className="node-details">
              <h4 className="text-xl font-semibold">{node.name}</h4>
              <p className="text-neutral">{node.country} - {node.region}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                {node.protocol}
              </span>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {!node.isPrimary && onSetPrimary && (
                <button
                  onClick={() => onSetPrimary(node)}
                  className="btn btn-primary btn-sm"
                >
                  Set Primary
                </button>
              )}
              {onRemoveNode && (
                <button
                  onClick={() => onRemoveNode(node)}
                  className="btn btn-error btn-sm"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
