import React from 'react';

interface InferredJobProps {
  jobDescription: string;
  job: any;
  match: any;
}

const InferredJob: React.FC<InferredJobProps> = ({ jobDescription, job, match }) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Inferred Job Details</h2>
      <p>Job Description: {jobDescription}</p>
      <pre>{JSON.stringify(job, null, 2)}</pre>
      <h2 className="text-lg font-semibold mt-4">Job Match Details</h2>
      <pre>{JSON.stringify(match, null, 2)}</pre>
    </div>
  );
};

export default InferredJob;
