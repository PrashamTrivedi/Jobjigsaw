'use client';

import React, { useCallback, useState } from 'react';
import { cn } from '@/lib/utils';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  selectedFile?: File | null;
  onRemoveFile?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  accept = '.pdf,.json',
  maxSize = 10,
  disabled = false,
  selectedFile,
  onRemoveFile,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      return `File type must be one of: ${allowedTypes.join(', ')}`;
    }

    return null;
  }, [accept, maxSize]);

  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    onFileSelect(file);
  }, [onFileSelect, validateFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        // File selected state
        <div className="card border-2 border-dashed border-gray-300 dark:border-gray-600">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <DocumentIcon className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-body font-medium">{selectedFile.name}</p>
                <p className="text-caption">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {onRemoveFile && (
              <button
                onClick={onRemoveFile}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={disabled}
              >
                <XMarkIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
      ) : (
        // Upload state
        <div
          className={cn(
            'card border-2 border-dashed transition-colors cursor-pointer',
            isDragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
            disabled && 'opacity-50 cursor-not-allowed',
            error && 'border-red-400 bg-red-50 dark:bg-red-900/20'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <label
            htmlFor="file-upload"
            className={cn(
              'flex flex-col items-center justify-center py-8 px-4 text-center',
              disabled ? 'cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            <CloudArrowUpIcon
              className={cn(
                'h-12 w-12 mb-3',
                error ? 'text-red-500' : 'text-gray-400'
              )}
            />
            <p className="text-body-lg font-medium mb-2">
              {isDragOver ? 'Drop file here' : 'Upload your resume'}
            </p>
            <p className="text-caption mb-2">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-caption text-muted-foreground">
              Supports: {accept} • Max size: {maxSize}MB
            </p>
          </label>
          <input
            id="file-upload"
            type="file"
            className="sr-only"
            accept={accept}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export { FileUpload };