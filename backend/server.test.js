import http from "node:http";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkDatabaseHealth: vi.fn(),
  readContent: vi.fn(),
  resetContent: vi.fn(),
  updateContentSection: vi.fn(),
}));

vi.mock("./db.js", () => ({
  checkDatabaseHealth: mocks.checkDatabaseHealth,
  closeDatabase: vi.fn(),
  ensureDatabase: vi.fn(),
  isPublicSection: (section) => section === "site",
  readContent: mocks.readContent,
  resetContent: mocks.resetContent,
  updateContentSection: mocks.updateContentSection,
}));

process.env.AUTH_SECRET = "test-secret";
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "correct-password";
process.env.DB_PASSWORD = "test-database-password";

const { createServer } = await import("./server.js");

function request(server, path, { method = "GET", headers, body } = {}) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const request = http.request(
      {
        host: "127.0.0.1",
        port: address.port,
        path,
        method,
        headers,
      },
      (response) => {
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () =>
          resolve({
            statusCode: response.statusCode,
            body: JSON.parse(Buffer.concat(chunks).toString("utf8")),
          }),
        );
      },
    );
    request.on("error", reject);
    request.end(body);
  });
}

describe("Red Dot API", () => {
  let server;

  beforeEach(async () => {
    vi.clearAllMocks();
    server = createServer();
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it("rejects invalid login credentials", async () => {
    const response = await request(server, "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", password: "wrong" }),
    });

    expect(response).toMatchObject({
      statusCode: 401,
      body: { error: "Invalid email or password." },
    });
  });

  it("requires authentication before resetting content", async () => {
    const response = await request(server, "/api/content/reset", {
      method: "POST",
    });

    expect(response.statusCode).toBe(401);
    expect(mocks.resetContent).not.toHaveBeenCalled();
  });

  it("rejects malformed authenticated content updates", async () => {
    const login = await request(server, "/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "correct-password",
      }),
    });
    const response = await request(server, "/api/content/site", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${login.body.token}`,
        "Content-Type": "application/json",
      },
      body: "not-json",
    });

    expect(response).toMatchObject({
      statusCode: 400,
      body: { error: "Invalid JSON body." },
    });
    expect(mocks.updateContentSection).not.toHaveBeenCalled();
  });

  it("reports database connectivity from the health endpoint", async () => {
    const response = await request(server, "/api/health");

    expect(response).toEqual({
      statusCode: 200,
      body: { ok: true, database: "connected" },
    });
    expect(mocks.checkDatabaseHealth).toHaveBeenCalledOnce();
  });
});
