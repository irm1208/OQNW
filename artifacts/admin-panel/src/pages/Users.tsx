import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Users as UsersIcon, ShieldCheck, CheckCircle2, XCircle, Copy, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

const ROLES = ["owner", "manager", "viewer"] as const;
type Role = (typeof ROLES)[number];

type AdminUser = {
  id: number;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

type MfaStatus = {
  enabled: boolean;
  canEnroll: boolean;
  email: string | null;
};

const ROLE_STYLE: Record<Role, string> = {
  owner: "text-purple-600 border-purple-200 bg-purple-50",
  manager: "text-blue-600 border-blue-200 bg-blue-50",
  viewer: "text-slate-600 border-slate-200 bg-slate-50",
};

const BLANK = { email: "", name: "", password: "", role: "viewer" as Role };

export default function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ ...BLANK });
  const [mfaSecret, setMfaSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const { data: mfaStatus } = useQuery<MfaStatus>({
    queryKey: ["admin-mfa-status"],
    queryFn: async () => {
      const response = await fetch(api("admin/auth/mfa/status"), { credentials: "include" });
      if (!response.ok) throw new Error("Unable to load MFA status");
      return response.json() as Promise<MfaStatus>;
    },
  });

  const beginMfaSetup = useMutation({
    mutationFn: async () => {
      const response = await fetch(api("admin/auth/mfa/setup"), { method: "POST", credentials: "include" });
      const data = await response.json() as { secret?: string; otpauthUri?: string; error?: string };
      if (!response.ok || !data.secret || !data.otpauthUri) throw new Error(data.error ?? "Unable to start MFA setup");
      return { secret: data.secret, otpauthUri: data.otpauthUri };
    },
    onSuccess: (data) => {
      setMfaSecret(data.secret);
      setOtpauthUri(data.otpauthUri);
      setRecoveryCodes([]);
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const enableMfa = useMutation({
    mutationFn: async () => {
      const response = await fetch(api("admin/auth/mfa/enable"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode }),
      });
      const data = await response.json() as { recoveryCodes?: string[]; error?: string };
      if (!response.ok || !data.recoveryCodes) throw new Error(data.error ?? "Unable to enable MFA");
      return data.recoveryCodes;
    },
    onSuccess: (codes) => {
      setRecoveryCodes(codes);
      setMfaSecret(null);
      setOtpauthUri(null);
      setVerificationCode("");
      void queryClient.invalidateQueries({ queryKey: ["admin-mfa-status"] });
      toast({ title: "Two-step verification enabled" });
    },
    onError: (error: Error) => toast({ title: error.message, variant: "destructive" }),
  });

  const { data: users = [], isLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: () => fetch(api("admin/users"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<AdminUser[]>; }),
  });

  const save = useMutation({
    mutationFn: async (values: typeof form & { id?: number }) => {
      const isEdit = values.id !== undefined;
      const url = isEdit ? api(`admin/users/${values.id}`) : api("admin/users");
      const body: Record<string, unknown> = isEdit
        ? { name: values.name, role: values.role }
        : { email: values.email, name: values.name, password: values.password, role: values.role };
      if (values.password) body.password = values.password;
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(err.error ?? "Failed");
      }
    },
    onSuccess: () => {
      toast({ title: editing ? "Admin updated" : "Admin created" });
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setOpen(false);
    },
    onError: (e: Error) => toast({ title: e.message || "Save failed", variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/users/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Admin removed" });
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(api(`admin/users/${id}`), {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...BLANK });
    setOpen(true);
  }

  function openEdit(u: AdminUser) {
    setEditing(u);
    setForm({ email: u.email, name: u.name, password: "", role: u.role });
    setOpen(true);
  }

  function handleSubmit() {
    save.mutate(editing ? { ...form, id: editing.id } : form);
  }

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Users</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage admin accounts and their roles</p>
        </div>
        <div className="page-actions">
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Admin
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2"><KeyRound className="w-5 h-5 text-primary" /></div>
            <div>
              <h3 className="font-semibold">Your two-step verification</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {mfaStatus?.enabled
                  ? "Enabled. Your authenticator or a one-time recovery code is required at sign in."
                  : "Protect your individual admin account with an authenticator app."}
              </p>
            </div>
          </div>
          {mfaStatus?.enabled && <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Enabled</Badge>}
        </div>

        {mfaStatus && !mfaStatus.canEnroll && (
          <p className="text-sm text-amber-700 rounded-md bg-amber-50 border border-amber-200 p-3">
            Sign in with an individual admin email and password to enroll MFA. Shared owner access cannot hold a personal authenticator.
          </p>
        )}

        {mfaStatus?.canEnroll && !mfaStatus.enabled && !mfaSecret && (
          <Button variant="outline" onClick={() => beginMfaSetup.mutate()} disabled={beginMfaSetup.isPending}>
            {beginMfaSetup.isPending ? "Preparing…" : "Set up authenticator"}
          </Button>
        )}

        {mfaSecret && otpauthUri && (
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <p className="text-sm font-medium">1. Add this account to your authenticator app</p>
              <p className="text-xs text-muted-foreground mt-1">Use the setup key below if your app cannot open the enrollment link.</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-background border px-3 py-2 text-sm font-mono break-all">{mfaSecret}</code>
              <Button type="button" size="icon" variant="outline" onClick={() => void navigator.clipboard.writeText(mfaSecret)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
            <a href={otpauthUri} className="text-sm text-primary underline underline-offset-4">Open authenticator setup link</a>
            <div className="space-y-2">
              <label className="text-sm font-medium">2. Enter the 6-digit code to confirm</label>
              <div className="flex gap-2">
                <Input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="max-w-48 font-mono tracking-widest"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value.replace(/\D/g, ""))}
                />
                <Button onClick={() => enableMfa.mutate()} disabled={enableMfa.isPending || verificationCode.length !== 6}>
                  {enableMfa.isPending ? "Verifying…" : "Enable MFA"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {recoveryCodes.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-3">
            <div>
              <p className="font-semibold text-amber-900">Save these recovery codes now</p>
              <p className="text-sm text-amber-800">Each code works once. They will not be shown again.</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recoveryCodes.map((code) => <code key={code} className="rounded bg-white border px-3 py-2 text-center font-mono">{code}</code>)}
            </div>
            <Button variant="outline" onClick={() => void navigator.clipboard.writeText(recoveryCodes.join("\n"))}>
              <Copy className="w-4 h-4 mr-2" /> Copy all codes
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-amber-50 border-amber-200 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          The shared password only bootstraps the first admin account. Every individual admin must enroll an authenticator before their first session is created.
        </p>
      </div>

      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading…</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-muted-foreground">No admin users yet</p>
            <Button className="mt-4" onClick={openCreate}><Plus className="w-4 h-4 mr-2" /> Add First Admin</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Last Login</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={ROLE_STYLE[u.role]}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive.mutate({ id: u.id, isActive: !u.isActive })} className="flex items-center gap-1.5">
                        {u.isActive
                          ? <><CheckCircle2 className="w-4 h-4 text-green-500" /><span className="text-green-600 text-xs font-medium">Active</span></>
                          : <><XCircle className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground text-xs">Disabled</span></>}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(u)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => remove.mutate(u.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Admin" : "Add Admin"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Name</label>
              <Input placeholder="Jane Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="jane@omniqure.com" value={form.email} disabled={!!editing} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">{editing ? "New Password (leave blank to keep)" : "Password"}</label>
              <Input type="password" placeholder="At least 8 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Role</label>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={save.isPending || !form.name.trim() || (!editing && (!form.email.trim() || form.password.length < 8))}
            >
              {save.isPending ? "Saving…" : editing ? "Save Changes" : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
