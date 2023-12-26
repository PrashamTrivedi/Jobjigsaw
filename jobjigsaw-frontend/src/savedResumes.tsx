import {Link} from "react-router-dom"
import MainContent from "./mainContent"
import {Suspense} from "react"
import ResumesList from "./resumesList"
import JobLoadingSkeleton from "./JobLoadingSkeleton"

export default function SavedResumes() {
    return (

        <MainContent>
            <div className="flex items-center w-full justify-center">
                <h1 className="text-4xl text-center mr-4">Saved Resumes</h1>
                <Link to='/'
                    className="mt-3 text-center hover:border-b-4 hover:border-indigo-500 text-indigo-500 px-4 py-2 rounded" >
                    Add New Job (And Resume)
                </Link>
            </div>
            <Suspense fallback={<JobLoadingSkeleton />}>
                <ResumesList />
            </Suspense >
        </MainContent>
    )
}