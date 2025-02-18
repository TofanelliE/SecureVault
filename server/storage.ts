import { credentials, type Credential, type InsertCredential } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import crypto from 'crypto';

import { users, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getCredentials(): Promise<Credential[]>;
  saveCredential(credential: InsertCredential): Promise<void>;
  updateCredential(id: string, credential: InsertCredential): Promise<void>;
  deleteCredential(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    throw new Error("Method not implemented.");
  }
  async createUser(user: InsertUser): Promise<User> {
    throw new Error("Method not implemented.");
  }
  async getCredentials(): Promise<Credential[]> {
    return await db.select().from(credentials).orderBy(credentials.createdAt);
  }

  async saveCredential(credential: InsertCredential): Promise<void> {
    await db.insert(credentials).values({
      ...credential,
      id: crypto.randomUUID(),
    });
  }

  async updateCredential(id: string, credential: InsertCredential): Promise<void> {
    await db
      .update(credentials)
      .set(credential)
      .where(eq(credentials.id, id));
  }

  async deleteCredential(id: string): Promise<void> {
    await db.delete(credentials).where(eq(credentials.id, id));
  }
}

export const storage = new DatabaseStorage();