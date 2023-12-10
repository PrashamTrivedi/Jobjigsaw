'use client'
import {useFormStatus} from "react-dom"
import {inferJob, inferJobMatch} from "../lib/actions/jobInferrence"
import {SparklesIcon} from "@heroicons/react/20/solid"

export interface InferJobButtonProps {
    defaultText?: string
}

export function InferJobButton({defaultText}: InferJobButtonProps) {
    const {pending} = useFormStatus()
    const buttonText = !defaultText || defaultText === '' ? 'Infer Job' : defaultText
    return (
        <button className="bg-blue-500 text-white active:bg-blue-900 px-4 py-2 rounded flex items-center" formAction={inferJob}>
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Loading...' : buttonText}  </button>
    )
}


export function InferJobMatchButton({defaultText}: InferJobButtonProps) {
    const {pending} = useFormStatus()
    const buttonText = !defaultText || defaultText === '' ? 'Infer Job Match' : defaultText
    return (
        <button className="bg-green-500 text-white active:bg-green-900 px-4 py-2 rounded flex items-center" formAction={inferJobMatch}>
            <SparklesIcon className="ml-auto h-5 w-5 mx-2" />{pending ? 'Loading...' : buttonText}</button>
    )
}