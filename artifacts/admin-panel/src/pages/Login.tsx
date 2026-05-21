import { useState, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { useAdminMe } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, ShieldAlert, AlertTriangle } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

export default function Login() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const [isPending, setIsPending] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: session, isLoading: checkingSession } = useAdminMe();

  const isLocked = lockedUntil !== null && countdown > 0;

  useEffect(() => {
    if (!lockedUntil) return;
    function tick() {
      const remaining = Math.max(0, Math.ceil((lockedUntil! - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttemptsRemaining(null);
        setErrorMsg(null);
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lockedUntil]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!password || isPending || isLocked) return;
      setIsPending(true);
      setErrorMsg(null);

      try {
        const res = await fetch(`${BASE}/api/admin/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        const data = await res.json() as {
          authenticated?: boolean;
          error?: string;
          attemptsRemaining?: number;
          lockedUntil?: number;
          retryAfterSeconds?: number;
        };

        if (res.ok && data.authenticated) {
          setLocation("/dashboard");
          return;
        }

        if (res.status === 429 && data.lockedUntil) {
          setLockedUntil(data.lockedUntil);
          setAttemptsRemaining(0);
          setPassword("");
          return;
        }

        if (res.status === 401) {
          setErrorMsg("Incorrect password");
          setAttemptsRemaining(data.attemptsRemaining ?? null);
          setPassword("");
        }
      } catch {
        setErrorMsg("Connection error — please try again");
      } finally {
        setIsPending(false);
      }
    },
    [password, isPending, isLocked, setLocation],
  );

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

  const attemptWarning =
    attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${isLocked ? "bg-red-100" : "bg-primary/10"}`}>
            {isLocked
              ? <ShieldAlert className="w-6 h-6 text-red-600" />
              : <Lock className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">OmniQure Ops</CardTitle>
          <CardDescription>
            {isLocked
              ? "Access temporarily suspended"
              : "Enter your master password to access the admin console"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLocked ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-red-700">Too many failed attempts</p>
              <p className="text-xs text-red-600">Try again in</p>
              <p className="text-3xl font-mono font-bold text-red-700 tabular-nums">
                {formatCountdown(countdown)}
              </p>
              <p className="text-xs text-red-500">
                Access will resume automatically
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  className={`h-11 ${errorMsg ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                />

                {errorMsg && (
                  <div className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm ${attemptWarning ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p>{errorMsg}</p>
                      {attemptsRemaining !== null && (
                        <p className="text-xs mt-0.5 font-medium">
                          {attemptsRemaining === 1
                            ? "1 attempt remaining before lockout"
                            : `${attemptsRemaining} attempts remaining before lockout`}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={isPending || !password}
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Authenticate
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
