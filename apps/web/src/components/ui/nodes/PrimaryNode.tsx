// packages/ui/src/components/nodes/PrimaryNode.tsx
import { Node } from './types'
import { Flag } from '../flag';
import { EmptyPrimaryNode } from '../empty-states';

interface PrimaryNodeProps {
  node: Node | null;
  onBrowse?: () => void;
}

export function PrimaryNode({ node, onBrowse }: PrimaryNodeProps) {


  if (!node) {
    return <EmptyPrimaryNode onBrowse={onBrowse} />;
  }

  return (
    <div className="border border-base-300 p-8 hover:shadow-2xl transition-all flex items-center">
      <Flag
        countryCode={node.countryCode}
        alt={`${node.country} flag`}
        size={32}
      />
      <div className="flex-1">
        <h4 className="text-xl font-medium text-content">{node.name}</h4>
        <p className="text-sm text-content/70">
          {node.country} - {node.region || 'Earth'}
        </p>
        {node.protocol && node.ipAddress && (
          <p className="text-sm text-accent">
            {node.protocol} - {node.ipAddress}:{node.port}
          </p>
        )}
      </div>
    </div>
  );
}
