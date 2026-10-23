const FORMULA_PREFIX = /^[=+\-@\t\r]/;

/** Quote a CSV field and neutralize spreadsheet formulas. */
export function csvCell(value: string | number | null | undefined): string {
  let text = value == null ? "" : String(value);
  if (FORMULA_PREFIX.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export type CsvLead = {
  id: number;
  name: string;
  phone: string;
  email: string;
  plan: string;
  status: string;
  message?: string | null;
  createdAt: string;
};

export function leadsToCsv(leads: CsvLead[], formatDate: (iso: string) => string): string {
  const headers = ["ID", "Name", "Phone", "Email", "Plan", "Status", "Message", "Submitted At"];
  const rows = leads.map((lead) =>
    [
      csvCell(lead.id),
      csvCell(lead.name),
      csvCell(lead.phone),
      csvCell(lead.email),
      csvCell(lead.plan),
      csvCell(lead.status),
      csvCell(lead.message ?? ""),
      csvCell(formatDate(lead.createdAt)),
    ].join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}
