import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/sensordata';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Extend the global object type
declare global {
  var mongooseConn:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

// Ensure cached is always defined
const globalWithMongoose = global as typeof global & {
  mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

if (!globalWithMongoose.mongooseConn) {
  globalWithMongoose.mongooseConn = { conn: null, promise: null };
}

async function dbConnect() {
  const cached = globalWithMongoose.mongooseConn;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
