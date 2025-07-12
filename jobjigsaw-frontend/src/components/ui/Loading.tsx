import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    };

    return (
      <div
        ref={ref}
        className={cn('animate-spin inline-block', sizes[size], className)}
        {...props}
      >
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }
);
LoadingSpinner.displayName = 'LoadingSpinner';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  height?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, lines = 1, height = '1rem', ...props }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className="skeleton rounded"
            style={{ height }}
          />
        ))}
      </div>
    );
  }
);
Skeleton.displayName = 'Skeleton';

const JobCardSkeleton = () => (
  <div className="card">
    <div className="card-header">
      <Skeleton height="1.5rem" />
      <Skeleton height="1rem" />
    </div>
    <div className="card-content">
      <Skeleton lines={3} />
    </div>
    <div className="card-footer">
      <Skeleton height="2rem" className="w-24" />
      <Skeleton height="2rem" className="w-20" />
    </div>
  </div>
);

const ResumeCardSkeleton = () => (
  <div className="card">
    <div className="card-header">
      <Skeleton height="1.5rem" />
      <Skeleton height="1rem" />
    </div>
    <div className="card-content">
      <Skeleton lines={4} />
    </div>
    <div className="card-footer">
      <Skeleton height="2rem" className="w-20" />
      <Skeleton height="2rem" className="w-24" />
      <Skeleton height="2rem" className="w-16" />
    </div>
  </div>
);

export { LoadingSpinner, Skeleton, JobCardSkeleton, ResumeCardSkeleton };