'use client'

import { useState } from 'react'
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, Badge, useToast } from '@/components/ui'
import InferredJob from "./inferredJob"

interface JobInferenceResponse {
  inferredDescription: any;
  cached?: boolean;
  cacheExpiry?: string;
}

interface JobMatchResponse {
  jobMatch: any;
  cached?: boolean;
  cacheExpiry?: string;
}

async function inferJob(description: string): Promise<JobInferenceResponse> {
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

async function inferJobMatch(description: string): Promise<JobMatchResponse> {
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
  const { toast } = useToast()

  const [inferPending, toggleInferPending] = useState(false)
  const [inferMatchPending, toggleInferMatchPending] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [inferredJob, setInferredJob] = useState<any>({})
  const [inferredJobMatch, setInferredJobMatch] = useState<any>({})
  const [cacheInfo, setCacheInfo] = useState<{
    inference?: { cached: boolean; expiry?: string };
    match?: { cached: boolean; expiry?: string };
  }>({})

  async function handleInferJob() {
    try {
      toggleInferPending(true)
      const data = await inferJob(jobDescription)
      setInferredJob(data.inferredDescription)
      setCacheInfo(prev => ({
        ...prev,
        inference: { cached: data.cached || false, expiry: data.cacheExpiry }
      }))
      
      if (data.cached) {
        toast({
          type: 'info',
          title: 'Using cached data',
          description: 'Job analysis completed using cached results for faster processing'
        })
      } else {
        toast({
          type: 'success',
          title: 'Job analyzed successfully',
          description: 'Data has been cached for future use'
        })
      }
      
      toggleInferPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toast({
        type: 'error',
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Failed to analyze job description'
      })
      toggleInferPending(false)
    }
  }

  async function handleInferJobMatch() {
    try {
      toggleInferMatchPending(true)
      const data = await inferJobMatch(jobDescription)
      setInferredJobMatch(data.jobMatch)
      setCacheInfo(prev => ({
        ...prev,
        match: { cached: data.cached || false, expiry: data.cacheExpiry }
      }))
      
      if (data.cached) {
        toast({
          type: 'info',
          title: 'Using cached data',
          description: 'Resume match completed using cached results'
        })
      } else {
        toast({
          type: 'success',
          title: 'Resume match completed',
          description: 'Match results have been cached for future use'
        })
      }
      
      toggleInferMatchPending(false)
      setViewName('inferrence')
    } catch (error) {
      console.error(error)
      toast({
        type: 'error',
        title: 'Match check failed',
        description: error instanceof Error ? error.message : 'Failed to check resume match'
      })
      toggleInferMatchPending(false)
    }
  }

  const getCacheBadge = (type: 'inference' | 'match') => {
    const cache = cacheInfo[type]
    if (!cache) return null
    
    if (cache.cached) {
      return <Badge variant="cache-fresh">Cached - Fast processing</Badge>
    }
    return null
  }

  if (viewName === 'form') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <Card elevated>
          <CardHeader>
            <CardTitle className="text-heading-1">Job Analysis Tool</CardTitle>
            <p className="text-body text-muted-foreground">
              Paste a job description below to analyze requirements and match against your resume.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="jobDescription" className="block text-body-sm font-medium mb-2">
                Job Description
              </label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                rows={12}
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={inferPending || inferMatchPending}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                loading={inferPending}
                onClick={handleInferJob}
                disabled={!jobDescription.trim() || inferMatchPending}
                className="flex-1 sm:flex-none"
              >
                {inferPending ? 'Analyzing...' : 'Analyze Job'}
              </Button>
              
              <Button
                variant="outline"
                loading={inferMatchPending}
                onClick={handleInferJobMatch}
                disabled={!jobDescription.trim() || inferPending}
                className="flex-1 sm:flex-none"
              >
                {inferMatchPending ? 'Checking Match...' : 'Check Resume Match'}
              </Button>
            </div>

            {(getCacheBadge('inference') || getCacheBadge('match')) && (
              <div className="flex flex-wrap gap-2">
                {getCacheBadge('inference')}
                {getCacheBadge('match')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  } else if (viewName === 'inferrence') {
    return (
      <InferredJob
        jobDescription={jobDescription}
        job={inferredJob}
        match={inferredJobMatch}
        cacheInfo={cacheInfo}
      />
    )
  }
}
