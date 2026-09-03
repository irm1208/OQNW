CREATE TABLE IF NOT EXISTS affiliate_program_settings (
  id integer PRIMARY KEY DEFAULT 1,
  attribution_window_days integer NOT NULL DEFAULT 30,
  review_hold_days integer NOT NULL DEFAULT 30,
  customer_discount_percent numeric(5, 2) NOT NULL DEFAULT 10,
  free_reward_threshold_gbp numeric(10, 2) NOT NULL DEFAULT 1000,
  free_reward_value_cap_gbp numeric(10, 2) NOT NULL DEFAULT 50,
  max_free_rewards_per_period integer NOT NULL DEFAULT 1,
  payout_threshold_gbp numeric(10, 2) NOT NULL DEFAULT 50,
  tier_window_days integer NOT NULL DEFAULT 90,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS affiliate_tiers (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  minimum_sales_gbp numeric(10, 2) NOT NULL DEFAULT 0,
  commission_rate_percent numeric(5, 2) NOT NULL,
  reward_credit_gbp numeric(10, 2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS affiliate_tiers_active_order_idx
  ON affiliate_tiers (is_active, sort_order);

CREATE TABLE IF NOT EXISTS affiliate_partners (
  id serial PRIMARY KEY,
  customer_id integer REFERENCES customers(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  tracking_code text NOT NULL UNIQUE,
  discount_code text NOT NULL UNIQUE,
  discount_percent numeric(5, 2) NOT NULL DEFAULT 10,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  approved_at timestamptz,
  suspended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS affiliate_partners_email_unique
  ON affiliate_partners (email);
CREATE INDEX IF NOT EXISTS affiliate_partners_status_created_idx
  ON affiliate_partners (status, created_at);

CREATE TABLE IF NOT EXISTS affiliate_commissions (
  id serial PRIMARY KEY,
  partner_id integer NOT NULL REFERENCES affiliate_partners(id) ON DELETE RESTRICT,
  order_id integer REFERENCES orders(id) ON DELETE RESTRICT,
  eligible_sales_gbp numeric(10, 2) NOT NULL,
  commission_rate_percent numeric(5, 2) NOT NULL,
  amount_gbp numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  status_reason text,
  period_key text,
  approved_at timestamptz,
  held_at timestamptz,
  voided_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS affiliate_commissions_partner_order_unique
  ON affiliate_commissions (partner_id, order_id);
CREATE INDEX IF NOT EXISTS affiliate_commissions_partner_status_idx
  ON affiliate_commissions (partner_id, status, created_at);
CREATE INDEX IF NOT EXISTS affiliate_commissions_status_created_idx
  ON affiliate_commissions (status, created_at);

CREATE TABLE IF NOT EXISTS affiliate_reward_credits (
  id serial PRIMARY KEY,
  partner_id integer NOT NULL REFERENCES affiliate_partners(id) ON DELETE RESTRICT,
  qualifying_sales_gbp numeric(10, 2) NOT NULL,
  credit_value_gbp numeric(10, 2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  product_slug text,
  claimed_product_name text,
  status_reason text,
  last_admin_actor text,
  available_at timestamptz,
  claimed_at timestamptz,
  fulfilled_at timestamptz,
  voided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS affiliate_rewards_partner_status_idx
  ON affiliate_reward_credits (partner_id, status, created_at);
CREATE INDEX IF NOT EXISTS affiliate_rewards_status_created_idx
  ON affiliate_reward_credits (status, created_at);

ALTER TABLE discount_codes
  ADD COLUMN IF NOT EXISTS affiliate_partner_id integer
  REFERENCES affiliate_partners(id) ON DELETE SET NULL;

INSERT INTO affiliate_program_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO affiliate_tiers (name, slug, minimum_sales_gbp, commission_rate_percent, reward_credit_gbp, sort_order)
VALUES
  ('Starter', 'starter', 0, 5, 0, 0),
  ('Growth', 'growth', 1000, 8, 50, 1),
  ('Elite', 'elite', 2500, 10, 75, 2)
ON CONFLICT (slug) DO NOTHING;