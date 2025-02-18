import { z } from "zod";

export const credentialSchema = z.object({
  id: z.string(),
  url: z.string().url("Please enter a valid URL"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  createdAt: z.number(),
});

export type Credential = z.infer<typeof credentialSchema>;

export const insertCredentialSchema = credentialSchema.omit({ id: true, createdAt: true });
export type InsertCredential = z.infer<typeof insertCredentialSchema>;
