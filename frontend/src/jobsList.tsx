// import {Job, getJobs} from "@/app/lib/actions/jobs"
import {useEffect, useState} from "react"
import {JobsCard} from "./jobsCard"
import {Job, getJobs} from "./data/jobs"

export default function JobsList() {

    const [jobs, setJobs] = useState<Job[]>([])

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobs = await getJobs();
                setJobs(jobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, []);
    console.log(jobs)
    if (jobs.length === 0) return (
        <div className="mt-5 mh-8">
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                <div className="space-y-2 mt-2">
                    <div className="text-lg"><strong>No Jobs Found</strong></div>
                    <div className="text-sm">
                        <strong>Try adding a job by tapping <span className="font-mono font-semibold"> Add New Job </span> above</strong>
                    </div>
                </div>
            </div>
        </div>
    )
    return (

        <div className="mt-5 mh-8">
            {jobs.map((job: Job, i: number) => (
                <JobsCard key={i} job={job} i={i} />
            ))}
        </div>
    )
}