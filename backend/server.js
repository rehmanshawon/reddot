import { createHmac, timingSafeEqual } from "node:crypto";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formidable } from "formidable";
import {
  closeDatabase,
  ensureDatabase,
  isPublicSection,
  readContent,
  resetContent,
  updateContentSection,
} from "./db.js";
import { demoAdmin } from "../src/data/seedContent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3001);
const API_ORIGIN = process.env.API_ORIGIN || "http://localhost:5173";
const AUTH_SECRET = process.env.AUTH_SECRET || "reddot-dev-secret-change-me";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || demoAdmin.email;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || demoAdmin.password;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 12;
const UPLOAD_DIR = path.join(__dirname, "..", "public", "uploads");

function json(res, statusCode, payload, origin) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Origin": origin,
    "Content-Length": Buffer.byteLength(body),
    "Content-Type": "application/json; charset=utf-8",
    Vary: "Origin",
  });
  res.end(body);
}

function getAllowedOrigin(req) {
  const requestOrigin = req.headers.origin;
  if (!requestOrigin) {
    return "*";
  }

  if (requestOrigin === API_ORIGIN) {
    return requestOrigin;
  }

  return API_ORIGIN;
}

function sign(payload) {
  return createHmac("sha256", AUTH_SECRET).update(payload).digest("base64url");
}

function createToken(email) {
  const payload = Buffer.from(
    JSON.stringify({
      email,
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  ).toString("base64url");
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) {
    return null;
  }

  const [payload, signature] = token.split(".");
  const expected = sign(payload);

  try {
    const validSignature = timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expected),
    );
    if (!validSignature) {
      return null;
    }

    const parsed = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );
    if (
      !parsed.exp ||
      parsed.exp < Date.now() ||
      parsed.email !== ADMIN_EMAIL
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Invalid JSON body.");
  }
}

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length);
}

function requireAuth(req) {
  const token = getBearerToken(req);
  return verifyToken(token);
}

function getSectionName(url) {
  const prefix = "/api/content/";
  if (!url.startsWith(prefix)) {
    return null;
  }

  return decodeURIComponent(url.slice(prefix.length));
}

function notFound(res, origin) {
  json(res, 404, { error: "Not found." }, origin);
}

function unauthorized(res, origin) {
  json(res, 401, { error: "Unauthorized." }, origin);
}

async function handler(req, res) {
  const origin = getAllowedOrigin(req);
  const url = req.url || "/";

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
    });
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && url === "/api/health") {
      json(res, 200, { ok: true }, origin);
      return;
    }

    if (req.method === "POST" && url === "/api/auth/login") {
      const body = await readJsonBody(req);
      const email = String(body.email || "").trim();
      const password = String(body.password || "");

      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        json(res, 401, { error: "Invalid email or password." }, origin);
        return;
      }

      json(
        res,
        200,
        {
          token: createToken(email),
          user: { email },
        },
        origin,
      );
      return;
    }

    if (req.method === "GET" && url === "/api/auth/me") {
      const session = requireAuth(req);
      if (!session) {
        unauthorized(res, origin);
        return;
      }

      json(res, 200, { user: { email: session.email } }, origin);
      return;
    }

    if (req.method === "GET" && url === "/api/content") {
      const content = await readContent();
      json(res, 200, { content }, origin);
      return;
    }

    if (req.method === "POST" && url === "/api/content/reset") {
      const session = requireAuth(req);
      if (!session) {
        unauthorized(res, origin);
        return;
      }

      const content = await resetContent();
      json(res, 200, { content }, origin);
      return;
    }

    if (req.method === "POST" && url === "/api/upload") {
      const session = requireAuth(req);
      if (!session) {
        unauthorized(res, origin);
        return;
      }

      try {
        const form = formidable({
          uploadDir: UPLOAD_DIR,
          keepExtensions: true,
          maxFileSize: 10 * 1024 * 1024, // 10MB limit
        });

        const [fields, files] = await form.parse(req);
        const fileArray = files.file || files.image || files.upload;
        const uploadedFile = Array.isArray(fileArray)
          ? fileArray[0]
          : fileArray;

        if (!uploadedFile) {
          json(res, 400, { error: "No file provided." }, origin);
          return;
        }

        const filename = path.basename(uploadedFile.filepath);
        json(res, 200, { url: `/uploads/${filename}` }, origin);
      } catch (err) {
        json(res, 500, { error: "File upload failed." }, origin);
      }
      return;
    }

    if (req.method === "PUT" && url.startsWith("/api/content/")) {
      const session = requireAuth(req);
      if (!session) {
        unauthorized(res, origin);
        return;
      }

      const section = getSectionName(url);
      if (!section || !isPublicSection(section)) {
        notFound(res, origin);
        return;
      }

      const body = await readJsonBody(req);
      if (!Object.prototype.hasOwnProperty.call(body, "value")) {
        json(res, 400, { error: "Missing section value." }, origin);
        return;
      }

      const content = await updateContentSection(section, body.value);
      json(res, 200, { content }, origin);
      return;
    }

    notFound(res, origin);
  } catch (error) {
    json(
      res,
      500,
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error.",
      },
      origin,
    );
  }
}

await ensureDatabase();
await fs.mkdir(UPLOAD_DIR, { recursive: true });

const server = http.createServer(handler);

process.on("SIGINT", async () => {
  await closeDatabase();
  server.close(() => process.exit(0));
});

process.on("SIGTERM", async () => {
  await closeDatabase();
  server.close(() => process.exit(0));
});

server.listen(PORT, () => {
  console.log(`Red Dot API listening on http://localhost:${PORT}`);
});
