import { createCipheriv, createDecipheriv, randomBytes, randomUUID, scryptSync } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { appendFile, open, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { finished, pipeline } from "node:stream/promises";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { and, desc, eq, gt, lt, sql } from "drizzle-orm";
import { db } from "@workspace/db";
import { databaseBackupRunsTable } from "@workspace/db/schema";
import { logger } from "./logger";

const FIVE_HOURS_MS = 5 * 60 * 60 * 1_000;
const STALE_RUN_MS = 10 * 60 * 1_000;
const RETRY_DELAY_MS = 30 * 60 * 1_000;
const CHECK_INTERVAL_MS = 60 * 1_000;
const RETENTION_MS = 30 * 24 * 60 * 60 * 1_000;
const DRIVE_FOLDER_NAME = "OmniQure Database Backups";
const FILE_PREFIX = "omniqure-production-";
const BACKUP_MAGIC = Buffer.from("OMNIQURE_BACKUP_V1\n", "ascii");
const BACKUP_HEADER_SIZE = BACKUP_MAGIC.length + 16 + 12;
const BACKUP_TAG_SIZE = 16;
const ADVISORY_LOCK_ID = 1_978_426_105;

type DriveFile = {
  id: string;
  name: string;
  createdTime?: string;
};

async function driveJson<T>(
  connectors: ReplitConnectors,
  drivePath: string,
  options?: { method?: string; headers?: Record<string, string>; body?: unknown },
): Promise<T> {
  const response = await connectors.proxy("google-drive", drivePath, options);
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`Google Drive request failed (${response.status}): ${detail}`);
  }
  return response.json() as Promise<T>;
}

async function findOrCreateBackupFolder(connectors: ReplitConnectors): Promise<string> {
  const query = `name = '${DRIVE_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  const listed = await driveJson<{ files?: DriveFile[] }>(
    connectors,
    `/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name)&pageSize=10`,
  );
  const exact = listed.files?.find((file) => file.name === DRIVE_FOLDER_NAME);
  if (exact) return exact.id;

  const created = await driveJson<DriveFile>(connectors, "/drive/v3/files?fields=id,name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      name: DRIVE_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
  });
  return created.id;
}

export async function createEncryptedDatabaseDump(
  destination: string,
  databaseUrl: string,
  passphrase: string,
): Promise<void> {
  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const key = scryptSync(passphrase, salt, 32);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const output = createWriteStream(destination, { flags: "wx", mode: 0o600 });
  output.write(Buffer.concat([BACKUP_MAGIC, salt, iv]));

  const connection = new URL(databaseUrl);
  if (connection.protocol !== "postgres:" && connection.protocol !== "postgresql:") {
    throw new Error("DATABASE_URL is not a PostgreSQL connection");
  }
  const childEnv: NodeJS.ProcessEnv = { ...process.env };
  delete childEnv.DATABASE_URL;
  for (const key of [
    "PGHOST",
    "PGHOSTADDR",
    "PGPORT",
    "PGUSER",
    "PGPASSWORD",
    "PGPASSFILE",
    "PGSERVICE",
    "PGSERVICEFILE",
    "PGSSLMODE",
    "PGSSLROOTCERT",
    "PGSSLCERT",
    "PGSSLKEY",
    "PGDATABASE",
    "PGCONNECT_TIMEOUT",
  ]) {
    delete childEnv[key];
  }
  childEnv.PGHOST = connection.hostname;
  childEnv.PGPORT = connection.port || "5432";
  childEnv.PGUSER = decodeURIComponent(connection.username);
  childEnv.PGPASSWORD = decodeURIComponent(connection.password);
  childEnv.PGDATABASE = decodeURIComponent(connection.pathname.replace(/^\//, ""));
  childEnv.PGCONNECT_TIMEOUT = "20";
  const sslMode = connection.searchParams.get("sslmode");
  childEnv.PGSSLMODE = sslMode ?? "verify-full";
  const dump = spawn("pg_dump", ["--format=custom", "--no-owner", "--no-acl"], {
    env: childEnv,
    stdio: ["ignore", "pipe", "pipe"],
  });

  let stderr = "";
  dump.stderr.on("data", (chunk: Buffer) => {
    if (stderr.length < 2_000) stderr += chunk.toString("utf8");
  });

  dump.stdout.pipe(cipher).pipe(output, { end: false });
  const exitCode = await new Promise<number>((resolve, reject) => {
    dump.once("error", reject);
    dump.once("close", (code) => resolve(code ?? 1));
  });
  await finished(cipher);
  if (exitCode !== 0) {
    output.destroy();
    throw new Error(`pg_dump failed with exit code ${exitCode}: ${stderr.trim().slice(0, 500)}`);
  }

  output.end();
  await finished(output);
  await appendFile(destination, cipher.getAuthTag());
}

export async function verifyEncryptedDatabaseDump(
  filePath: string,
  passphrase: string,
): Promise<void> {
  const file = await open(filePath, "r");
  try {
    const fileInfo = await file.stat();
    if (fileInfo.size <= BACKUP_HEADER_SIZE + BACKUP_TAG_SIZE) {
      throw new Error("Encrypted backup file is too small");
    }
    const header = Buffer.alloc(BACKUP_HEADER_SIZE);
    const tag = Buffer.alloc(BACKUP_TAG_SIZE);
    await file.read(header, 0, header.length, 0);
    await file.read(tag, 0, tag.length, fileInfo.size - BACKUP_TAG_SIZE);
    if (!header.subarray(0, BACKUP_MAGIC.length).equals(BACKUP_MAGIC)) {
      throw new Error("Encrypted backup header is invalid");
    }

    const saltStart = BACKUP_MAGIC.length;
    const salt = header.subarray(saltStart, saltStart + 16);
    const iv = header.subarray(saltStart + 16, BACKUP_HEADER_SIZE);
    const key = scryptSync(passphrase, salt, 32);
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const restore = spawn("pg_restore", ["--list"], {
      stdio: ["pipe", "ignore", "pipe"],
    });
    let stderr = "";
    restore.stderr.on("data", (chunk: Buffer) => {
      if (stderr.length < 2_000) stderr += chunk.toString("utf8");
    });
    const restoreExit = new Promise<number>((resolve, reject) => {
      restore.once("error", reject);
      restore.once("close", (code) => resolve(code ?? 1));
    });
    await pipeline(
      createReadStream(filePath, {
        start: BACKUP_HEADER_SIZE,
        end: fileInfo.size - BACKUP_TAG_SIZE - 1,
      }),
      decipher,
      restore.stdin,
    );
    const exitCode = await restoreExit;
    if (exitCode !== 0) {
      throw new Error(`pg_restore verification failed with exit code ${exitCode}: ${stderr.trim().slice(0, 500)}`);
    }
  } finally {
    await file.close();
  }
}

async function uploadBackup(
  connectors: ReplitConnectors,
  folderId: string,
  filePath: string,
  fileName: string,
): Promise<DriveFile> {
  const encrypted = await readFile(filePath);
  const boundary = `omniqure-${randomBytes(12).toString("hex")}`;
  const metadata = Buffer.from(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${JSON.stringify({ name: fileName, parents: [folderId] })}\r\n` +
      `--${boundary}\r\nContent-Type: application/octet-stream\r\n\r\n`,
  );
  const ending = Buffer.from(`\r\n--${boundary}--\r\n`);
  const body = Buffer.concat([metadata, encrypted, ending]);

  return driveJson<DriveFile>(
    connectors,
    "/upload/drive/v3/files?uploadType=multipart&fields=id,name,createdTime",
    {
      method: "POST",
      headers: {
        "Content-Type": `multipart/related; boundary=${boundary}`,
        "Content-Length": String(body.length),
      },
      body,
    },
  );
}

