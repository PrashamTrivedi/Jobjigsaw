import {Link} from "react-router-dom"
import MainContent from "./mainContent"
import {Suspense} from "react"
import JobLoadingSkeleton from "./JobLoadingSkeleton"
import JobsList from "./jobsList"

export default function SavedJobs() {

    return (
        <MainContent>
            <div className="flex items-center w-full justify-center">
                <h1 className="text-4xl text-center mr-4">Saved Jobs</h1>
                <Link to='/create-job'
                    className="mt-3 text-center hover:border-b-4 hover:border-indigo-500 text-indigo-500 px-4 py-2 rounded" >
                    Add New Job
                </Link>
            </div>
            <Suspense fallback={<JobLoadingSkeleton />}>
                <JobsList />
            </Suspense >
        </MainContent>
    )
}