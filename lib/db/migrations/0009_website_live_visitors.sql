CREATE TABLE IF NOT EXISTS "website_live_visitors" (
  "visitor_id" text PRIMARY KEY NOT NULL,
  "path" text NOT NULL,
  "last_seen_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "website_live_visitors_last_seen_at_idx"
  ON "website_live_visitors" USING btree ("last_seen_at");