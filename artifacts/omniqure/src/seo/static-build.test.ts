import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const artifactRoot = new URL("../../", import.meta.url);
const workspaceRoot = new URL("../../../../", import.meta.url);

test("the production build serves referral metadata from the referral landing document", async () => {
  const [mainHtml, referralHtml, legacyReferralHtml, replitConfig] = await Promise.all([
    readFile(new URL("dist/public/index.html", artifactRoot), "utf8"),
    readFile(new URL("dist/public/refer-a-friend/index.html", artifactRoot), "utf8"),
    readFile(new URL("dist/public/sign-up/index.html", artifactRoot), "utf8"),
    readFile(new URL(".replit", workspaceRoot), "utf8"),
  ]);

  assert.doesNotMatch(mainHtml, /data-seo="referral"/);
  assert.match(referralHtml, /property="og:title" content="Join OmniQure — Get 10% Off Your First Order/);
  assert.match(referralHtml, /property="og:description" content="[^"]*10% off[^"]*£25 credit/);
  assert.match(referralHtml, /property="og:image" content="https:\/\/omniqure\.com\/opengraph\.jpg\?v=4"/);
  assert.match(referralHtml, /name="twitter:card" content="summary_large_image"/);
  assert.match(referralHtml, /rel="canonical" href="https:\/\/omniqure\.com\/refer-a-friend"/);
  assert.match(referralHtml, /data-seo="referral">.*"@type":"WebPage"/);
  assert.doesNotMatch(referralHtml, /ABC123/);
  assert.match(legacyReferralHtml, /property="og:title" content="Join OmniQure — Get 10% Off Your First Order/);
  assert.match(
    replitConfig,
    /\[\[deployment\.rewrites\]\]\s+from = "\/sign-up"\s+to = "\/sign-up\/index\.html"/,
  );
  assert.match(
    replitConfig,
    /\[\[deployment\.rewrites\]\]\s+from = "\/refer-a-friend"\s+to = "\/refer-a-friend\/index\.html"/,
  );
});