'use client'

import React from 'react'
import {Card, CardHeader, CardTitle, CardContent, Badge} from '@/components/ui'
import {Resume} from '@/types/resume'
import {MapPinIcon, EnvelopeIcon, PhoneIcon, GlobeAltIcon} from '@heroicons/react/24/outline'

interface ResumeDisplayProps {
  resume: Resume
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({resume}) => {
  const {basics, workExperience, education, skills, projects, certifications} = resume

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Section */}
      <Card elevated>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h1 className="text-heading-1 mb-2">{basics.name || 'Your Name'}</h1>
            <h2 className="text-heading-3 text-muted-foreground mb-4">{basics.label || 'Professional Title'}</h2>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {basics.email && (
              <div className="flex items-center justify-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-sm">{basics.email}</span>
              </div>
            )}
            {basics.phone && (
              <div className="flex items-center justify-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-sm">{basics.phone}</span>
              </div>
            )}
            {basics.location?.city && (
              <div className="flex items-center justify-center space-x-2">
                <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-body-sm">
                  {basics.location.city}{basics.location.region && `, ${basics.location.region}`}
                </span>
              </div>
            )}
            {basics.url && (
              <div className="flex items-center justify-center space-x-2">
                <GlobeAltIcon className="h-4 w-4 text-muted-foreground" />
                <a href={basics.url} className="text-body-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </div>
            )}
          </div>

          {/* Summary */}
          {basics.summary && (
            <div className="mt-6">
              <p className="text-body text-center">{basics.summary}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Work Experience */}
      {workExperience && workExperience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-2">Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {workExperience.map((exp, index) => (
              <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                  <h3 className="text-heading-3">{exp.position}</h3>
                  <span className="text-body-sm text-muted-foreground">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <h4 className="text-body-lg font-medium text-blue-600 mb-2">{exp.company}</h4>
                {exp.summary && (
                  <p className="text-body mb-3">{exp.summary}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {exp.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-body flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-2">Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                  <h3 className="text-heading-3">{edu.studyType} in {edu.area}</h3>
                  <span className="text-body-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <h4 className="text-body-lg font-medium text-blue-600 mb-2">{edu.institution}</h4>
                {edu.gpa && (
                  <p className="text-body">GPA: {edu.gpa}</p>
                )}
                {edu.courses && edu.courses.length > 0 && (
                  <div className="mt-2">
                    <span className="text-body-sm font-medium">Relevant Courses: </span>
                    <span className="text-body-sm">{edu.courses.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-2">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skills.map((skillGroup, index) => (
              <div key={index}>
                <h3 className="text-heading-3 mb-2">{skillGroup.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.keywords.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="info">{skill}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-2">Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-2">
                  <h3 className="text-heading-3">{project.name}</h3>
                  {project.url && (
                    <a
                      href={project.url}
                      className="text-blue-600 hover:underline text-body-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Project
                    </a>
                  )}
                </div>
                <p className="text-body mb-3">{project.description}</p>
                {project.highlights && project.highlights.length > 0 && (
                  <ul className="space-y-1">
                    {project.highlights.map((highlight, highlightIndex) => (
                      <li key={highlightIndex} className="text-body flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-heading-2">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="success">{cert}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ResumeDisplay