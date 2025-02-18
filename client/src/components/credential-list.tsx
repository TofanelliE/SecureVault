import { type Credential } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Edit2, ExternalLink, Trash2, Eye, EyeOff, ChevronDown, ChevronRight } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteCredential } from "@/lib/storage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface CredentialListProps {
  search: string;
  onEdit: (credential: Credential) => void;
}

export default function CredentialList({ search, onEdit }: CredentialListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Uncategorized']));

  const { data: credentials = [], isLoading } = useQuery({
    queryKey: ['/api/credentials'],
    retry: false
  });

  const filteredCredentials = credentials.filter(
    (cred) =>
      cred.url.toLowerCase().includes(search.toLowerCase()) ||
      cred.username.toLowerCase().includes(search.toLowerCase())
  );

  const groupedCredentials = filteredCredentials.reduce((groups, cred) => {
    const category = cred.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(cred);
    return groups;
  }, {} as Record<string, Credential[]>);

  function toggleCategory(category: string) {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  }

  async function handleDelete(id: string) {
    try {
      await deleteCredential(id);
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      toast({ title: "Credential deleted successfully" });
    } catch (error) {
      toast({
        title: "Error deleting credential",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }

  function togglePasswordVisibility(id: string) {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }

  function handleAutoConnect(credential: Credential) {
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

  if (isLoading) {
    return <div className="text-center">Loading credentials...</div>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedCredentials).map(([category, categoryCredentials]) => (
        <Collapsible
          key={category}
          open={expandedCategories.has(category)}
          onOpenChange={() => toggleCategory(category)}
        >
          <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-accent rounded-lg">
            {expandedCategories.has(category) ? (
              <ChevronDown className="h-4 w-4 mr-2" />
            ) : (
              <ChevronRight className="h-4 w-4 mr-2" />
            )}
            <span className="font-medium">{category}</span>
            <span className="ml-2 text-muted-foreground">({categoryCredentials.length})</span>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-2 space-y-2">
            {categoryCredentials.map((credential) => (
              <Card key={credential.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{new URL(credential.url).hostname}</h3>
                    <p className="text-sm text-muted-foreground">{credential.username}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Password: {visiblePasswords.has(credential.id) ? credential.password : '••••••••'}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-2"
                        onClick={() => togglePasswordVisibility(credential.id)}
                      >
                        {visiblePasswords.has(credential.id) ?
                          <EyeOff className="h-3 w-3" /> :
                          <Eye className="h-3 w-3" />
                        }
                      </Button>
                    </p>
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
          </CollapsibleContent>
        </Collapsible>
      ))}

      {filteredCredentials.length === 0 && (
        <p className="text-center text-muted-foreground">
          {search ? "No credentials match your search" : "No credentials saved yet"}
        </p>
      )}
    </div>
  );
}