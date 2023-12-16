'use client'
import {ClipboardIcon, DocumentDuplicateIcon} from "@heroicons/react/20/solid"
import {ClipboardDocumentCheckIcon} from "@heroicons/react/24/solid"
import clsx from "clsx"
import {useState} from "react"

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
