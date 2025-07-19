'use client'

import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentIcon
} from '@heroicons/react/24/outline';

export interface Job {
  id?: number;
  companyName: string;
  jobTitle: string;
  location?: string;
  jobUrl?: string;
  dateCreated?: string;
  dateUpdated?: string;
  jobStatus?: 'active' | 'applied' | 'interviewing' | 'rejected' | 'closed';
  technicalSkills?: string[];
  softSkills?: string[];
  jobFitScore?: number;
  cached?: boolean;
  cacheExpiry?: string;
}

export interface JobCardProps {
  job: Job;
  onView?: (job: Job) => void;
  onEdit?: (job: Job) => void;
  onDelete?: (job: Job) => void;
  onGenerateResume?: (job: Job) => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onView,
  onEdit,
  onDelete,
  onGenerateResume,
  showActions = true,
  compact = false,
  className,
}) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'applied':
        return 'info';
      case 'interviewing':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'closed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getCacheStatus = () => {
    if (!job.cached) return null;
    
    if (job.cacheExpiry) {
      const expiryDate = new Date(job.cacheExpiry);
      const now = new Date();
      const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      
      if (hoursUntilExpiry <= 0) {
        return { variant: 'cache-expired' as const, text: 'Cache expired' };
      } else if (hoursUntilExpiry <= 2) {
        return { variant: 'cache-expiring' as const, text: 'Cache expiring soon' };
      }
    }
    
    return { variant: 'cache-fresh' as const, text: 'Cached' };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFitScoreColor = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const cacheStatus = getCacheStatus();

  return (
    <Card className={cn(
      'hover-lift transition-all duration-200 hover:shadow-lg',
      compact && 'p-4',
      className
    )}>
      <CardContent className={cn('space-y-4', compact && 'p-0')}>
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <BuildingOfficeIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm font-medium text-muted-foreground truncate">
                {job.companyName}
              </span>
            </div>
            <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
              {job.jobTitle}
            </h3>
          </div>
          
          {/* Status and Cache Badges */}
          <div className="flex flex-col gap-1 ml-4">
            {job.jobStatus && (
              <Badge variant={getStatusColor(job.jobStatus)} size="sm">
                {job.jobStatus.charAt(0).toUpperCase() + job.jobStatus.slice(1)}
              </Badge>
            )}
            {cacheStatus && (
              <Badge variant={cacheStatus.variant} size="sm">
                {cacheStatus.text}
              </Badge>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="space-y-2">
          {job.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          )}
          
          {job.dateCreated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarIcon className="w-4 h-4" />
              <span>Added {formatDate(job.dateCreated)}</span>
            </div>
          )}

          {job.jobFitScore !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Fit Score:</span>
              <Badge variant={getFitScoreColor(job.jobFitScore)} size="sm">
                {job.jobFitScore}%
              </Badge>
            </div>
          )}
        </div>

        {/* Skills Preview */}
        {!compact && (job.technicalSkills?.length || job.softSkills?.length) && (
          <div className="space-y-2">
            {job.technicalSkills && job.technicalSkills.length > 0 && (
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Technical Skills
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {job.technicalSkills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {job.technicalSkills.length > 3 && (
                    <Badge variant="secondary" size="sm">
                      +{job.technicalSkills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex items-center gap-2 pt-2 border-t border-border">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(job)}
                className="flex-1"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
            
            {onGenerateResume && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onGenerateResume(job)}
                className="flex-1"
              >
                <DocumentIcon className="w-4 h-4 mr-1" />
                Resume
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(job)}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(job)}
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

export default JobCard;