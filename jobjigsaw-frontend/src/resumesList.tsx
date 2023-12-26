// import {Job, getJobs} from "@/app/lib/actions/jobs"
import {useEffect, useState} from "react"
import {ResumeResponse} from "./data/mainResume"
import {getResumes} from "./data/resumes"
import {ResumesCard} from "./resumeCard"

export default function ResumesList() {

    const [resumes, setResumes] = useState<ResumeResponse[]>([])

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const resumes = await getResumes()
                setResumes(resumes)
            } catch (error) {
                console.error("Error fetching jobs:", error)
            }
        }

        fetchJobs()
    }, [])
    console.log(resumes)

    return (

        <div className="mt-5 mh-8">
            {resumes.map((resume: ResumeResponse, i: number) => (
                <ResumesCard key={i} resume={resume} i={i} />
            ))}
        </div>
    )
}