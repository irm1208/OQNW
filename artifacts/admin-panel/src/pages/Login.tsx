import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, useAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const login = useAdminLogin();
  const { data: session, isLoading: checkingSession } = useAdminMe();

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (session?.authenticated) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    login.mutate(
      { data: { password } },
      {
        onSuccess: () => {
          toast.success("Login successful");
          setLocation("/dashboard");
        },
        onError: () => {
          toast.error("Invalid password");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">OmniQure Ops</CardTitle>
          <CardDescription>Enter your master password to access the admin console</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11" disabled={login.isPending || !password}>
              {login.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Authenticate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
