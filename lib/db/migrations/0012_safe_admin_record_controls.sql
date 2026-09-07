ALTER TABLE abandoned_carts ADD COLUMN IF NOT EXISTS archived_at timestamptz;
ALTER TABLE stock_alerts ADD COLUMN IF NOT EXISTS dismissed_at timestamptz;