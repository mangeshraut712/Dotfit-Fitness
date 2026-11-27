import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { GUIDE_CANONICAL, HOME_CANONICAL, SITE_ORIGIN } from "./page-meta";
import { preparePagesSite } from "./prepare-pages-site";

const LIVE = SITE_ORIGIN;

describe("published URLs", () => {
  it("points metadata and the sitemap at the live GitHub Pages site", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain(`<link rel="canonical" href="${LIVE}/" />`);
    expect(html).toContain(`content="${LIVE}/opengraph.jpg"`);
    expect(html).toContain(`"logo": "${LIVE}/logo-icon.png"`);
    expect(html).not.toContain("https://dotfitfitness.in");

    const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
    expect(sitemap).toContain(`<loc>${LIVE}/</loc>`);
    expect(sitemap).toContain(`<loc>${GUIDE_CANONICAL}</loc>`);
    expect(sitemap).not.toContain("dotfitfitness.in");

    const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
    expect(robots).toContain(`Sitemap: ${LIVE}/sitemap.xml`);
  });

  it("publishes guide and admin as real 200 routes", () => {
    const siteDir = mkdtempSync(path.join(tmpdir(), "dotfit-pages-"));
    writeFileSync(
      path.join(siteDir, "index.html"),
      [
        "<!doctype html><title>Dotfit</title>",
        `<link rel="canonical" href="${HOME_CANONICAL}" />`,
        `<meta property="og:url" content="${HOME_CANONICAL}" />`,
        `<script type="application/ld+json">{ "url": "${HOME_CANONICAL}" }</script>`,
      ].join(""),
    );
    preparePagesSite(siteDir);

    const fallback = readFileSync(path.join(siteDir, "404.html"), "utf8");
    expect(fallback).toContain(`href="${HOME_CANONICAL}"`);
    expect(fallback).not.toContain(GUIDE_CANONICAL);

    const guide = readFileSync(path.join(siteDir, "guide", "index.html"), "utf8");
    expect(guide).toContain(`<link rel="canonical" href="${GUIDE_CANONICAL}" />`);
    expect(guide).toContain(`<meta property="og:url" content="${GUIDE_CANONICAL}" />`);
    // Only the page-level signals move to the guide. The HealthClub JSON-LD "url" is the
    // gym's official site, so it must keep pointing at the homepage.
    expect(guide).toContain(`"url": "${HOME_CANONICAL}"`);
    expect(guide).not.toContain(`"url": "${GUIDE_CANONICAL}"`);
    expect(guide).not.toContain(`href="${HOME_CANONICAL}"`);
    // Exactly two guide URLs: the canonical link and og:url. A third means a blanket
    // string replace leaked into structured data.
    expect(guide.match(new RegExp(`${GUIDE_CANONICAL.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&")}`, "g")))
      .toHaveLength(2);

    const admin = readFileSync(path.join(siteDir, "admin", "index.html"), "utf8");
    expect(admin).toContain(`href="${HOME_CANONICAL}"`);
    expect(readFileSync(path.join(siteDir, ".nojekyll"), "utf8")).toBe("");
  });
});
