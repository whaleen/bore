// packages/ui/src/components/toggle/types.ts
export interface ToggleSwitchProps {
  enabled: boolean
  onToggle: (value: boolean) => void
  label?: string
  className?: string // Added className to the interface
}
