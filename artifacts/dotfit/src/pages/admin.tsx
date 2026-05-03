import { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search, Download, Users, Calendar, TrendingUp, Phone, Mail,
  RefreshCw, ChevronDown, ChevronUp, X, Dumbbell, MessageCircle,
  CheckCircle2, PhoneCall, Loader2, Lock,
} from "lucide-react";
import { type Contact } from "@workspace/api-client-react";

type SortKey = keyof Contact;

const STATUSES = ["New", "Contacted", "Converted"] as const;
type Status = typeof STATUSES[number];

const STATUS_STYLES: Record<Status, string> = {
  New: "bg-blue-50 text-blue-700 border border-blue-200",
  Contacted: "bg-amber-50 text-amber-700 border border-amber-200",
  Converted: "bg-green-50 text-green-700 border border-green-200",
};

const STATUS_DOTS: Record<Status, string> = {
  New: "bg-blue-500",
  Contacted: "bg-amber-500",
  Converted: "bg-green-500",
};

const ADMIN_KEY_STORAGE = "dotfit_admin_key";

function getStoredKey(): string {
  try { return localStorage.getItem(ADMIN_KEY_STORAGE) ?? ""; } catch { return ""; }
}

function storeKey(key: string) {
  try { localStorage.setItem(ADMIN_KEY_STORAGE, key); } catch { /* ignore */ }
}

function clearStoredKey() {
  try { localStorage.removeItem(ADMIN_KEY_STORAGE); } catch { /* ignore */ }
}

function buildHeaders(adminKey: string): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (adminKey) headers["Authorization"] = `Bearer ${adminKey}`;
  return headers;
}

async function apiFetch(url: string, adminKey: string, init: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...init,
    credentials: "include",
    headers: { ...buildHeaders(adminKey), ...(init.headers as Record<string, string> | undefined) },
  });
}

