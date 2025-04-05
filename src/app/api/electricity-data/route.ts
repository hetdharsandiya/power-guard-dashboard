import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔔 Webhook received:', body);

    return NextResponse.json({ message: 'Webhook received!' });
  } catch (error) {
    console.error('❌ Error parsing webhook:', error);
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Only POST allowed' }, { status: 405 });
}
