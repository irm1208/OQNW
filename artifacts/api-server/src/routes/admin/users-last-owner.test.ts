import assert from "node:assert/strict";
import test from "node:test";
import {
  LastActiveOwnerError,
  protectLastActiveOwner,
  type OwnerGuardUser,
} from "./users";

type User = OwnerGuardUser & { id: number };

class Mutex {
  private tail = Promise.resolve();

  async lock(): Promise<() => void> {
    let release!: () => void;
    const previous = this.tail;
    this.tail = new Promise<void>((resolve) => { release = resolve; });
    await previous;
    return release;
  }
}

async function guardedMutation(
  users: Map<number, User>,
  mutex: Mutex,
  id: number,
  action: "disable" | "demote" | "delete",
): Promise<User | null> {
  let release: (() => void) | undefined;
  try {
    return await protectLastActiveOwner(
      async () => { release = await mutex.lock(); },
      async () => users.get(id) ?? null,
      async () => [...users.values()].some((user) => user.id !== id && user.role === "owner" && user.isActive),
      () => true,
      async () => {
        const target = users.get(id);
        if (!target) return null;
        if (action === "delete") {
          users.delete(id);
          return target;
        }
        const updated = {
          ...target,
          ...(action === "disable" ? { isActive: false } : { role: "admin" }),
        };
        users.set(id, updated);
        return updated;
      },
    );
  } finally {
    release?.();
  }
}

for (const action of ["disable", "demote", "delete"] as const) {
  test(`rejects ${action} of the final active owner`, async () => {
    const users = new Map([[1, { id: 1, role: "owner", isActive: true }]]);

    await assert.rejects(
      guardedMutation(users, new Mutex(), 1, action),
      LastActiveOwnerError,
    );
    assert.deepEqual(users.get(1), { id: 1, role: "owner", isActive: true });
  });

  test(`allows ${action} when another active owner exists`, async () => {
    const users = new Map([
      [1, { id: 1, role: "owner", isActive: true }],
      [2, { id: 2, role: "owner", isActive: true }],
    ]);

    await guardedMutation(users, new Mutex(), 1, action);
    const activeOwners = [...users.values()].filter((user) => user.role === "owner" && user.isActive);
    assert.equal(activeOwners.length, 1);
    assert.equal(activeOwners[0].id, 2);
  });
}

test("concurrent removals cannot both remove the last active owner", async () => {
  const users = new Map([
    [1, { id: 1, role: "owner", isActive: true }],
    [2, { id: 2, role: "owner", isActive: true }],
  ]);
  const mutex = new Mutex();

  const results = await Promise.allSettled([
    guardedMutation(users, mutex, 1, "delete"),
    guardedMutation(users, mutex, 2, "delete"),
  ]);

  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1);
  assert.equal(results.filter(
    (result) => result.status === "rejected" && result.reason instanceof LastActiveOwnerError,
  ).length, 1);
  assert.equal([...users.values()].filter((user) => user.role === "owner" && user.isActive).length, 1);
});