import mongoose, { type Mongoose } from "mongoose";

import {
  buildMongoConnectionError,
  hasMongoDatabaseUri as hasConfiguredMongoDatabaseUri,
  readMongoDatabaseUri
} from "@/lib/db/mongo-connection-config";

type MongooseConnectionCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseConnectionCache: MongooseConnectionCache | undefined;
}

function getMongooseConnectionCache(): MongooseConnectionCache {
  if (!global.mongooseConnectionCache) {
    global.mongooseConnectionCache = {
      connection: null,
      promise: null
    };
  }

  return global.mongooseConnectionCache;
}

export function hasMongoDatabaseUri(): boolean {
  return hasConfiguredMongoDatabaseUri();
}

export async function connectToDatabase(): Promise<Mongoose> {
  const connectionCache = getMongooseConnectionCache();

  if (connectionCache.connection) {
    return connectionCache.connection;
  }

  if (!connectionCache.promise) {
    const mongodbUri = readMongoDatabaseUri();

    connectionCache.promise = mongoose.connect(mongodbUri).catch((error: unknown) => {
      connectionCache.promise = null;
      throw buildMongoConnectionError(error, mongodbUri);
    });
  }

  connectionCache.connection = await connectionCache.promise;

  return connectionCache.connection;
}
