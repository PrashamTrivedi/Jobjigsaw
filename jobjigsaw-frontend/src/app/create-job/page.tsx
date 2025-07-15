'use client'

import { useState, useEffect } from "react";
// import { addJob } from "@/data/jobs"; // Adjust path as needed
// import { analyzeJob, getAnalyzedJob } from "@/data/jobInferrence"; // Adjust path as needed
// import { Job } from "@/data/jobs"; // Adjust path as needed
// import './createJob.css'; // Tailwind CSS should handle this
// import { useNavigate } from "next/navigation"; // Use Next.js navigation

// Placeholder types and functions for now
type Job = {
    id: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
    jobUrl: string | null;
    jobLocation: string | null;
    jobType: string | null;
    salary: string | null;
    postedDate: string | null;
    applicationDeadline: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    responsibilities: string | null;
    requirements: string | null;
    benefits: string | null;
    aboutCompany: string | null;
    howToApply: string | null;
    jobFitScore: number | null;
    jobFitBreakdown: string | null;
    inferredData: string | null;
};

async function addJob(job: Job): Promise<any> {
    const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(job),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add job');
    }
    return response.json();
}

async function analyzeJob(input: string): Promise<any> {
    const response = await fetch('/api/job/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobUrl: input }), // Assuming input can be a URL or description
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze job');
    }
    return response.json();
}

export default function CreateJobPage() {
    // const navigate = useNavigate(); // Uncomment when ready to use Next.js navigation
    const [jobUrl, setJobUrl] = useState("");
    const [jobDescriptionInput, setJobDescriptionInput] = useState("");
    const [analyzedJobData, setAnalyzedJobData] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [job, setJob] = useState<Job>({
        id: "",
        jobTitle: "",
        company: "",
        jobDescription: "",
        jobUrl: null,
        jobLocation: null,
        jobType: null,
        salary: null,
        postedDate: null,
        applicationDeadline: null,
        contactEmail: null,
        contactPhone: null,
        responsibilities: null,
        requirements: null,
        benefits: null,
        aboutCompany: null,
        howToApply: null,
        jobFitScore: null,
        jobFitBreakdown: null,
        inferredData: null,
    });

    useEffect(() => {
        if (analyzedJobData) {
            const inferredJob = analyzedJobData.inferredJob?.response || {};
            const compatibility = analyzedJobData.compatibility?.response || {};

            setJob({
                ...job,
                jobTitle: inferredJob.jobTitle || "",
                company: inferredJob.company || "",
                jobDescription: inferredJob.jobDescription || jobDescriptionInput,
                jobUrl: jobUrl || null,
                jobLocation: inferredJob.jobLocation || null,
                jobType: inferredJob.jobType || null,
                salary: inferredJob.salary || null,
                postedDate: inferredJob.postedDate || null,
                applicationDeadline: inferredJob.applicationDeadline || null,
                contactEmail: inferredJob.contactEmail || null,
                contactPhone: inferredJob.contactPhone || null,
                responsibilities: inferredJob.responsibilities || null,
                requirements: inferredJob.requirements || null,
                benefits: inferredJob.benefits || null,
                aboutCompany: inferredJob.aboutCompany || null,
                howToApply: inferredJob.howToApply || null,
                jobFitScore: compatibility.score || null,
                jobFitBreakdown: compatibility.breakdown ? JSON.stringify(compatibility.breakdown) : null,
                inferredData: JSON.stringify(analyzedJobData),
            });
        }
    }, [analyzedJobData]);

    async function handleAnalyzeJob() {
        setIsAnalyzing(true);
        try {
            const data = await analyzeJob(jobUrl || jobDescriptionInput);
            setAnalyzedJobData(data);
        } catch (error) {
            console.error("Error analyzing job:", error);
            alert("Failed to analyze job. Please check the URL or description.");
        } finally {
            setIsAnalyzing(false);
        }
    }

    async function handleAddJob() {
        setIsAdding(true);
        try {
            await addJob(job);
            // Redirect is handled by the server action now
        } catch (error) {
            console.error("Error adding job:", error);
            alert("Failed to add job.");
        } finally {
            setIsAdding(false);
        }
    }

    const handleGenerateResume = () => {
        if (analyzedJobData) {
            // navigate('/saved-resumes/resume', { state: { jobCompatibilityData: analyzedJobData.compatibility?.response, jobDescription: job.jobDescription } }); // Uncomment when ready to use Next.js navigation
            console.log("Generate Resume clicked");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-heading-1 font-bold text-foreground mb-3">
                    Analyze and Add Job
                </h1>
                <p className="text-body-lg text-muted-foreground">
                    Enter a job URL or paste the job description to analyze and save it to your library.
                </p>
            </div>
            
            <div className="space-y-6 p-6 bg-background border border-border rounded-lg shadow-sm">
                <div>
                    <label htmlFor="jobUrl"
                        className="block text-body-sm font-medium text-foreground">Job URL</label>
                    <input type="text"
                        id="jobUrl" name="jobUrl"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="jobDescriptionInput"
                        className="block text-body-sm font-medium text-foreground">Or Job Description (Paste here)</label>
                    <textarea id="jobDescriptionInput"
                        rows={10}
                        name="jobDescriptionInput"
                        value={jobDescriptionInput}
                        onChange={(e) => setJobDescriptionInput(e.target.value)}
                        className="inputBox" />
                </div>

                <button onClick={handleAnalyzeJob}
                    disabled={isAnalyzing || (!jobUrl && !jobDescriptionInput)}
                    className="w-full inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-body font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAnalyzing ? 'Analyzing Job...' : 'Analyze Job'}
                </button>

                {analyzedJobData && (
                    <div className="mt-6 p-6 border border-border rounded-lg bg-secondary/50">
                        <h2 className="text-heading-3 font-semibold mb-4 text-foreground">Analyzed Job Details:</h2>
                        <div className="space-y-2 text-body">
                            <p><span className="font-medium">Job Title:</span> {job.jobTitle}</p>
                            <p><span className="font-medium">Company:</span> {job.company}</p>
                            <p><span className="font-medium">Location:</span> {job.jobLocation}</p>
                            <p><span className="font-medium">Job Fit Score:</span> {job.jobFitScore}</p>
                            <p><span className="font-medium">Job Description:</span> {job.jobDescription?.substring(0, 200)}...</p>
                        </div>
                        {/* Display other relevant inferred data */}
                    </div>
                )}

                {analyzedJobData && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button onClick={handleAddJob}
                            disabled={isAdding}
                            className="flex-1 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-body font-medium rounded-md text-white bg-success hover:bg-success/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-success disabled:opacity-50 disabled:cursor-not-allowed">
                            {isAdding ? 'Adding Job...' : 'Save Analyzed Job'}
                        </button>
                        <button onClick={handleGenerateResume}
                            className="flex-1 inline-flex justify-center py-3 px-6 border border-info text-info hover:bg-info/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-info shadow-sm text-body font-medium rounded-md transition-colors">
                            Generate Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
