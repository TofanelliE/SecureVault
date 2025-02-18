import { type Credential, type InsertCredential } from "@shared/schema";

const STORAGE_KEY = "credentials";

export function getCredentials(): Credential[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export async function saveCredential(credential: InsertCredential): Promise<void> {
  const credentials = getCredentials();
  const newCredential: Credential = {
    ...credential,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  credentials.push(newCredential);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export async function updateCredential(id: string, credential: InsertCredential): Promise<void> {
  const credentials = getCredentials();
  const index = credentials.findIndex((c) => c.id === id);
  
  if (index === -1) {
    throw new Error("Credential not found");
  }

  credentials[index] = {
    ...credentials[index],
    ...credential,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
}

export async function deleteCredential(id: string): Promise<void> {
  const credentials = getCredentials();
  const filtered = credentials.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}
