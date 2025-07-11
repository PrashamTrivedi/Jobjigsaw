

interface JinaResponse {
    data: unknown
}



async function jinaFetch(endpoint: string, url: string, env: Env): Promise<string> {


    const jinaApiEndpoint = `https://${endpoint}.jina.ai/${url}`
    console.log(`Fetching ${jinaApiEndpoint}`)

    const headers = {
        Authorization: `Bearer ${env.JINA_API_KEY}`,
        'X-Return-Format': 'markdown',

    }

    let response = await fetch(jinaApiEndpoint, {headers})

    // If we get a 403, retry once with X-No-Cache header
    if (response.status === 403) {
        console.log('Got 403, retrying with X-No-Cache header')
        response = await fetch(jinaApiEndpoint, {
            headers: {
                ...headers,
                'X-No-Cache': 'true'
            }
        })
    }

    if (!response.ok) {
        throw new Error(`Jina API error: ${response.statusText}`)
    }
    console.log(`fetched ${jinaApiEndpoint}`)

    return await response.text()
}

export async function readPage(url: string, env: Env): Promise<string> {
    return await jinaFetch('r', url, env)
}

export async function search(searchTerm: string, env: Env): Promise<string> {
    return await jinaFetch('s', searchTerm, env)
}

export async function searchGrounding(searchTerm: string, env: Env): Promise<string> {
    return await jinaFetch('g', searchTerm, env)
}