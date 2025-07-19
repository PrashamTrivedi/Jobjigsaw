import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function POST(request: Request) {
  try {
    const job = await request.json()

    const response = await fetch(`${API_BASE_URL}/job`, {
      method: 'POST',
      body: JSON.stringify(job),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to add job'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error adding job:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/job`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to fetch jobs'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error getting jobs:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}
