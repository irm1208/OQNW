ALTER TABLE wholesale_invoices
  ADD COLUMN IF NOT EXISTS payment_last_error text;