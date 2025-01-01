// packages/ui/src/components/badge/Badge.tsx
import { BadgeProps } from './types';

const variantClasses = {
  default: 'bg-base-300 text-base-content/70',
  primary: 'bg-primary text-primary-content',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error'
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'px-3 py-1'
};

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) => {
  return (
    <span
      className={`
        inline-flex items-center justify-center font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export type { BadgeProps };
