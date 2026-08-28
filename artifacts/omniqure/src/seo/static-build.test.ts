import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const artifactRoot = new URL("../../", import.meta.url);
const workspaceRoot = new URL("../../../../", import.meta.url);

test("the production build serves referral metadata from the static sign-up document", async () => {
  const [mainHtml, referralHtml, replitConfig] = await Promise.all([
    readFile(new URL("dist/public/index.html", artifactRoot), "utf8"),
    readFile(new URL("dist/public/sign-up/index.html", artifactRoot), "utf8"),
    readFile(new URL(".replit", workspaceRoot), "utf8"),
  ]);

  assert.doesNotMatch(mainHtml, /data-seo="referral"/);
  assert.match(referralHtml, /property="og:title" content="Join OmniQure — Get 10% Off Your First Order/);
  assert.match(referralHtml, /property="og:description" content="[^"]*10% off[^"]*£25 credit/);
  assert.match(referralHtml, /property="og:image" content="https:\/\/omniqure\.com\/opengraph\.jpg"/);
  assert.match(referralHtml, /name="twitter:card" content="summary_large_image"/);
  assert.match(referralHtml, /rel="canonical" href="https:\/\/omniqure\.com\/sign-up"/);
  assert.match(referralHtml, /data-seo="referral">.*"@type":"WebPage"/);
  assert.doesNotMatch(referralHtml, /ABC123/);
  assert.match(
    replitConfig,
    /\[\[deployment\.rewrites\]\]\s+from = "\/sign-up"\s+to = "\/sign-up\/index\.html"/,
  );
});