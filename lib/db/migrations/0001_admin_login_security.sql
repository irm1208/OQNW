ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS mfa_secret_encrypted text,
  ADD COLUMN IF NOT EXISTS pending_mfa_secret_encrypted text,
  ADD COLUMN IF NOT EXISTS mfa_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mfa_enrolled_at timestamptz,
  ADD COLUMN IF NOT EXISTS mfa_last_used_at timestamptz,
  ADD COLUMN IF NOT EXISTS session_version integer NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  id serial PRIMARY KEY,
  ip text NOT NULL UNIQUE,
  failed_attempts integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz NOT NULL DEFAULT now(),
  locked_until timestamptz
);

CREATE TABLE IF NOT EXISTS admin_auth_challenges (
  id serial PRIMARY KEY,
  admin_user_id integer NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_recovery_codes (
  id serial PRIMARY KEY,
  admin_user_id integer NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  code_hash text NOT NULL UNIQUE,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_audit_events (
  id serial PRIMARY KEY,
  event_type text NOT NULL,
  admin_user_id integer REFERENCES admin_users(id) ON DELETE SET NULL,
  email text,
  ip text,
  user_agent text,
  request_id text,
  success boolean NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);