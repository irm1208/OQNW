import assert from "node:assert/strict";
import test from "node:test";
import { adminRoleAllowsRequest, recordStrictAdminAudit, strictAdminAuditValues } from "./auth";

test("viewer role is read-only across admin routes", () => {
  assert.equal(adminRoleAllowsRequest("viewer", "/orders/42", "GET"), true);
  assert.equal(adminRoleAllowsRequest("viewer", "/orders/42", "PATCH"), false);
  assert.equal(adminRoleAllowsRequest("viewer", "/catalog", "POST"), false);
});

test("manager can operate ordinary routes but not security-critical configuration", () => {
  assert.equal(adminRoleAllowsRequest("manager", "/orders/42/dispatch", "POST"), true);
  assert.equal(adminRoleAllowsRequest("manager", "/users", "GET"), false);
  assert.equal(adminRoleAllowsRequest("manager", "/settings", "PATCH"), false);
  assert.equal(adminRoleAllowsRequest("manager", "/security/events", "GET"), false);
  assert.equal(adminRoleAllowsRequest("manager", "/customers/42/gdpr-erase", "DELETE"), false);
});

test("owner can access every admin route", () => {
  assert.equal(adminRoleAllowsRequest("owner", "/users", "POST"), true);
  assert.equal(adminRoleAllowsRequest("owner", "/security/events", "GET"), true);
  assert.equal(adminRoleAllowsRequest("owner", "/customers/42/gdpr-erase", "DELETE"), true);
});

test("strict audit rows identify the actor and retain the mutation target only as metadata", () => {
  const req = {
    id: "request-1",
    ip: "203.0.113.2",
    get: () => "test-agent",
  } as never;
  const audit = strictAdminAuditValues(req, { id: 11, email: "owner@example.test" }, "admin_user_updated", true, {
    metadata: { targetAdminUserId: 22, targetEmail: "viewer@example.test" },
  });
  assert.equal(audit.adminUserId, 11);
  assert.equal(audit.email, "owner@example.test");
  assert.deepEqual(audit.metadata, { targetAdminUserId: 22, targetEmail: "viewer@example.test" });
});

test("strict audit failures propagate so the enclosing transaction can roll back", async () => {
  const tx = {
    select: () => ({ from: () => ({ where: () => ({ limit: async () => [{ id: 11, email: "owner@example.test" }] }) }) }),
    insert: () => ({ values: async () => { throw new Error("audit insert failed"); } }),
  } as never;
  const req = { id: "request-1", ip: "203.0.113.2", get: () => null } as never;
  await assert.rejects(
    recordStrictAdminAudit(tx, req, "admin_user_created", true, { metadata: { targetAdminUserId: 22 } }),
    /audit insert failed/,
  );
});