async function deleteExpiredBackups(
  connectors: ReplitConnectors,
  folderId: string,
): Promise<number> {
  const query = `'${folderId}' in parents and trashed = false and name contains '${FILE_PREFIX}'`;
  let pageToken: string | undefined;
  let deleted = 0;
  const cutoff = Date.now() - RETENTION_MS;

  do {
    const params = new URLSearchParams({
      q: query,
      fields: "nextPageToken,files(id,name,createdTime)",
      pageSize: "1000",
    });
    if (pageToken) params.set("pageToken", pageToken);
    const page = await driveJson<{ files?: DriveFile[]; nextPageToken?: string }>(
      connectors,
      `/drive/v3/files?${params.toString()}`,
    );
    for (const file of page.files ?? []) {
      if (!file.name.startsWith(FILE_PREFIX) || !file.createdTime) continue;
      if (new Date(file.createdTime).getTime() >= cutoff) continue;
      const response = await connectors.proxy(
        "google-drive",
        `/drive/v3/files/${encodeURIComponent(file.id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(`Google Drive permanent delete failed (${response.status})`);
      }
      deleted += 1;
    }
    pageToken = page.nextPageToken;
  } while (pageToken);

  return deleted;
}

async function claimBackupRun(): Promise<{ id: number; ownerToken: string } | null> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(${ADVISORY_LOCK_ID})`);
    const now = new Date();
    const staleBefore = new Date(now.getTime() - STALE_RUN_MS);
    await tx
      .update(databaseBackupRunsTable)
      .set({ status: "failed", completedAt: now, error: "Backup heartbeat expired" })
      .where(and(
        eq(databaseBackupRunsTable.status, "running"),
        lt(databaseBackupRunsTable.heartbeatAt, staleBefore),
      ));

    const [active] = await tx
      .select({ id: databaseBackupRunsTable.id })
      .from(databaseBackupRunsTable)
      .where(and(
        eq(databaseBackupRunsTable.status, "running"),
        gt(databaseBackupRunsTable.heartbeatAt, staleBefore),
      ))
      .limit(1);
    if (active) return null;

    const [latest] = await tx
      .select({ completedAt: databaseBackupRunsTable.completedAt })
      .from(databaseBackupRunsTable)
      .where(eq(databaseBackupRunsTable.status, "completed"))
      .orderBy(desc(databaseBackupRunsTable.completedAt))
      .limit(1);
    if (latest?.completedAt && now.getTime() - latest.completedAt.getTime() < FIVE_HOURS_MS) {
      return null;
    }

    const [latestAttempt] = await tx
      .select({
        status: databaseBackupRunsTable.status,
        completedAt: databaseBackupRunsTable.completedAt,
      })
      .from(databaseBackupRunsTable)
      .orderBy(desc(databaseBackupRunsTable.startedAt))
      .limit(1);
    if (
      latestAttempt?.status === "failed" &&
      latestAttempt.completedAt &&
      now.getTime() - latestAttempt.completedAt.getTime() < RETRY_DELAY_MS
    ) {
      return null;
    }

    const ownerToken = randomUUID();
    const [run] = await tx
      .insert(databaseBackupRunsTable)
      .values({ status: "running", ownerToken, startedAt: now, heartbeatAt: now })
      .returning({ id: databaseBackupRunsTable.id });
    return { id: run.id, ownerToken };
  });
}

