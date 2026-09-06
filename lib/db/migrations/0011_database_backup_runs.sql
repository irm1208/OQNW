CREATE TABLE IF NOT EXISTS "database_backup_runs" (
  "id" serial PRIMARY KEY NOT NULL,
  "status" text NOT NULL,
  "owner_token" text,
  "started_at" timestamp with time zone DEFAULT now() NOT NULL,
  "heartbeat_at" timestamp with time zone,
  "completed_at" timestamp with time zone,
  "drive_file_id" text,
  "drive_file_name" text,
  "error" text
);

CREATE INDEX IF NOT EXISTS "database_backup_runs_status_completed_idx"
  ON "database_backup_runs" ("status", "completed_at");