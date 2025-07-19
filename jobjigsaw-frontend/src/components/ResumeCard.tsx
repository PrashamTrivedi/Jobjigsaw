'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { 
  DocumentIcon, 
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  CalendarIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export interface Resume {
  id?: number;
  resumeName: string;
  jobId?: number;
  jobTitle?: string;
  companyName?: string;
  dateCreated?: string;
  dateUpdated?: string;
  resumeContent?: unknown;
}

export interface ResumeCardProps {
  resume: Resume;
  onView?: (resume: Resume) => void;
  onEdit?: (resume: Resume) => void;
  onDelete?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onDuplicate?: (resume: Resume) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onDuplicate,
  showActions = true,
  compact = false,
  className,
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Removed unused function getResumeInitials

  return (
    <Card className={cn(
      'hover-lift transition-all duration-200 hover:shadow-lg',
      compact && 'p-4',
      className
    )}>
      <CardContent className={cn('space-y-4', compact && 'p-0')}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Resume Icon/Thumbnail */}
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DocumentIcon className="w-6 h-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
                {resume.resumeName}
              </h3>
              
              {/* Associated Job */}
              {resume.jobTitle && resume.companyName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BriefcaseIcon className="w-4 h-4" />
                  <span className="truncate">
                    {resume.jobTitle} at {resume.companyName}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          <Badge variant="outline" size="sm">
            Resume
          </Badge>
        </div>

        <div className="space-y-2">
          {resume.dateCreated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>Created {formatDate(String(resume.dateCreated))}</span>
            </div>
          )}
          
          {resume.dateUpdated && resume.dateUpdated !== resume.dateCreated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <PencilIcon className="w-4 h-4" />
              <span>Updated {formatDate(String(resume.dateUpdated))}</span>
            </div>
          )}
        </div>

        {/* Resume Preview/Stats */}
        {!compact && !!resume.resumeContent && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">
              {/* You could add resume stats here like word count, sections, etc. */}
              <div className="flex items-center justify-between">
                <span>Resume ready for download</span>
                <ArrowDownTrayIcon className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(resume)}
                className="flex-1"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
            
            {onDownload && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onDownload(resume)}
                className="flex-1"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                Download
              </Button>
            )}
            
            {onDuplicate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDuplicate(resume)}
              >
                <DocumentDuplicateIcon className="w-4 h-4" />
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(resume)}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(resume)}
                className="text-error hover:text-error-foreground hover:bg-error"
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumeCard;