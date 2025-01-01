// packages/ui/src/components/button/types.ts
export interface ButtonProps {
  label: string
  onClick: () => void
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}
