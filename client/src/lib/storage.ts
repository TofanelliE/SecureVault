import { type Credential, type InsertCredential } from "@shared/schema";
import { apiRequest } from "./queryClient";

export async function getCredentials(): Promise<Credential[]> {
  const res = await fetch("/api/credentials", {
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch credentials");
  return res.json();
}

export async function saveCredential(credential: InsertCredential): Promise<void> {
  await apiRequest("POST", "/api/credentials", credential);
}

export async function updateCredential(id: string, credential: InsertCredential): Promise<void> {
  await apiRequest("PUT", `/api/credentials/${id}`, credential);
}

export async function deleteCredential(id: string): Promise<void> {
  await apiRequest("DELETE", `/api/credentials/${id}`);
}