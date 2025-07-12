import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE_URL}/main-resume/getMainResume`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to fetch main resume' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error getting main resume:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
