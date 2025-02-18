import { useState } from "react";
import { type Credential } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit2, ExternalLink, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteCredential, getCredentials } from "@/lib/storage";

interface CredentialListProps {
  search: string;
  onEdit: (credential: Credential) => void;
}

export default function CredentialList({ search, onEdit }: CredentialListProps) {
  const [credentials, setCredentials] = useState<Credential[]>(() => getCredentials());
  const { toast } = useToast();

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.url.toLowerCase().includes(search.toLowerCase()) ||
      cred.username.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    try {
      await deleteCredential(id);
      setCredentials(getCredentials());
      toast({ title: "Credential deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting credential",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }

  function handleAutoConnect(credential: Credential) {
    // Create a temporary form and submit it
    const form = document.createElement("form");
    form.method = "POST";
    form.action = credential.url;
    form.target = "_blank";

    const usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.name = "username";
    usernameInput.value = credential.username;

    const passwordInput = document.createElement("input");
    passwordInput.type = "password";
    passwordInput.name = "password";
    passwordInput.value = credential.password;

    form.appendChild(usernameInput);
    form.appendChild(passwordInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }

  return (
    <div className="space-y-4">
      {filteredCredentials.map((credential) => (
        <Card key={credential.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex-1">
              <h3 className="font-medium">{new URL(credential.url).hostname}</h3>
              <p className="text-sm text-muted-foreground">{credential.username}</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleAutoConnect(credential)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(credential)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Credential</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this credential? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(credential.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredCredentials.length === 0 && (
        <p className="text-center text-muted-foreground">
          {search ? "No credentials match your search" : "No credentials saved yet"}
        </p>
      )}
    </div>
  );
}
