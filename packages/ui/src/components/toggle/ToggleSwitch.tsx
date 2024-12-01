// packages/ui/src/components/toggle/ToggleSwitch.tsx
interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: (value: boolean) => void;
  label?: string;
}

export function ToggleSwitch({ enabled, onToggle, label }: ToggleSwitchProps) {
  return (
    <div className="flex items-center space-x-4 flex-col justify-center">

      <label className="">
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
  )
}
