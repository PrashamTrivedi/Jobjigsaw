import {inferJob} from "../lib/actions/jobInferrence"
import {SparklesIcon} from '@heroicons/react/24/solid'
export function InferJobButton({text}: {text: string}) {
    const deleteInvoiceWithId = inferJob.bind(null, text)

    return (
        <form action={deleteInvoiceWithId}>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-100">
                <span className="sr-only">Infer Job</span>
                
                <SparklesIcon className="h-6 w-6" aria-hidden="true" />
            </button>
        </form>
    )
}