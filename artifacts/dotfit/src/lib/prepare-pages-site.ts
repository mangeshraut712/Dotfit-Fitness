import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { GUIDE_CANONICAL, HOME_CANONICAL } from "./page-meta.ts";

/** Client routes that GitHub Pages would otherwise answer with 404. */
export const PAGES_ROUTES = ["guide", "admin"] as const;

const ROUTE_CANONICAL: Partial<Record<(typeof PAGES_ROUTES)[number], string>> = {
  guide: GUIDE_CANONICAL,
};

/**
 * The guide is its own search result. A copied homepage canonical would fold it into `/`.
 *
 * Only the page-level signals move. The HealthClub JSON-LD `url` is the gym's official
 * site, not the URL of the page it is embedded in, so it deliberately keeps `HOME_CANONICAL`.
 */
function shellForRoute(html: string, route: (typeof PAGES_ROUTES)[number]): string {
  const canonical = ROUTE_CANONICAL[route];
  if (!canonical) return html;
  return html
    .replaceAll(
      `<link rel="canonical" href="${HOME_CANONICAL}" />`,
      `<link rel="canonical" href="${canonical}" />`,
    )
    .replaceAll(
      `<meta property="og:url" content="${HOME_CANONICAL}" />`,
      `<meta property="og:url" content="${canonical}" />`,
    );
}

/**
 * Copy the SPA shell onto the paths the site links to.
 * GitHub Pages has no rewrite to index.html, and its 404.html fallback still returns HTTP 404.
 */
export function preparePagesSite(siteDir: string): void {
  const indexPath = path.join(siteDir, "index.html");
  const html = readFileSync(indexPath, "utf8");
  cpSync(indexPath, path.join(siteDir, "404.html"));
  for (const route of PAGES_ROUTES) {
    const routeDir = path.join(siteDir, route);
    mkdirSync(routeDir, { recursive: true });
    writeFileSync(path.join(routeDir, "index.html"), shellForRoute(html, route));
  }
  writeFileSync(path.join(siteDir, ".nojekyll"), "");
}
