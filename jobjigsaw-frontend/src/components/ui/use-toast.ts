import { useState, useEffect } from 'react';

type ToastType = 'info' | 'success' | 'warning' | 'error';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  description: string;
}

interface ToastOptions {
  type?: ToastType;
  title: string;
  description: string;
}

const toasts: Toast[] = [];
let toastListener: (toasts: Toast[]) => void;

function toast(options: ToastOptions) {
  const newToast: Toast = {
    id: Date.now(),
    type: options.type || 'info',
    title: options.title,
    description: options.description,
  };
  toasts.push(newToast);
  if (toastListener) {
    toastListener([...toasts]);
  }
  setTimeout(() => {
    const index = toasts.findIndex((t) => t.id === newToast.id);
    if (index > -1) {
      toasts.splice(index, 1);
      if (toastListener) {
        toastListener([...toasts]);
      }
    }
  }, 5000);
}

function useToast() {
  const [toastState, setToastState] = useState<Toast[]>([]);

  useEffect(() => {
    toastListener = setToastState;
    return () => {
      toastListener = (undefined as unknown) as (toasts: Toast[]) => void;
    };
  }, []);

  return { toasts: toastState, toast };
}

export { useToast, toast };
export type { Toast, ToastType };
