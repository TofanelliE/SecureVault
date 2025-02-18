import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Shield } from "lucide-react";
import CredentialForm from "@/components/credential-form";
import CredentialList from "@/components/credential-list";
import { type Credential } from "@shared/schema";

export default function Home() {
  const [search, setSearch] = useState("");
  const [editCredential, setEditCredential] = useState<Credential | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>Local Credential Manager</CardTitle>
                <CardDescription>Securely store and manage your credentials locally</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <CredentialForm 
                editCredential={editCredential}
                onSave={() => setEditCredential(null)}
              />
            </div>
            
            <div className="mb-4">
              <Input
                placeholder="Search credentials..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <CredentialList 
              search={search}
              onEdit={setEditCredential}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
