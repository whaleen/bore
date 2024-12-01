import { CheckboxProps } from './types';

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="label cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="checkbox" />
      <span className="label-text">{label}</span>
    </label>
  );
}
