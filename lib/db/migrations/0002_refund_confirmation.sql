ALTER TABLE refunds_log
  ADD COLUMN IF NOT EXISTS currency text NOT NULL DEFAULT 'GBP',
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'confirmed',
  ADD COLUMN IF NOT EXISTS wallid_refund_reference text,
  ADD COLUMN IF NOT EXISTS confirmed_at timestamptz;

CREATE UNIQUE INDEX IF NOT EXISTS refunds_log_wallid_refund_reference_unique
  ON refunds_log (wallid_refund_reference)
  WHERE wallid_refund_reference IS NOT NULL;