// packages/ui/src/components/nodes/NodeListItem.tsx
import { NodeListItemProps } from './types';
import { Flag } from '../flag';

const NodeListItem = ({
  node,
  onRemove,
  onSetPrimary,
  className = ''
}: NodeListItemProps) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-base-300 rounded-lg ${className}`}
    >
      {/* Left Section: Flag and Node Info */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Flag
          countryCode={node.countryCode}
          size={20}
          className="rounded"
        />

        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{node.name}</div>
          <div className="text-sm text-base-content/70 truncate">
            {node.country} • {node.ipAddress}
          </div>
        </div>
      </div>

      {/* Right Section: Button Group */}
      <div className="flex gap-2 mt-3 sm:mt-0">
        {onSetPrimary && (
          <button
            onClick={onSetPrimary}
            className="btn btn-xs"
          >
            Set Primary
          </button>
        )}
        {onRemove && (
          <button
            onClick={onRemove}
            className="btn btn-xs btn-error"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};



export default NodeListItem;
