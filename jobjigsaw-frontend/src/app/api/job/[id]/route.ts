import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await fetch(`${API_BASE_URL}/job/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      return NextResponse.json({ error: errorData.error || 'Failed to fetch job' }, { status: response.status });
    }

    const data = await response.json() as unknown;
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error getting job:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const response = await fetch(`${API_BASE_URL}/job/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json() as { error?: string };
      return NextResponse.json({ error: errorData.error || 'Failed to delete job' }, { status: response.status });
    }

    const data = await response.json() as unknown;
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error deleting job:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
