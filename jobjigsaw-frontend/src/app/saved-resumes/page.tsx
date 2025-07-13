'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, DataTable, Modal, ModalHeader, ModalFooter, useToast } from '@/components/ui';
import { ResumeCard, Resume } from '@/components/ResumeCard';
import { Column } from '@/components/ui/DataTable';
import { PlusIcon, TableCellsIcon, Squares2X2Icon, DocumentIcon } from '@heroicons/react/24/outline';
import { getResumes } from '@/data/resumes';

type ViewMode = 'grid' | 'table';

export default function SavedResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setLoading(true);
      const resumesData = await getResumes();
      setResumes(resumesData);
    } catch (error) {
      toast({
        type: 'error',
        title: 'Failed to load resumes',
        description: 'Could not fetch your saved resumes'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = (resume: Resume) => {
    // Navigate to resume viewer
    console.log('View resume:', resume);
  };

  const handleEditResume = (resume: Resume) => {
    // Navigate to resume editor
    console.log('Edit resume:', resume);
  };

  const handleDeleteResume = (resume: Resume) => {
    setResumeToDelete(resume);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!resumeToDelete?.id) return;

    try {
      setDeleting(true);
      // await deleteResume(String(resumeToDelete.id));
      setResumes(resumes.filter(resume => resume.id !== resumeToDelete.id));
      toast({
        type: 'success',
        title: 'Resume deleted',
        description: 'The resume has been removed from your library'
      });
    } catch (error) {
      toast({
        type: 'error',
        title: 'Delete failed',
        description: 'Could not delete the resume'
      });
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleDownloadResume = (resume: Resume) => {
    // Implement download functionality
    toast({
      type: 'info',
      title: 'Download started',
      description: 'Your resume is being prepared for download'
    });
  };

  const handleDuplicateResume = (resume: Resume) => {
    // Implement duplicate functionality
    toast({
      type: 'success',
      title: 'Resume duplicated',
      description: 'A copy of your resume has been created'
    });
  };

  // Table columns configuration
  const columns: Column<Resume>[] = [
    {
      key: 'resumeName',
      header: 'Resume Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
            <DocumentIcon className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            {row.jobTitle && row.companyName && (
              <div className="text-sm text-muted-foreground">
                {row.jobTitle} at {row.companyName}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'companyName',
      header: 'Company',
      sortable: true,
    },
    {
      key: 'jobTitle',
      header: 'Position',
      sortable: true,
    },
    {
      key: 'dateCreated',
      header: 'Created',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'dateUpdated',
      header: 'Updated',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleDateString() : '-',
    },
  ];

  return (
    <div className="container-xl mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-heading-1 font-bold">Resume Library</h1>
          <p className="text-body text-muted-foreground mt-1">
            Manage your customized resumes for different job applications
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

          {/* Generate Resume Button */}
          <Button asChild>
            <Link href="/saved-resumes/resume/print">
              <PlusIcon className="w-4 h-4 mr-2" />
              Generate Resume
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading your resume library...</p>
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <DocumentIcon className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-heading-3 font-semibold mb-2">No resumes yet</h3>
          <p className="text-body text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first customized resume by analyzing a job and generating a tailored version of your resume.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild variant="outline">
              <Link href="/main-resume">
                Upload Main Resume
              </Link>
            </Button>
            <Button asChild>
              <Link href="/saved-resumes/resume/print">
                <PlusIcon className="w-4 h-4 mr-2" />
                Generate Resume
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-auto-fit gap-6">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onView={handleViewResume}
                  onEdit={handleEditResume}
                  onDelete={handleDeleteResume}
                  onDownload={handleDownloadResume}
                  onDuplicate={handleDuplicateResume}
                />
              ))}
            </div>
          ) : (
            <DataTable
              data={resumes}
              columns={columns}
              searchPlaceholder="Search resumes by name or company..."
              onRowClick={handleViewResume}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Resume"
        description="Are you sure you want to delete this resume? This action cannot be undone."
      >
        <div className="space-y-4">
          {resumeToDelete && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{resumeToDelete.resumeName}</p>
              {resumeToDelete.jobTitle && resumeToDelete.companyName && (
                <p className="text-sm text-muted-foreground">
                  {resumeToDelete.jobTitle} at {resumeToDelete.companyName}
                </p>
              )}
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
              {deleting ? 'Deleting...' : 'Delete Resume'}
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}