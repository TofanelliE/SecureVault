import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCredentialSchema, type InsertCredential, type Credential } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Save } from "lucide-react";
import { useState } from "react";
import { saveCredential, updateCredential } from "@/lib/storage";

interface CredentialFormProps {
  editCredential: Credential | null;
  onSave: () => void;
}

export default function CredentialForm({ editCredential, onSave }: CredentialFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertCredential>({
    resolver: zodResolver(insertCredentialSchema),
    defaultValues: editCredential ?? {
      url: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: InsertCredential) {
    try {
      if (editCredential) {
        await updateCredential(editCredential.id, data);
        toast({ title: "Credential updated successfully" });
      } else {
        await saveCredential(data);
        toast({ title: "Credential saved successfully" });
      }
      form.reset({ url: "", username: "", password: "" });
      onSave();
    } catch (error) {
      toast({
        title: "Error saving credential",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <Save className="mr-2 h-4 w-4" />
          {editCredential ? "Update" : "Save"} Credential
        </Button>
      </form>
    </Form>
  );
}
