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
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
            <div className="text-center">
                <h1 className="text-heading-1 font-bold text-foreground mb-3">
                    Print Resume
                </h1>
                <p className="text-body-lg text-muted-foreground">
                    Generate a PDF version of your resume by providing the resume name and JSON data.
                </p>
            </div>
            
            <div className="space-y-6 p-6 bg-background border border-border rounded-lg shadow-sm">
                <div>
                    <label htmlFor="name"
                        className="block text-body-sm font-medium text-foreground mb-2">Resume Name</label>
                    <input 
                        id="name" 
                        className="inputBox" 
                        type="text" 
                        value={resumeName} 
                        onChange={(e) => setResumeName(e.target.value)} 
                        placeholder="Enter resume name (e.g., John Doe Resume)"
                    />
                </div>
                
                <div>
                    <label htmlFor="resumeJson"
                        className="block text-body-sm font-medium text-foreground mb-2">Resume JSON</label>
                    <textarea
                        rows={20}
                        id="resumeJson"
                        className="inputBox"
                        value={resumeJson} 
                        onChange={(e) => setResumeJson(e.target.value)}
                        placeholder="Paste your resume JSON data here..."
                    />
                </div>
                
                <button 
                    onClick={processPrintResume}
                    disabled={!resumeName || !resumeJson}
                    className="w-full py-3 px-6 border border-transparent rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed text-body font-medium"
                >
                    Print Resume
                </button>
            </div>
        </div>
    )
}
