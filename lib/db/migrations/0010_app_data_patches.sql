CREATE TABLE IF NOT EXISTS "app_data_patches" (
  "id" text PRIMARY KEY NOT NULL,
  "applied_at" timestamp with time zone DEFAULT now() NOT NULL
);