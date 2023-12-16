export async function getMainResume() {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/mainResume/getMainResume`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}

export async function updateSkills({name, items}: {name: string, items: string[]}) {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/mainResume/updateSkills`, {
        method: 'POST',
        body: JSON.stringify({name, items}),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}

export async function updateExperience(body: {company: string, role: string, duration: string, responsibilities: string[]}) {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/mainResume/addWorkExperience`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}

export async function addProject(body: {name: string, description: string, url: string, techStack: string[], responsibilities: string[]}) {
    const response = await fetch(`${process.env.BACKEND_API_HOST}/mainResume/addProject`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    })
    const data = await response.json()
    return data
}