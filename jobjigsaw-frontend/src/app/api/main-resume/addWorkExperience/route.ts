import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function PUT(request: Request) {
  try {
    const experience = await request.json();

    const response = await fetch(`${API_BASE_URL}/main-resume/addWorkExperience`, {
      method: 'PUT',
      body: JSON.stringify(experience),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      return NextResponse.json({ error: errorData.error || 'Failed to update work experience' }, { status: response.status });
    }

    const data = await response.json() as unknown;
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error updating work experience:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
