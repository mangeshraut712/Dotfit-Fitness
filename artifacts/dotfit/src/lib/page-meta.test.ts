// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { applyPageMeta, GUIDE_PAGE_META } from "./page-meta";

describe("applyPageMeta", () => {
  it("sets the document title and description for the guide", () => {
    applyPageMeta(GUIDE_PAGE_META);
    expect(document.title).toBe(GUIDE_PAGE_META.title);
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      GUIDE_PAGE_META.description,
    );
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe("index, follow");
  });
});
