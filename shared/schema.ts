import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const credentials = pgTable("credentials", {
  id: varchar("id").primaryKey(),
  url: text("url").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export type Credential = typeof credentials.$inferSelect;
export const insertCredentialSchema = createInsertSchema(credentials, {
  url: z.string().url("Please enter a valid URL"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
}).omit({ id: true, createdAt: true });

export type InsertCredential = z.infer<typeof insertCredentialSchema>;