/**
 * Guards against the class of bug where an admin route handler starts
 * returning a new field (e.g. `fraudScore`, `refundedAmountGbp`) without the
 * OpenAPI spec being updated to declare it. When that happens, generated
 * frontend types silently omit the field instead of failing to typecheck,
 * and admin staff can end up looking at a UI that never renders data the
 * server is actually sending.
 *
 * This script statically extracts the field names returned by a curated set
 * of admin response builders in artifacts/api-server/src/routes/admin/*.ts
 * and checks that every field is declared on the corresponding schema in
 * lib/api-spec/openapi.yaml. It does NOT check the reverse (schema fields
 * missing from code) since routes are allowed to omit optional fields.
 *
 * Run with: pnpm --filter @workspace/scripts run check:api-drift
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseYaml } from "yaml";

const ROOT = resolve(import.meta.dirname, "../..");
const OPENAPI_PATH = resolve(ROOT, "lib/api-spec/openapi.yaml");
const ADMIN_ROUTES_DIR = resolve(ROOT, "artifacts/api-server/src/routes/admin");

type OpenApiSchema = {
  properties?: Record<string, unknown>;
};

type OpenApiDoc = {
  components?: { schemas?: Record<string, OpenApiSchema> };
};

function loadSchemaFieldNames(doc: OpenApiDoc, schemaName: string): Set<string> {
  const schema = doc.components?.schemas?.[schemaName];
  if (!schema) {
    throw new Error(`OpenAPI spec has no schema named "${schemaName}" (components.schemas.${schemaName})`);
  }
  return new Set(Object.keys(schema.properties ?? {}));
}

/** Skip over a string/template literal starting at `start` (which points at the opening quote). */
function skipStringLiteral(text: string, start: number): number {
  const quote = text[start];
  let i = start + 1;
  while (i < text.length) {
    if (text[i] === "\\") {
      i += 2;
      continue;
    }
    if (text[i] === quote) return i + 1;
    i++;
  }
  throw new Error("Unterminated string literal while scanning for object literal boundaries");
}

/** Given the index of an opening `{`, return the text between it and its matching `}` (exclusive of braces). */
function extractBalancedBraces(text: string, openIndex: number): string {
  let depth = 0;
  let i = openIndex;
  while (i < text.length) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipStringLiteral(text, i);
      continue;
    }
    if (c === "{") {
      depth++;
      i++;
      continue;
    }
    if (c === "}") {
      depth--;
      if (depth === 0) return text.slice(openIndex + 1, i);
      i++;
      continue;
    }
    i++;
  }
  throw new Error("Unbalanced braces while scanning object literal");
}

