import React from 'react';

interface ButtonProps {
  pending: boolean;
  onClick: () => void;
}

export const InferJobButton: React.FC<ButtonProps> = ({ pending, onClick }) => (
  <button
    onClick={onClick}
    disabled={pending}
    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-xs text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {pending ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Analyzing...
      </>
    ) : 'Analyze Job'}
  </button>
);

export const InferJobMatchButton: React.FC<ButtonProps> = ({ pending, onClick }) => (
  <button
    onClick={onClick}
    disabled={pending}
    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border border-primary text-sm font-medium rounded-lg shadow-xs text-primary bg-transparent hover:bg-primary/10 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    {pending ? (
      <>
        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Checking Match...
      </>
    ) : 'Check Resume Match'}
  </button>
);
