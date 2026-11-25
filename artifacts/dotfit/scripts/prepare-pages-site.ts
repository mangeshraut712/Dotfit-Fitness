import { preparePagesSite } from "../src/lib/prepare-pages-site.ts";

const siteDir = process.argv[2];
if (!siteDir) {
  console.error("Usage: prepare-pages-site.ts <site-dir>");
  process.exit(1);
}

preparePagesSite(siteDir);
