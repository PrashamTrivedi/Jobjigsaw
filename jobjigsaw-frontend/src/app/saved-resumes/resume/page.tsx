'use client'

import { Suspense, useEffect, useRef, useState } from "react"
import ResumeComponent from "@/components/ResumeComponent"
import CopyButton from "@/components/CopyButton"
import { Resume } from "@/types/resume"
import { useSearchParams } from 'next/navigation'

async function getResumeById(id: string): Promise<any> {
    const response = await fetch(`/api/resume/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch resume by ID');
    }
    return response.json();
}

async function getJob(id: string): Promise<any> {
    const response = await fetch(`/api/job/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch job');
    }
    return response.json();
}

async function generateResume(jobCompatibilityData: any, generateCoverLetter: boolean): Promise<any> {
    const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobCompatibilityData, generateCoverLetter }),
    });
    if (!response.ok) {
        throw new Error('Failed to generate resume');
    }
    return response.json();
}

async function printResume(data: { resumeJson: any, resumeName: string }): Promise<any> {
    const response = await fetch('/api/resume/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to print resume');
    }
    return response.blob();
}

async function createResume(body: { jobId: string, updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string }): Promise<any> {
    const response = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error('Failed to create resume');
    }
    return response.json();
}

export default function ResumesPage() {
    const searchParams = useSearchParams()
    const jobId = searchParams.get("jobId")
    const resumeId = searchParams.get("resumeId")

    if ((!jobId && !resumeId) || (jobId === '' && resumeId === '')) {
        return (
            <div className="bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                <div className="space-y-2 mt-2">
                    <div className="text-lg"><strong>No Job ID or resumeID provided</strong></div>
                </div>
            </div>
        )
    } else {
        return (
            <Suspense fallback={<div>Loading...</div>}>
                <ResumeWithCoverLetterComponent jobId={jobId} resumeId={resumeId} />
            </Suspense>
        )
    }
}

function ResumeWithCoverLetterComponent({ jobId, resumeId }: { jobId: string | null, resumeId: string | null }) {
    const [resume, setResume] = useState<Resume>({
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
    })

    const [coverLetter, setCoverLetter] = useState<string>("")
    const [isPrinting, setIsPrinting] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [companyName, setCompanyName] = useState<string>("")
    const resumeRef = useRef(null)

    useEffect(() => {
        (async () => {
            if (resumeId) {
                console.log("Ignoring JOB ID parameter.")
                const resume = await getResumeById(resumeId)
                setResume(JSON.parse(resume.updated_resume))
                setCoverLetter(resume.cover_letter)
            } else if (jobId) {
                console.log("Parsing from job id means resumeId is not provided.")
                const jobData = await getJob(jobId)
                const compatibilityData = jobData.inferredJobMatch
                setCompanyName(jobData.companyName)
                if (compatibilityData) {
                    const compatibilityJson = JSON.parse(compatibilityData)
                    const jsonData = {
                        title: jobData.post,
                        company: jobData.companyName,
                        techinicalSkills: compatibilityJson.compatibilityMatrix.requiredSkills.techSkills,
                        softSkills: compatibilityJson.compatibilityMatrix.requiredSkills.softSkills,
                    }

                    const inferredResume = await generateResume(jsonData, true)
                    console.log(inferredResume)
                    setResume(inferredResume.resumeDetails.generatedResume)
                    setCoverLetter(inferredResume.resumeDetails.coverLetter)

                }
            }

        })()
    }, [resumeId, jobId])
    async function printPdf() {
        setIsPrinting(true)

        const resumeName = `Resume: ${resume.basics.name} - ${companyName}.pdf`
        const printedResume = await printResume({ resumeJson: resume, resumeName })
        // Download the file
        const url = window.URL.createObjectURL(new Blob([printedResume]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', resumeName)
        document.body.appendChild(link)
        link.click()
        setIsPrinting(false)

    }

    async function addResume() {
        if (jobId) {
            setIsAdding(true)
            const jobData = await getJob(jobId)
            const compatibilityData = jobData.inferredJobMatch ?? "{}"

            const compatibilityJson = JSON.parse(compatibilityData)
            const resumeData = {
                jobId: jobId,
                updatedResume: resume,
                coverLetter: coverLetter,
                technicalSkills: JSON.stringify(compatibilityJson.compatibilityMatrix.requiredSkills.techSkills),
                softSkills: JSON.stringify(compatibilityJson.compatibilityMatrix.requiredSkills.softSkills)
            }
            await createResume(resumeData)
            setIsAdding(false)
        }
    }
    return (
        <>
            <div ref={resumeRef}>

                <ResumeComponent initialResume={resume} />
            </div>
            <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 rounded-md" onClick={printPdf}>
                {isPrinting ? 'Printing Resume' : 'Print Resume'}
            </button>
            {(!resumeId || resumeId === '') && <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 mx-2 rounded-md" onClick={addResume}>
                {isAdding ? 'Adding Resume' : 'Add Resume'}
            </button>}
            <div className="dark:bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                <div className="space-y-2 mt-2">
                    <div className="text-lg"><strong>Cover Letter</strong>
                        <CopyButton text={coverLetter} />
                    </div>

                    <div className="text-sm dark:text-gray-400">This is a generated cover letter based on the job description.</div>
                </div>
                <div className="text-sm dark:text-gray-400">
                    {coverLetter}
                </div>
            </div>
        </>
    )
}
