import { cpSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

/** Client routes that GitHub Pages would otherwise answer with 404. */
export const PAGES_ROUTES = ["guide", "admin"] as const;

/**
 * Copy the SPA shell onto the paths the site links to.
 * GitHub Pages has no rewrite to index.html, and its 404.html fallback still returns HTTP 404.
 */
export function preparePagesSite(siteDir: string): void {
  const indexPath = path.join(siteDir, "index.html");
  cpSync(indexPath, path.join(siteDir, "404.html"));
  for (const route of PAGES_ROUTES) {
    const routeDir = path.join(siteDir, route);
    mkdirSync(routeDir, { recursive: true });
    cpSync(indexPath, path.join(routeDir, "index.html"));
  }
  writeFileSync(path.join(siteDir, ".nojekyll"), "");
}
