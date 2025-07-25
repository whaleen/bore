// packages/ui/src/components/nodes/NodeCard.tsx
import { Badge } from '../badge/Badge';
import { Flag } from '../flag/Flag'
import { NodeCardProps } from './types';

const NodeCard = ({
  node,
  isPrimary = false,
  onSave,
  onSetPrimary,
  showActions = true,
  className = ''
}: NodeCardProps) => {
  return (
    <div className={`rounded-lg border border-base-300 bg-base-100 shadow-sm ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header with Name and Status */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{node.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Flag
                countryCode={node.countryCode}
                size={20}
                className="rounded"
              />
              <span className="text-sm text-base-content/70">
                {node.country} ({node.countryCode})
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {isPrimary && (
              <Badge className="bg-primary text-primary-content">Primary</Badge>
            )}
            <Badge
              className={`${node.isActive
                ? 'bg-success/10 text-success'
                : 'bg-base-300 text-base-content/70'
                }`}
            >
              {node.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-base-content/70">
          <p>IP: {node.ipAddress}</p>
          <p>Region: {node.region}</p>
          {node.protocol && <p>Protocol: {node.protocol}</p>}
          {node.supportsUDP && (
            <p className="text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              UDP Supported
            </p>
          )}
        </div>

        {/* Actions */}
        {showActions && (node.isActive || isPrimary) && (
          <div className="flex gap-2 pt-2">
            {onSave && !isPrimary && (
              <button
                onClick={onSave}
                className="btn btn-sm btn-primary flex-1"
              >
                Save Node
              </button>
            )}
            {onSetPrimary && !isPrimary && (
              <button
                onClick={onSetPrimary}
                className="btn btn-sm btn-outline flex-1"
              >
                Set as Primary
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeCard;
