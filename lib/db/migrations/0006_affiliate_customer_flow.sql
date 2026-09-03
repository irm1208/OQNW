ALTER TABLE affiliate_partners
  ADD COLUMN IF NOT EXISTS channel_url text,
  ADD COLUMN IF NOT EXISTS audience_description text,
  ADD COLUMN IF NOT EXISTS promotion_plan text;

ALTER TABLE affiliate_reward_credits
  ADD COLUMN IF NOT EXISTS commission_id integer
  REFERENCES affiliate_commissions(id) ON DELETE RESTRICT;

CREATE INDEX IF NOT EXISTS affiliate_rewards_commission_idx
  ON affiliate_reward_credits (commission_id);

CREATE TABLE IF NOT EXISTS affiliate_order_attributions (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  partner_id integer NOT NULL REFERENCES affiliate_partners(id) ON DELETE RESTRICT,
  customer_id integer REFERENCES customers(id) ON DELETE SET NULL,
  tracking_code_snapshot text NOT NULL,
  discount_code_snapshot text,
  source text NOT NULL,
  clicked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS affiliate_order_attributions_order_unique
  ON affiliate_order_attributions (order_id);
CREATE INDEX IF NOT EXISTS affiliate_order_attributions_partner_created_idx
  ON affiliate_order_attributions (partner_id, created_at);