import assert from "node:assert/strict";
import test from "node:test";
import {
  cryptoRouteFromSnapshot,
  receivedSolanaTokenUnits,
} from "./crypto-payments";

const walletAddress = "E7EXxfoqVc9PMKzeU6xSJdcK2Ur83rKCZymcHQ9r8iNM";
const canonicalUsdtMint = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB";
const legacyIncorrectMint = "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY6bmFFP1VMZ8c";

test("legacy Solana USDT snapshots use the canonical mint during verification", () => {
  const route = cryptoRouteFromSnapshot({
    id: "solana:USDT",
    enabled: true,
    network: "solana",
    currency: "USDT",
    tokenContract: legacyIncorrectMint,
    tokenDecimals: 6,
    walletAddress,
    minConfirmations: 1,
  });

  assert.ok(route);
  assert.equal(route.tokenContract, canonicalUsdtMint);
});

test("counts canonical Solana USDT received by the configured wallet owner", () => {
  const received = receivedSolanaTokenUnits(
    [{
      accountIndex: 2,
      mint: canonicalUsdtMint,
      owner: walletAddress,
      uiTokenAmount: { amount: "0" },
    }],
    [{
      accountIndex: 2,
      mint: canonicalUsdtMint,
      owner: walletAddress,
      uiTokenAmount: { amount: "13589757" },
    }],
    canonicalUsdtMint,
    walletAddress,
  );

  assert.equal(received, 13_589_757n);
});

test("does not count a matching token sent to a different wallet owner", () => {
  const received = receivedSolanaTokenUnits(
    [],
    [{
      accountIndex: 2,
      mint: canonicalUsdtMint,
      owner: "BK64bvZDt1EgkbEcf64dMyV4frzC5qFBetWCBNZqSTXt",
      uiTokenAmount: { amount: "13589757" },
    }],
    canonicalUsdtMint,
    walletAddress,
  );

  assert.equal(received, 0n);
});