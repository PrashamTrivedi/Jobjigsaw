
import {useState} from "react"
import clsx from "clsx"
import {BriefcaseIcon, LinkIcon} from "@heroicons/react/20/solid"
import {Job, deleteJob} from "./data/jobs"
import {Link} from "react-router-dom"
import {DeleteJobButton} from "./buttons"


export function JobsCard({job}: {job: Job, i: number}) {
    const [isExpanded, setExpanded] = useState(false)
    const [isPending, setPending] = useState(false)
    async function handleJobDeletion() {
        setPending(true)
        await deleteJob(`${job.id}`)
        setPending(false)
    }

    return (
        <div key={job.id} className=" bg-gray-800 rounded-lg p-4 my-4 space-y-4">
            <div className="space-y-2 mt-2">
                <div className="text-lg"><BriefcaseIcon className="inline-block h-5 w-5 ms-1 me-1"></BriefcaseIcon><strong>{job.companyName}</strong></div>

                <div ><strong>Role: </strong>{job.post}</div>
                <div ><strong>Type: </strong>{job.type}</div>
                <div ><strong>Location: </strong>{job.location}</div>
                <div className={clsx("text-sm", {"hidden": !isExpanded})}>
                    <strong>About The Job: </strong>{job.text}
                </div>
                <div ><Link to={job.url} target="_blank"><LinkIcon className="inline-block h-5 w-5 ms-1 me-1"></LinkIcon> Job URL</Link></div>
                <div className="flex justify-between">
                    <button className="text-slate-500 hover:text-slate-300 active:text-slate-100 px-2 py-1 rounded-md" onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'Show Less' : 'Show More'}</button>
                    <div className="flex flex-row space-x-2" >
                        <DeleteJobButton pending={isPending} onClick={handleJobDeletion} />
                    </div>
                </div>
            </div>
        </div>
    )
}