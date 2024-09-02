import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://0.0.0.0:8000/python-output');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ output: 'Error fetching data' });
  }
}