async function runDatabaseBackup(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const passphrase = process.env.BACKUP_ENCRYPTION_PASSPHRASE;
  if (!databaseUrl || !passphrase) {
    logger.error("Database backup skipped because required production secrets are unavailable");
    return;
  }

  let claim: { id: number; ownerToken: string } | null;
  try {
    claim = await claimBackupRun();
  } catch (error) {
    logger.error({ err: error }, "Production database backup claim failed");
    return;
  }
  if (!claim) return;
  const { id: runId, ownerToken } = claim;
  const heartbeat = setInterval(() => {
    void db
      .update(databaseBackupRunsTable)
      .set({ heartbeatAt: new Date() })
      .where(and(
        eq(databaseBackupRunsTable.id, runId),
        eq(databaseBackupRunsTable.status, "running"),
        eq(databaseBackupRunsTable.ownerToken, ownerToken),
      ))
      .catch((error) => logger.error({ err: error, runId }, "Database backup heartbeat failed"));
  }, 60_000);
  heartbeat.unref();

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const fileName = `${FILE_PREFIX}${timestamp}.dump.enc`;
  const filePath = path.join(tmpdir(), `${fileName}.${process.pid}`);

  try {
    await createEncryptedDatabaseDump(filePath, databaseUrl, passphrase);
    await verifyEncryptedDatabaseDump(filePath, passphrase);
    const fileSize = (await stat(filePath)).size;
    const [stillOwner] = await db
      .select({ id: databaseBackupRunsTable.id })
      .from(databaseBackupRunsTable)
      .where(and(
        eq(databaseBackupRunsTable.id, runId),
        eq(databaseBackupRunsTable.status, "running"),
        eq(databaseBackupRunsTable.ownerToken, ownerToken),
      ))
      .limit(1);
    if (!stillOwner) throw new Error("Database backup lease was lost before upload");

    const connectors = new ReplitConnectors();
    const folderId = await findOrCreateBackupFolder(connectors);
    const uploaded = await uploadBackup(connectors, folderId, filePath, fileName);
    const completed = await db
      .update(databaseBackupRunsTable)
      .set({
        status: "completed",
        completedAt: new Date(),
        driveFileId: uploaded.id,
        driveFileName: uploaded.name,
        error: null,
      })
      .where(and(
        eq(databaseBackupRunsTable.id, runId),
        eq(databaseBackupRunsTable.status, "running"),
        eq(databaseBackupRunsTable.ownerToken, ownerToken),
      ))
      .returning({ id: databaseBackupRunsTable.id });
    if (completed.length !== 1) {
      const cleanup = await connectors.proxy(
        "google-drive",
        `/drive/v3/files/${encodeURIComponent(uploaded.id)}`,
        { method: "DELETE" },
      );
      if (!cleanup.ok) {
        logger.error({ runId, status: cleanup.status }, "Lost-lease backup upload cleanup failed");
      }
      throw new Error("Database backup lease was lost while finalizing upload");
    }
    logger.info({ runId, fileName, fileSize }, "Encrypted production database backup uploaded");

    try {
      const deleted = await deleteExpiredBackups(connectors, folderId);
      if (deleted > 0) logger.info({ deleted }, "Expired database backups permanently deleted");
    } catch (error) {
      logger.warn({ err: error }, "Database backup retention cleanup failed");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 1_000) : "Unknown backup error";
    await db
      .update(databaseBackupRunsTable)
      .set({ status: "failed", completedAt: new Date(), error: message })
      .where(and(
        eq(databaseBackupRunsTable.id, runId),
        eq(databaseBackupRunsTable.status, "running"),
        eq(databaseBackupRunsTable.ownerToken, ownerToken),
      ));
    logger.error({ err: error, runId }, "Production database backup failed");
  } finally {
    clearInterval(heartbeat);
    await rm(filePath, { force: true });
  }
}

export function startDatabaseBackupJob(): void {
  if (process.env.NODE_ENV !== "production") {
    logger.info("Production database backup job disabled outside production");
    return;
  }
  logger.info({ intervalHours: 5, retentionDays: 30 }, "Production database backup job started");
  void runDatabaseBackup();
  setInterval(() => void runDatabaseBackup(), CHECK_INTERVAL_MS).unref();
}
