import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function POST(request: Request) {
  try {
    const {jobCompatibilityData, generateCoverLetter} = await request.json() as {jobCompatibilityData: object, generateCoverLetter: object}

    const headers: Record<string, string> = {"Content-Type": "application/json"}

    const response = await fetch(`${API_BASE_URL}/resume/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({jobCompatibilityData, generateCoverLetter}),
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to generate resume'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error generating resume:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}
