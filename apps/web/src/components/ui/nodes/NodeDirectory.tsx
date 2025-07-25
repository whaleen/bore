// packages/ui/src/components/nodes/NodeDirectory.tsx
import { NodeDirectoryProps } from './types';
import NodeCard from './NodeCard';

export const NodeDirectory = ({
  nodes,
  onSaveNode,
  onSetPrimary,
  filters = {},
  className = ''
}: NodeDirectoryProps) => {
  const filteredNodes = nodes.filter(node => {
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' && !node.isActive) return false;
      if (filters.status === 'inactive' && node.isActive) return false;
    }

    if (filters.country && node.countryCode !== filters.country) return false;

    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        node.name.toLowerCase().includes(search) ||
        node.country.toLowerCase().includes(search) ||
        node.region.toLowerCase().includes(search)
      );
    }

    return true;
  });

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {filteredNodes.map(node => (
        <NodeCard
          key={node.id}
          node={node}
          onSave={() => onSaveNode?.(node.id)}
          onSetPrimary={() => onSetPrimary?.(node.id)}
          showActions={node.isActive}
        />
      ))}
    </div>
  );
};

export type { NodeDirectoryProps };
