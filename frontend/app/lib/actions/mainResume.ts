'use server'

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8787"; // Default to local Worker URL

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

export async function updateExperience(body: { company: string; position: string; website: string; startDate: string; endDate: string; summary: string; highlights: string[]; }) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/addWorkExperience`, {
            method: 'PUT',
            body: JSON.stringify(body),
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

export async function addProject(body: { name: string; description: string; url: string; techStack: string[]; responsibilities: string[]; }) {
    try {
        const response = await fetch(`${API_BASE_URL}/main-resume/addProject`, {
            method: 'PUT',
            body: JSON.stringify(body),
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
