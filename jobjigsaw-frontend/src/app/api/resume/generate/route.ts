import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function POST(request: Request) {
  try {
    const { jobCompatibilityData, generateCoverLetter } = await request.json();

    const headers: any = { "Content-Type": "application/json" };

    const response = await fetch(`${API_BASE_URL}/resume/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ jobCompatibilityData, generateCoverLetter }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to generate resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error generating resume:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
