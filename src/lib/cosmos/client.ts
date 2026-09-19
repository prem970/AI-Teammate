import { CosmosClient, Container, Database } from "@azure/cosmos";

let cachedClient: CosmosClient | null = null;
let cachedDb: Database | null = null;

export function cosmosConfigured(): boolean {
  return Boolean(
    process.env.AZURE_COSMOS_ENDPOINT?.trim() &&
      process.env.AZURE_COSMOS_KEY?.trim() &&
      (process.env.AZURE_COSMOS_DATABASE || "ai_os").trim()
  );
}

export function getCosmosDatabase(): Database | null {
  if (!cosmosConfigured()) return null;
  if (cachedDb) return cachedDb;

  cachedClient = new CosmosClient({
    endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
    key: process.env.AZURE_COSMOS_KEY!,
  });
  cachedDb = cachedClient.database(process.env.AZURE_COSMOS_DATABASE || "ai_os");
  return cachedDb;
}

export function getContainer(name: string): Container | null {
  const db = getCosmosDatabase();
  if (!db) return null;
  return db.container(name);
}

export async function queryAll<T = Record<string, unknown>>(
  containerName: string,
  query: string,
  parameters: { name: string; value: string | number | boolean }[] = []
): Promise<T[]> {
  const container = getContainer(containerName);
  if (!container) return [];
  const { resources } = await container.items
    .query({ query, parameters })
    .fetchAll();
  return resources as T[];
}
