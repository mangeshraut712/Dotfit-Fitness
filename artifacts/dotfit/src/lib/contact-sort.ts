export type SortableLead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  plan: string;
  message?: string | null;
  status: string;
  createdAt: string;
};

export function compareLeads<T extends SortableLead>(
  a: T,
  b: T,
  key: keyof T,
  ascending: boolean,
): number {
  const direction = ascending ? 1 : -1;
  if (key === "id") {
    return (Number(a.id) - Number(b.id)) * direction;
  }
  if (key === "createdAt") {
    return (new Date(String(a.createdAt)).getTime() - new Date(String(b.createdAt)).getTime()) * direction;
  }
  const left = String(a[key] ?? "").toLowerCase();
  const right = String(b[key] ?? "").toLowerCase();
  return left.localeCompare(right) * direction;
}
