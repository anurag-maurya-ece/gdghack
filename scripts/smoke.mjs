import assert from "node:assert/strict";

// Run against a real local server, never a mocked response or production endpoint.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Smoke checks must stay local");

// 1. Home Page Check
const homeRes = await fetch(base, { signal: AbortSignal.timeout(15_000) });
assert.equal(homeRes.status, 200);
const homeHtml = await homeRes.text();
assert.match(homeHtml, /Tech Thela/);
assert.match(homeHtml, /id="main"/);
assert.match(homeHtml, /Aas-Paas Ke Thele Dekhein/);
console.log("PASS: home returns 200 with title and navigation targets");

// 2. Customer Discovery & Live Map Check
const customerRes = await fetch(new URL("/customer", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(customerRes.status, 200);
const customerHtml = await customerRes.text();
assert.match(customerHtml, /Live Thela/);
assert.match(customerHtml, /Bulao Thela/);
console.log("PASS: /customer returns 200 with map controls and Bulao Thela demand ping");

// 3. Vendor Operations Dashboard Check
const vendorRes = await fetch(new URL("/vendor", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(vendorRes.status, 200);
const vendorHtml = await vendorRes.text();
assert.match(vendorHtml, /Ramesh Bhaiya/);
assert.match(vendorHtml, /Thela ON/);
assert.match(vendorHtml, /Voice Listing/);
console.log("PASS: /vendor returns 200 with live toggle, voice listing and inventory");

// 4. Rewards & Reviews Check
const rewardsRes = await fetch(new URL("/rewards", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(rewardsRes.status, 200);
const rewardsHtml = await rewardsRes.text();
assert.match(rewardsHtml, /Review Thelas/);
assert.match(rewardsHtml, /Mohalla Leaderboard/);
assert.match(rewardsHtml, /Redeem Discount Coupons/);
console.log("PASS: /rewards returns 200 with leaderboard, review submission and coupon store");

// 5. Stylesheet verification
const styles = [...homeHtml.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^\"]*)?)"[^>]*>/g)];
assert.ok(styles.length > 0, "Built stylesheet must be linked");
for (const [, path] of styles) {
  const css = await fetch(new URL(path.replaceAll("&amp;", "&"), base));
  assert.equal(css.status, 200);
  assert.match(await css.text(), /--color-green/);
}
console.log("PASS: compiled stylesheet is served and includes brand tokens");

// 6. 404 Recovery Check
const missing = await fetch(new URL("/missing-smoke-check-page", base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Yeh gali abhi khaali hai/);
console.log("PASS: unknown route returns 404 with friendly recovery page");
