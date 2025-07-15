'use client'

import {useState} from 'react'
import {Button, Card, CardHeader, CardTitle, CardContent, Textarea, Badge, useToast} from '@/components/ui'
import InferredJob from "./inferredJob"

interface JobInferenceResponse {
  inferredDescription: any
  cached?: boolean
  cacheExpiry?: string
}

interface JobMatchResponse {
  jobMatch: any
  cached?: boolean
  cacheExpiry?: string
}

async function inferJob(description: string): Promise<JobInferenceResponse> {
  const response = await fetch('/api/job/infer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({description}),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to infer job')
  }
  return response.json()
}

async function inferJobMatch(description: string): Promise<JobMatchResponse> {
  const response = await fetch('/api/job/infer-match', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({description}),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to infer job match')
  }
  return response.json()
}

export default function JobInferencer() {
  const [viewName, setViewName] = useState('form')
  const {toast} = useToast()

  const [inferPending, toggleInferPending] = useState(false)
  const [inferMatchPending, toggleInferMatchPending] = useState(false)

  const [jobDescription, setJobDescription] = useState('')
  const [inferredJob, setInferredJob] = useState<any>({})
  const [inferredJobMatch, setInferredJobMatch] = useState<any>({})
  const [cacheInfo, setCacheInfo] = useState<{
    inference?: {cached: boolean; expiry?: string}
    match?: {cached: boolean; expiry?: string}
  }>({})

  async function handleInferJob() {
    try {
      toggleInferPending(true)
      const data = await inferJob(jobDescription)
      setInferredJob(data.inferredDescription)
      setCacheInfo(prev => ({
        ...prev,
        inference: {cached: data.cached || false, expiry: data.cacheExpiry}
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
        match: {cached: data.cached || false, expiry: data.cacheExpiry}
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
      const expiryDate = cache.expiry ? new Date(cache.expiry) : null
      const now = new Date()

      if (expiryDate) {
        const hoursUntilExpiry = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60)

        if (hoursUntilExpiry <= 0) {
          return <Badge variant="cache-expired" size="sm">Cache expired</Badge>
        } else if (hoursUntilExpiry <= 2) {
          return <Badge variant="cache-expiring" size="sm">Cache expiring soon</Badge>
        }
      }

      return <Badge variant="cache-fresh" size="sm">Cached - Fast processing</Badge>
    }
    return null
  }

  if (viewName === 'form') {
    return (
      <div className="bg-gradient-to-br from-background via-blue-50/5 to-purple-50/10 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10">
        <div className="mx-auto py-12 px-6">
          <div className="text-center mb-8">
            <h1 className="text-heading-1 font-bold text-foreground mb-3">
              AI-Powered Job Analysis
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Paste a job description below to get instant AI analysis of requirements and match scoring against your resume.
            </p>
          </div>

          <Card elevated className="backdrop-blur-sm mx-5 bg-gradient-to-br from-background/95 to-blue-50/30 dark:to-blue-950/30 border border-blue-200/30 dark:border-blue-800/30 shadow-2xl shadow-blue-500/10">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <label htmlFor="jobDescription" className="block text-body font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                  Job Description
                </label>
                <Textarea
                  id="jobDescription"
                  name="jobDescription"
                  rows={16}
                  placeholder="Paste the complete job description here... Include requirements, responsibilities, and qualifications for best analysis."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  disabled={inferPending || inferMatchPending}
                  className="text-base leading-relaxed resize-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 transition-all duration-200 px-6 py-4"
                />
                <p className="text-caption text-muted-foreground flex items-center gap-2">
                  <span className="inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{jobDescription.length}</span> characters
                  </span>
                  • Longer descriptions provide more accurate analysis
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  loading={inferPending}
                  onClick={handleInferJob}
                  disabled={!jobDescription.trim() || inferMatchPending}
                  className="flex-1 sm:flex-none sm:min-w-[180px] h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-0"
                >
                  {inferPending ? 'Analyzing...' : '🔍 Analyze Job'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  loading={inferMatchPending}
                  onClick={handleInferJobMatch}
                  disabled={!jobDescription.trim() || inferPending}
                  className="flex-1 sm:flex-none sm:min-w-[200px] h-12 text-base font-semibold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:border-emerald-600 transition-all duration-200 hover:scale-[1.02]"
                >
                  {inferMatchPending ? 'Checking Match...' : '🎯 Check Resume Match'}
                </Button>
              </div>

              {(getCacheBadge('inference') || getCacheBadge('match')) && (
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Cache Status</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {getCacheBadge('inference') && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Job Analysis:</span>
                        {getCacheBadge('inference')}
                      </div>
                    )}
                    {getCacheBadge('match') && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Resume Match:</span>
                        {getCacheBadge('match')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
