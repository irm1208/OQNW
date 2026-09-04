CREATE INDEX CONCURRENTLY IF NOT EXISTS "admin_alert_reads_cleanup_idx"
  ON "admin_alert_reads" USING btree ("read_at", "id");