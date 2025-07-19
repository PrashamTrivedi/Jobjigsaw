'use client'

import {useState, useEffect, useCallback} from 'react'
import Link from 'next/link'
import {Button, DataTable, Modal, ModalFooter, useToast} from '@/components/ui'
import {JobCard, Job as JobCardJob} from '@/components/JobCard'
import {Column} from '@/components/ui/DataTable'
import {PlusIcon, TableCellsIcon, Squares2X2Icon} from '@heroicons/react/24/outline'
import {getJobs, deleteJob, Job} from '@/data/jobs'

type ViewMode = 'grid' | 'table'

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [deleting, setDeleting] = useState(false)
  const {toast} = useToast()

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true)
      const jobsData = await getJobs()
      setJobs(jobsData)
    } catch (error: unknown) {
      toast({
        type: 'error',
        title: 'Failed to load jobs',
        description: 'Could not fetch your saved jobs'
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  const handleViewJobCardJob = (jobCardJob: JobCardJob) => {
    // Convert JobCard Job back to data Job for the handler
    const job = jobs.find(j => j.id === jobCardJob.id);
    if (job) {
      handleViewJob(job);
    }
  }

  const handleEditJobCardJob = (jobCardJob: JobCardJob) => {
    const job = jobs.find(j => j.id === jobCardJob.id);
    if (job) {
      handleEditJob(job);
    }
  }

  const handleDeleteJobCardJob = (jobCardJob: JobCardJob) => {
    const job = jobs.find(j => j.id === jobCardJob.id);
    if (job) {
      handleDeleteJob(job);
    }
  }

  const handleGenerateResumeJobCardJob = (jobCardJob: JobCardJob) => {
    const job = jobs.find(j => j.id === jobCardJob.id);
    if (job) {
      handleGenerateResume(job);
    }
  }

  const handleRowClick = (row: Record<string, unknown>) => {
    const job = jobs.find(j => j.id === row.id);
    if (job) {
      handleViewJob(job);
    }
  }

  const handleViewJob = (job: Job) => {
    // Navigate to job details or open in modal
    console.log('View job:', job)
  }

  const handleEditJob = (job: Job) => {
    // Navigate to edit job page
    console.log('Edit job:', job)
  }

  const handleDeleteJob = (job: Job) => {
    setJobToDelete(job)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!jobToDelete?.id) return

    try {
      setDeleting(true)
      await deleteJob(String(jobToDelete.id))
      setJobs(jobs.filter(job => job.id !== jobToDelete.id))
      toast({
        type: 'success',
        title: 'Job deleted',
        description: 'The job has been removed from your saved jobs'
      })
    } catch (error: unknown) {
      toast({
        type: 'error',
        title: 'Delete failed',
        description: 'Could not delete the job'
      })
      console.error(error)
    } finally {
      setDeleting(false)
      setDeleteModalOpen(false)
      setJobToDelete(null)
    }
  }

  const handleGenerateResume = (job: Job) => {
    // Navigate to resume generation
    console.log('Generate resume for job:', job)
  }

  // Table columns configuration
  const columns: Column<Job>[] = [
    {
      key: 'companyName',
      header: 'Company',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{String(value)}</div>
          <div className="text-sm text-muted-foreground">{row.post}</div>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
    },
    {
      key: 'type',
      header: 'Status',
      sortable: true,
      render: (value) => {
        const stringValue = String(value);
        const getStatusColor = (status?: string) => {
          switch (status) {
            case 'active': return 'success'
            case 'applied': return 'info'
            case 'interviewing': return 'warning'
            case 'rejected': return 'error'
            case 'closed': return 'secondary'
            default: return 'default'
          }
        }

        return stringValue ? (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(stringValue)} text-${getStatusColor(stringValue)}-foreground`}>
            {stringValue.charAt(0).toUpperCase() + stringValue.slice(1)}
          </span>
        ) : null
      },
    },
    {
      key: 'date',
      header: 'Date Added',
      sortable: true,
      render: (value) => value ? new Date(String(value)).toLocaleDateString() : '-',
    },
  ]

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
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'ghost'}
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
                  job={{
                    ...job,
                    jobTitle: job.post,
                    jobUrl: job.url,
                  }}
                  onView={handleViewJobCardJob}
                  onEdit={handleEditJobCardJob}
                  onDelete={handleDeleteJobCardJob}
                  onGenerateResume={handleGenerateResumeJobCardJob}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={jobs as unknown as Record<string, unknown>[]}
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              searchPlaceholder="Search jobs by company or title..."
              onRowClick={handleRowClick}
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
              <p className="font-medium">{jobToDelete.post}</p>
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
  )
}
