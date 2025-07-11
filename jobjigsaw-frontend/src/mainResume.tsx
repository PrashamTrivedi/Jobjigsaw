import { Project, Resume, Skills, WorkExperience, addProject, getMainResume, updateExperience, updateSkills, uploadResume } from "./data/mainResume";
import { Suspense, useEffect, useState } from "react";
import ResumeComponent from "./resume";
import { printResume } from "./data/resumes";

export default function MainResume() {
    const [isPrinting, setIsPrinting] = useState<boolean>(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const [mainResume, setMainResume] = useState<Resume>({
        basics: {
            name: "",
            label: "",
            email: "",
            phone: "",
            url: "",
            summary: "",
            location: {
                address: "",
                postalCode: "",
                city: "",
                countryCode: "",
                region: "",
            },
            profiles: [],
        },
        workExperience: [],
        education: [],
        awards: [],
        skills: [],
        languages: [],
        interests: [],
        references: [],
        projects: [],
        certifications: [],
    });

    useEffect(() => {
        (async () => {
            const resume = await getMainResume();
            if (resume) {
                setMainResume(resume);
            }
        })();
    }, []);

    async function printPdf() {
        setIsPrinting(true);
        const resumeName = `resume-${mainResume.basics.name}.pdf`;
        const printedResume = await printResume({ resumeJson: mainResume, resumeName });
        const url = window.URL.createObjectURL(new Blob([printedResume]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', resumeName);
        document.body.appendChild(link);
        link.click();
        setIsPrinting(false);
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUploadResume = async () => {
        if (!selectedFile) {
            alert("Please select a file to upload.");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            const uploadedResume = await uploadResume(formData);
            setMainResume(uploadedResume);
            alert("Resume uploaded and parsed successfully!");
        } catch (error) {
            console.error("Error uploading resume:", error);
            alert("Failed to upload or parse resume.");
        } finally {
            setIsUploading(false);
            setSelectedFile(null); // Clear selected file after upload attempt
        }
    };

    async function updateSkillsFromResume(skills: Skills[]) {
        const updatedResume = await updateSkills(skills);
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`);
    }

    async function updateExperienceFromResume(experience: WorkExperience) {
        const updatedResume = await updateExperience(experience);
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`);
    }

    async function updateProjectsFromResume(project: Project) {
        const updatedResume = await addProject(project);
        console.log(`updatedResume: ${JSON.stringify(updatedResume)}`);
    }

    function compareObjects(object1: any, object2: any) {
        if (!object1 || !object2) {
            return false;
        }
        const keys = Object.keys(object1);

        console.log(`comparing ${JSON.stringify(object1)} and ${JSON.stringify(object2)}`);
        for (const key of keys) {
            if (Array.isArray(object1[key])) {
                if (object1[key].length !== object2[key].length || !object1[key].every((val: any, index: number) => val === object2[key][index])) {
                    console.log(`Comparison failed on ${key}`);
                    return false;
                }
            } else if (typeof object1[key] === "object") {
                if (!compareObjects(object1[key], object2[key])) {
                    console.log(`Comparison failed on ${key}`);
                    return false;
                }
            } else if (object1[key] !== object2[key]) {
                console.log(`Comparison failed on ${key}`);
                return false;
            }
        }
        return true;
    }

    async function handleResumeUpdated(resume: Resume) {
        console.log(`resume: ${JSON.stringify(resume)}`);
        console.log(`mainResume: ${JSON.stringify(mainResume)}`);
        if (!compareObjects(resume.skills, mainResume.skills)) {
            console.log("Skills changed");
            await updateSkillsFromResume(resume.skills);
        } else if (!compareObjects(resume.workExperience, mainResume.workExperience)) {
            const changedExperience = resume.workExperience.filter((experience) => {
                return !compareObjects(experience, mainResume.workExperience.find((mainExperience) => mainExperience.company === experience.company));
            });
            console.log("Experience changed");
            const workExperiencePromises = changedExperience.map((experience) => {
                return updateExperienceFromResume(experience);
            });
            await Promise.all(workExperiencePromises);
        } else if (!compareObjects(resume.projects, mainResume.projects)) {
            const changedProjects = resume.projects.filter((project) => {
                return !compareObjects(project, mainResume.projects.find((mainProject) => mainProject.name === project.name));
            });
            console.log("Projects changed");
            const projectsPromises = changedProjects.map((project) => {
                return updateProjectsFromResume(project);
            });
            await Promise.all(projectsPromises);
        } else {
            console.log("Nothing changed");
        }
    }

    return (
        <>
            <h1 className='text-4xl font-bold text-center'>Main Resume Management</h1>
            <div className="space-y-4 p-4 max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div>
                    <label htmlFor="resumeUpload"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Main Resume (PDF or JSON)</label>
                    <input type="file"
                        id="resumeUpload" name="resumeUpload"
                        accept=".pdf,.json"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>
                <button onClick={handleUploadResume}
                    disabled={isUploading || !selectedFile}
                    className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isUploading ? 'Uploading...' : 'Upload Resume'}
                </button>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                <ResumeComponent initialResume={JSON.parse(JSON.stringify(mainResume))} onResumeUpdated={handleResumeUpdated} />
            </Suspense>
            <button className="dark:border dark:border-white dark:hover:bg-gray-900 dark:text-white px-4 py-2 mt-2 rounded-md" onClick={printPdf}>
                {isPrinting ? 'Printing Resume' : 'Print Resume'}
            </button>
        </>
    );
}