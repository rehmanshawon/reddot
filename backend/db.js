import pg from "pg";
import { defaultContent } from "../src/data/seedContent.js";

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_USER = process.env.DB_USER || "reddot";
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || "reddot";
const publicSections = [
  "site",
  "stats",
  "featuredWorks",
  "worksArchive",
  "btsGallery",
  "about",
  "leadership",
  "team",
];

const { Pool } = pg;
const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  max: 10,
});

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(value) {
  return JSON.parse(value);
}

export async function ensureDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      section_name VARCHAR(64) NOT NULL PRIMARY KEY,
      content_json TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const { rows } = await pool.query("SELECT section_name FROM site_content");
  const existingSections = new Set(rows.map((row) => row.section_name));

  for (const section of publicSections) {
    if (existingSections.has(section)) {
      continue;
    }

    await pool.query(
      "INSERT INTO site_content (section_name, content_json) VALUES ($1, $2)",
      [section, serialize(defaultContent[section])],
    );
  }
}

export async function readContent() {
  const { rows } = await pool.query(
    "SELECT section_name, content_json FROM site_content ORDER BY section_name",
  );

  const content = {};
  for (const section of publicSections) {
    const row = rows.find((item) => item.section_name === section);
    content[section] = row
      ? deserialize(row.content_json)
      : defaultContent[section];
  }

  return content;
}

export async function updateContentSection(section, value) {
  await pool.query(
    `
      INSERT INTO site_content (section_name, content_json)
      VALUES ($1, $2)
      ON CONFLICT (section_name)
      DO UPDATE SET content_json = EXCLUDED.content_json, updated_at = CURRENT_TIMESTAMP
    `,
    [section, serialize(value)],
  );

  return readContent();
}

export async function resetContent() {
  const connection = await pool.connect();

  try {
    await connection.query("BEGIN");
    await connection.query("DELETE FROM site_content");

    for (const section of publicSections) {
      await connection.query(
        "INSERT INTO site_content (section_name, content_json) VALUES ($1, $2)",
        [section, serialize(defaultContent[section])],
      );
    }

    await connection.query("COMMIT");
  } catch (error) {
    await connection.query("ROLLBACK");
    throw error;
  } finally {
    connection.release();
  }

  return readContent();
}

export function isPublicSection(section) {
  return publicSections.includes(section);
}

export async function closeDatabase() {
  await pool.end();
}
