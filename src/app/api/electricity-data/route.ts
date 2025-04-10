import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SensorReading from '@/models/SensorReading';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('🔔 Webhook received:', body);

    await dbConnect();

    const reading = new SensorReading({
      api_key: body.api_key || '',
      sensor_zone: body.sensor_zone || '',
      sensor_type: body.sensor_type || '',
      sensor_name: body.sensor_name || '',
      sensor_current: parseFloat(body.sensor_current) || 0,
      sensor_time: body.timestamp || 0 
    });

    await reading.save();

    return NextResponse.json({ message: 'Sensor data saved!' });
  } catch (error) {
    console.error('❌ Error saving sensor data:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
