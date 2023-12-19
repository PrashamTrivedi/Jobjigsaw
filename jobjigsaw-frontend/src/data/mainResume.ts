import axios from 'axios';

export async function getMainResume() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/getMainResume`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateSkills({name, items}: {name: string, items: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/updateSkills`, {name, items}, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function updateExperience(body: {company: string, role: string, duration: string, responsibilities: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addWorkExperience`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}

export async function addProject(body: {name: string, description: string, url: string, techStack: string[], responsibilities: string[]}) {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_API_HOST}/mainResume/addProject`, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    return response.data
}