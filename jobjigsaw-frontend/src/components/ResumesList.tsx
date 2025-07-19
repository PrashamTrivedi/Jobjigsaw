import { ResumesCard } from "./ResumesCard";
import { getResumes } from "@/data/resumes";
import { ResumeResponse } from "@/data/mainResume";

export default async function ResumesList() {
  const resumes = await getResumes();

  return (
    <div className="mt-5 mh-8">
      {resumes.map((resume: ResumeResponse, i: number) => (
        <ResumesCard key={i} resume={resume} i={i} />
      ))}
    </div>
  );
}
