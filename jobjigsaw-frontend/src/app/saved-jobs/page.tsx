'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, DataTable, Modal, ModalHeader, ModalFooter, useToast } from '@/components/ui';
import { JobCard, Job } from '@/components/JobCard';
import { Column } from '@/components/ui/DataTable';
import { PlusIcon, TableCellsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { getJobs, deleteJob } from '@/data/jobs';

type ViewMode = 'grid' | 'table';

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await getJobs();
      setJobs(jobsData);
    } catch (error) {
      toast({
        type: 'error',
        title: 'Failed to load jobs',
        description: 'Could not fetch your saved jobs'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewJob = (job: Job) => {
    // Navigate to job details or open in modal
    console.log('View job:', job);
  };

  const handleEditJob = (job: Job) => {
    // Navigate to edit job page
    console.log('Edit job:', job);
  };

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!jobToDelete?.id) return;

    try {
      setDeleting(true);
      await deleteJob(String(jobToDelete.id));
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      toast({
        type: 'success',
        title: 'Job deleted',
        description: 'The job has been removed from your saved jobs'
      });
    } catch (error) {
      toast({
        type: 'error',
        title: 'Delete failed',
        description: 'Could not delete the job'
      });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

  const handleGenerateResume = (job: Job) => {
    // Navigate to resume generation
    console.log('Generate resume for job:', job);
  };

  // Table columns configuration
  const columns: Column<Job>[] = [
    {
      key: 'companyName',
      header: 'Company',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.jobTitle}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
    },
    {
      key: 'jobStatus',
      header: 'Status',
      sortable: true,
      render: (value) => {
        const getStatusColor = (status?: string) => {
          switch (status) {
            case 'active': return 'success';
            case 'applied': return 'info';
            case 'interviewing': return 'warning';
            case 'rejected': return 'error';
            case 'closed': return 'secondary';
            default: return 'default';
          }
        };
        
        return value ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(value)} text-${getStatusColor(value)}-foreground`}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        ) : null;
      },
    },
    {
      key: 'jobFitScore',
      header: 'Fit Score',
      sortable: true,
      render: (value) => value ? `${value}%` : '-',
    },
    {
      key: 'dateCreated',
      header: 'Date Added',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];

  return (
    <div className="container-xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 font-bold">Saved Jobs</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage your job applications and track your progress
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <TableCellsIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Add Job Button */}
          <Button asChild>
            <Link href="/">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your saved jobs...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Squares2X2Icon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-heading-3 font-semibold mb-2">No saved jobs yet</h3>
          <p className="text-body text-muted-foreground mb-6 max-w-md mx-auto">
            Start by analyzing a job description to save it to your library and track your applications.
          </p>
          <Button asChild>
            <Link href="/">
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Your First Job
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-auto-fit gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onView={handleViewJob}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                  onGenerateResume={handleGenerateResume}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={jobs}
              columns={columns}
              searchPlaceholder="Search jobs by company or title..."
              onRowClick={handleViewJob}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Job"
        description="Are you sure you want to delete this job? This action cannot be undone."
      >
        <div className="space-y-4">
          {jobToDelete && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{jobToDelete.jobTitle}</p>
              <p className="text-sm text-muted-foreground">{jobToDelete.companyName}</p>
            </div>
          )}
          
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              loading={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Job'}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
