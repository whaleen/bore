import { InputFieldProps } from './types';

export function InputField({ type = 'text', placeholder, value, onChange }: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="input input-bordered w-full"
    />
  );
}
