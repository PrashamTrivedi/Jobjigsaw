import {Job, getJobs} from "@/app/lib/actions/jobs"
import {JobsCard} from "./jobsCard"

export default async function JobsList() {
    const jobs = await getJobs()
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