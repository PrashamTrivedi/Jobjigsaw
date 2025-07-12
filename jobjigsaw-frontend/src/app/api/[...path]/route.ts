import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_HOST || "http://localhost:8787";

export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');
  const backendUrl = `${BACKEND_API_URL}${path}`;

  try {
    const response = await fetch(backendUrl, {
      headers: request.headers,
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');
  const backendUrl = `${BACKEND_API_URL}${path}`;

  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');
  const backendUrl = `${BACKEND_API_URL}${path}`;

  try {
    const body = await request.json();
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: request.headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const path = pathname.replace('/api', '');
  const backendUrl = `${BACKEND_API_URL}${path}`;

  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: request.headers,
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Backend error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
