CREATE TABLE IF NOT EXISTS customer_segments (
  id serial PRIMARY KEY,
  name text NOT NULL,
  description text,
  rules jsonb NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_segments_active_idx ON customer_segments (is_active, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS customer_segments_active_name_idx
  ON customer_segments (lower(name))
  WHERE is_active = true;