import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function POST(request: Request) {
  try {
    const {jobUrl} = await request.json() as {jobUrl: string}

    const response = await fetch(`${API_BASE_URL}/job/analyze`, {
      method: 'POST',
      body: JSON.stringify({jobUrl}),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to analyze job'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error analyzing job:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}
