import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search, Download, Users, Calendar, TrendingUp, Phone, Mail,
  RefreshCw, ChevronDown, ChevronUp, X, Dumbbell,
} from "lucide-react";

interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  plan: string;
  message: string | null;
  createdAt: string;
}

type SortKey = keyof Contact;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
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
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function isToday(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

function exportCSV(contacts: Contact[]) {
  const headers = ["ID", "Name", "Phone", "Email", "Plan", "Message", "Submitted At"];
  const rows = contacts.map(c => [
    c.id,
    `"${c.name}"`,
    c.phone,
    c.email,
    `"${c.plan}"`,
    `"${(c.message ?? "").replace(/"/g, '""')}"`,
    formatDate(c.createdAt),
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dotfit-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const PLAN_COLORS: Record<string, string> = {
  "Trial": "bg-gray-100 text-gray-600",
  "1 Month": "bg-blue-50 text-blue-700",
  "3 Months": "bg-purple-50 text-purple-700",
  "6 Months": "bg-amber-50 text-amber-700",
  "1 Year": "bg-green-50 text-green-700",
  "Happy Hours Annual": "bg-lime-50 text-lime-700",
};

function planColor(plan: string) {
  for (const key of Object.keys(PLAN_COLORS)) {
    if (plan.toLowerCase().includes(key.toLowerCase())) return PLAN_COLORS[key];
  }
  return "bg-gray-100 text-gray-600";
}

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: contacts = [], isLoading, isError, refetch, isFetching } = useQuery<Contact[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const plans = useMemo(() => {
    const set = new Set(contacts.map(c => c.plan));
    return ["All", ...Array.from(set)];
  }, [contacts]);

  const topPlan = useMemo(() => {
    if (!contacts.length) return "—";
    const freq: Record<string, number> = {};
    contacts.forEach(c => { freq[c.plan] = (freq[c.plan] ?? 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contacts
      .filter(c =>
        (planFilter === "All" || c.plan === planFilter) &&
        (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q) ||
          c.email.toLowerCase().includes(q) || c.plan.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        const av = String(a[sortKey] ?? "");
        const bv = String(b[sortKey] ?? "");
        return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
      });
  }, [contacts, search, planFilter, sortKey, sortAsc]);

  const todayCount = useMemo(() => contacts.filter(c => isToday(c.createdAt)).length, [contacts]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(true); }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
      : <ChevronDown className="w-3 h-3 opacity-25" />;

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
            <div className="text-white/40 text-xs font-medium tracking-wide">Lead Management</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => refetch()}
            className={`flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors px-3 py-1.5 border border-white/10 hover:border-white/30 ${isFetching ? "opacity-50 pointer-events-none" : ""}`}>
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button onClick={() => exportCSV(filtered)} disabled={!filtered.length}
            className="flex items-center gap-1.5 text-xs font-black text-white bg-primary hover:bg-primary/90 transition-colors px-4 py-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: contacts.length, icon: <Users className="w-5 h-5" />, color: "text-primary" },
            { label: "Today", value: todayCount, icon: <Calendar className="w-5 h-5" />, color: "text-blue-500" },
            { label: "Showing", value: filtered.length, icon: <Search className="w-5 h-5" />, color: "text-amber-500" },
            { label: "Top Plan", value: topPlan, icon: <TrendingUp className="w-5 h-5" />, color: "text-purple-500" },
          ].map((s) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-gray-400">{s.label}</span>
                <span className={s.color}>{s.icon}</span>
              </div>
              <div className="text-2xl font-black text-gray-900 truncate">{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 p-4 mb-4 shadow-sm flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, phone, email, or plan…"
              className="w-full h-10 pl-9 pr-8 border border-gray-200 text-sm font-medium focus:outline-none focus:border-primary transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {plans.map(p => (
              <button key={p} onClick={() => setPlanFilter(p)}
                className={`text-xs font-black uppercase tracking-widest px-3 py-2 transition-colors border ${planFilter === p ? "bg-primary text-white border-primary" : "bg-white text-gray-500 border-gray-200 hover:border-primary hover:text-primary"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white border border-gray-100 p-16 text-center shadow-sm">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">Loading leads…</p>
          </div>
        ) : isError ? (
          <div className="bg-white border border-red-100 p-16 text-center shadow-sm">
            <p className="text-red-500 font-bold text-sm mb-2">Failed to load contacts</p>
            <button onClick={() => refetch()} className="text-xs font-black text-primary hover:underline">Try again</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 p-16 text-center shadow-sm">
            <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">{contacts.length === 0 ? "No leads yet" : "No results match your filters"}</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-950 text-white">
                  <tr>
                    {(["id","name","phone","email","plan","createdAt"] as SortKey[]).map(col => (
                      <th key={col} onClick={() => handleSort(col)}
                        className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest cursor-pointer hover:bg-white/5 transition-colors select-none">
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          {col === "createdAt" ? "Submitted" : col}
                          <SortIcon col={col} />
                        </span>
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-xs font-black uppercase tracking-widest">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <tr key={c.id} className={`border-t border-gray-50 hover:bg-[#f8fbf3] transition-colors ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{c.id}</td>
                      <td className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap">{c.name}</td>
                      <td className="px-4 py-3">
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium whitespace-nowrap">
                          <Phone className="w-3 h-3" />{c.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-gray-600 hover:text-primary transition-colors font-medium truncate max-w-[180px]">
                          <Mail className="w-3 h-3 shrink-0" />{c.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-black uppercase tracking-wide px-2.5 py-1 ${planColor(c.plan)}`}>{c.plan}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-medium whitespace-nowrap" title={formatDate(c.createdAt)}>
                        {timeAgo(c.createdAt)}
                        <div className="text-gray-300">{formatDate(c.createdAt)}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs max-w-[200px] truncate">{c.message ?? <span className="text-gray-200">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filtered.map(c => (
                <div key={c.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-gray-900">{c.name}</span>
                      <span className="text-gray-300 text-xs font-mono ml-2">#{c.id}</span>
                    </div>
                    <span className={`text-xs font-black uppercase tracking-wide px-2 py-0.5 ${planColor(c.plan)}`}>{c.plan}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm">
                    <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-gray-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-primary" />{c.phone}
                    </a>
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-gray-600 font-medium truncate">
                      <Mail className="w-3.5 h-3.5 text-primary" />{c.email}
                    </a>
                    <div className="text-gray-400 text-xs mt-1">{formatDate(c.createdAt)}</div>
                    {c.message && (
                      <button onClick={() => setExpandedId(expandedId === c.id ? null : c.id)} className="text-left">
                        <p className={`text-gray-400 text-xs mt-1 ${expandedId === c.id ? "" : "line-clamp-1"}`}>{c.message}</p>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 font-medium">
              Showing {filtered.length} of {contacts.length} leads
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
