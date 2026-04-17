const MONGODB_URI_ENVIRONMENT_VARIABLE = "MONGODB_URI";
const SUPPORTED_MONGODB_PROTOCOLS = new Set(["mongodb:", "mongodb+srv:"]);

type MongoEnvironment = Record<string, string | undefined>;

function stripWrappingQuotes(value: string): string {
  const trimmedValue = value.trim();

  if (trimmedValue.length < 2) {
    return trimmedValue;
  }

  const firstCharacter = trimmedValue.at(0);
  const lastCharacter = trimmedValue.at(-1);
  const hasDoubleQuotes = firstCharacter === "\"" && lastCharacter === "\"";
  const hasSingleQuotes = firstCharacter === "'" && lastCharacter === "'";

  if (!hasDoubleQuotes && !hasSingleQuotes) {
    return trimmedValue;
  }

  return trimmedValue.slice(1, -1).trim();
}

function parseMongoDatabaseUri(mongodbUri: string): URL {
  let parsedUri: URL;

  try {
    parsedUri = new URL(mongodbUri);
  } catch {
    throw new Error(
      'Invalid environment variable: MONGODB_URI. Use a full MongoDB connection string such as "mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority".'
    );
  }

  if (!SUPPORTED_MONGODB_PROTOCOLS.has(parsedUri.protocol)) {
    throw new Error('Invalid environment variable: MONGODB_URI. Use either the "mongodb://" or "mongodb+srv://" protocol.');
  }

  if (!parsedUri.hostname) {
    throw new Error('Invalid environment variable: MONGODB_URI. Provide a valid MongoDB host in the connection string.');
  }

  return parsedUri;
}

function getMongoDatabaseName(parsedUri: URL): string | null {
  const databaseName = parsedUri.pathname.replace(/^\//, "").trim();

  return databaseName.length > 0 ? databaseName : null;
}

function hasPlaceholderCredential(value: string): boolean {
  if (!value) {
    return false;
  }

  const decodedValue = decodeURIComponent(value).trim();

  return decodedValue.startsWith("<") && decodedValue.endsWith(">");
}

function buildMongoConnectionHints(parsedUri: URL): string[] {
  const hints: string[] = [];

  if (!parsedUri.username || !parsedUri.password) {
    hints.push("Confirme se a URI inclui usuario e senha.");
  }

  if (hasPlaceholderCredential(parsedUri.username) || hasPlaceholderCredential(parsedUri.password)) {
    hints.push('Substitua placeholders como "<user>" e "<password>" pelos valores reais do cluster.');
  }

  if (!getMongoDatabaseName(parsedUri)) {
    hints.push('Adicione um nome de banco explicito na URI, por exemplo "/finance-ai".');
  }

  return hints;
}

function isMongoAuthenticationError(errorMessage: string): boolean {
  const normalizedMessage = errorMessage.toLowerCase();

  return normalizedMessage.includes("authentication failed") || normalizedMessage.includes("bad auth");
}

function isMongoSrvLookupError(errorMessage: string): boolean {
  const normalizedMessage = errorMessage.toLowerCase();

  return normalizedMessage.includes("querysrv") || normalizedMessage.includes("_mongodb._tcp");
}

export function readMongoDatabaseUri(environment: MongoEnvironment = process.env): string {
  const rawMongoDatabaseUri = environment[MONGODB_URI_ENVIRONMENT_VARIABLE];
  const mongodbUri = typeof rawMongoDatabaseUri === "string" ? stripWrappingQuotes(rawMongoDatabaseUri) : "";

  if (!mongodbUri) {
    throw new Error('Missing environment variable: MONGODB_URI. Define it in ".env.local" or ".env" before connecting to MongoDB.');
  }

  parseMongoDatabaseUri(mongodbUri);

  return mongodbUri;
}

export function hasMongoDatabaseUri(environment: MongoEnvironment = process.env): boolean {
  try {
    return readMongoDatabaseUri(environment).length > 0;
  } catch {
    return false;
  }
}

export function buildMongoConnectionError(error: unknown, mongodbUri: string): Error {
  const parsedUri = parseMongoDatabaseUri(mongodbUri);
  const hints = buildMongoConnectionHints(parsedUri);
  const originalMessage = error instanceof Error ? error.message : "Unknown MongoDB connection error.";

  if (isMongoAuthenticationError(originalMessage)) {
    const authenticationHints = [
      "Falha de autenticacao ao conectar no MongoDB usando MONGODB_URI.",
      "Verifique se o usuario e a senha pertencem ao cluster correto.",
      "Se a senha tiver caracteres especiais, aplique URL encoding antes de salvar a URI."
    ];

    return new Error([...authenticationHints, ...hints].join(" "), {
      cause: error instanceof Error ? error : undefined
    });
  }

  if (isMongoSrvLookupError(originalMessage)) {
    return new Error(
      "Falha ao resolver o host SRV do MongoDB a partir de MONGODB_URI. Verifique internet, DNS e se o host do cluster esta correto.",
      {
        cause: error instanceof Error ? error : undefined
      }
    );
  }

  return new Error(`Falha ao conectar no MongoDB usando MONGODB_URI. ${originalMessage}`, {
    cause: error instanceof Error ? error : undefined
  });
}
