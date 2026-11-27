import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

/** CSS `hsl(h s% l%)` to hex, matching the brand primary in index.css. */
function hslToHex(hue: number, saturation: number, lightness: number): string {
  const sat = saturation / 100;
  const light = lightness / 100;
  const chroma = (1 - Math.abs(2 * light - 1)) * sat;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - chroma / 2;
  const channels =
    hue < 60
      ? [chroma, x, 0]
      : hue < 120
        ? [x, chroma, 0]
        : hue < 180
          ? [0, chroma, x]
          : hue < 240
            ? [0, x, chroma]
            : hue < 300
              ? [x, 0, chroma]
              : [chroma, 0, x];
  const hex = channels
    .map((channel) => Math.round((channel + m) * 255).toString(16).padStart(2, "0"))
    .join("");
  return `#${hex}`;
}

describe("brand theme color", () => {
  it("uses the same green as the CSS primary, including the page glow", () => {
    const css = readFileSync(new URL("../index.css", import.meta.url), "utf8");
    const match = css.match(/--primary:\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
    expect(match).not.toBeNull();
    const hex = hslToHex(Number(match?.[1]), Number(match?.[2]), Number(match?.[3]));
    expect(hex).toBe("#5c7e20");

    const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
    expect(html).toContain(`<meta name="theme-color" content="${hex}" />`);
    expect(html).not.toContain("#6aaa14");

    const home = readFileSync(new URL("../pages/home.tsx", import.meta.url), "utf8");
    expect(home).not.toContain("rgba(125,181,32");
    expect(home).toContain("rgba(92,126,32");
  });
});
