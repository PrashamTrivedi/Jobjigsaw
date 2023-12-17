
import {Suspense} from "react"
import JobLoadingSkeleton from "../ui/JobLoadingSkeleton"
import JobsList from "../ui/jobsList"
import {Metadata} from "next"
import Link from "next/link"
import {PlusIcon} from "@heroicons/react/20/solid"

export const metadata: Metadata = {
    title: 'Jobs',
}
export default async function Page() {
    return (
        <>
            <div className="flex items-center w-full justify-center">
                <h1 className="text-4xl text-center mr-4">Saved Jobs</h1>
                <Link href='/create-job'
                    className="mt-3 text-center text-indigo-500 px-4 py-2 rounded" >
                    Add New Job
                </Link>
            </div>
            <Suspense fallback={<JobLoadingSkeleton />}>
                <JobsList />
            </Suspense >
        </>

    )
}