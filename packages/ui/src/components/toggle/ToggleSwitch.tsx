// packages/ui/src/components/toggle/ToggleSwitch.tsx
import { ToggleSwitchProps } from './types';

export function ToggleSwitch({ enabled, onToggle, label, className = '' }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-4 flex-col justify-center">
      <label className={className}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="toggle toggle-success toggle-lg"
        />
      </label>
      {label && (
        <span className="mt-2 text-sm text-neutral">
          {label}
        </span>
      )}
    </div>
  );
}
