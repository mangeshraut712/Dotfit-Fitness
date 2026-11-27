export type ContactHandoff = {
  name: string;
  phone: string;
  email: string;
  plan: string;
  message?: string | null;
};

const WHATSAPP_NUMBER = "919527237213";

/** First field error, then the API's error string. HTML and empty bodies have neither. */
export function contactApiErrorMessage(body: unknown): string | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as { error?: unknown; details?: unknown };
  if (typeof record.details === "object" && record.details !== null) {
    for (const value of Object.values(record.details as Record<string, unknown>)) {
      if (!Array.isArray(value)) continue;
      const message = value.find((item) => typeof item === "string" && item.trim().length > 0);
      if (typeof message === "string") return message;
    }
  }
  if (typeof record.error === "string" && record.error.trim().length > 0) {
    return record.error;
  }
  return null;
}

/** Prefill WhatsApp when the static site cannot store the lead. */
export function whatsappHandoffUrl(lead: ContactHandoff): string {
  const note = lead.message?.trim();
  const lines = [
    "Hi Dotfit Fitness! I'd like to book a visit.",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Plan: ${lead.plan}`,
  ];
  if (note) lines.push(`Note: ${note}`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
