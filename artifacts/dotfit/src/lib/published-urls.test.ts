import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { preparePagesSite } from "./prepare-pages-site";

const LIVE = "https://mangeshraut712.github.io/Dotfit-Fitness";

describe("published URLs", () => {
  it("points metadata and the sitemap at the live GitHub Pages site", () => {
    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain(`<link rel="canonical" href="${LIVE}/" />`);
    expect(html).toContain(`content="${LIVE}/opengraph.jpg"`);
    expect(html).toContain(`"logo": "${LIVE}/logo-icon.png"`);
    expect(html).not.toContain("https://dotfitfitness.in");

    const sitemap = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
    expect(sitemap).toContain(`<loc>${LIVE}/</loc>`);
    expect(sitemap).toContain(`<loc>${LIVE}/guide</loc>`);
    expect(sitemap).not.toContain("dotfitfitness.in");

    const robots = readFileSync(new URL("../../public/robots.txt", import.meta.url), "utf8");
    expect(robots).toContain(`Sitemap: ${LIVE}/sitemap.xml`);
  });

  it("publishes guide and admin as real 200 routes", () => {
    const siteDir = mkdtempSync(path.join(tmpdir(), "dotfit-pages-"));
    writeFileSync(path.join(siteDir, "index.html"), "<!doctype html><title>Dotfit</title>");
    preparePagesSite(siteDir);
    expect(readFileSync(path.join(siteDir, "404.html"), "utf8")).toContain("Dotfit");
    expect(readFileSync(path.join(siteDir, "guide", "index.html"), "utf8")).toContain("Dotfit");
    expect(readFileSync(path.join(siteDir, "admin", "index.html"), "utf8")).toContain("Dotfit");
    expect(readFileSync(path.join(siteDir, ".nojekyll"), "utf8")).toBe("");
  });
});
