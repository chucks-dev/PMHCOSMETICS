import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var mongoose: { conn: any; promise: any } | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

// Add this to ensure TypeScript knows cached is defined
if (!cached) throw new Error("Failed to initialize Mongoose cache");

async function connectToDatabase() {
    if (!cached) {
        throw new Error("Mongoose cache is not initialized");
    }

    if (cached.conn) {
        return { success: true, connection: cached.conn };
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        return { success: true, connection: cached.conn };
    } catch (e) {
        cached.promise = null;
        console.error("MongoDB connection failed:", e);
        return { success: false, connection: null, error: e };
    }
}

export default connectToDatabase;
