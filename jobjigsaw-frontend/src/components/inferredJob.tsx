'use client'

import React, {useState} from 'react'
import {Card, CardHeader, CardTitle, CardContent, Button, Badge} from '@/components/ui'
import {ChevronDownIcon, ChevronUpIcon, DocumentDuplicateIcon, CheckIcon} from '@heroicons/react/24/outline'

interface JobDetails {
  jobTitle?: string
  companyName?: string
  location?: string
  workType?: string
  technicalSkills?: string[]
  softSkills?: string[]
  requirements?: string[]
  responsibilities?: string[]
}

interface MatchDetails {
  overallScore?: number
  skillsMatch?: {
    matched?: string[]
    missing?: string[]
  }
  recommendations?: string[]
}

interface InferredJobProps {
  jobDescription: string
  job: JobDetails
  match: MatchDetails
  cacheInfo?: {
    inference?: {cached: boolean; expiry?: string}
    match?: {cached: boolean; expiry?: string}
  }
}

const InferredJob: React.FC<InferredJobProps> = ({jobDescription, job, match, cacheInfo}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [copiedSections, setCopiedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({...prev, [section]: !prev[section]}))
  }

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSections(prev => ({...prev, [section]: true}))
      setTimeout(() => {
        setCopiedSections(prev => ({...prev, [section]: false}))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const renderJobDetails = () => {
    if (!job || Object.keys(job).length === 0) {
      return (
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No job analysis data available. Click &quot;Analyze Job&quot; to get started.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {/* Job Overview Card */}
        <Card elevated>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-heading-2">Job Overview</CardTitle>
              {cacheInfo?.inference?.cached && (
                <Badge variant="cache-fresh">Cached Data</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {job.jobTitle && (
              <div>
                <h4 className="text-heading-3 text-primary mb-2">{job.jobTitle}</h4>
              </div>
            )}
            {job.companyName && (
              <div>
                <span className="text-body-sm font-medium text-muted-foreground">Company: </span>
                <span className="text-body">{job.companyName}</span>
              </div>
            )}
            {job.location && (
              <div>
                <span className="text-body-sm font-medium text-muted-foreground">Location: </span>
                <span className="text-body">{job.location}</span>
              </div>
            )}
            {job.workType && (
              <div>
                <span className="text-body-sm font-medium text-muted-foreground">Work Type: </span>
                <span className="text-body">{job.workType}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technical Skills Card */}
        {job.technicalSkills && job.technicalSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3">Technical Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.technicalSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="info">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Soft Skills Card */}
        {job.softSkills && job.softSkills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3">Soft Skills Required</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {job.softSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="success">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements Card */}
        {job.requirements && job.requirements.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-3">Key Requirements</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('requirements')}
                >
                  {expandedSections.requirements ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${expandedSections.requirements ? '' : 'line-clamp-3'}`}>
                {job.requirements.map((req: string, index: number) => (
                  <li key={index} className="text-body flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Responsibilities Card */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-3">Key Responsibilities</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('responsibilities')}
                >
                  {expandedSections.responsibilities ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className={`space-y-2 ${expandedSections.responsibilities ? '' : 'line-clamp-3'}`}>
                {job.responsibilities.map((resp: string, index: number) => (
                  <li key={index} className="text-body flex items-start">
                    <span className="text-primary mr-2">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderMatchDetails = () => {
    if (!match || Object.keys(match).length === 0) {
      return (
        <Card>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No resume match data available. Click &quot;Check Resume Match&quot; to analyze compatibility.
            </p>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {/* Match Score Card */}
        {match.overallScore !== undefined && (
          <Card elevated>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-heading-2">Resume Match Score</CardTitle>
                {cacheInfo?.match?.cached && (
                  <Badge variant="cache-fresh">Cached Data</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">
                  {match.overallScore}%
                </div>
                <p className="text-body text-muted-foreground">
                  Overall compatibility with this role
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills Match Card */}
        {match.skillsMatch && (
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3">Skills Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {match.skillsMatch.matched && match.skillsMatch.matched.length > 0 && (
                <div>
                  <h5 className="text-body-sm font-medium text-green-600 mb-2">✓ Skills You Have</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.skillsMatch.matched.map((skill: string, index: number) => (
                      <Badge key={index} variant="success">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {match.skillsMatch.missing && match.skillsMatch.missing.length > 0 && (
                <div>
                  <h5 className="text-body-sm font-medium text-red-600 mb-2">✗ Skills to Develop</h5>
                  <div className="flex flex-wrap gap-2">
                    {match.skillsMatch.missing.map((skill: string, index: number) => (
                      <Badge key={index} variant="error">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recommendations Card */}
        {match.recommendations && match.recommendations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-heading-3">Improvement Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {match.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="text-body flex items-start">
                    <span className="text-warning mr-2">💡</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Original Job Description Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-heading-3">Original Job Description</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(jobDescription, 'original')}
            >
              {copiedSections.original ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <DocumentDuplicateIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-body whitespace-pre-wrap ${expandedSections.original ? '' : 'line-clamp-4'}`}>
            {jobDescription}
          </p>
          {jobDescription.length > 300 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection('original')}
              className="mt-2"
            >
              {expandedSections.original ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Analysis Column */}
        <div>
          <h2 className="text-heading-1 mb-4">Job Analysis</h2>
          {renderJobDetails()}
        </div>

        {/* Resume Match Column */}
        <div>
          <h2 className="text-heading-1 mb-4">Resume Match</h2>
          {renderMatchDetails()}
        </div>
      </div>
    </div>
  )
}

export default InferredJob
