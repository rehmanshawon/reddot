import { beforeEach, describe, expect, it, vi } from "vitest";
import { defaultContent } from "../src/data/seedContent.js";

const mocks = vi.hoisted(() => {
  const pool = {
    query: vi.fn(),
    connect: vi.fn(),
    end: vi.fn(),
  };

  return {
    pool,
    Pool: vi.fn(() => pool),
    connection: {
      query: vi.fn(),
      release: vi.fn(),
    },
  };
});

vi.mock("pg", () => ({
  default: { Pool: mocks.Pool },
}));

const {
  ensureDatabase,
  isPublicSection,
  readContent,
  resetContent,
  updateContentSection,
} = await import("./db.js");

describe("database content persistence", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recognizes public content sections", () => {
    expect(isPublicSection("site")).toBe(true);
    expect(isPublicSection("private")).toBe(false);
  });

  it("creates the content table and seeds missing sections", async () => {
    mocks.pool.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValue({});

    await ensureDatabase();

    expect(mocks.pool.query).toHaveBeenCalledTimes(10);
    expect(mocks.pool.query.mock.calls[0][0]).toContain(
      "CREATE TABLE IF NOT EXISTS site_content",
    );
    expect(mocks.pool.query.mock.calls[2]).toEqual([
      expect.stringContaining("INSERT INTO site_content"),
      ["site", JSON.stringify(defaultContent.site)],
    ]);
  });

  it("reads stored sections and falls back to defaults for missing rows", async () => {
    mocks.pool.query.mockResolvedValueOnce({
      rows: [
        {
          section_name: "site",
          content_json: JSON.stringify({ heroTag: "Stored" }),
        },
      ],
    });

    const content = await readContent();

    expect(content.site).toEqual({ heroTag: "Stored" });
    expect(content.about).toEqual(defaultContent.about);
  });

  it("updates a section and returns the refreshed content", async () => {
    const storedContent = { site: { heroTag: "Updated" } };
    mocks.pool.query.mockResolvedValueOnce({}).mockResolvedValueOnce({
      rows: [
        {
          section_name: "site",
          content_json: JSON.stringify(storedContent.site),
        },
      ],
    });

    const content = await updateContentSection("site", storedContent.site);

    expect(mocks.pool.query.mock.calls[0]).toEqual([
      expect.stringContaining("ON CONFLICT (section_name)"),
      ["site", JSON.stringify(storedContent.site)],
    ]);
    expect(content.site).toEqual(storedContent.site);
  });

  it("resets all sections in a transaction", async () => {
    mocks.pool.connect.mockResolvedValueOnce(mocks.connection);
    mocks.connection.query.mockResolvedValue({});
    mocks.pool.query.mockResolvedValueOnce({ rows: [] });

    const content = await resetContent();

    expect(mocks.connection.query).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(mocks.connection.query).toHaveBeenNthCalledWith(
      2,
      "DELETE FROM site_content",
    );
    expect(mocks.connection.query).toHaveBeenLastCalledWith("COMMIT");
    expect(mocks.connection.query).toHaveBeenCalledTimes(11);
    expect(mocks.connection.release).toHaveBeenCalledOnce();
    expect(Object.keys(content)).toHaveLength(8);
    expect(content.site).toEqual(defaultContent.site);
    expect(content.about).toEqual(defaultContent.about);
    expect(content.leadership).toEqual(defaultContent.leadership);
    expect(content.team).toEqual(defaultContent.team);
  });
});
