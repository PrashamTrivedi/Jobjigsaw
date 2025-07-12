import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json({ error: 'Job description is empty' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/job/infer-match`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to infer job match' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.compatibilityMatrix);
  } catch (error: any) {
    console.error("Error inferring job match:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
