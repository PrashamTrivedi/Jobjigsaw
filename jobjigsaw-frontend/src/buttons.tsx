
// import {inferJob, inferJobMatch} from ""
import {DocumentDuplicateIcon, PlusIcon, SparklesIcon, TrashIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useState} from "react"
import {Link} from "react-router-dom"
// import {inferJob, inferJobMatch} from "./data/jobInferrence"

export interface ButtonTextProps {
    defaultText?: string
}
export function InferJobButton({defaultText, pending, onClick}: {defaultText?: string, pending: boolean, onClick?: () => void}) {

    const buttonText = !defaultText || defaultText === '' ? 'Infer Job' : defaultText
    return (
        <button onClick={onClick} className="bg-blue-500 text-white active:bg-blue-900 px-4 py-2 rounded flex items-center">
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Inferring Job...' : buttonText}  </button>
    )
}


export function InferJobMatchButton({defaultText, pending, onClick}: {defaultText?: string, pending: boolean, onClick?: () => void}) {

    const buttonText = !defaultText || defaultText === '' ? 'Infer Job Match' : defaultText
    return (
        <button onClick={onClick} className="bg-green-500 text-white active:bg-green-900 px-4 py-2 rounded flex items-center">
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Infering Match...' : buttonText}</button>
    )
}

export function DeleteJobButton({pending, onClick}: {pending: boolean, onClick?: () => void}) {

    return (
        <button onClick={onClick} className="text-center">
            <TrashIcon className={clsx("w-5 h-5 mr-2 text-red-600 hover:text-red-400", {
                "text-red-800": pending,
                "text-red-600": !pending,
            })} />
        </button>
    )
}

export function CopyButton({text}: {text: string}) {
    const [copied, setCopied] = useState(false)
    const copy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1000)
    }
    return (
        <button className="text-center" onClick={copy}>
            <DocumentDuplicateIcon className={
                clsx("w-5 h-5 mr-2 hover:text-white", {
                    "text-gray-400": !copied,
                    "text-green-400": copied,
                })
            } /></button>
    )
}


export function AddJobButton({jobDescription, job, match}:
    {
        jobDescription: string,
        job: any,
        match: any
    }) {
    return (
        <Link to="/create-job?fromInferred"
            state={{jobDescription, job, match}}
            className="mt-3 bg-indigo-500 text-white active:bg-indigo-900 px-4 py-2 rounded flex items-center" >
            <PlusIcon className="ml-auto h-5 w-5 mx-2"></PlusIcon>Add This Job
        </Link>
    )
}