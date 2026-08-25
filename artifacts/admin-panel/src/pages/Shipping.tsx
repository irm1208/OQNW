import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus, Pencil, Trash2, Truck, Globe, ChevronDown, ChevronRight,
  CheckCircle2, XCircle, Search, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

function api(path: string) { return `/api/${path}`.replace(/\/+/g, "/"); }

type ShippingZone = {
  id: number;
  name: string;
  description: string | null;
  countryCodes: string[];
  isActive: boolean;
  createdAt: string;
};

type ShippingRate = {
  id: number;
  zoneId: number;
  name: string;
  carrier: string;
  priceGbp: number;
  freeAboveGbp: number | null;
  estimatedDaysMin: number;
  estimatedDaysMax: number;
  isActive: boolean;
  createdAt: string;
};

const BLANK_ZONE = { name: "", description: "" };
const BLANK_RATE = { zoneId: 0, name: "", carrier: "Royal Mail", priceGbp: "4.99", freeAboveGbp: "", estimatedDaysMin: "2", estimatedDaysMax: "5" };

const ALL_COUNTRIES: { code: string; name: string; flag: string }[] = [
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "AL", name: "Albania", flag: "🇦🇱" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "AD", name: "Andorra", flag: "🇦🇩" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "AM", name: "Armenia", flag: "🇦🇲" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "AZ", name: "Azerbaijan", flag: "🇦🇿" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "BY", name: "Belarus", flag: "🇧🇾" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "BA", name: "Bosnia and Herzegovina", flag: "🇧🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "BN", name: "Brunei", flag: "🇧🇳" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "CD", name: "Congo (DRC)", flag: "🇨🇩" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "GQ", name: "Equatorial Guinea", flag: "🇬🇶" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "SZ", name: "Eswatini", flag: "🇸🇿" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GE", name: "Georgia", flag: "🇬🇪" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "IS", name: "Iceland", flag: "🇮🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "IL", name: "Israel", flag: "🇮🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "KP", name: "North Korea", flag: "🇰🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "LS", name: "Lesotho", flag: "🇱🇸" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MO", name: "Macao", flag: "🇲🇴" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "MD", name: "Moldova", flag: "🇲🇩" },
  { code: "MC", name: "Monaco", flag: "🇲🇨" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "ME", name: "Montenegro", flag: "🇲🇪" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "NR", name: "Nauru", flag: "🇳🇷" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "MK", name: "North Macedonia", flag: "🇲🇰" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "PS", name: "Palestine", flag: "🇵🇸" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "RU", name: "Russia", flag: "🇷🇺" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "KN", name: "Saint Kitts and Nevis", flag: "🇰🇳" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "SM", name: "San Marino", flag: "🇸🇲" },
  { code: "ST", name: "Sao Tome and Principe", flag: "🇸🇹" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "RS", name: "Serbia", flag: "🇷🇸" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "TW", name: "Taiwan", flag: "🇹🇼" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "TR", name: "Turkey", flag: "🇹🇷" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "UA", name: "Ukraine", flag: "🇺🇦" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
];

const CODE_TO_COUNTRY = new Map(ALL_COUNTRIES.map(c => [c.code, c]));

const PRESET_ZONES: { name: string; description: string; codes: string[] }[] = [
  {
    name: "United Kingdom",
    description: "Great Britain and Northern Ireland",
    codes: ["GB"],
  },
  {
    name: "European Union",
    description: "All 27 EU member states",
    codes: ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE"],
  },
  {
    name: "Europe (Broad)",
    description: "EU + Norway, Switzerland, Iceland, UK",
    codes: ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","NO","CH","IS","GB"],
  },
  {
    name: "North America",
    description: "United States and Canada",
    codes: ["US","CA"],
  },
  {
    name: "Asia Pacific",
    description: "Australia, New Zealand, Japan, South Korea, Singapore, Hong Kong, Taiwan",
    codes: ["AU","NZ","JP","KR","SG","HK","TW"],
  },
  {
    name: "Southeast Asia",
    description: "ASEAN countries",
    codes: ["SG","MY","TH","ID","PH","VN","KH","LA","MM","BN"],
  },
  {
    name: "Middle East",
    description: "Gulf states and broader MENA",
    codes: ["AE","SA","QA","KW","BH","OM","JO","IL","LB","EG"],
  },
  {
    name: "Rest of World",
    description: "Worldwide (catch-all for unspecified regions)",
    codes: [],
  },
];

