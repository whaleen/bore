// packages/ui/src/components/form/InputField.tsx
import { InputFieldProps } from './types'

export function InputField({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',  // Add className with default empty string
  label
}: InputFieldProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`input input-bordered w-full ${className}`}
      />
    </div>
  )
}
