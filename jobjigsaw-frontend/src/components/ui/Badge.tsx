import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'cache-fresh' | 'cache-expiring' | 'cache-expired';
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'info', ...props }, ref) => {
    const baseClasses = 'badge';
    const variantClasses = {
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
      info: 'badge-info',
      'cache-fresh': 'badge-cache-fresh',
      'cache-expiring': 'badge-cache-expiring',
      'cache-expired': 'badge-cache-expired',
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };