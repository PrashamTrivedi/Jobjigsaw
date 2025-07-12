/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api` : "http://localhost:3000/api";

export async function inferJob(jobDescription: string): Promise<any> {
    console.log('handleInferJob');
    console.log(jobDescription);
    if (!jobDescription || jobDescription === '') {
        throw new Error('Job description is empty');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/job/infer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: jobDescription })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to infer job');
        }

        const data = await response.json();
        return data.inferredDescription;
    } catch (error) {
        console.error("Error inferring job:", error);
        throw error;
    }
}

export async function researchCompany(search: string): Promise<any> {
    console.log('handleResearchCompany');
    console.log(search);
    if (!search || search === '') {
        throw new Error('Search is empty');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/job/research-company/${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to research company');
        }

        const data = await response.json();
        return data.companyResearch;
    } catch (error) {
        console.error("Error researching company:", error);
        throw error;
    }
}

export async function inferJobMatch(jobDescription: string): Promise<any> {
    console.log('handleInferJobMatch');
    console.log(jobDescription);

    if (!jobDescription || jobDescription === '') {
        throw new Error('Job description is empty');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/job/infer-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: jobDescription })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to infer job match');
        }

        const data = await response.json();
        return data.compatibilityMatrix;
    } catch (error) {
        console.error("Error inferring job match:", error);
        throw error;
    }
}

export async function analyzeJob(jobUrl: string): Promise<any> {
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

export async function getAnalyzedJob(id: string): Promise<any> {
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
