import { FormControlProps } from './types';

export function FormControl({ label, children, errorMessage }: FormControlProps) {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      {children}
      {errorMessage && <span className="text-error text-sm">{errorMessage}</span>}
    </div>
  );
}
