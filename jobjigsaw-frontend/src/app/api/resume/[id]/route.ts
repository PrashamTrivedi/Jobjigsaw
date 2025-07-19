import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params
    const body = await request.json()

    const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json() as { error?: string }
      return NextResponse.json({error: errorData.error || 'Failed to update resume'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error updating resume:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}

export async function DELETE(request: Request, {params}: {params: Promise<{id: string}>}) {
  try {
    const {id} = await params

    const response = await fetch(`${API_BASE_URL}/resume/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json() as { error?: string }
      return NextResponse.json({error: errorData.error || 'Failed to delete resume'}, {status: response.status})
    }

    const data = await response.json() as unknown
    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Error deleting resume:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}