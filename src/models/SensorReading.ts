import mongoose, { Schema, model, models } from 'mongoose';

const SensorReadingSchema = new Schema({
  api_key: String,
  sensor_zone: String,
  sensor_type: { type: String, enum: ['IN', 'OUT'] },
  sensor_name: String,
  sensor_current: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorReading =
  models.SensorReading || model('SensorReading', SensorReadingSchema);

export default SensorReading;
