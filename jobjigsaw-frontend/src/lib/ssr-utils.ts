/**
 * Utility functions for safe browser API access during Server-Side Rendering (SSR)
 * These functions prevent "window is not defined" and similar SSR errors.
 */

/**
 * Check if we're running in a browser environment
 */
export const isBrowser = () => typeof window !== 'undefined';

/**
 * Check if we're running on the server
 */
export const isServer = () => typeof window === 'undefined';

/**
 * Safely access localStorage with SSR support
 */
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to access localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (!isBrowser()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set localStorage:', error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    if (!isBrowser()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error);
      return false;
    }
  }
};

/**
 * Safely access sessionStorage with SSR support
 */
export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to access sessionStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): boolean => {
    if (!isBrowser()) return false;
    try {
      sessionStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('Failed to set sessionStorage:', error);
      return false;
    }
  },
  removeItem: (key: string): boolean => {
    if (!isBrowser()) return false;
    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error);
      return false;
    }
  }
};

/**
 * Safely check media queries with SSR support
 */
export const safeMatchMedia = (query: string): { matches: boolean; media?: MediaQueryList } => {
  if (!isBrowser()) {
    return { matches: false };
  }
  
  try {
    const mediaQuery = window.matchMedia(query);
    return { matches: mediaQuery.matches, media: mediaQuery };
  } catch (error) {
    console.warn('Failed to access matchMedia:', error);
    return { matches: false };
  }
};

/**
 * Safely access document with SSR support
 */
export const safeDocument = {
  addEventListener: (event: string, handler: EventListener, options?: boolean | AddEventListenerOptions): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.addEventListener(event, handler, options);
      return true;
    } catch (error) {
      console.warn('Failed to add document event listener:', error);
      return false;
    }
  },
  removeEventListener: (event: string, handler: EventListener, options?: boolean | EventListenerOptions): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.removeEventListener(event, handler, options);
      return true;
    } catch (error) {
      console.warn('Failed to remove document event listener:', error);
      return false;
    }
  },
  createElement: (tagName: string): HTMLElement | null => {
    if (!isBrowser() || typeof document === 'undefined') return null;
    try {
      return document.createElement(tagName);
    } catch (error) {
      console.warn('Failed to create element:', error);
      return null;
    }
  }
};

/**
 * Safely download a file with SSR support
 */
export const safeDownload = (blob: Blob, filename: string): boolean => {
  if (!isBrowser() || typeof window === 'undefined' || typeof document === 'undefined') {
    console.warn('File download not available during server-side rendering');
    return false;
  }

  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.warn('Failed to download file:', error);
    return false;
  }
};

/**
 * Get system theme preference safely
 */
export const getSystemTheme = (): 'dark' | 'light' => {
  const { matches } = safeMatchMedia('(prefers-color-scheme: dark)');
  return matches ? 'dark' : 'light';
};

/**
 * Safely manipulate document classes
 */
export const safeDocumentClasses = {
  add: (className: string): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.documentElement.classList.add(className);
      return true;
    } catch (error) {
      console.warn('Failed to add document class:', error);
      return false;
    }
  },
  remove: (className: string): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.documentElement.classList.remove(className);
      return true;
    } catch (error) {
      console.warn('Failed to remove document class:', error);
      return false;
    }
  },
  toggle: (className: string): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.documentElement.classList.toggle(className);
      return true;
    } catch (error) {
      console.warn('Failed to toggle document class:', error);
      return false;
    }
  }
};

/**
 * Safely manipulate body styles
 */
export const safeBodyStyles = {
  setOverflow: (value: string): boolean => {
    if (!isBrowser() || typeof document === 'undefined') return false;
    try {
      document.body.style.overflow = value;
      return true;
    } catch (error) {
      console.warn('Failed to set body overflow:', error);
      return false;
    }
  }
};