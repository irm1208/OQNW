import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { getAdminMeQueryKey, useAdminMe } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Copy, KeyRound, Loader2, Lock, ShieldAlert, ShieldCheck } from "lucide-react";

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
}

type LoginResponse = {
  authenticated?: boolean;
  error?: string;
  attemptsRemaining?: number;
  lockedUntil?: number;
  mfaRequired?: boolean;
  enrollmentRequired?: boolean;
  challengeToken?: string;
  secret?: string;
  otpauthUri?: string;
  recoveryCodes?: string[];
};

export default function Login() {
  const params = new URLSearchParams(window.location.search);
  const isReauthentication = params.get("reauth") === "1";
  const requestedReturnTo = params.get("returnTo");
  const returnTo = requestedReturnTo?.startsWith("/") && !requestedReturnTo.startsWith("//")
    ? requestedReturnTo
    : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState("");
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [enrollmentSecret, setEnrollmentSecret] = useState<string | null>(null);
  const [enrollmentUri, setEnrollmentUri] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { data: session, isLoading: checkingSession } = useAdminMe();
  const isLocked = lockedUntil !== null && countdown > 0;
  const developmentLoginAttempted = useRef(false);

  useEffect(() => {
    if (
      !import.meta.env.DEV ||
      checkingSession ||
      session?.authenticated ||
      isReauthentication ||
      developmentLoginAttempted.current
    ) {
      return;
    }

    developmentLoginAttempted.current = true;
    setIsPending(true);
    setErrorMsg(null);
    void fetch("/api/admin/auth/development-login", {
      method: "POST",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({})) as LoginResponse;
          throw new Error(data.error || "Development access is unavailable");
        }
        await queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation(returnTo);
      })
      .catch((error: unknown) => {
        setErrorMsg(error instanceof Error ? error.message : "Development access is unavailable");
      })
      .finally(() => setIsPending(false));
  }, [
    checkingSession,
    session?.authenticated,
    isReauthentication,
    queryClient,
    setLocation,
    returnTo,
  ]);

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

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password || isPending || isLocked || (challengeToken && !mfaCode)) return;
    setIsPending(true);
    setErrorMsg(null);
    try {
      const body: Record<string, string> = { password };
      if (email.trim()) body.email = email.trim();
      if (challengeToken) {
        body.challengeToken = challengeToken;
        body[useRecoveryCode ? "recoveryCode" : "mfaCode"] = mfaCode.trim();
      }
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as LoginResponse;
      if (res.ok && data.enrollmentRequired && data.challengeToken && data.secret && data.otpauthUri) {
        setChallengeToken(data.challengeToken);
        setEnrollmentSecret(data.secret);
        setEnrollmentUri(data.otpauthUri);
        setMfaCode("");
        setErrorMsg(null);
        return;
      }
      if (res.ok && data.mfaRequired && data.challengeToken) {
        setChallengeToken(data.challengeToken);
        setEnrollmentSecret(null);
        setEnrollmentUri(null);
        setMfaCode("");
        setErrorMsg(null);
        return;
      }
      if (res.ok && data.authenticated) {
        if (data.recoveryCodes?.length) {
          setRecoveryCodes(data.recoveryCodes);
          setChallengeToken(null);
          setEnrollmentSecret(null);
          setEnrollmentUri(null);
          return;
        }
        await queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation(returnTo);
        return;
      }
      if (res.status === 429 && data.lockedUntil) {
        setLockedUntil(data.lockedUntil);
        setAttemptsRemaining(0);
        setPassword("");
        setMfaCode("");
        setChallengeToken(null);
        return;
      }
      setErrorMsg(challengeToken ? "That security code was not accepted" : "Email or password was not accepted");
      setAttemptsRemaining(data.attemptsRemaining ?? null);
      setMfaCode("");
      if (!challengeToken) setPassword("");
    } catch {
      setErrorMsg("Connection error — please try again");
    } finally {
      setIsPending(false);
    }
  }, [password, email, challengeToken, mfaCode, useRecoveryCode, isPending, isLocked, queryClient, setLocation, returnTo]);

  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }
  if (session?.authenticated && recoveryCodes.length === 0 && !isReauthentication) {
    setLocation("/dashboard");
    return null;
  }

  const attemptWarning = attemptsRemaining !== null && attemptsRemaining <= 2 && attemptsRemaining > 0;
  const isMfaStep = Boolean(challengeToken);
  const isEnrollmentStep = Boolean(enrollmentSecret && enrollmentUri);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <img
            src={`${import.meta.env.BASE_URL}omniqure-wordmark.png?v=5`}
            alt="OmniQure"
            className="mx-auto mb-3 h-[34px] w-[220px] max-w-full object-cover object-center"
          />
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${isLocked ? "bg-red-100" : "bg-primary/10"}`}>
            {isLocked ? <ShieldAlert className="w-6 h-6 text-red-600" /> : recoveryCodes.length > 0 ? <ShieldCheck className="w-6 h-6 text-primary" /> : isMfaStep ? <KeyRound className="w-6 h-6 text-primary" /> : <Lock className="w-6 h-6 text-primary" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Console</CardTitle>
          <CardDescription>
            {isLocked ? "Access temporarily suspended" : recoveryCodes.length > 0 ? "Two-step verification is active" : isEnrollmentStep ? "Set up required two-step verification" : isMfaStep ? "Complete two-step verification" : isReauthentication ? "Confirm your identity to continue" : "Sign in to the admin console"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recoveryCodes.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
                <div>
                  <p className="font-semibold text-amber-900">Save these recovery codes now</p>
                  <p className="text-sm text-amber-800">Each code works once. They will not be shown again.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {recoveryCodes.map((code) => <code key={code} className="rounded bg-white border px-3 py-2 text-center font-mono">{code}</code>)}
                </div>
                <Button variant="outline" className="w-full" onClick={() => void navigator.clipboard.writeText(recoveryCodes.join("\n"))}>
                  <Copy className="w-4 h-4 mr-2" /> Copy all codes
                </Button>
              </div>
              <Button className="w-full" onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
                setLocation("/dashboard");
              }}>Continue to admin console</Button>
            </div>
          ) : isLocked ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center space-y-2">
              <p className="text-sm font-semibold text-red-700">Too many failed attempts</p>
              <p className="text-xs text-red-600">Try again in</p>
              <p className="text-3xl font-mono font-bold text-red-700 tabular-nums">{formatCountdown(countdown)}</p>
              <p className="text-xs text-red-500">This lockout is shared across all API instances.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {isMfaStep ? (
                <>
                  {isEnrollmentStep && (
                    <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                      <p className="text-sm font-medium">Add this account to your authenticator app before continuing.</p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded bg-background border px-3 py-2 text-xs font-mono break-all">{enrollmentSecret}</code>
                        <Button type="button" size="icon" variant="outline" onClick={() => void navigator.clipboard.writeText(enrollmentSecret!)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <a href={enrollmentUri!} className="text-sm text-primary underline underline-offset-4">Open authenticator setup link</a>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{useRecoveryCode ? "Recovery code" : isEnrollmentStep ? "Code from your authenticator" : "Authenticator code"}</label>
                    <Input
                      inputMode={useRecoveryCode ? "text" : "numeric"}
                      autoComplete="one-time-code"
                      placeholder={useRecoveryCode ? "10-character recovery code" : "6-digit code"}
                      maxLength={useRecoveryCode ? 10 : 6}
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      autoFocus
                      className="h-11 font-mono tracking-widest"
                    />
                  </div>
                  {!isEnrollmentStep && (
                    <Button type="button" variant="link" className="h-auto p-0 text-xs" onClick={() => { setUseRecoveryCode((value) => !value); setMfaCode(""); }}>
                      {useRecoveryCode ? "Use authenticator app instead" : "Use a recovery code"}
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                      <label className="text-sm font-medium">Email <span className="text-muted-foreground font-normal">(blank for initial owner or MFA recovery)</span></label>
                      <Input type="email" autoComplete="username" placeholder="owner@omniqure.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" autoFocus />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <Input type="password" autoComplete="current-password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11" />
                  </div>
                </>
              )}
              {errorMsg && (
                <div className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm ${attemptWarning ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p>{errorMsg}</p>
                    {attemptsRemaining !== null && <p className="text-xs mt-0.5 font-medium">{attemptsRemaining} attempt{attemptsRemaining === 1 ? "" : "s"} remaining before lockout</p>}
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full h-11" disabled={isPending || !password || (isMfaStep && !mfaCode.trim())}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isEnrollmentStep ? "Enable MFA and sign in" : isMfaStep ? "Verify and sign in" : "Continue"}
              </Button>
              {isMfaStep && (
                <Button type="button" variant="ghost" className="w-full" onClick={() => { setChallengeToken(null); setEnrollmentSecret(null); setEnrollmentUri(null); setMfaCode(""); setPassword(""); setUseRecoveryCode(false); setErrorMsg(null); }}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to sign in
                </Button>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}