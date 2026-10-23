import { describe, expect, it } from "vitest";
import { csvCell, leadsToCsv } from "./csv";

describe("lead CSV export", () => {
  it("escapes quotes and neutralizes spreadsheet formulas", () => {
    expect(csvCell('Ana "A" Patel')).toBe('"Ana ""A"" Patel"');
    expect(csvCell('=HYPERLINK("http://evil")')).toBe(`"'=HYPERLINK(""http://evil"")"`);
    const csv = leadsToCsv(
      [
        {
          id: 3,
          name: "=cmd",
          phone: "+919527237213",
          email: "a@example.com",
          plan: "1 Month",
          status: "New",
          message: 'He said "hi"',
          createdAt: "2026-10-23T00:00:00.000Z",
        },
      ],
      (iso) => iso,
    );
    expect(csv).toContain(`"'=cmd"`);
    expect(csv).toContain('"He said ""hi"""');
    expect(csv.startsWith("ID,Name,Phone,Email,Plan,Status,Message,Submitted At")).toBe(true);
  });
});
