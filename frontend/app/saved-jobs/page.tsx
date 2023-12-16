
import {Suspense} from "react"
import JobLoadingSkeleton from "../ui/JobLoadingSkeleton"
import JobsList from "../ui/jobsList"

export default async function Page() {
    return (
        <>
            <h1 className="text-4xl text-center">Saved Jobs</h1>
            <Suspense fallback={<JobLoadingSkeleton />}>
                <JobsList />
            </Suspense >
        </>

    )
}