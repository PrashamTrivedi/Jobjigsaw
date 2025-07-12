'use client'

// import JobLoadingSkeleton from "@/components/JobLoadingSkeleton"; // Create this component
// import JobsList from "@/components/JobsList"; // Create this component

// Placeholder components
const JobLoadingSkeleton = () => {
  return <div>Loading Jobs...</div>;
};

const JobsList = () => {
  return <div>List of Saved Jobs will go here.</div>;
};

export default function SavedJobsPage() {
  return (
    <>
      <div className="flex items-center w-full justify-center">
        <h1 className="text-4xl text-center mr-4">Saved Jobs</h1>
        <a href='/home'
          className="mt-3 text-center hover:border-b-4 hover:border-indigo-500 text-indigo-500 px-4 py-2 rounded" >
          Add New Job
        </a>
      </div>
      {/* <Suspense fallback={<JobLoadingSkeleton />}> */}
        <JobsList />
      {/* </Suspense> */}
    </>
  );
}
