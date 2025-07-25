import { SelectFieldProps } from './types';

export function SelectField({ options = [], value, onChange }: SelectFieldProps) {
  return (
    <select value={value} onChange={onChange} className="select select-bordered w-full">
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))
      ) : (
        <option value="">No options available</option>
      )}
    </select>
  );
}
