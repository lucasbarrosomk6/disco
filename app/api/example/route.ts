import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    // Sample data
    const exampleData = {
      message: "This is an example endpoint",
      timestamp: new Date().toISOString(),
      features: ["API Routes", "Next.js", "TypeScript"]
    };

    return NextResponse.json(exampleData);
  } catch (error) {
    console.error('Error in example endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Echo back the received data along with a message
    const responseData = {
      message: "Received your POST request",
      receivedData: body,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in example POST endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
