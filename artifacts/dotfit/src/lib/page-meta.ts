export type PageMeta = {
  title: string;
  description?: string;
  robots?: string;
};

function setMeta(name: string, content: string): void {
  let element = document.querySelector(`meta[name="${name}"]`);
  if (!(element instanceof HTMLMetaElement)) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function applyPageMeta(meta: PageMeta): void {
  if (typeof document === "undefined") return;
  document.title = meta.title;
  if (meta.description) setMeta("description", meta.description);
  if (meta.robots) setMeta("robots", meta.robots);
}

export const HOME_PAGE_META: PageMeta = {
  title: "Dotfit Fitness | Best Gym in Baner, Pune | Stay Fit With Dotfit",
  description:
    "Dotfit Fitness — Baner's premier K11-certified gym since 2012. 25,000+ happy members, expert coaches, Zumba, Yoga, Kickboxing, personal training & nutrition counseling. Book a free trial today.",
  robots: "index, follow",
};

export const GUIDE_PAGE_META: PageMeta = {
  title: "Fitness Progression Guide | Dotfit Fitness Baner, Pune",
  description:
    "Five-level fitness progression guide from Dotfit Fitness in Baner, Pune. Foundational movement through advanced split training, written by K11-certified coaches.",
  robots: "index, follow",
};

export const ADMIN_PAGE_META: PageMeta = {
  title: "Lead Dashboard | Dotfit Fitness",
  description: "Private lead dashboard for Dotfit Fitness staff.",
  robots: "noindex, nofollow",
};

export const NOT_FOUND_PAGE_META: PageMeta = {
  title: "Page Not Found | Dotfit Fitness",
  description: "This page is not part of the Dotfit Fitness website.",
  robots: "noindex, follow",
};
