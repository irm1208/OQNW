import { db, storeSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export const CRYPTO_CURRENCIES = ["BTC", "ETH", "SOL", "USDT", "USDC"] as const;
export const CRYPTO_NETWORKS = ["bitcoin", "ethereum", "bsc", "arbitrum", "polygon", "solana", "tron"] as const;
export type CryptoCurrency = typeof CRYPTO_CURRENCIES[number];
export type CryptoNetwork = typeof CRYPTO_NETWORKS[number];
export type CryptoPaymentStatus = "rate_locked" | "pending" | "confirmed" | "underpaid" | "wrong_wallet" | "manual_review";

export type CryptoPaymentRoute = {
  id: string;
  currency: CryptoCurrency;
  network: CryptoNetwork;
  walletAddress: string;
  tokenContract?: string;
  tokenDecimals: number;
  minConfirmations: number;
  enabled: boolean;
};

export type CryptoPaymentDetails = {
  currency: CryptoCurrency;
  network: CryptoNetwork;
  walletAddress: string;
  expectedAmount: string;
  rateUsd: number;
  rateExpiresAt: string;
  confirmationsRequired: number;
};

export type CryptoVerificationResult = {
  status: Exclude<CryptoPaymentStatus, "rate_locked">;
  reason: string;
  observedAmount?: string;
  confirmations?: number;
  occurredAt?: string;
  evidence: Record<string, unknown>;
};

const STABLECOINS = new Set<CryptoCurrency>(["USDT", "USDC"]);
const RATE_TTL_MS = 2 * 60 * 1000;
const GBP_USD_TTL_MS = 5 * 60 * 1000;
const RATE_LOCK_MS = 15 * 60 * 1000;
const PAYMENT_TOLERANCE = 0.005;

const TOKEN_DEFAULTS: Partial<Record<CryptoNetwork, Partial<Record<CryptoCurrency, { contract: string; decimals: number }>>>> = {
  ethereum: {
    USDT: { contract: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    USDC: { contract: "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", decimals: 6 },
  },
  bsc: {
    USDT: { contract: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
    USDC: { contract: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18 },
  },
  arbitrum: {
    USDT: { contract: "0xFd086bC7CD5C481DCC9C85eA0bE2cA18E3B4dB0", decimals: 6 },
    USDC: { contract: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", decimals: 6 },
  },
  polygon: {
    USDT: { contract: "0xc2132D05D31c914a87C6611C10748AaCbC532cA6", decimals: 6 },
    USDC: { contract: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359", decimals: 6 },
  },
  solana: {
    USDT: { contract: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY6bmFFP1VMZ8c", decimals: 6 },
    USDC: { contract: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", decimals: 6 },
  },
  tron: {
    USDT: { contract: "TR7NHqjeKQxGTCi8q8ZY4pL8otS5YDRu4M", decimals: 6 },
  },
};

function rpcEndpoints(configured: string | undefined, fallbacks: string[]): string[] {
  return [...new Set([configured, ...fallbacks].filter((endpoint): endpoint is string => Boolean(endpoint)))];
}

const RPC_ENDPOINTS: Record<Exclude<CryptoNetwork, "bitcoin" | "tron">, string[]> = {
  ethereum: rpcEndpoints(process.env.CRYPTO_RPC_ETHEREUM, [
    "https://ethereum-rpc.publicnode.com",
    "https://1rpc.io/eth",
    "https://cloudflare-eth.com",
  ]),
  bsc: rpcEndpoints(process.env.CRYPTO_RPC_BSC, [
    "https://bsc-rpc.publicnode.com",
    "https://bsc-dataseed.binance.org",
  ]),
  arbitrum: rpcEndpoints(process.env.CRYPTO_RPC_ARBITRUM, [
    "https://arbitrum-one-rpc.publicnode.com",
    "https://arb1.arbitrum.io/rpc",
  ]),
  polygon: rpcEndpoints(process.env.CRYPTO_RPC_POLYGON, [
    "https://polygon-bor-rpc.publicnode.com",
    "https://polygon-rpc.com",
  ]),
  solana: rpcEndpoints(process.env.CRYPTO_RPC_SOLANA, [
    "https://solana-rpc.publicnode.com",
    "https://api.mainnet-beta.solana.com",
  ]),
};

let cachedUsdRates: { values: Partial<Record<CryptoCurrency, number>>; expiresAt: number } | null = null;
let cachedGbpUsdRate: { value: number; expiresAt: number } | null = null;

function asCurrency(value: unknown): CryptoCurrency | null {
  const upper = typeof value === "string" ? value.trim().toUpperCase() : "";
  return (CRYPTO_CURRENCIES as readonly string[]).includes(upper) ? upper as CryptoCurrency : null;
}

function asNetwork(value: unknown): CryptoNetwork | null {
  const lower = typeof value === "string" ? value.trim().toLowerCase() : "";
  return (CRYPTO_NETWORKS as readonly string[]).includes(lower) ? lower as CryptoNetwork : null;
}

function tokenDefaults(currency: CryptoCurrency, network: CryptoNetwork) {
  return TOKEN_DEFAULTS[network]?.[currency];
}

function routeIsSupported(route: CryptoPaymentRoute): boolean {
  if (route.currency === "BTC") return route.network === "bitcoin";
  if (route.currency === "ETH") return route.network === "ethereum";
  if (route.currency === "SOL") return route.network === "solana";
  if (route.currency === "USDT" || route.currency === "USDC") return Boolean(tokenDefaults(route.currency, route.network));
  return false;
}

function parseRoutes(raw: string): CryptoPaymentRoute[] {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    logger.warn("Crypto payment routes could not be parsed");
    return [];
  }
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();
  const parsed: CryptoPaymentRoute[] = [];
  for (const row of value) {
    if (!row || typeof row !== "object") continue;
    const data = row as Record<string, unknown>;
    const currency = asCurrency(data.currency);
    const network = asNetwork(data.network);
    const walletAddress = typeof data.walletAddress === "string" ? data.walletAddress.trim() : "";
    if (!currency || !network || walletAddress.length < 12) continue;
    const defaults = tokenDefaults(currency, network);
    const tokenContract = typeof data.tokenContract === "string" && data.tokenContract.trim()
      ? data.tokenContract.trim()
      : defaults?.contract;
    const tokenDecimals = Number.isInteger(data.tokenDecimals) && Number(data.tokenDecimals) >= 0
      ? Number(data.tokenDecimals)
      : defaults?.decimals ?? (currency === "BTC" ? 8 : currency === "SOL" ? 9 : 18);
    const minConfirmations = Number.isInteger(data.minConfirmations) && Number(data.minConfirmations) > 0
      ? Math.min(Number(data.minConfirmations), 100)
      : network === "bitcoin" ? 1 : network === "solana" || network === "tron" ? 1 : 3;
    const id = `${network}:${currency}`;
    if (seen.has(id)) continue;
    const route: CryptoPaymentRoute = {
      id,
      currency,
      network,
      walletAddress,
      tokenContract,
      tokenDecimals,
      minConfirmations,
      enabled: data.enabled !== false,
    };
    if (routeIsSupported(route)) {
      parsed.push(route);
      seen.add(id);
    }
  }
  return parsed;
}

export function serializeCryptoRoutes(routes: unknown): string {
  const safeRoutes = parseRoutes(JSON.stringify(routes));
  return JSON.stringify(safeRoutes.map(({ id: _id, ...route }) => route));
}

export function cryptoRouteFromSnapshot(value: unknown): CryptoPaymentRoute | null {
  return parseRoutes(JSON.stringify([value]))[0] ?? null;
}

export async function getCryptoPaymentRoutes(includeDisabled = false): Promise<CryptoPaymentRoute[]> {
  const [settings] = await db.select().from(storeSettingsTable).limit(1);
  if (!settings || !settings.cryptoPaymentsEnabled) return [];
  return parseRoutes(settings.cryptoPaymentRoutes).filter((route) => includeDisabled || route.enabled);
}

export async function getPublicCryptoPaymentOptions(): Promise<Array<Pick<CryptoPaymentRoute, "currency" | "network" | "minConfirmations">>> {
  const routes = await getCryptoPaymentRoutes();
  return routes.map(({ currency, network, minConfirmations }) => ({ currency, network, minConfirmations }));
}

export async function getCryptoPaymentRoute(currency: unknown, network: unknown): Promise<CryptoPaymentRoute | null> {
  const parsedCurrency = asCurrency(currency);
  const parsedNetwork = asNetwork(network);
  if (!parsedCurrency || !parsedNetwork) return null;
  const routes = await getCryptoPaymentRoutes();
  return routes.find((route) => route.currency === parsedCurrency && route.network === parsedNetwork) ?? null;
}

async function getGbpUsdRate(): Promise<number | null> {
  if (cachedGbpUsdRate && cachedGbpUsdRate.expiresAt > Date.now()) return cachedGbpUsdRate.value;
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/GBP", { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const body = await response.json() as { rates?: { USD?: unknown } };
    const rate = Number(body.rates?.USD);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    cachedGbpUsdRate = { value: rate, expiresAt: Date.now() + GBP_USD_TTL_MS };
    return rate;
  } catch (err) {
    logger.warn({ err }, "Could not retrieve GBP/USD crypto rate");
    return null;
  }
}

async function getUsdRate(currency: CryptoCurrency): Promise<number | null> {
  if (STABLECOINS.has(currency)) return 1;
  if (cachedUsdRates?.expiresAt && cachedUsdRates.expiresAt > Date.now()) {
    return cachedUsdRates.values[currency] ?? null;
  }
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
      { signal: AbortSignal.timeout(5000) },
    );
    if (!response.ok) return null;
    const body = await response.json() as {
      bitcoin?: { usd?: unknown };
      ethereum?: { usd?: unknown };
      solana?: { usd?: unknown };
    };
    const values: Partial<Record<CryptoCurrency, number>> = {
      BTC: Number(body.bitcoin?.usd),
      ETH: Number(body.ethereum?.usd),
      SOL: Number(body.solana?.usd),
      USDT: 1,
      USDC: 1,
    };
    if (Object.values(values).some((rate) => rate !== undefined && (!Number.isFinite(rate) || rate <= 0))) return null;
    cachedUsdRates = { values, expiresAt: Date.now() + RATE_TTL_MS };
    return values[currency] ?? null;
  } catch (err) {
    logger.warn({ err, currency }, "Could not retrieve crypto market rate");
    return null;
  }
}

function formatAmount(amount: number, decimals: number): string {
  const precision = Math.min(Math.max(decimals, 6), 12);
  return amount.toFixed(precision).replace(/\.?0+$/, "");
}

export async function prepareCryptoPayment(
  totalGbp: number,
  currency: unknown,
  network: unknown,
): Promise<{ details: CryptoPaymentDetails; route: CryptoPaymentRoute } | null> {
  if (!Number.isFinite(totalGbp) || totalGbp <= 0) return null;
  const route = await getCryptoPaymentRoute(currency, network);
  if (!route) return null;
  const [gbpUsd, assetUsd] = await Promise.all([getGbpUsdRate(), getUsdRate(route.currency)]);
  if (!gbpUsd || !assetUsd) return null;
  const expectedAmount = totalGbp * gbpUsd / assetUsd;
  if (!Number.isFinite(expectedAmount) || expectedAmount <= 0) return null;
  const rateExpiresAt = new Date(Date.now() + RATE_LOCK_MS);
  return {
    route,
    details: {
      currency: route.currency,
      network: route.network,
      walletAddress: route.walletAddress,
      expectedAmount: formatAmount(expectedAmount, route.tokenDecimals),
      rateUsd: assetUsd,
      rateExpiresAt: rateExpiresAt.toISOString(),
      confirmationsRequired: route.minConfirmations,
    },
  };
}

export function normalizeTransactionHash(network: CryptoNetwork, value: unknown): string | null {
  if (typeof value !== "string") return null;
  const hash = value.trim();
  if (network === "solana") return /^[1-9A-HJ-NP-Za-km-z]{32,120}$/.test(hash) ? hash : null;
  if (network === "bitcoin") return /^[a-fA-F0-9]{64}$/.test(hash) ? hash.toLowerCase() : null;
  const withoutPrefix = hash.replace(/^0x/i, "");
  return /^[a-fA-F0-9]{64}$/.test(withoutPrefix) ? `0x${withoutPrefix.toLowerCase()}` : null;
}

function decimalFromUnits(value: bigint, decimals: number): number {
  const divider = 10 ** decimals;
  return Number(value) / divider;
}

function expectedAmountMatches(observed: number, expectedAmount: number): "confirmed" | "underpaid" {
  return observed + Number.EPSILON >= expectedAmount * (1 - PAYMENT_TOLERANCE) ? "confirmed" : "underpaid";
}

function evmAddress(value: string | null | undefined): string {
  return value?.toLowerCase() ?? "";
}

async function rpc(network: Exclude<CryptoNetwork, "bitcoin" | "tron">, method: string, params: unknown[]): Promise<unknown> {
  const endpoints = RPC_ENDPOINTS[network];
  let lastError: unknown;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error(`RPC returned ${response.status}`);
      const payload = await response.json() as { result?: unknown; error?: { message?: string } };
      if (payload.error) throw new Error(payload.error.message || "RPC error");
      return payload.result;
    } catch (err) {
      lastError = err;
      logger.warn(
        { err, network, method },
        "Crypto RPC provider failed; trying the next configured provider",
      );
    }
  }
  throw lastError instanceof Error ? lastError : new Error("No RPC provider is available");
}

async function verifyEvm(route: CryptoPaymentRoute, txHash: string, expectedAmount: number): Promise<CryptoVerificationResult> {
  const receipt = await rpc(route.network as Exclude<CryptoNetwork, "bitcoin" | "tron" | "solana">, "eth_getTransactionReceipt", [txHash]) as {
    status?: string; blockNumber?: string; logs?: Array<{ address?: string; topics?: string[]; data?: string }>;
  } | null;
  if (!receipt) {
    return { status: "pending", reason: "Transaction has not appeared on this network yet.", evidence: { txHash } };
  }
  if (receipt.status !== "0x1") {
    return { status: "manual_review", reason: "The network reports this transaction failed.", evidence: { txHash, receiptStatus: receipt.status } };
  }
  const blockNumber = receipt.blockNumber ? Number(BigInt(receipt.blockNumber)) : 0;
  const block = receipt.blockNumber
    ? await rpc(route.network as Exclude<CryptoNetwork, "bitcoin" | "tron" | "solana">, "eth_getBlockByNumber", [receipt.blockNumber, false]) as { timestamp?: string } | null
    : null;
  const occurredAt = block?.timestamp ? new Date(Number(BigInt(block.timestamp)) * 1000).toISOString() : undefined;
  const currentBlockHex = await rpc(route.network as Exclude<CryptoNetwork, "bitcoin" | "tron" | "solana">, "eth_blockNumber", []) as string;
  const confirmations = blockNumber ? Math.max(0, Number(BigInt(currentBlockHex)) - blockNumber + 1) : 0;

  let observedAmount = 0;
  let recipientMatched = false;
  if (route.currency === "ETH") {
    const tx = await rpc(route.network as Exclude<CryptoNetwork, "bitcoin" | "tron" | "solana">, "eth_getTransactionByHash", [txHash]) as {
      to?: string | null; value?: string;
    } | null;
    recipientMatched = evmAddress(tx?.to) === evmAddress(route.walletAddress);
    observedAmount = tx?.value ? decimalFromUnits(BigInt(tx.value), route.tokenDecimals) : 0;
  } else {
    const transferTopic = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef";
    const tokenContract = evmAddress(route.tokenContract);
    for (const log of receipt.logs ?? []) {
      const recipient = log.topics?.[2] ? `0x${log.topics[2].slice(-40)}` : "";
      if (
        evmAddress(log.address) === tokenContract &&
        log.topics?.[0]?.toLowerCase() === transferTopic &&
        evmAddress(recipient) === evmAddress(route.walletAddress) &&
        log.data
      ) {
        recipientMatched = true;
        observedAmount += decimalFromUnits(BigInt(log.data), route.tokenDecimals);
      }
    }
  }
  if (!recipientMatched) {
    return {
      status: "wrong_wallet",
      reason: "The transaction does not transfer the selected asset to the configured wallet.",
      confirmations,
      evidence: { txHash, blockNumber, route: route.id },
    };
  }
  const amountStatus = expectedAmountMatches(observedAmount, expectedAmount);
  if (amountStatus === "underpaid") {
    return {
      status: "underpaid",
      reason: "The received amount is below the locked payment amount.",
      observedAmount: formatAmount(observedAmount, route.tokenDecimals),
      confirmations,
      evidence: { txHash, blockNumber, route: route.id },
    };
  }
  if (confirmations < route.minConfirmations) {
    return {
      status: "pending",
      reason: `Payment detected; waiting for ${route.minConfirmations} network confirmations.`,
      observedAmount: formatAmount(observedAmount, route.tokenDecimals),
      confirmations,
      evidence: { txHash, blockNumber, route: route.id },
    };
  }
  return {
    status: "confirmed",
    reason: "Payment was verified on-chain.",
    observedAmount: formatAmount(observedAmount, route.tokenDecimals),
    confirmations,
    occurredAt,
    evidence: { txHash, blockNumber, route: route.id },
  };
}

async function verifyBitcoin(route: CryptoPaymentRoute, txHash: string, expectedAmount: number): Promise<CryptoVerificationResult> {
  const txResponse = await fetch(`https://blockstream.info/api/tx/${txHash}`, { signal: AbortSignal.timeout(8000) });
  if (txResponse.status === 404) return { status: "pending", reason: "Transaction has not appeared on Bitcoin yet.", evidence: { txHash } };
  if (!txResponse.ok) throw new Error(`Bitcoin explorer returned ${txResponse.status}`);
  const transaction = await txResponse.json() as {
    status?: { confirmed?: boolean; block_height?: number; block_time?: number };
    vout?: Array<{ value?: number; scriptpubkey_address?: string }>;
  };
  const satoshis = (transaction.vout ?? [])
    .filter((output) => output.scriptpubkey_address === route.walletAddress)
    .reduce((sum, output) => sum + (output.value ?? 0), 0);
  const observedAmount = satoshis / 100_000_000;
  if (!satoshis) {
    return { status: "wrong_wallet", reason: "No BTC output was sent to the configured wallet.", evidence: { txHash, route: route.id } };
  }
  const amountStatus = expectedAmountMatches(observedAmount, expectedAmount);
  if (amountStatus === "underpaid") {
    return { status: "underpaid", reason: "The received amount is below the locked payment amount.", observedAmount: formatAmount(observedAmount, 8), evidence: { txHash, route: route.id } };
  }
  if (!transaction.status?.confirmed) {
    return { status: "pending", reason: "Payment detected; waiting for Bitcoin confirmation.", observedAmount: formatAmount(observedAmount, 8), confirmations: 0, evidence: { txHash, route: route.id } };
  }
  const tipResponse = await fetch("https://blockstream.info/api/blocks/tip/height", { signal: AbortSignal.timeout(8000) });
  const tip = tipResponse.ok ? Number(await tipResponse.text()) : transaction.status.block_height ?? 0;
  const confirmations = transaction.status.block_height ? Math.max(1, tip - transaction.status.block_height + 1) : 1;
  if (confirmations < route.minConfirmations) {
    return { status: "pending", reason: `Payment detected; waiting for ${route.minConfirmations} Bitcoin confirmations.`, observedAmount: formatAmount(observedAmount, 8), confirmations, evidence: { txHash, route: route.id } };
  }
  return { status: "confirmed", reason: "Payment was verified on Bitcoin.", observedAmount: formatAmount(observedAmount, 8), confirmations, occurredAt: transaction.status?.block_time ? new Date(transaction.status.block_time * 1000).toISOString() : undefined, evidence: { txHash, route: route.id } };
}

async function verifySolana(route: CryptoPaymentRoute, txHash: string, expectedAmount: number): Promise<CryptoVerificationResult> {
  const tx = await rpc("solana", "getTransaction", [txHash, { encoding: "jsonParsed", commitment: "finalized", maxSupportedTransactionVersion: 0 }]) as {
    slot?: number;
    blockTime?: number;
    transaction?: { message?: { accountKeys?: Array<{ pubkey?: string }> } };
    meta?: {
      err?: unknown;
      preBalances?: number[];
      postBalances?: number[];
      preTokenBalances?: Array<{ accountIndex?: number; mint?: string; owner?: string; uiTokenAmount?: { amount?: string } }>;
      postTokenBalances?: Array<{ accountIndex?: number; mint?: string; owner?: string; uiTokenAmount?: { amount?: string } }>;
    };
  } | null;
  if (!tx) return { status: "pending", reason: "Transaction has not appeared on Solana yet.", evidence: { txHash } };
  if (tx.meta?.err) return { status: "manual_review", reason: "The Solana network reports this transaction failed.", evidence: { txHash, error: tx.meta.err } };
  if (route.currency === "SOL") {
    const accountKeys = tx.transaction?.message?.accountKeys ?? [];
    const recipientIndex = accountKeys.findIndex((account) => account.pubkey === route.walletAddress);
    const receivedUnits = recipientIndex >= 0
      ? BigInt(Math.max(0, (tx.meta?.postBalances?.[recipientIndex] ?? 0) - (tx.meta?.preBalances?.[recipientIndex] ?? 0)))
      : 0n;
    const observedAmount = decimalFromUnits(receivedUnits, route.tokenDecimals);
    if (!receivedUnits) return { status: "wrong_wallet", reason: "No SOL was received by the configured Solana wallet.", evidence: { txHash, route: route.id } };
    if (expectedAmountMatches(observedAmount, expectedAmount) === "underpaid") {
      return { status: "underpaid", reason: "The received amount is below the locked payment amount.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), evidence: { txHash, route: route.id } };
    }
    return { status: "confirmed", reason: "Payment was verified on Solana.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), confirmations: route.minConfirmations, occurredAt: typeof tx.blockTime === "number" ? new Date(tx.blockTime * 1000).toISOString() : undefined, evidence: { txHash, slot: tx.slot, route: route.id } };
  }
  const before = new Map<number, bigint>();
  for (const balance of tx.meta?.preTokenBalances ?? []) {
    if (balance.accountIndex !== undefined && balance.mint === route.tokenContract && balance.owner === route.walletAddress) {
      before.set(balance.accountIndex, BigInt(balance.uiTokenAmount?.amount ?? "0"));
    }
  }
  let receivedUnits = 0n;
  for (const balance of tx.meta?.postTokenBalances ?? []) {
    if (balance.accountIndex !== undefined && balance.mint === route.tokenContract && balance.owner === route.walletAddress) {
      const after = BigInt(balance.uiTokenAmount?.amount ?? "0");
      const previous = before.get(balance.accountIndex) ?? 0n;
      if (after > previous) receivedUnits += after - previous;
    }
  }
  const observedAmount = decimalFromUnits(receivedUnits, route.tokenDecimals);
  if (!receivedUnits) return { status: "wrong_wallet", reason: "No selected token was received by the configured Solana wallet.", evidence: { txHash, route: route.id } };
  if (expectedAmountMatches(observedAmount, expectedAmount) === "underpaid") {
    return { status: "underpaid", reason: "The received amount is below the locked payment amount.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), evidence: { txHash, route: route.id } };
  }
  return { status: "confirmed", reason: "Payment was verified on Solana.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), confirmations: route.minConfirmations, occurredAt: typeof tx.blockTime === "number" ? new Date(tx.blockTime * 1000).toISOString() : undefined, evidence: { txHash, slot: tx.slot, route: route.id } };
}

async function verifyTron(route: CryptoPaymentRoute, txHash: string, expectedAmount: number): Promise<CryptoVerificationResult> {
  const response = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}/events?only_confirmed=true&limit=200`, { signal: AbortSignal.timeout(8000) });
  if (response.status === 404) return { status: "pending", reason: "Transaction has not appeared on Tron yet.", evidence: { txHash } };
  if (!response.ok) throw new Error(`Tron explorer returned ${response.status}`);
  const body = await response.json() as {
    data?: Array<{ event_name?: string; contract_address?: string; result?: { to?: string; value?: string } }>;
  };
  const transfer = (body.data ?? []).find((event) =>
    event.event_name === "Transfer" &&
    event.contract_address === route.tokenContract &&
    event.result?.to === route.walletAddress,
  );
  if (!transfer) return { status: "wrong_wallet", reason: "No USDT transfer was received by the configured Tron wallet.", evidence: { txHash, route: route.id } };
  const observedAmount = decimalFromUnits(BigInt(transfer.result?.value ?? "0"), route.tokenDecimals);
  if (expectedAmountMatches(observedAmount, expectedAmount) === "underpaid") {
    return { status: "underpaid", reason: "The received amount is below the locked payment amount.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), evidence: { txHash, route: route.id } };
  }
  const transactionResponse = await fetch(`https://api.trongrid.io/v1/transactions/${txHash}`, { signal: AbortSignal.timeout(8000) });
  const transactionBody = transactionResponse.ok
    ? await transactionResponse.json() as { data?: Array<{ raw_data?: { timestamp?: number } }> }
    : null;
  const occurredAt = transactionBody?.data?.[0]?.raw_data?.timestamp;
  return { status: "confirmed", reason: "Payment was verified on Tron.", observedAmount: formatAmount(observedAmount, route.tokenDecimals), confirmations: route.minConfirmations, occurredAt: typeof occurredAt === "number" ? new Date(occurredAt).toISOString() : undefined, evidence: { txHash, route: route.id } };
}

export async function verifyCryptoPayment(
  route: CryptoPaymentRoute,
  txHash: string,
  expectedAmount: string | number,
): Promise<CryptoVerificationResult> {
  const expected = Number(expectedAmount);
  if (!Number.isFinite(expected) || expected <= 0) {
    return { status: "manual_review", reason: "The order has no valid locked crypto amount.", evidence: { route: route.id } };
  }
  try {
    if (route.network === "bitcoin") return await verifyBitcoin(route, txHash, expected);
    if (route.network === "solana") return await verifySolana(route, txHash, expected);
    if (route.network === "tron") return await verifyTron(route, txHash, expected);
    return await verifyEvm(route, txHash, expected);
  } catch (err) {
    logger.warn({ err, txHash, route: route.id }, "Crypto payment verification could not complete");
    return {
      status: "pending",
      reason: "Verification is temporarily unavailable. We will check the transaction again automatically.",
      evidence: { txHash, route: route.id, verifierError: true },
    };
  }
}

export function isRateLockExpired(value: Date | null): boolean {
  return !value || value.getTime() <= Date.now();
}