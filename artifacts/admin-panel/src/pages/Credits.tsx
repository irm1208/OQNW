import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface CreditRow {
  customerId: number;
  balancePence: number;
  updatedAt: string;
  firstName: string;
  lastName: string;
  email: string;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
function api(path: string) { return `${BASE}/api/${path}`.replace(/\/+/g, "/"); }

export default function Credits() {
  const [search, setSearch] = useState("");

  const { data: rows, isLoading } = useQuery<CreditRow[]>({
    queryKey: ["admin-credits"],
    queryFn: () => customFetch<CreditRow[]>(api("admin/credits")),
    staleTime: 30_000,
  });

  const fmt = (pence: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(pence / 100);

  const filtered = (Array.isArray(rows) ? rows : []).filter((r) => {
    const q = search.toLowerCase();
    return (
      !q ||
      r.firstName.toLowerCase().includes(q) ||
      r.lastName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  });

  const totalPence = (Array.isArray(rows) ? rows : []).reduce((s, r) => s + r.balancePence, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Customer Credits</h2>
        <Card className="sm:min-w-48">
          <CardContent className="flex items-center gap-3 p-4">
            <CreditCard className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Issued</p>
              <p className="font-bold text-lg leading-tight">{fmt(totalPence)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No credit balances found</p>
          ) : (
            <div className="divide-y">
              {filtered.map((row) => (
                <Link key={row.customerId} href={`/customers/${row.customerId}`}>
                  <div className="flex items-center justify-between px-6 py-4 hover:bg-muted/40 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">{row.firstName} {row.lastName}</p>
                      <p className="text-xs text-muted-foreground">{row.email}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${row.balancePence > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                        {fmt(row.balancePence)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        updated {new Date(row.updatedAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