/** Split an object literal's inner text into its top-level `key: value` / `...spread` entries. */
function splitTopLevelEntries(inner: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  while (i < inner.length) {
    const c = inner[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipStringLiteral(inner, i);
      continue;
    }
    if ("{[(".includes(c)) {
      depth++;
    } else if ("}])".includes(c)) {
      depth--;
    } else if (c === "," && depth === 0) {
      parts.push(inner.slice(start, i));
      start = i + 1;
    }
    i++;
  }
  parts.push(inner.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

type ParsedEntry = { kind: "key"; name: string } | { kind: "spread"; callee: string };

function parseEntry(entry: string): ParsedEntry | null {
  const spreadMatch = entry.match(/^\.\.\.([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
  if (spreadMatch) return { kind: "spread", callee: spreadMatch[1] };
  const keyMatch = entry.match(/^["']?([A-Za-z_][A-Za-z0-9_]*)["']?\s*:/);
  if (keyMatch) return { kind: "key", name: keyMatch[1] };
  return null;
}

/** Extract the object literal that follows the first `return {` (or `{` after `anchor`) in `content`, starting the search at `fromIndex`. */
function findObjectLiteralAfter(content: string, fromIndex: number): string {
  const braceIndex = content.indexOf("{", fromIndex);
  if (braceIndex === -1) throw new Error("Expected an object literal but found none");
  return extractBalancedBraces(content, braceIndex);
}

/**
 * Resolve the full set of field names an object literal produces, following
 * `...someFunction(...)` spreads into other named object-literal-returning
 * functions declared in the same file (one level of indirection is enough
 * for this codebase's mapper style).
 */
function resolveFields(content: string, objectLiteralText: string, functionsByName: Map<string, string>): Set<string> {
  const fields = new Set<string>();
  for (const entry of splitTopLevelEntries(objectLiteralText)) {
    const parsed = parseEntry(entry);
    if (!parsed) continue;
    if (parsed.kind === "key") {
      fields.add(parsed.name);
    } else {
      const calleeLiteral = functionsByName.get(parsed.callee);
      if (!calleeLiteral) {
        throw new Error(`Spread of unknown function "${parsed.callee}(...)" — add it to functionsByName if it returns an object literal`);
      }
      for (const f of resolveFields(content, calleeLiteral, functionsByName)) fields.add(f);
    }
  }
  return fields;
}

/** Find `function <name>(...) { ... return { ... }; }` and return the inner text of its returned object literal. */
function extractFunctionReturnObject(content: string, functionName: string): string {
  const fnMatch = content.match(new RegExp(`function\\s+${functionName}\\s*\\([^)]*\\)[^{]*\\{`));
  if (!fnMatch || fnMatch.index === undefined) {
    throw new Error(`Could not find function ${functionName} in file`);
  }
  const fnBody = extractBalancedBraces(content, content.indexOf("{", fnMatch.index));
  const returnMatch = fnBody.match(/return\s*\{/);
  if (!returnMatch || returnMatch.index === undefined) {
    throw new Error(`Function ${functionName} does not contain a "return {" object literal`);
  }
  return findObjectLiteralAfter(fnBody, returnMatch.index);
}

/** Find the object literal immediately following the given literal anchor string (first occurrence). */
function extractObjectAfterAnchor(content: string, anchor: string): string {
  const idx = content.indexOf(anchor);
  if (idx === -1) throw new Error(`Could not find anchor "${anchor}" in file`);
  return findObjectLiteralAfter(content, idx + anchor.length);
}

/**
 * Find the object literal that *encloses* the first occurrence of `marker`
 * (e.g. a distinctive line inside a `res.json({ ... })` call), by scanning
 * backwards for the nearest unmatched `{`. Use this when the object literal
 * you care about isn't the first `{` after some anchor (e.g. it's nested
 * inside a route handler's arrow function body).
 */
function extractEnclosingObjectLiteral(content: string, marker: string): string {
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) throw new Error(`Could not find marker "${marker}" in file`);
  let depth = 0;
  let i = markerIndex - 1;
  while (i >= 0) {
    const c = content[i];
    if (c === "}") {
      depth++;
    } else if (c === "{") {
      if (depth === 0) return extractBalancedBraces(content, i);
      depth--;
    }
    i--;
  }
  throw new Error(`Could not find enclosing object literal for marker "${marker}"`);
}

interface Check {
  file: string;
  /** Human-readable label used in error output. */
  label: string;
  /** Extra named object-literal-returning functions this block may spread in (name -> extracted literal text). */
  helperFunctionNames?: string[];
  /** How to find the object literal to check. */
  extract: (content: string) => string;
  /** OpenAPI schema name the extracted fields must be a subset of. */
  schema: string;
}

const checks: Check[] = [
  {
    file: "orders.ts",
    label: "orderToResponse()",
    extract: (content) => extractFunctionReturnObject(content, "orderToResponse"),
    schema: "Order",
  },
  {
    file: "orders.ts",
    label: 'GET /admin/orders/:id response (spreads orderToResponse + extra fields)',
    helperFunctionNames: ["orderToResponse"],
    extract: (content) => extractEnclosingObjectLiteral(content, "...orderToResponse(order),"),
    schema: "OrderDetail",
  },
  {
    file: "orders.ts",
    label: "GET /admin/orders/:id items[] mapping",
    extract: (content) => extractObjectAfterAnchor(content, "items: items.map((item) => ("),
    schema: "OrderItem",
  },
  {
    file: "customers.ts",
    label: "customerToResponse()",
    extract: (content) => extractFunctionReturnObject(content, "customerToResponse"),
    schema: "Customer",
  },
  {
    file: "customers.ts",
    label: 'GET /admin/customers/:id response (spreads customerToResponse + extra fields)',
    helperFunctionNames: ["customerToResponse"],
    extract: (content) => extractEnclosingObjectLiteral(content, "...customerToResponse(customer),"),
    schema: "CustomerDetail",
  },
  {
    file: "customers.ts",
    label: "GET /admin/customers/:id embedded orders[] mapping",
    extract: (content) => extractObjectAfterAnchor(content, "orders: orders.map((o) => ("),
    schema: "Order",
  },
  {
    file: "refunds.ts",
    label: "refundToResponse()",
    extract: (content) => extractFunctionReturnObject(content, "refundToResponse"),
    schema: "Refund",
  },
  {
    file: "fraud.ts",
    label: "GET /admin/fraud order queue select()",
    // The first `.select(...)` in this file is the order-queue projection;
    // the second (for `allFlagged`) only selects fraudScore/fraudReviewed
    // for stats and is intentionally not checked here.
    extract: (content) => extractObjectAfterAnchor(content, ".select("),
    schema: "FraudQueueOrder",
  },
  {
    file: "fraud.ts",
    label: "GET /admin/fraud stats object",
    extract: (content) => extractObjectAfterAnchor(content, "const stats = "),
    schema: "FraudStats",
  },
];

function main() {
  const openApiRaw = readFileSync(OPENAPI_PATH, "utf8");
  const doc = parseYaml(openApiRaw) as OpenApiDoc;

  const failures: string[] = [];
  const fileContentCache = new Map<string, string>();

  for (const check of checks) {
    const filePath = resolve(ADMIN_ROUTES_DIR, check.file);
    let content = fileContentCache.get(filePath);
    if (content === undefined) {
      content = readFileSync(filePath, "utf8");
      fileContentCache.set(filePath, content);
    }

    const functionsByName = new Map<string, string>();
    for (const helperName of check.helperFunctionNames ?? []) {
      functionsByName.set(helperName, extractFunctionReturnObject(content, helperName));
    }

    let objectLiteralText: string;
    try {
      objectLiteralText = check.extract(content);
    } catch (err) {
      failures.push(
        `[${check.file}] Could not locate "${check.label}" — the code moved or was renamed. ` +
          `Update scripts/src/check-api-drift.ts to match, or this check is silently no longer running.\n  ${(err as Error).message}`,
      );
      continue;
    }

    let codeFields: Set<string>;
    try {
      codeFields = resolveFields(content, objectLiteralText, functionsByName);
    } catch (err) {
      failures.push(`[${check.file}] Failed to parse fields for "${check.label}": ${(err as Error).message}`);
      continue;
    }

    let schemaFields: Set<string>;
    try {
      schemaFields = loadSchemaFieldNames(doc, check.schema);
    } catch (err) {
      failures.push(`[${check.file}] ${(err as Error).message}`);
      continue;
    }

    const missing = [...codeFields].filter((f) => !schemaFields.has(f));
    if (missing.length > 0) {
      failures.push(
        `[${check.file}] "${check.label}" returns field(s) not declared on openapi.yaml schema "${check.schema}": ${missing.join(", ")}\n` +
          `  Fix: add the field(s) to components.schemas.${check.schema} in lib/api-spec/openapi.yaml, then run ` +
          `"pnpm --filter @workspace/api-spec run codegen" if the schema feeds generated frontend types.`,
      );
    }
  }

  if (failures.length > 0) {
    console.error("\n✗ API spec drift detected between admin routes and lib/api-spec/openapi.yaml:\n");
    for (const f of failures) console.error(`${f}\n`);
    console.error(`${failures.length} drift issue(s) found.`);
    process.exit(1);
  }

  console.log(`✓ No API spec drift detected across ${checks.length} checked admin response shape(s).`);
}

main();
