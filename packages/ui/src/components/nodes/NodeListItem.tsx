// packages/ui/src/components/nodes/NodeListItem.tsx
import { Badge } from '../badge/Badge';
import { NodeListItemProps } from './types';

const NodeListItem = ({
  node,
  isPrimary = false,
  onRemove,
  onSetPrimary,
  className = ''
}: NodeListItemProps) => {
  return (
    <div className={`flex items-center justify-between p-3 border border-base-300 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        <img
          src={`/api/placeholder/20/15`}
          alt={`${node.country} flag`}
          className="rounded"
        />

        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{node.name}</span>
            {isPrimary && (
              <Badge className="bg-primary text-primary-content text-xs">Primary</Badge>
            )}
          </div>
          <div className="text-sm text-base-content/70">
            {node.country} • {node.ipAddress}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isPrimary && onSetPrimary && (
          <button
            onClick={onSetPrimary}
            className="btn btn-sm btn-outline"
          >
            Set Primary
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn btn-sm btn-ghost text-error"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default NodeListItem;
