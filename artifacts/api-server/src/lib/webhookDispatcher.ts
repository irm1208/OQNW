import crypto from "crypto";
import { db } from "@workspace/db";
import { webhooksTable, webhookDeliveriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

export type WebhookEvent =
  | "order.created"
  | "order.updated"
  | "order.cancelled"
  | "order.refunded";

export interface WebhookPayload {
  event: WebhookEvent;
  createdAt: string;
  data: Record<string, unknown>;
}

export async function dispatchWebhook(event: WebhookEvent, data: Record<string, unknown>): Promise<void> {
  try {
    const webhooks = await db
      .select()
      .from(webhooksTable)
      .where(
        sql`${webhooksTable.isActive} = true AND ${event} = ANY(${webhooksTable.events})`
      );

    if (webhooks.length === 0) return;

    const payload: WebhookPayload = {
      event,
      createdAt: new Date().toISOString(),
      data,
    };

    const payloadStr = JSON.stringify(payload);

    for (const webhook of webhooks) {
      const sig = crypto
        .createHmac("sha256", webhook.secret)
        .update(payloadStr)
        .digest("hex");

      let status = "failed";
      let responseCode: number | null = null;
      let responseBody: string | null = null;

      try {
        const res = await fetch(webhook.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-OmniQure-Signature": `sha256=${sig}`,
            "X-OmniQure-Event": event,
          },
          body: payloadStr,
          signal: AbortSignal.timeout(10_000),
        });
        responseCode = res.status;
        responseBody = (await res.text()).slice(0, 500);
        status = res.ok ? "success" : "failed";
      } catch {
        responseBody = "Request failed or timed out";
      }

      await db.insert(webhookDeliveriesTable).values({
        webhookId: webhook.id,
        eventType: event,
        payloadJson: payloadStr,
        status,
        responseCode,
        responseBody,
      });
    }
  } catch {
    // Webhook dispatch is non-blocking — errors don't affect the main flow
  }
}
