import mongoose from "mongoose";

// The promise, kept. Not the connection -- the promise of one. The
// first caller starts the connect; every caller after it gets this
// same promise back and waits on the connection already being made.

let connection: Promise<typeof mongoose> | null = null;

export function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  // Fail here, with a sentence, rather than three screens later with a
  // connection timeout that does not mention .env at all.
  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Copy .env.example to .env and fill it in.",
    );
  }

  if (connection === null) {
    connection = mongoose
      .connect(uri, { serverSelectionTimeoutMS: 5000 })
      .then((m) => {
        console.log("MongoDB connected:", m.connection.name);
        return m;
      })
      .catch((err: unknown) => {
        // A failed attempt must not be the thing that gets kept. Leave
        // the rejected promise in place and every request from now on
        // fails with this same five-second-old error, including the
        // ones sent after the database comes back.
        connection = null;
        throw err;
      });
  }

  return connection;
}
