import { useState, useEffect } from "react";
import { addJob } from "./data/jobs";
import { analyzeJob, getAnalyzedJob } from "./data/jobInferrence";
import { Job } from "./data/jobs";
import './createJob.css';
import { useNavigate } from "react-router-dom";

export default function CreateJob() {
    const navigate = useNavigate();
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
            navigate('/saved-resumes/resume', { state: { jobCompatibilityData: analyzedJobData.compatibility?.response, jobDescription: job.jobDescription } });
        }
    };

    return (
        <>
            <h1 className='text-4xl font-bold text-center'>
                Analyze and Add Job
            </h1>
            <div className="space-y-4 p-4 max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div>
                    <label htmlFor="jobUrl"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Job URL</label>
                    <input type="text"
                        id="jobUrl" name="jobUrl"
                        value={jobUrl}
                        onChange={(e) => setJobUrl(e.target.value)}
                        className="inputBox" />
                </div>
                <div>
                    <label htmlFor="jobDescriptionInput"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Or Job Description (Paste here)</label>
                    <textarea id="jobDescriptionInput"
                        rows={10}
                        name="jobDescriptionInput"
                        value={jobDescriptionInput}
                        onChange={(e) => setJobDescriptionInput(e.target.value)}
                        className="inputBox" />
                </div>

                <button onClick={handleAnalyzeJob}
                    disabled={isAnalyzing || (!jobUrl && !jobDescriptionInput)}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isAnalyzing ? 'Analyzing Job...' : 'Analyze Job'}
                </button>

                {analyzedJobData && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
                        <h2 className="text-xl font-semibold mb-2">Analyzed Job Details:</h2>
                        <p><strong>Job Title:</strong> {job.jobTitle}</p>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.jobLocation}</p>
                        <p><strong>Job Fit Score:</strong> {job.jobFitScore}</p>
                        <p><strong>Job Description:</strong> {job.jobDescription?.substring(0, 200)}...</p>
                        {/* Display other relevant inferred data */}
                    </div>
                )}

                {analyzedJobData && (
                    <div className="flex justify-between mt-4">
                        <button onClick={handleAddJob}
                            disabled={isAdding}
                            className="w-1/2 mr-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            {isAdding ? 'Adding Job...' : 'Save Analyzed Job'}
                        </button>
                        <button onClick={handleGenerateResume}
                            className="w-1/2 ml-2 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Generate Resume
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}