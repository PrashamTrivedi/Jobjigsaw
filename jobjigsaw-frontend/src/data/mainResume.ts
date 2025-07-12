import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api` : "http://localhost:3000/api";

export async function getMainResume() {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/getMainResume`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // Ensure fresh data
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch main resume');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting main resume:", error);
        throw error;
    }
}

export async function updateSkills(skills: { name: string; items: string[] }[]) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/updateSkills`, {
            method: 'PUT',
            body: JSON.stringify(skills),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update skills');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating skills:", error);
        throw error;
    }
}

export async function updateExperience(experience: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/addWorkExperience`, {
            method: 'PUT',
            body: JSON.stringify(experience),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update work experience');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating work experience:", error);
        throw error;
    }
}

export async function addProject(project: any) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/addProject`, {
            method: 'PUT',
            body: JSON.stringify(project),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add project');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
}

export async function uploadResume(formData: FormData) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/uploadResume`, {
            method: 'POST',
            body: formData, // FormData will be correctly handled by Hono
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload resume');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error uploading resume:", error);
        throw error;
    }
}

export interface Resume {
    basics: {
        name: string;
        label: string;
        email: string;
        phone: string;
        url: string;
        summary: string;
        location: {
            address: string;
            postalCode: string;
            city: string;
            countryCode: string;
            region: string;
        };
        profiles: {
            network: string;
            username: string;
            url: string;
        }[];
    };
    workExperience: {
        company: string;
        position: string;
        website: string;
        startDate: string;
        endDate: string;
        summary: string;
        highlights: string[];
    }[];
    education: {
        institution: string;
        area: string;
        studyType: string;
        startDate: string;
        endDate: string;
        gpa: string;
        courses: string[];
    }[];
    awards: {
        title: string;
        date: string;
        awarder: string;
        summary: string;
    }[];
    skills: {
        name: string;
        level: string;
        keywords: string[];
    }[];
    languages: {
        language: string;
        fluency: string;
    }[];
    interests: {
        name: string;
        keywords: string[];
    }[];
    references: {
        name: string;
        reference: string;
    }[];
    projects: {
        name: string;
        description: string;
        highlights: string[];
        url: string;
    }[];
    certifications: string[];
}

export interface ResumeResponse extends Resume {
    id: string;
    cover_letter: string;
    job_id: string;
    soft_skills: string;
    technical_skills: string;
    updated_resume: string;
}
