export interface VectorDbConfig {
  enabled: boolean;
  model: string;
  dimension: number;
  totalIndexed: number;
  lastUpdated: string;
}

let inMemoryConfig: VectorDbConfig = {
  enabled: true,
  model: "text-embedding-004",
  dimension: 768,
  totalIndexed: 4868,
  lastUpdated: new Date().toISOString()
};

let inMemoryVectorStore: any[] = [];

export function getVectorDbConfig(): VectorDbConfig {
  return inMemoryConfig;
}

export function saveVectorDbConfig(cfg: Partial<VectorDbConfig>): VectorDbConfig {
  inMemoryConfig = { ...inMemoryConfig, ...cfg, lastUpdated: new Date().toISOString() };
  return inMemoryConfig;
}

export function getAllVectorItems(): any[] {
  return inMemoryVectorStore;
}

export function saveVectorItemsBatch(items: any[]): void {
  inMemoryVectorStore = [...inMemoryVectorStore, ...items];
  inMemoryConfig.totalIndexed = inMemoryVectorStore.length;
}

export function searchVectorDatabase(query: string, topK: number = 5): any[] {
  return inMemoryVectorStore.slice(0, topK);
}

export function executeVectorDbRollback(): { success: boolean; message: string } {
  inMemoryVectorStore = [];
  inMemoryConfig.totalIndexed = 0;
  return { success: true, message: "Vector DB rollback completed" };
}

export function restoreVectorDbMode(enabled: boolean): VectorDbConfig {
  inMemoryConfig.enabled = enabled;
  return inMemoryConfig;
}
