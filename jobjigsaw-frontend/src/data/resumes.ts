/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_HOST || "http://localhost:8787";

export async function getResumeById(id: string): Promise<any> {
    try {
        const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch resume by ID');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting resume by ID:", error);
        throw error;
    }
}

export async function getResumes(): Promise<any[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/resume`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch resumes');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error getting resumes:", error);
        throw error;
    }
}

export async function updateResumeById(id: string, body: { updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string }) {
    try {
        const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to update resume');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating resume:", error);
        throw error;
    }
}

export async function deleteResumeById(id: string) {
    try {
        const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to delete resume');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error deleting resume:", error);
        throw error;
    }
}

export async function createResume(body: { jobId: string, updatedResume: any, technicalSkills: string, softSkills: string, coverLetter: string }) {
    try {
        const response = await fetch(`${API_BASE_URL}/resume`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to create resume');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating resume:", error);
        throw error;
    }
}

export async function generateResume(jobCompatibilityData: any, generateCoverLetter: boolean) {
    try {
        const headers: any = { "Content-Type": "application/json" };
        // If streaming is desired, add the header. Backend will handle it.
        // headers["streaming"] = "true"; 

        const response = await fetch(`${API_BASE_URL}/resume/generate`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ jobCompatibilityData, generateCoverLetter }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to generate resume');
        }

        // Assuming the backend returns the full JSON directly for non-streaming
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Error generating resume:", error);
        throw error;
    }
}
