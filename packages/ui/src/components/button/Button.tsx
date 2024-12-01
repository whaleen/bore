import { ButtonProps } from "./types";

export function Button({ label, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`btn ${className}`}>
      {label}
    </button>
  );
}
