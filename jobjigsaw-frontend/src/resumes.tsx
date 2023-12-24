import {Suspense, useEffect, useState} from "react"
import MainContent from "./mainContent"
import ResumeComponent from "./resume"
import {useParams, useSearchParams} from "react-router-dom"
import {Resume} from "./data/mainResume"
import {generateResume, getResumeById} from "./data/resumes"
import {getJob} from "./data/jobs"
import {CopyButton} from "./buttons"

export default function Resumes() {
    const [searchParams, setSearchParams] = useSearchParams()
    const jobId = searchParams.get("jobId")
    const resumeId = searchParams.get("resumeId")





    return (
        <MainContent>
            {
                ((!jobId && !resumeId) || (jobId === '' && resumeId === '')) ?
                    <div className="bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                        <div className="space-y-2 mt-2">
                            <div className="text-lg"><strong>No Job ID or resumeID provided</strong></div>
                        </div>
                    </div>
                    :

                    <Suspense fallback={<div>Loading...</div>}>
                        <ResumeWithCoverLetterComponent jobId={jobId} resumeId={resumeId} />
                    </Suspense>}
        </MainContent>
    )
}


function ResumeWithCoverLetterComponent({jobId, resumeId}: {jobId: string | null, resumeId: string | null}) {
    const [resume, setResume] = useState<Resume>({
        about: {
            summary: "",
            highlights: []
        },
        certifications: [],
        contactDetails: {
            name: "",
            email: "",
            phone: "",
            website: "",
            github: "",
            linkedin: ""
        },
        education: [],
        projects: [],
        skills: [],
        workExperience: []
    })

    const [coverLetter, setCoverLetter] = useState<string>("")

    useEffect(() => {
        (async () => {
            if (resumeId) {
                console.log("Ignoring JOB ID parameter.")
                const resume = await getResumeById(resumeId)
                setResume(resume)
            }
            else if (jobId) {
                console.log("Parsing from job id means resumeId is not provided.")
                const jobData = await getJob(jobId)
                const compatibilityData = jobData.inferredJobMatch
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
    })
    return (
        <>
            <ResumeComponent resume={resume} />

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