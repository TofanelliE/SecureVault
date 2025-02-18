import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCredentialSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/credentials", async (_req, res) => {
    const credentials = await storage.getCredentials();
    res.json(credentials);
  });

  app.post("/api/credentials", async (req, res) => {
    try {
      const credential = insertCredentialSchema.parse(req.body);
      await storage.saveCredential(credential);
      res.status(201).json({ message: "Credential saved successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save credential" });
      }
    }
  });

  app.put("/api/credentials/:id", async (req, res) => {
    try {
      const credential = insertCredentialSchema.parse(req.body);
      await storage.updateCredential(req.params.id, credential);
      res.json({ message: "Credential updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update credential" });
      }
    }
  });

  app.delete("/api/credentials/:id", async (req, res) => {
    try {
      await storage.deleteCredential(req.params.id);
      res.json({ message: "Credential deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete credential" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}