function resolveStatus(c: Contact, overrides: Record<number, Status>): Status {
  const override = overrides[c.id];
  if (override) return override;
  if ((STATUSES as readonly string[]).includes(c.status)) return c.status as Status;
  return "New";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function exportCSV(contacts: Contact[], overrides: Record<number, Status>) {
  const headers = ["ID", "Name", "Phone", "Email", "Plan", "Status", "Message", "Submitted At"];
  const rows = contacts.map((c) => [
    c.id,
    `"${c.name}"`,
    c.phone,
    c.email,
    `"${c.plan}"`,
    resolveStatus(c, overrides),
    `"${(c.message ?? "").replace(/"/g, '""')}"`,
    formatDate(c.createdAt),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dotfit-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const PLAN_COLORS: Record<string, string> = {
  Trial: "bg-gray-100 text-gray-600",
  "Free Trial": "bg-gray-100 text-gray-600",
  "1 Month": "bg-blue-50 text-blue-700",
  "3 Months": "bg-purple-50 text-purple-700",
  "6 Months": "bg-amber-50 text-amber-700",
  "1 Year": "bg-green-50 text-green-700",
  "Happy Hours Annual": "bg-lime-50 text-lime-700",
  "Personal Training": "bg-rose-50 text-rose-700",
  Zumba: "bg-pink-50 text-pink-700",
};

function planColor(plan: string) {
  for (const key of Object.keys(PLAN_COLORS)) {
    if (plan.toLowerCase().includes(key.toLowerCase())) return PLAN_COLORS[key];
  }
  return "bg-gray-100 text-gray-600";
}

function waLink(phone: string, name: string) {
  const msg = encodeURIComponent(`Hi ${name}! This is Dotfit Fitness. We received your enquiry and would love to help you get started. When would be a good time to visit?`);
  const clean = phone.replace(/\D/g, "");
  const num = clean.startsWith("91") ? clean : `91${clean}`;
  return `https://wa.me/${num}?text=${msg}`;
}

/* ── Password gate ────────────────────────────────────────────────────── */
function PasswordGate({ onUnlock }: { onUnlock: (key: string) => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function tryUnlock() {
    const key = input.trim();
    if (!key) { setError("Please enter the admin password."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/contacts", {
        headers: key ? { Authorization: `Bearer ${key}` } : {},
        credentials: "include",
      });
      if (res.ok) {
        storeKey(key);
        onUnlock(key);
      } else if (res.status === 401) {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Could not reach the server. Check your connection.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-100 shadow-sm w-full max-w-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-primary flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-black uppercase tracking-widest text-sm text-gray-900">Dotfit Fitness</div>
            <div className="text-gray-400 text-xs font-medium">Lead Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-bold text-gray-700">Admin Access Required</span>
        </div>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") void tryUnlock(); }}
          placeholder="Enter admin password"
          autoFocus
          className="w-full h-11 border border-gray-200 px-3 text-sm font-medium focus:outline-none focus:border-primary transition-colors mb-3"
        />
        {error && <p className="text-red-500 text-xs font-medium mb-3">{error}</p>}
        <button
          onClick={() => void tryUnlock()}
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs transition-colors disabled:opacity-50"
        >
          {loading ? "Checking…" : "Unlock Dashboard"}
        </button>
      </div>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────────────────────────── */
function Dashboard({ adminKey, onLogout }: { adminKey: string; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [statusOverrides, setStatusOverrides] = useState<Record<number, Status>>({});
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

  const { data: contacts = [], isLoading, isError, refetch, isFetching } = useQuery<Contact[]>({
    queryKey: ["contacts", adminKey],
    queryFn: async () => {
      const res = await apiFetch("/api/contacts", adminKey);
      if (res.status === 401) { onLogout(); throw new Error("Unauthorized"); }
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json() as Promise<Contact[]>;
    },
    refetchInterval: 30000,
  });

  useEffect(() => {
    setStatusOverrides({});
  }, [adminKey]);

  async function cycleStatus(c: Contact) {
    const curr = resolveStatus(c, statusOverrides);
    const idx = STATUSES.indexOf(curr);
    const next = STATUSES[(idx + 1) % STATUSES.length];
    setStatusOverrides((prev) => ({ ...prev, [c.id]: next }));
    setUpdatingIds((prev) => new Set(prev).add(c.id));
    try {
      const res = await apiFetch(`/api/contacts/${c.id}/status`, adminKey, {
        method: "PATCH",
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        const updated = await res.json() as Contact;
        queryClient.setQueryData<Contact[]>(["contacts", adminKey], (old) =>
          old ? old.map((x) => (x.id === updated.id ? updated : x)) : old
        );
        setStatusOverrides((prev) => {
          const next = { ...prev };
          delete next[c.id];
          return next;
        });
      } else {
        setStatusOverrides((prev) => ({ ...prev, [c.id]: curr }));
      }
    } catch {
      setStatusOverrides((prev) => ({ ...prev, [c.id]: curr }));
    } finally {
      setUpdatingIds((prev) => {
        const s = new Set(prev);
        s.delete(c.id);
        return s;
      });
    }
  }

  const plans = useMemo(() => {
    const set = new Set(contacts.map((c) => c.plan));
    return ["All", ...Array.from(set)];
  }, [contacts]);

  const topPlan = useMemo(() => {
    if (!contacts.length) return "—";
    const freq: Record<string, number> = {};
    contacts.forEach((c) => { freq[c.plan] = (freq[c.plan] ?? 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [contacts]);

  const convertedCount = useMemo(
    () => contacts.filter((c) => resolveStatus(c, statusOverrides) === "Converted").length,
    [contacts, statusOverrides]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts
      .filter(
        (c) =>
          (planFilter === "All" || c.plan === planFilter) &&
          (statusFilter === "All" || resolveStatus(c, statusOverrides) === statusFilter) &&
          (!q ||
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.plan.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [contacts, search, planFilter, statusFilter, sortKey, sortAsc, statusOverrides]);

  const todayCount = useMemo(
    () => contacts.filter((c) => isToday(c.createdAt)).length,
    [contacts]
  );

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(true); }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3 opacity-25" />
    );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-gray-950 text-white px-6 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary flex items-center justify-center">
            <Dumbbell className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-black uppercase tracking-widest text-sm">Dotfit Fitness</div>
            <div className="text-white/40 text-xs font-medium tracking-wide">Lead Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors hidden sm:block">
            ← Back to Website
          </a>
          <button
            onClick={() => void refetch()}
            className={`flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => exportCSV(filtered, statusOverrides)}
            disabled={!filtered.length}
            className="flex items-center gap-1.5 text-xs font-black text-white bg-primary hover:bg-primary/90 transition-colors px-4 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={onLogout}
            title="Sign out"
            className="flex items-center gap-1.5 text-xs font-bold text-white/30 hover:text-white/60 transition-colors px-2 py-1.5 border border-white/10 hover:border-white/20"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {(
            [
              { label: "Total Leads", value: contacts.length, icon: <Users className="w-5 h-5" />, color: "text-primary" },
              { label: "Today", value: todayCount, icon: <Calendar className="w-5 h-5" />, color: "text-blue-500" },
              { label: "Converted", value: convertedCount, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-500" },
              { label: "Top Plan", value: topPlan, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-500" },
            ] as { label: string; value: string | number; icon: React.ReactNode; color: string }[]
          ).map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{s.label}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className="text-2xl font-black text-gray-900 truncate">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-gray-100 p-4 mb-2 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, or plan…"
              className="w-full h-10 pl-9 pr-8 border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status + Plan filter */}
        <div className="bg-white border border-gray-100 border-t-0 px-4 pb-4 shadow-sm mb-2 flex gap-2 flex-wrap">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 self-center mr-1">Status:</span>
          {(["All", ...STATUSES] as string[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 transition-colors border ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"
              }`}
            >
              {s}
            </button>
          ))}
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 self-center mr-1 ml-4">Plan:</span>
          {plans.map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={`text-xs font-black uppercase tracking-widest px-3 py-1.5 transition-colors border ${
                planFilter === p
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 px-1">
          {STATUSES.map((s) => (
            <div key={s} className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <div className={`w-2 h-2 rounded-full ${STATUS_DOTS[s]}`} />
              {s}
            </div>
          ))}
          <span className="text-gray-300 text-xs ml-1">· Click status badge to cycle</span>
        </div>

        {/* Table / cards / empty states */}
        {isLoading ? (
          <div className="bg-white border border-gray-100 p-16 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Loading leads…</p>
          </div>
        ) : isError ? (
          <div className="bg-white border border-red-100 p-16 text-center shadow-sm">
            <p className="text-red-500 font-bold text-sm mb-2">Failed to load contacts</p>
            <button onClick={() => void refetch()} className="text-xs font-black text-primary hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 p-16 text-center shadow-sm">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">
              {contacts.length === 0 ? "No leads yet" : "No results match your filters"}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-950 text-white">
                  <tr>
                    {(["id", "name", "phone", "email", "plan"] as SortKey[]).map((col) => (
                      <th
                        key={col}
                        onClick={() => handleSort(col)}
                        className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none"
                      >
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          {col} <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Status</th>
                    <th
                      onClick={() => handleSort("createdAt")}
                      className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none"
                    >
                      <span className="flex items-center gap-1">Submitted <SortIcon col="createdAt" /></span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const status = resolveStatus(c, statusOverrides);
                    const isUpdating = updatingIds.has(c.id);
                    return (
                      <tr key={c.id} className={`border-t border-gray-50 hover:bg-[#f8fbf3] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                        <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{c.id}</td>
                        <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{c.name}</td>
                        <td className="px-4 py-3">
                          <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium whitespace-nowrap">
                            <Phone className="w-3 h-3" />{c.phone}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium truncate max-w-[160px]">
                            <Mail className="w-3 h-3 shrink-0" />{c.email}
                          </a>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-black uppercase tracking-wide px-2.5 py-1 ${planColor(c.plan)}`}>{c.plan}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => void cycleStatus(c)}
                            disabled={isUpdating}
                            title="Click to cycle: New → Contacted → Converted"
                            className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wide px-2.5 py-1 rounded-sm transition-all hover:opacity-80 ${STATUS_STYLES[status]} ${isUpdating ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                          >
                            {isUpdating
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />
                            }
                            {status}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs font-medium whitespace-nowrap" title={formatDate(c.createdAt)}>
                          <div>{timeAgo(c.createdAt)}</div>
                          <div className="text-gray-300">{formatDate(c.createdAt)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <a href={waLink(c.phone, c.name)} target="_blank" rel="noopener noreferrer" title="WhatsApp this lead"
                              className="w-8 h-8 bg-[#25D366] hover:bg-[#22c55e] flex items-center justify-center text-white transition-colors">
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                            <a href={`tel:${c.phone}`} title="Call this lead"
                              className="w-8 h-8 bg-gray-100 hover:bg-primary flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map((c) => {
                const status = resolveStatus(c, statusOverrides);
                const isUpdating = updatingIds.has(c.id);
                return (
                  <div key={c.id} className="p-4">
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <div>
                        <span className="font-bold text-gray-900">{c.name}</span>
                        <span className="text-gray-300 text-xs font-mono ml-2">#{c.id}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => void cycleStatus(c)}
                          disabled={isUpdating}
                          className={`flex items-center gap-1 text-xs font-black uppercase tracking-wide px-2 py-0.5 rounded-sm ${STATUS_STYLES[status]}`}>
                          {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <div className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status]}`} />}
                          {status}
                        </button>
                        <span className={`text-xs font-black uppercase tracking-wide px-2 py-0.5 ${planColor(c.plan)}`}>{c.plan}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 text-sm">
                      <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-gray-600 font-medium">
                        <Phone className="w-3.5 h-3.5 text-primary" />{c.phone}
                      </a>
                      <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-gray-600 font-medium truncate">
                        <Mail className="w-3.5 h-3.5 text-primary" />{c.email}
                      </a>
                      <div className="flex items-center gap-2 mt-2">
                        <a href={waLink(c.phone, c.name)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-black bg-[#25D366] text-white px-3 py-1.5 hover:bg-[#22c55e] transition-colors">
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                        <a href={`tel:${c.phone}`}
                          className="flex items-center gap-1.5 text-xs font-black bg-gray-900 text-white px-3 py-1.5 hover:bg-gray-800 transition-colors">
                          <PhoneCall className="w-3 h-3" /> Call
                        </a>
                      </div>
                      <div className="text-gray-400 text-xs mt-1">{formatDate(c.createdAt)}</div>
                      {c.message && (
                        <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="text-left">
                          <p className={`text-gray-400 text-xs mt-1 ${expandedId === c.id ? "" : "line-clamp-1"}`}>{c.message}</p>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 font-medium flex items-center justify-between">
              <span>Showing {filtered.length} of {contacts.length} leads</span>
              <span className="text-gray-300">{convertedCount} converted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Root: handles auth gate ──────────────────────────────────────────── */
export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(() => {
    const stored = getStoredKey();
    return stored || null;
  });

  function handleLogout() {
    clearStoredKey();
    setAdminKey(null);
  }

  if (!adminKey) {
    return <PasswordGate onUnlock={(key) => setAdminKey(key)} />;
  }

  return <Dashboard adminKey={adminKey} onLogout={handleLogout} />;
}
