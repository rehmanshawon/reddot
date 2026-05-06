import mysql from "mysql2/promise";
import { defaultContent } from "../src/data/seedContent.js";

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "your_actual_password_here";
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

function createPool() {
  return mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
}

const pool = createPool();

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(value) {
  return JSON.parse(value);
}

export async function ensureDatabase() {
  const adminConnection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
  });

  try {
    await adminConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME.replace(/`/g, "``")}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await adminConnection.end();
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      section_name VARCHAR(64) NOT NULL PRIMARY KEY,
      content_json LONGTEXT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  const [rows] = await pool.query("SELECT section_name FROM site_content");
  const existingSections = new Set(rows.map((row) => row.section_name));

  for (const section of publicSections) {
    if (existingSections.has(section)) {
      continue;
    }

    await pool.query(
      "INSERT INTO site_content (section_name, content_json) VALUES (?, ?)",
      [section, serialize(defaultContent[section])],
    );
  }
}

export async function readContent() {
  const [rows] = await pool.query(
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
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)
    `,
    [section, serialize(value)],
  );

  return readContent();
}

export async function resetContent() {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();
    await connection.query("DELETE FROM site_content");

    for (const section of publicSections) {
      await connection.query(
        "INSERT INTO site_content (section_name, content_json) VALUES (?, ?)",
        [section, serialize(defaultContent[section])],
      );
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
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
