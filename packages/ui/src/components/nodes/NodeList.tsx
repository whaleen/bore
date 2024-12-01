// packages/ui/src/components/nodes/NodeList.tsx
import { NodeListProps } from './types';
import NodeListItem from './NodeListItem';

export const NodeList = ({
  nodes,
  primaryNodeId,
  onRemoveNode,
  onSetPrimary,
  className = ''
}: NodeListProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {nodes.map(node => (
        <NodeListItem
          key={node.id}
          node={node}
          isPrimary={node.id === primaryNodeId}
          onRemove={() => onRemoveNode?.(node.id)}
          onSetPrimary={() => onSetPrimary?.(node.id)}
        />
      ))}
    </div>
  );
};

export type { NodeListProps };
