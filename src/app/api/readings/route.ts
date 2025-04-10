import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SensorReading from '@/models/SensorReading';

export async function GET() {
  try {
    await dbConnect();

    const readings = await SensorReading.find()
      .sort({ timestamp: -1 })
      .limit(5);

    return NextResponse.json({ readings });
  } catch (error) {
    console.error('❌ Error fetching sensor readings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch readings' },
      { status: 500 }
    );
  }
}
