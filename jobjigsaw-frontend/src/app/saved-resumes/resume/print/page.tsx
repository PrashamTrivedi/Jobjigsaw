'use client'

import {useState} from "react"
// import {printResume} from "@/data/resumes" // Adjust path as needed

// Placeholder function for now
async function printResume(data: { resumeJson: any, resumeName: string }): Promise<any> {
    const response = await fetch('/api/resume/print', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to print resume');
    }
    return response.blob();
}

export default function PrintResumePage() {
    const [resumeName, setResumeName] = useState<string>("")
    const [resumeJson, setResumeJson] = useState<string>("")

    async function processPrintResume() {
        const name = resumeName.endsWith('.pdf') ? resumeName : `${resumeName}.pdf`
        const printedResume = await printResume({resumeJson: JSON.parse(resumeJson), resumeName: name})
        // Download the file
        const url = window.URL.createObjectURL(new Blob([printedResume]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', name)
        document.body.appendChild(link)
        link.click()
    }
    return (
        <>
            <div className="space-y-4 p-4 max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200">Resume Name</label>
                <input id="name" className="inputBox" type="text" value={resumeName} onChange={(e) => setResumeName(e.target.value)} />
                <label htmlFor="resumeJson"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200">Resume JSON</label>
                <textarea
                    rows={80}
                    id="resumeJson"
                    className="inputBox"
                    value={resumeJson} onChange={(e) => setResumeJson(e.target.value)} />
                <button onClick={processPrintResume}>Print Resume</button>
            </div>
        </>
    )
}
