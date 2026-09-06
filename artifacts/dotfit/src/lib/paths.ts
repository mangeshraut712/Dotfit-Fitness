/** Vite `base` (always ends with `/`). */
export const BASE_URL = import.meta.env.BASE_URL;

/** Public file under `artifacts/dotfit/public`, honoring GitHub Pages project base. */
export function assetUrl(path: string): string {
  return `${BASE_URL}${path.replace(/^\//, "")}`;
}

/** In-app path that includes the project base (e.g. `/Dotfit-Fitness/` or `/`). */
export function pageUrl(path: string): string {
  const base = BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}` || "/";
}
