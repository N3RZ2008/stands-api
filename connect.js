import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set");

let cached = { client: null, db: null };

export async function connect() {
  if (cached.db) return cached.db;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "jojoWiki";
  const db = client.db(dbName);
  cached = { client, db };
  return db;
}
