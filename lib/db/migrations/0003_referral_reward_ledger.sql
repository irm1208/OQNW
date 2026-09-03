CREATE TABLE IF NOT EXISTS referral_rewards (
  id serial PRIMARY KEY,
  beneficiary_customer_id integer REFERENCES customers(id) ON DELETE RESTRICT,
  referrer_customer_id integer REFERENCES customers(id) ON DELETE RESTRICT,
  referred_customer_id integer REFERENCES customers(id) ON DELETE RESTRICT,
  qualifying_order_id integer REFERENCES orders(id) ON DELETE RESTRICT,
  beneficiary_role text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  amount_gbp numeric(10,2) NOT NULL,
  remaining_amount_gbp numeric(10,2) NOT NULL,
  status_reason text,
  historical boolean NOT NULL DEFAULT false,
  last_admin_actor text,
  earned_at timestamptz,
  held_at timestamptz,
  voided_at timestamptz,
  redeemed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT referral_rewards_status_check CHECK (status IN ('pending', 'earned', 'redeemed', 'held', 'voided', 'legacy')),
  CONSTRAINT referral_rewards_role_check CHECK (beneficiary_role IN ('referrer', 'referred', 'historical')),
  CONSTRAINT referral_rewards_amount_check CHECK (
    amount_gbp > 0 AND remaining_amount_gbp >= 0 AND remaining_amount_gbp <= amount_gbp
  ),
  CONSTRAINT referral_rewards_links_check CHECK (
    (
      historical = true
      AND beneficiary_role = 'historical'
      AND referrer_customer_id IS NULL
      AND referred_customer_id IS NULL
      AND qualifying_order_id IS NULL
    )
    OR
    (
      historical = false
      AND beneficiary_role IN ('referrer', 'referred')
      AND beneficiary_customer_id IS NOT NULL
      AND referrer_customer_id IS NOT NULL
      AND referred_customer_id IS NOT NULL
      AND qualifying_order_id IS NOT NULL
    )
  )
);
CREATE UNIQUE INDEX IF NOT EXISTS referral_rewards_issuance_unique
  ON referral_rewards (qualifying_order_id, beneficiary_customer_id, beneficiary_role);
CREATE INDEX IF NOT EXISTS referral_rewards_beneficiary_status_idx
  ON referral_rewards (beneficiary_customer_id, status, created_at);
CREATE INDEX IF NOT EXISTS referral_rewards_referred_customer_idx ON referral_rewards (referred_customer_id);

CREATE TABLE IF NOT EXISTS referral_redemption_allocations (
  id serial PRIMARY KEY,
  reward_id integer NOT NULL REFERENCES referral_rewards(id) ON DELETE RESTRICT,
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  customer_id integer NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  amount_gbp numeric(10,2) NOT NULL CHECK (amount_gbp > 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS referral_redemption_reward_order_unique
  ON referral_redemption_allocations (reward_id, order_id);
CREATE INDEX IF NOT EXISTS referral_redemption_order_idx ON referral_redemption_allocations (order_id);

-- Balances predate individual events. Preserve them as spendable, explicitly
-- historical buckets; never invent a referrer, referee, or £25 issuance.
INSERT INTO referral_rewards
  (beneficiary_customer_id, beneficiary_role, status, amount_gbp, remaining_amount_gbp, status_reason, historical)
SELECT id, 'historical', 'legacy', referral_credit_gbp, referral_credit_gbp,
       'Migrated compatibility balance; no individual referral event was inferred', true
FROM customers
WHERE referral_credit_gbp > 0
  AND NOT EXISTS (
    SELECT 1 FROM referral_rewards r
    WHERE r.beneficiary_customer_id = customers.id AND r.historical = true
  );