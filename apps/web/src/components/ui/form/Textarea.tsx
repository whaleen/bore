import { TextareaProps } from './types';

export function Textarea({ placeholder, value, onChange }: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="textarea textarea-bordered w-full"
    ></textarea>
  );
}
