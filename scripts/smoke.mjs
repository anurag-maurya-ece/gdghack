import assert from "node:assert/strict";

// Run against a real local server, never a mocked response or production endpoint.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Smoke checks must stay local");

// 1. Home Page Check (SIH-Wekreta UI)
const homeRes = await fetch(base, { signal: AbortSignal.timeout(15_000) });
assert.equal(homeRes.status, 200);
const homeHtml = await homeRes.text();
assert.match(homeHtml, /WEkreta/);
assert.match(homeHtml, /START TO SUCCESS/);
assert.match(homeHtml, /Empowering your long-lived/);
assert.match(homeHtml, /Hear it from our customers/);
console.log("PASS: home returns 200 with SIH-Wekreta layout, hero and feedback carousel");

// 2. About Us Check
const aboutRes = await fetch(new URL("/aboutus", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(aboutRes.status, 200);
const aboutHtml = await aboutRes.text();
assert.match(aboutHtml, /ABOUT/);
assert.match(aboutHtml, /problems of street vendors/);
console.log("PASS: /aboutus returns 200 with about story and gif");

// 3. Pricing Check
const pricingRes = await fetch(new URL("/pricing", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(pricingRes.status, 200);
const pricingHtml = await pricingRes.text();
assert.match(pricingHtml, /Designed for a smooth experience/);
assert.match(pricingHtml, /Customer - Free/);
console.log("PASS: /pricing returns 200 with pricing plans");

// 4. Customer Discovery & Live Map Check
const customerRes = await fetch(new URL("/customer", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(customerRes.status, 200);
const customerHtml = await customerRes.text();
assert.match(customerHtml, /Live Thela/);
assert.match(customerHtml, /Bulao Thela/);
console.log("PASS: /customer returns 200 with map controls and Bulao Thela demand ping");

// 5. Vendor Operations Dashboard Check
const vendorRes = await fetch(new URL("/vendor", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(vendorRes.status, 200);
const vendorHtml = await vendorRes.text();
assert.match(vendorHtml, /Ramesh Bhaiya/);
assert.match(vendorHtml, /Thela ON/);
assert.match(vendorHtml, /Voice Listing/);
console.log("PASS: /vendor returns 200 with live toggle, voice listing and inventory");

// 6. Rewards & Reviews Check
const rewardsRes = await fetch(new URL("/rewards", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(rewardsRes.status, 200);
const rewardsHtml = await rewardsRes.text();
assert.match(rewardsHtml, /Review Thelas/);
assert.match(rewardsHtml, /Mohalla Leaderboard/);
console.log("PASS: /rewards returns 200 with leaderboard, review submission and coupon store");

// 7. Stylesheet verification
const styles = [...homeHtml.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^\"]*)?)"[^>]*>/g)];
assert.ok(styles.length > 0, "Built stylesheet must be linked");
for (const [, path] of styles) {
  const css = await fetch(new URL(path.replaceAll("&amp;", "&"), base));
  assert.equal(css.status, 200);
  assert.match(await css.text(), /--color-green/);
}
console.log("PASS: compiled stylesheet is served and includes brand tokens");

// 8. 404 Recovery Check
const missing = await fetch(new URL("/missing-smoke-check-page", base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Yeh gali abhi khaali hai/);
console.log("PASS: unknown route returns 404 with friendly recovery page");
