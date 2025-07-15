'use client'

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, Button, FileUpload, LoadingSpinner, useToast } from "@/components/ui";
import ResumeDisplay from "@/components/ResumeDisplay";
import { Resume, Skills, WorkExperience, Project } from "@/types/resume";

interface ResumeUploadResponse {
  resume: Resume;
  message: string;
}

async function getMainResume(): Promise<Resume | null> {
    try {
        const response = await fetch('/api/main-resume/getMainResume');
        if (!response.ok) {
            if (response.status === 404) {
                return null; // No resume exists yet
            }
            throw new Error('Failed to fetch main resume');
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching main resume:', error);
        return null;
    }
}

async function uploadResume(formData: FormData): Promise<ResumeUploadResponse> {
    const response = await fetch('/api/main-resume/uploadResume', {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload resume');
    }
    return response.json();
}

export default function MainResumePage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [mainResume, setMainResume] = useState<Resume | null>(null);
    const { toast } = useToast();

    const defaultResume: Resume = {
        basics: {
            name: "",
            label: "",
            email: "",
            phone: "",
            url: "",
            summary: "",
            location: {
                address: "",
                postalCode: "",
                city: "",
                countryCode: "",
                region: "",
            },
            profiles: [],
        },
        workExperience: [],
        education: [],
        awards: [],
        skills: [],
        languages: [],
        interests: [],
        references: [],
        projects: [],
        certifications: [],
    };

    useEffect(() => {
        const loadResume = async () => {
            setIsLoading(true);
            try {
                const resume = await getMainResume();
                setMainResume(resume);
            } catch (error) {
                console.error('Error loading resume:', error);
                toast({
                    type: 'error',
                    title: 'Failed to load resume',
                    description: 'Could not fetch your resume data'
                });
            } finally {
                setIsLoading(false);
            }
        };
        loadResume();
    }, [toast]);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const handleUploadResume = async () => {
        if (!selectedFile) {
            toast({
                type: 'warning',
                title: 'No file selected',
                description: 'Please select a resume file to upload'
            });
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            const response = await uploadResume(formData);
            setMainResume(response.resume);
            setSelectedFile(null);
            
            toast({
                type: 'success',
                title: 'Resume uploaded successfully',
                description: response.message || 'Your resume has been parsed and saved'
            });
        } catch (error) {
            console.error("Error uploading resume:", error);
            toast({
                type: 'error',
                title: 'Upload failed',
                description: error instanceof Error ? error.message : 'Failed to upload or parse resume'
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handlePrintResume = () => {
        toast({
            type: 'info',
            title: 'PDF Export',
            description: 'PDF export feature coming soon!'
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="mx-auto px-6 py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-heading-1 mb-4">Resume Management</h1>
                <p className="text-body text-muted-foreground">
                    Upload and manage your main resume for job applications
                </p>
            </div>

            {/* Upload Section */}
            <Card elevated>
                <CardHeader>
                    <CardTitle className="text-heading-2">Upload Resume</CardTitle>
                    <p className="text-body text-muted-foreground">
                        Upload your resume in PDF or JSON format. Our AI will parse and structure your information.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FileUpload
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                        onRemoveFile={handleRemoveFile}
                        accept=".pdf,.json"
                        maxSize={10}
                        disabled={isUploading}
                    />
                    
                    {selectedFile && (
                        <Button
                            onClick={handleUploadResume}
                            loading={isUploading}
                            disabled={!selectedFile}
                            className="w-full"
                        >
                            {isUploading ? 'Processing...' : 'Upload & Parse Resume'}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Resume Display Section */}
            {mainResume ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-heading-1">Your Resume</h2>
                        <Button
                            variant="outline"
                            onClick={handlePrintResume}
                        >
                            Export PDF
                        </Button>
                    </div>
                    <ResumeDisplay resume={mainResume} />
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <h3 className="text-heading-2 mb-2">No Resume Found</h3>
                            <p className="text-body text-muted-foreground mb-6">
                                Upload your resume to get started with job matching and customization.
                            </p>
                            <div className="max-w-md mx-auto">
                                <FileUpload
                                    onFileSelect={handleFileSelect}
                                    selectedFile={selectedFile}
                                    onRemoveFile={handleRemoveFile}
                                    accept=".pdf,.json"
                                    maxSize={10}
                                    disabled={isUploading}
                                />
                                {selectedFile && (
                                    <Button
                                        onClick={handleUploadResume}
                                        loading={isUploading}
                                        className="w-full mt-4"
                                    >
                                        {isUploading ? 'Processing...' : 'Upload & Parse Resume'}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
