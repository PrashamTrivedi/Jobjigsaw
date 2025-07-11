'use server'
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export interface Job {
    id: string;
    jobTitle: string;
    company: string;
    jobDescription: string;
    jobUrl: string | null;
    jobLocation: string | null;
    jobType: string | null;
    salary: string | null;
    postedDate: string | null;
    applicationDeadline: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
    responsibilities: string | null;
    requirements: string | null;
    benefits: string | null;
    aboutCompany: string | null;
    howToApply: string | null;
    jobFitScore: number | null;
    jobFitBreakdown: string | null;
    inferredData: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8787"; // Default to local Worker URL

export async function addJob(formData: FormData) {
    const job: Job = {
        id: formData.get('id') as string || Date.now().toString(), // Ensure ID is present
        jobTitle: formData.get('jobTitle') as string,
        company: formData.get('company') as string,
        jobDescription: formData.get('jobDescription') as string,
        jobUrl: formData.get('jobUrl') as string,
        jobLocation: formData.get('jobLocation') as string,
        jobType: formData.get('jobType') as string,
        salary: formData.get('salary') as string,
        postedDate: formData.get('postedDate') as string,
        applicationDeadline: formData.get('applicationDeadline') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
        responsibilities: formData.get('responsibilities') as string,
        requirements: formData.get('requirements') as string,
        benefits: formData.get('benefits') as string,
        aboutCompany: formData.get('aboutCompany') as string,
        howToApply: formData.get('howToApply') as string,
        jobFitScore: parseFloat(formData.get('jobFitScore') as string) || null,
        jobFitBreakdown: formData.get('jobFitBreakdown') as string || null,
        inferredData: formData.get('inferredData') as string || null,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/job`, {
            method: 'POST',
            body: JSON.stringify(job),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add job');
        }

        const data = await response.json();
        console.log("Job added successfully:", data);
        revalidatePath('/saved-jobs');
        redirect('/saved-jobs');
    } catch (error) {
        console.error("Error adding job:", error);
        // Re-throw or handle error as appropriate for Next.js server actions
        throw error;
    }
}

export async function getJobs() {
    try {
        const response = await fetch(`${API_BASE_URL}/job`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch jobs');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting jobs:", error);
        throw error;
    }
}

export async function getJob(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/job/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch job');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting job:", error);
        throw error;
    }
}

export async function deleteJob(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/job/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete job');
        }

        const data = await response.json();
        console.log("Job deleted successfully:", data);
        revalidatePath('/saved-jobs');
        redirect('/saved-jobs');
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
}

export async function analyzeJob(jobUrl: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/job/analyze`, {
            method: 'POST',
            body: JSON.stringify({ jobUrl }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to analyze job');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error analyzing job:", error);
        throw error;
    }
}

export async function getAnalyzedJob(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/job/analyzed/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch analyzed job');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting analyzed job:", error);
        throw error;
    }
}
