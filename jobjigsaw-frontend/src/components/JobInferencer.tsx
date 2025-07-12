'use client'

import { useState } from 'react'
import { InferJobButton, InferJobMatchButton } from "./buttons"
import InferredJob from "./inferredJob"

async function inferJob(description: string) {
  const response = await fetch('/api/job/infer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to infer job');
  }
  return response.json();
}

async function inferJobMatch(description: string) {
  const response = await fetch('/api/job/infer-match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to infer job match');
  }
  return response.json();
}

export default function JobInferencer() {
  const [viewName, setViewName] = useState('form')

  const [inferPending, toggleInferPending] = useState(false)
  const [inferMatchPending, toggleInferMatchPending] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [inferredJob, setInferredJob] = useState<any>({})
  const [inferredJobMatch, setInferredJobMatch] = useState<any>({})

  async function handleInferJob() {
    try {
      toggleInferPending(true)
      const data = await inferJob(jobDescription)
      setInferredJob(data)
      toggleInferPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toggleInferPending(false)
    }
  }

  async function handleInferJobMatch() {
    try {
      toggleInferMatchPending(true)
      const job = await inferJobMatch(jobDescription)
      setInferredJobMatch(job)
      toggleInferMatchPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toggleInferMatchPending(false)
    }
  }

  if (viewName === 'form') {
    return (
      <div className="max-w-4xl mx-auto bg-background">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">Job Analysis Tool</h1>
          <p className="text-muted-foreground mb-4">
            Paste a job description below to analyze requirements and match against your resume.
          </p>
          
          <textarea
            className="w-full p-4 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={12}
            placeholder="Paste the job description here..."
            id="jobDescription"
            name="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={inferPending || inferMatchPending}
          />

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <InferJobButton pending={inferPending} onClick={handleInferJob} />
            <InferJobMatchButton pending={inferMatchPending} onClick={handleInferJobMatch} />
          </div>
        </div>
      </div>
    )
  } else if (viewName === 'inferrence') {
    return (
      <InferredJob
        jobDescription={jobDescription}
        job={inferredJob}
        match={inferredJobMatch} />
    )
  }
}
