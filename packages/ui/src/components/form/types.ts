export interface FormControlProps {
  label: string
  children: React.ReactNode
  errorMessage?: string
  required?: boolean
  helperText?: string
}

export interface InputFieldProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string // Add className prop
  label?: string
}

export interface SelectFieldProps {
  options: string[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  className?: string
}

export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

export interface TextareaProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  rows?: number
  label?: string
  disabled?: boolean
}

export interface Country {
  code: string
  name: string
}

export interface CountrySelectProps {
  value: string
  onChange: (value: string) => void
  countries: Country[]
  className?: string
}
