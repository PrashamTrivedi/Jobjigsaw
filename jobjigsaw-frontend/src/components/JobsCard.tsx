'use client'

import { useState, useTransition } from "react";
import { BriefcaseIcon, LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Job, deleteJob } from "@/data/jobs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function JobsCard({ job }: { job: Job; i: number }) {
  const [isExpanded, setExpanded] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleJobDeletion() {
    startDeleteTransition(async () => {
      try {
        await deleteJob(`${job.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      }
    });
  }

  return (
    <Card key={job.id}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span>{job.companyName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <TrashIcon className="h-4 w-4" />
            <AlertTitle>Deletion Failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <p><strong>Role:</strong> {job.post}</p>
          <p><strong>Type:</strong> <Badge variant="secondary">{job.type}</Badge></p>
          <p><strong>Location:</strong> {job.location}</p>
        </div>
        {isExpanded && (
          <div className="prose prose-sm dark:prose-invert">
            <p>{job.text}</p>
          </div>
        )}
        <div>
          <Link href={job.url} target="_blank" className="flex items-center gap-2 text-sm text-blue-500 hover:underline">
            <LinkIcon className="h-4 w-4" />
            <span>Job URL</span>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/saved-resumes/resume?jobId=${job.id}`}>View Resume</Link>
          </Button>
          <Button variant="destructive" onClick={handleJobDeletion} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : <TrashIcon className="h-5 w-5" />}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
