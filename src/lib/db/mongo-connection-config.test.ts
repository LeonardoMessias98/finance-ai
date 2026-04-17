import { describe, expect, it } from "vitest";

import { buildMongoConnectionError, hasMongoDatabaseUri, readMongoDatabaseUri } from "@/lib/db/mongo-connection-config";

describe("mongo-connection-config", () => {
  it("reads a valid mongo uri from the environment", () => {
    const environment = {
      MONGODB_URI: "mongodb+srv://user:password@cluster.example.mongodb.net/finance-ai?retryWrites=true&w=majority"
    };

    expect(readMongoDatabaseUri(environment)).toBe(environment.MONGODB_URI);
  });

  it("strips wrapping quotes from the mongo uri", () => {
    const environment = {
      MONGODB_URI: "\"mongodb+srv://user:password@cluster.example.mongodb.net/finance-ai?retryWrites=true&w=majority\""
    };

    expect(readMongoDatabaseUri(environment)).toBe(
      "mongodb+srv://user:password@cluster.example.mongodb.net/finance-ai?retryWrites=true&w=majority"
    );
  });

  it("returns false when the configured mongo uri is invalid", () => {
    expect(hasMongoDatabaseUri({ MONGODB_URI: "http://example.com" })).toBe(false);
  });

  it("builds an actionable message for authentication failures", () => {
    const error = buildMongoConnectionError(
      new Error("bad auth : authentication failed"),
      "mongodb+srv://user:password@cluster.example.mongodb.net/?appName=Cluster0"
    );

    expect(error.message).toContain("Falha de autenticacao");
    expect(error.message).toContain("URL encoding");
    expect(error.message).toContain("/finance-ai");
  });

  it("builds an actionable message for srv lookup failures", () => {
    const error = buildMongoConnectionError(
      new Error("querySrv ECONNREFUSED _mongodb._tcp.cluster.example.mongodb.net"),
      "mongodb+srv://user:password@cluster.example.mongodb.net/finance-ai?appName=Cluster0"
    );

    expect(error.message).toContain("Falha ao resolver o host SRV");
  });
});
