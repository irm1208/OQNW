import {
  pgTable,
  serial,
  integer,
  text,
  date,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { ordersTable } from "./orders";

export const wholesaleInvoicesTable = pgTable("wholesale_invoices", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => ordersTable.id, { onDelete: "cascade" }),
  referenceNumber: text("reference_number").notNull(),
  customerEmailCc: text("customer_email_cc"),
  dueDate: date("due_date").notNull(),
  description: text("description"),
  invoiceNotes: text("invoice_notes"),
  bankAccountLabel: text("bank_account_label").notNull().default("Wallid Business Account"),
  payerAccountType: text("payer_account_type").notNull().default("any"),
  paymentStatus: text("payment_status").notNull().default("creating"),
  apiPaymentId: text("api_payment_id"),
  paymentUrl: text("payment_url"),
  emailStatus: text("email_status").notNull().default("not_sent"),
  emailLastError: text("email_last_error"),
  invoiceSentAt: timestamp("invoice_sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  uniqueIndex("wholesale_invoices_order_id_unique").on(table.orderId),
  uniqueIndex("wholesale_invoices_reference_number_unique").on(table.referenceNumber),
  uniqueIndex("wholesale_invoices_api_payment_id_unique").on(table.apiPaymentId),
]);

export type WholesaleInvoice = typeof wholesaleInvoicesTable.$inferSelect;