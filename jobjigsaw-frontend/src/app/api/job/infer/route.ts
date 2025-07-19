import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function POST(request: Request) {
  try {
    const {description} = await request.json() as {description: string}

    if (!description) {
      return NextResponse.json({error: 'Job description is empty'}, {status: 400})
    }

    const response = await fetch(`${API_BASE_URL}/job/infer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({description}),
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to infer job'}, {status: response.status})
    }

    const data = await response.json() as {inferredDescription: unknown}
    return NextResponse.json(data.inferredDescription)
  } catch (error: unknown) {
    console.error("Error inferring job:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}
