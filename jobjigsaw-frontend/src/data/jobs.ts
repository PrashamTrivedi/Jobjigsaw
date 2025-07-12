import axios from 'axios'

export interface Job {
    id?: number
    text: string
    url: string
    companyName: string
    post: string
    type: string
    location: string
    date?: string
    technicalSkills: string[]
    softSkills: string[]
    inferredJob?: string
    inferredJobMatch?: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api` : "http://localhost:3000/api";

export async function addJob(job: Job) {
    console.log(job);
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
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error adding job:", error);
        throw error;
    }
}

export async function getJobs(): Promise<Job[]> {
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

export async function getJob(id: string): Promise<Job> {
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
    console.log('deleteJob');
    console.log(id);
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
        console.log(data);
        return data;
    } catch (error) {
        console.error("Error deleting job:", error);
        throw error;
    }
}
