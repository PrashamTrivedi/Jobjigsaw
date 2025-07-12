import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.BACKEND_API_HOST || "http://localhost:8787";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    if (!search) {
      return NextResponse.json({ error: 'Search query is empty' }, { status: 400 });
    }

    const response = await fetch(`${API_BASE_URL}/job/research-company/${search}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || 'Failed to research company' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data.companyResearch);
  } catch (error: any) {
    console.error("Error researching company:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
