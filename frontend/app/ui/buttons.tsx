'use client'
import {useFormStatus} from "react-dom"
import {inferJob, inferJobMatch} from "@/app/lib/actions/jobInferrence"
import {DocumentDuplicateIcon, SparklesIcon, TrashIcon} from "@heroicons/react/20/solid"
import clsx from "clsx"
import {useState} from "react"

export interface ButtonTextProps {
    defaultText?: string
}

export function InferJobButton({defaultText}: ButtonTextProps) {
    const {pending} = useFormStatus()
    const buttonText = !defaultText || defaultText === '' ? 'Infer Job' : defaultText
    return (
        <button className="bg-blue-500 text-white active:bg-blue-900 px-4 py-2 rounded flex items-center" formAction={inferJob}>
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Loading...' : buttonText}  </button>
    )
}


export function InferJobMatchButton({defaultText}: ButtonTextProps) {
    const {pending} = useFormStatus()
    const buttonText = !defaultText || defaultText === '' ? 'Infer Job Match' : defaultText
    return (
        <button className="bg-green-500 text-white active:bg-green-900 px-4 py-2 rounded flex items-center" formAction={inferJobMatch}>
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Loading...' : buttonText}</button>
    )
}

export function DeleteJobButton({defaultText}: ButtonTextProps) {
    const {pending} = useFormStatus()
    return (
        <button className="text-center">
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
