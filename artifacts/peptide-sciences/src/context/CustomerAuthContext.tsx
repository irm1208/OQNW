import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

export type CustomerUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

type CustomerAuthContextType = {
  customer: CustomerUser | null;
  loadingAuth: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    institution?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
};

const CustomerAuthContext = createContext<CustomerAuthContextType | null>(null);

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    fetch(apiUrl("auth/me"), { credentials: "include" })
      .then((r) => (r.ok ? (r.json() as Promise<CustomerUser>) : null))
      .then((data) => setCustomer(data ?? null))
      .catch(() => setCustomer(null))
      .finally(() => setLoadingAuth(false));
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch(apiUrl("auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = (await res.json()) as CustomerUser & { error?: string };
    if (!res.ok) throw new Error(data.error ?? "Sign in failed");
    setCustomer({ id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName });
  }, []);

  const register = useCallback(
    async (form: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      institution?: string;
    }) => {
      const res = await fetch(apiUrl("auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as CustomerUser & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Registration failed");
      setCustomer({ id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName });
    },
    []
  );

  const signOut = useCallback(async () => {
    await fetch(apiUrl("auth/logout"), { method: "POST", credentials: "include" });
    setCustomer(null);
  }, []);

  return (
    <CustomerAuthContext.Provider value={{ customer, loadingAuth, signIn, register, signOut }}>
      {children}
    </CustomerAuthContext.Provider>
  );
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return ctx;
}
