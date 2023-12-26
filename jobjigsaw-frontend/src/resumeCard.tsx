
import {useState} from "react"
import clsx from "clsx"
import {DocumentIcon} from "@heroicons/react/20/solid"
import {CopyButton, DeleteJobButton} from "./buttons"
import {Resume, ResumeResponse} from "./data/mainResume"
import {deleteResumeById, printResume} from "./data/resumes"


export function ResumesCard({resume}: {resume: ResumeResponse, i: number}) {
    const [isExpanded, setExpanded] = useState(false)
    const [isPending, setPending] = useState(false)
    async function handleJobDeletion() {
        setPending(true)
        await deleteResumeById(`${resume.id}`)
        setPending(false)
    }
    const [isPrinting, setIsPrinting] = useState<boolean>(false)

    async function printPdf() {
        const resumeData = JSON.parse(resume.updated_resume) as Resume
        setIsPrinting(true)
        const resumeName = `resume-${resumeData.contactDetails.name}.pdf`
        const printedResume = await printResume({resumeJson: resumeData, resumeName})
        // Download the file
        const url = window.URL.createObjectURL(new Blob([printedResume]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', resumeName)
        document.body.appendChild(link)
        link.click()
        setIsPrinting(false)

    }
    return (
        <div key={resume.id} className=" dark:border-none border border-gray-800 dark:bg-gray-800 rounded-lg p-4 my-4 space-y-4">
            <div className="space-y-2 mt-2">
                <div className="text-lg"><DocumentIcon className="inline-block h-5 w-5 ms-1 me-1" /><strong>Resume: {resume.id}</strong></div>

                <div className={clsx("text-sm", {"hidden": !isExpanded})}>
                    <CopyButton text={resume.cover_letter} />
                    <strong>Cover Letter: </strong>{resume.cover_letter}
                </div>
                <div >

                    <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 rounded-md" onClick={printPdf}>
                        {isPrinting ? 'Printing Resume' : 'Print Resume'}
                    </button>
                </div>
                <div className="flex justify-between">
                    <button className="dark:text-slate-500 dark:hover:text-slate-300 active:text-slate-100 px-2 py-1 rounded-md" onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'Hide Cover Letter' : 'Show Cover Letter'}</button>
                    <div className="flex flex-row space-x-2" >
                        <DeleteJobButton pending={isPending} onClick={handleJobDeletion} />
                    </div>
                </div>
            </div>
        </div>
    )
}