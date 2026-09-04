CREATE TABLE IF NOT EXISTS "admin_alert_reads" (
  "id" serial PRIMARY KEY NOT NULL,
  "admin_user_id" integer NOT NULL,
  "alert_id" text NOT NULL,
  "alert_created_at" timestamp with time zone NOT NULL,
  "read_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "admin_alert_reads_admin_user_id_admin_users_id_fk"
    FOREIGN KEY ("admin_user_id") REFERENCES "public"."admin_users"("id")
    ON DELETE cascade ON UPDATE no action
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_alert_reads_user_alert_event_idx"
  ON "admin_alert_reads" USING btree ("admin_user_id", "alert_id", "alert_created_at");