function countryInfo(code: string) {
  return CODE_TO_COUNTRY.get(code.toUpperCase()) ?? { code, name: code, flag: "🌍" };
}

function CountryPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (codes: string[]) => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) : ALL_COUNTRIES;
  }, [search]);

  function toggle(code: string) {
    if (selected.includes(code)) {
      onChange(selected.filter(c => c !== code));
    } else {
      onChange([...selected, code]);
    }
  }

  function addPreset(codes: string[]) {
    const merged = Array.from(new Set([...selected, ...codes]));
    onChange(merged);
  }

  return (
    <div className="space-y-3">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 rounded-md border bg-muted/30">
          {selected.map(code => {
            const c = countryInfo(code);
            return (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-background border text-xs"
              >
                <span>{c.flag}</span>
                <span>{c.code}</span>
                <button
                  type="button"
                  onClick={() => onChange(selected.filter(s => s !== code))}
                  className="text-muted-foreground hover:text-foreground ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      <div className="space-y-1.5">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Quick Add Region</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_ZONES.filter(p => p.codes.length > 0).map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => addPreset(p.codes)}
              className="inline-flex items-center px-2 py-0.5 rounded-full border text-xs hover:bg-muted transition-colors"
            >
              + {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Search countries…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8 h-8 text-sm"
        />
      </div>

      <div className="h-48 overflow-y-auto rounded-md border bg-background text-sm">
        {filtered.map(c => {
          const checked = selected.includes(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => toggle(c.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-muted/50 ${checked ? "bg-primary/5" : ""}`}
            >
              <span className="shrink-0">{c.flag}</span>
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-muted-foreground text-xs shrink-0">{c.code}</span>
              {checked && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-6 text-xs">No countries match</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">{selected.length} {selected.length === 1 ? "country" : "countries"} selected</p>
    </div>
  );
}

export default function Shipping() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedZones, setExpandedZones] = useState<Set<number>>(new Set());

  const [zoneOpen, setZoneOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneForm, setZoneForm] = useState({ ...BLANK_ZONE });
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const [rateOpen, setRateOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [rateForm, setRateForm] = useState({ ...BLANK_RATE });

  const [presetOpen, setPresetOpen] = useState(false);

  const { data: zones = [], isLoading: zonesLoading } = useQuery<ShippingZone[]>({
    queryKey: ["shipping-zones"],
    queryFn: () => fetch(api("admin/shipping/zones"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<ShippingZone[]>; }),
  });

  const { data: rates = [] } = useQuery<ShippingRate[]>({
    queryKey: ["shipping-rates"],
    queryFn: () => fetch(api("admin/shipping/rates"), { credentials: "include" }).then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json()as Promise<ShippingRate[]>; }),
  });

  const saveZone = useMutation({
    mutationFn: async (v: typeof zoneForm & { id?: number; codes: string[] }) => {
      const url = v.id ? api(`admin/shipping/zones/${v.id}`) : api("admin/shipping/zones");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: v.name, description: v.description || null, countryCodes: v.codes }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editingZone ? "Zone updated" : "Zone created" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] });
      setZoneOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const toggleZoneActive = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      const res = await fetch(api(`admin/shipping/zones/${id}`), {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] }),
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const deleteZone = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/shipping/zones/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Zone deleted" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const saveRate = useMutation({
    mutationFn: async (v: typeof rateForm & { id?: number }) => {
      const url = v.id ? api(`admin/shipping/rates/${v.id}`) : api("admin/shipping/rates");
      const res = await fetch(url, {
        method: v.id ? "PATCH" : "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          zoneId: Number(v.zoneId),
          name: v.name,
          carrier: v.carrier,
          priceGbp: parseFloat(v.priceGbp) || 0,
          freeAboveGbp: v.freeAboveGbp ? parseFloat(v.freeAboveGbp) : null,
          estimatedDaysMin: parseInt(v.estimatedDaysMin) || 2,
          estimatedDaysMax: parseInt(v.estimatedDaysMax) || 5,
        }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: editingRate ? "Rate updated" : "Rate created" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
      setRateOpen(false);
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const deleteRate = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(api(`admin/shipping/rates/${id}`), { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      toast({ title: "Rate deleted" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  const createPresetZones = useMutation({
    mutationFn: async (presets: typeof PRESET_ZONES) => {
      for (const p of presets) {
        await fetch(api("admin/shipping/zones"), {
          method: "POST", credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: p.name, description: p.description, countryCodes: p.codes }),
        });
      }
    },
    onSuccess: () => {
      toast({ title: "Preset zones created" });
      void queryClient.invalidateQueries({ queryKey: ["shipping-zones"] });
      setPresetOpen(false);
    },
    onError: () => toast({ title: "Failed to create presets", variant: "destructive" }),
  });

  function toggleZoneExpanded(id: number) {
    setExpandedZones(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function openCreateZone() {
    setEditingZone(null);
    setZoneForm({ ...BLANK_ZONE });
    setSelectedCodes([]);
    setZoneOpen(true);
  }

  function openEditZone(z: ShippingZone) {
    setEditingZone(z);
    setZoneForm({ name: z.name, description: z.description ?? "" });
    setSelectedCodes([...z.countryCodes]);
    setZoneOpen(true);
  }

  function openCreateRate(zoneId?: number) {
    setEditingRate(null);
    setRateForm({ ...BLANK_RATE, zoneId: zoneId ?? (zones[0]?.id ?? 0) });
    setRateOpen(true);
  }

  function openEditRate(r: ShippingRate) {
    setEditingRate(r);
    setRateForm({
      zoneId: r.zoneId, name: r.name, carrier: r.carrier,
      priceGbp: String(r.priceGbp), freeAboveGbp: r.freeAboveGbp != null ? String(r.freeAboveGbp) : "",
      estimatedDaysMin: String(r.estimatedDaysMin), estimatedDaysMax: String(r.estimatedDaysMax),
    });
    setRateOpen(true);
  }

  const totalCountries = new Set(zones.flatMap(z => z.countryCodes)).size;
  const activeZones = zones.filter(z => z.isActive).length;

  return (
    <div className="admin-page space-y-6">
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shipping</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage zones and delivery rates by region</p>
        </div>
        <div className="page-actions flex gap-2">
          {zones.length === 0 && (
            <Button variant="outline" onClick={() => setPresetOpen(true)}>
              <Globe className="w-4 h-4 mr-2" /> Use Presets
            </Button>
          )}
          <Button variant="outline" onClick={() => openCreateRate()}>
            <Plus className="w-4 h-4 mr-2" /> Add Rate
          </Button>
          <Button onClick={openCreateZone}>
            <Plus className="w-4 h-4 mr-2" /> Add Zone
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Zones</p>
          <p className="text-3xl font-bold">{zones.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{activeZones}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Shipping Methods</p>
          <p className="text-3xl font-bold">{rates.length}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Countries Covered</p>
          <p className="text-3xl font-bold">{totalCountries}</p>
        </div>
      </div>

      {zonesLoading ? (
        <div className="p-12 text-center text-muted-foreground rounded-xl border bg-card">Loading…</div>
      ) : zones.length === 0 ? (
        <div className="p-12 text-center rounded-xl border bg-card">
          <Truck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-muted-foreground mb-4">No shipping zones configured</p>
            <div className="page-actions flex gap-2 justify-center">
            <Button variant="outline" onClick={() => setPresetOpen(true)}>
              <Globe className="w-4 h-4 mr-2" /> Use Presets
            </Button>
            <Button onClick={openCreateZone}>
              <Plus className="w-4 h-4 mr-2" /> Create Zone
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {zones.map(zone => {
            const zoneRates = rates.filter(r => r.zoneId === zone.id);
            const expanded = expandedZones.has(zone.id);
            return (
              <div key={zone.id} className={`rounded-xl border bg-card transition-opacity ${!zone.isActive ? "opacity-60" : ""}`}>
                <div
                   className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4 cursor-pointer hover:bg-muted/30"
                  onClick={() => toggleZoneExpanded(zone.id)}
                >
                  {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                   <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{zone.name}</p>
                      {!zone.isActive && (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Disabled</Badge>
                      )}
                    </div>
                    {zone.description && <p className="text-xs text-muted-foreground">{zone.description}</p>}
                  </div>

                   <div className="flex flex-wrap gap-1 w-full sm:w-auto sm:max-w-[280px] justify-start sm:justify-end">
                    {zone.countryCodes.slice(0, 8).map(cc => {
                      const c = countryInfo(cc);
                      return (
                        <span key={cc} title={c.name} className="inline-flex items-center gap-1 px-1.5 py-0 rounded border text-xs bg-background">
                          <span>{c.flag}</span>
                          <span className="text-muted-foreground">{cc}</span>
                        </span>
                      );
                    })}
                    {zone.countryCodes.length > 8 && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0">+{zone.countryCodes.length - 8}</Badge>
                    )}
                    {zone.countryCodes.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">No countries</span>
                    )}
                  </div>

                   <div className="flex flex-wrap items-center gap-1 shrink-0 self-end sm:self-auto sm:ml-2" onClick={e => e.stopPropagation()}>
                    <Switch
                      checked={zone.isActive}
                      onCheckedChange={(v) => toggleZoneActive.mutate({ id: zone.id, isActive: v })}
                      className="scale-90"
                    />
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => openCreateRate(zone.id)}>
                      <Plus className="w-3 h-3 mr-1" /> Rate
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEditZone(zone)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteZone.mutate(zone.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {expanded && (
                  <div className="border-t">
                    {zone.countryCodes.length > 0 && (
                      <div className="px-5 py-3 border-b bg-muted/20 flex flex-wrap gap-1">
                        {zone.countryCodes.map(cc => {
                          const c = countryInfo(cc);
                          return (
                            <span key={cc} title={c.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs bg-background">
                              <span>{c.flag}</span>
                              <span>{c.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {zoneRates.length === 0 ? (
                      <p className="text-sm text-muted-foreground px-5 py-4">
                        No rates for this zone.{" "}
                        <button className="underline text-primary" onClick={() => openCreateRate(zone.id)}>Add one</button>
                      </p>
                    ) : (
                       <div className="overflow-x-auto">
                       <table className="w-full min-w-[620px] text-sm">
                        <thead>
                          <tr className="border-b bg-muted/20">
                            <th className="text-left px-5 py-2.5 font-medium text-muted-foreground">Method</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Carrier</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Price</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Free Above</th>
                            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Lead Time</th>
                            <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {zoneRates.map(r => (
                            <tr key={r.id} className="border-b last:border-0 hover:bg-muted/20">
                              <td className="px-5 py-3 font-medium">{r.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.carrier}</td>
                              <td className="px-4 py-3 font-mono">${r.priceGbp.toFixed(2)}</td>
                              <td className="px-4 py-3">{r.freeAboveGbp != null ? `$${r.freeAboveGbp.toFixed(2)}+` : <span className="text-muted-foreground">—</span>}</td>
                              <td className="px-4 py-3 text-muted-foreground">{r.estimatedDaysMin}–{r.estimatedDaysMax} days</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => openEditRate(r)}>
                                    <Pencil className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => deleteRate.mutate(r.id)}>
                                    <Trash2 className="w-3.5 h-3.5" />
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
                )}
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={zoneOpen} onOpenChange={v => { setZoneOpen(v); }}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingZone ? "Edit Zone" : "Create Shipping Zone"}</DialogTitle>
            <DialogDescription>
              Set the zone name, optional description, and the countries it covers.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Zone Name</label>
                <Input placeholder="e.g. European Union" value={zoneForm.name} onChange={e => setZoneForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Description (optional)</label>
                <Input placeholder="Brief description" value={zoneForm.description} onChange={e => setZoneForm(f => ({ ...f, description: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Countries</label>
              <CountryPicker selected={selectedCodes} onChange={setSelectedCodes} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setZoneOpen(false)}>Cancel</Button>
            <Button
              onClick={() => saveZone.mutate(editingZone ? { ...zoneForm, id: editingZone.id, codes: selectedCodes } : { ...zoneForm, codes: selectedCodes })}
              disabled={saveZone.isPending || !zoneForm.name}
            >
              {saveZone.isPending ? "Saving…" : editingZone ? "Save Changes" : "Create Zone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rateOpen} onOpenChange={setRateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRate ? "Edit Shipping Rate" : "Add Shipping Rate"}</DialogTitle>
            <DialogDescription>
              Configure the delivery method, pricing, and estimated delivery time.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Zone</label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={rateForm.zoneId}
                onChange={e => setRateForm(f => ({ ...f, zoneId: parseInt(e.target.value) }))}
              >
                {zones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Method Name</label>
                <Input placeholder="Standard Delivery" value={rateForm.name} onChange={e => setRateForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Carrier</label>
                <Input placeholder="Royal Mail" value={rateForm.carrier} onChange={e => setRateForm(f => ({ ...f, carrier: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Price ($)</label>
                <Input type="number" min={0} step={0.01} value={rateForm.priceGbp} onChange={e => setRateForm(f => ({ ...f, priceGbp: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Free Above ($)</label>
                <Input type="number" min={0} step={0.01} placeholder="e.g. 50 or leave blank" value={rateForm.freeAboveGbp} onChange={e => setRateForm(f => ({ ...f, freeAboveGbp: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Min Days</label>
                <Input type="number" min={1} value={rateForm.estimatedDaysMin} onChange={e => setRateForm(f => ({ ...f, estimatedDaysMin: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Max Days</label>
                <Input type="number" min={1} value={rateForm.estimatedDaysMax} onChange={e => setRateForm(f => ({ ...f, estimatedDaysMax: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRateOpen(false)}>Cancel</Button>
            <Button onClick={() => saveRate.mutate(editingRate ? { ...rateForm, id: editingRate.id } : rateForm)} disabled={saveRate.isPending || !rateForm.name}>
              {saveRate.isPending ? "Saving…" : editingRate ? "Save Changes" : "Add Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={presetOpen} onOpenChange={setPresetOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" /> Preset Shipping Zones
            </DialogTitle>
            <DialogDescription>
              Choose the regions to create before adding their delivery rates.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2 space-y-3">
            <p className="text-sm text-muted-foreground">
              Select which regions to create zones for. You can add rates to each zone afterwards.
            </p>
            <div className="space-y-2">
              {PRESET_ZONES.map(p => (
                <div key={p.name} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                    {p.codes.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">{p.codes.length} countries</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPresetOpen(false)}>Cancel</Button>
            <Button
              onClick={() => createPresetZones.mutate(PRESET_ZONES)}
              disabled={createPresetZones.isPending}
            >
              {createPresetZones.isPending ? "Creating…" : `Create All ${PRESET_ZONES.length} Zones`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
