import {NextResponse} from 'next/server'

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787"

export async function POST(request: Request) {
  try {
    type ResumePrintBody = { resumeName: string; [key: string]: unknown };
    const body = await request.json() as ResumePrintBody

    const response = await fetch(`${API_BASE_URL}/resume/print`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json() as {error?: string}
      return NextResponse.json({error: errorData.error || 'Failed to print resume'}, {status: response.status})
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${body.resumeName}"`, // Assuming resumeName is in the body
      },
    })
  } catch (error: unknown) {
    console.error("Error printing resume:", error)
    return NextResponse.json({error: error instanceof Error ? error.message : 'Internal Server Error'}, {status: 500})
  }
}
