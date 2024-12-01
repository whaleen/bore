export interface FormControlProps {
  label: string
  children: React.ReactNode
  errorMessage?: string
}

export interface InputFieldProps {
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface SelectFieldProps {
  options: string[]
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export interface TextareaProps {
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
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
