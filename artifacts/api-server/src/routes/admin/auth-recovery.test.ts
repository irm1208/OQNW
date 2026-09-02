import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { db } from "@workspace/db";
import app from "../../app";
import {
  createSecureAdminSessionValue,
  sharedOwnerSessionAllowed,
  sharedRecoveryDecision,
} from "./auth";

test("shared recovery bootstraps when there are zero active admins", () => {
  assert.equal(sharedRecoveryDecision([]), "bootstrap");
  assert.equal(sharedOwnerSessionAllowed([]), true);
});

test("shared recovery remains available when every existing admin is disabled", () => {
  const activeAdmins: Array<{ role: string; mfaEnabled: boolean }> = [];

  assert.equal(sharedRecoveryDecision(activeAdmins), "bootstrap");
  assert.equal(sharedOwnerSessionAllowed(activeAdmins), true);
});

test("a sole active owner without MFA is sent to mandatory enrollment", () => {
  const activeAdmins = [{ role: "owner", mfaEnabled: false }];

  assert.equal(sharedRecoveryDecision(activeAdmins), "enroll-owner");
  assert.equal(sharedOwnerSessionAllowed(activeAdmins), false);
});

test("shared recovery cannot bypass an MFA-protected owner", () => {
  const activeAdmins = [{ role: "owner", mfaEnabled: true }];

  assert.equal(sharedRecoveryDecision(activeAdmins), "denied");
  assert.equal(sharedOwnerSessionAllowed(activeAdmins), false);
});

test("shared recovery is denied when multiple active admins exist", () => {
  const activeAdmins = [
    { role: "owner", mfaEnabled: false },
    { role: "viewer", mfaEnabled: false },
  ];

  assert.equal(sharedRecoveryDecision(activeAdmins), "denied");
  assert.equal(sharedOwnerSessionAllowed(activeAdmins), false);
});

test("a stale shared-owner session is rejected as soon as an active owner exists", () => {
  assert.equal(sharedOwnerSessionAllowed([]), true);
  assert.equal(
    sharedOwnerSessionAllowed([{ role: "owner", mfaEnabled: true }]),
    false,
  );
});

test("shared-owner HTTP access expires when an active MFA owner appears", async (t) => {
  let activeAdmins: Array<{ role: string; mfaEnabled: boolean }> = [];
  const originalSelect = db.select;
  Object.assign(db, {
    select: () => ({
      from: () => ({
        where: () => ({
          limit: async () => activeAdmins,
        }),
        orderBy: async () => activeAdmins,
      }),
    }),
  });
  t.after(() => Object.assign(db, { select: originalSelect }));

  const server = app.listen(0);
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  t.after(() => server.close());

  const { port } = server.address() as AddressInfo;
  const cookie = `admin_secure_session=${createSecureAdminSessionValue(null)}`;
  const request = (path: string) => fetch(`http://127.0.0.1:${port}${path}`, {
    headers: { cookie },
  });

  assert.equal((await request("/api/admin/auth/me")).status, 200);
  assert.equal((await request("/api/admin/users")).status, 200);

  activeAdmins = [{ role: "owner", mfaEnabled: true }];

  assert.equal((await request("/api/admin/auth/me")).status, 401);
  assert.equal((await request("/api/admin/users")).status, 401);
});