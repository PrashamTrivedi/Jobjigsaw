'use client'

import { useState, useTransition } from 'react'
import { Button, Card, CardContent, Textarea, Badge } from '@/components/ui'
import { useToast } from '@/components/ui/use-toast'
import InferredJob from "./inferredJob"
import { inferJob, inferJobMatch } from '@/data/jobInference'
import { Loader2 } from 'lucide-react'

export default function JobInferencer() {
  const [viewName, setViewName] = useState('form')
  const { toast } = useToast()

  const [isInferPending, startInferTransition] = useTransition()
  const [isMatchPending, startMatchTransition] = useTransition()

  const [jobDescription, setJobDescription] = useState('')
  const [inferredJob, setInferredJob] = useState<any>({})
  const [inferredJobMatch, setInferredJobMatch] = useState<any>({})
  const [cacheInfo, setCacheInfo] = useState<{
    inference?: { cached: boolean; expiry?: string };
    match?: { cached: boolean; expiry?: string };
  }>({})

  function handleInferJob() {
    startInferTransition(async () => {
      try {
        const data = await inferJob(jobDescription)
        setInferredJob(data.inferredDescription)
        setCacheInfo(prev => ({
          ...prev,
          inference: { cached: data.cached || false, expiry: data.cacheExpiry }
        }))

        toast({
          title: data.cached ? 'Using cached data' : 'Job analyzed successfully',
          description: data.cached
            ? 'Job analysis completed using cached results for faster processing'
            : 'Data has been cached for future use',
        })

        setViewName('inferrence')
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Analysis failed',
          description: error instanceof Error ? error.message : 'Failed to analyze job description'
        })
      }
    })
  }

  function handleInferJobMatch() {
    startMatchTransition(async () => {
      try {
        const data = await inferJobMatch(jobDescription)
        setInferredJobMatch(data.jobMatch)
        setCacheInfo(prev => ({
          ...prev,
          match: { cached: data.cached || false, expiry: data.cacheExpiry }
        }))

        toast({
          title: data.cached ? 'Using cached data' : 'Resume match completed',
          description: data.cached
            ? 'Resume match completed using cached results'
            : 'Match results have been cached for future use',
        })

        setViewName('inferrence')
      } catch (error) {
        console.error(error)
        toast({
          variant: 'destructive',
          title: 'Match check failed',
          description: error instanceof Error ? error.message : 'Failed to check resume match'
        })
      }
    })
  }

  const getCacheBadge = (type: 'inference' | 'match') => {
    const cache = cacheInfo[type]
    if (!cache?.cached) return null
    
    return <Badge>Cached - Fast processing</Badge>
  }

  if (viewName === 'form') {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
            AI-Powered Job Analysis
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Paste a job description below to get instant AI analysis of requirements and match scoring against your resume.
          </p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="jobDescription" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Job Description
              </label>
              <Textarea
                id="jobDescription"
                name="jobDescription"
                rows={12}
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={isInferPending || isMatchPending}
                className="w-full"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {jobDescription.length} characters • Longer descriptions provide more accurate analysis
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleInferJob}
                disabled={!jobDescription.trim() || isInferPending || isMatchPending}
                className="w-full sm:w-auto"
              >
                {isInferPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isInferPending ? 'Analyzing...' : 'Analyze Job'}
              </Button>

              <Button
                variant="secondary"
                onClick={handleInferJobMatch}
                disabled={!jobDescription.trim() || isInferPending || isMatchPending}
                className="w-full sm:w-auto"
              >
                {isMatchPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isMatchPending ? 'Checking Match...' : 'Check Resume Match'}
              </Button>
            </div>

            {(getCacheBadge('inference') || getCacheBadge('match')) && (
              <div className="flex flex-wrap gap-2 pt-4 border-t">
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
