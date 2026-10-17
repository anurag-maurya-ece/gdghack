import assert from "node:assert/strict";

// Run against a real local server, never a mocked response or production endpoint.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Smoke checks must stay local");

// 1. Home Page Check
const homeRes = await fetch(base, { signal: AbortSignal.timeout(15_000) });
assert.equal(homeRes.status, 200);
const homeHtml = await homeRes.text();
assert.match(homeHtml, /Tech Thela/);
assert.match(homeHtml, /START TO SUCCESS/);
assert.match(homeHtml, /Empowering your long-lived/);
assert.match(homeHtml, /Hear it from our customers/);
console.log("PASS: home returns 200 with Tech Thela hero, stats, roles, and feedback carousel");

// 1b. Vendor Login Check
const vLoginRes = await fetch(new URL("/Vendorlogin", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(vLoginRes.status, 200);
const vLoginHtml = await vLoginRes.text();
assert.match(vLoginHtml, /Vendor Login/);
assert.match(vLoginHtml, /Grow Your/);
console.log("PASS: /Vendorlogin returns 200 with business sign-in form");

// 1c. Customer Login Check
const cLoginRes = await fetch(new URL("/Customerlogin", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(cLoginRes.status, 200);
const cLoginHtml = await cLoginRes.text();
assert.match(cLoginHtml, /Customer Login/);
assert.match(cLoginHtml, /Fresh/);
console.log("PASS: /Customerlogin returns 200 with customer sign-in form");

// 1d. Questionnaire Form Check
const formRes = await fetch(new URL("/form", base), { signal: AbortSignal.timeout(15_000) });
assert.equal(formRes.status, 200);
const formHtml = await formRes.text();
assert.match(formHtml, /Let us know something about you/);
console.log("PASS: /form returns 200 with customer household questionnaire");

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
assert.match(vendorHtml, /Update Inventory/);
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

// 9. Backend API Routes Check (ref-sih-wekreta & The-Hashira)
const apiVendorRes = await fetch(new URL("/api/vendor", base));
assert.equal(apiVendorRes.status, 200);
const apiVendorData = await apiVendorRes.json();
assert.equal(apiVendorData.success, true);
console.log("PASS: /api/vendor returns 200 with vendor data");

const apiLeaderboardRes = await fetch(new URL("/api/leaderboard", base));
assert.equal(apiLeaderboardRes.status, 200);
const apiLeaderboardData = await apiLeaderboardRes.json();
assert.equal(apiLeaderboardData.success, true);
console.log("PASS: /api/leaderboard returns 200 with rankings");

const apiReviewsRes = await fetch(new URL("/api/reviews", base));
assert.equal(apiReviewsRes.status, 200);
const apiReviewsData = await apiReviewsRes.json();
assert.equal(apiReviewsData.success, true);
console.log("PASS: /api/reviews returns 200 with community reviews");

// 10. WhatsApp Bot Simulator & Webhook Handshake Check
const whatsappPageRes = await fetch(new URL("/whatsapp", base));
assert.equal(whatsappPageRes.status, 200);
assert.match(await whatsappPageRes.text(), /Tech Thela Bot/);
console.log("PASS: /whatsapp returns 200 with WhatsApp Bot Simulator");

const webhookVerifyUrl = new URL("/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=tech_thela_webhook_secret&hub.challenge=test_challenge_123", base);
const webhookGetRes = await fetch(webhookVerifyUrl);
assert.equal(webhookGetRes.status, 200);
assert.equal(await webhookGetRes.text(), "test_challenge_123");
console.log("PASS: /api/whatsapp/webhook GET verification handshake returns 200 with challenge");

const webhookPostRes = await fetch(new URL("/api/whatsapp/webhook", base), {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ from: "9876543210", text: "aaj aloo 20 rupaye kilo, pyaaz 35" }),
});
assert.equal(webhookPostRes.status, 200);
const webhookPostData = await webhookPostRes.json();
assert.equal(webhookPostData.success, true);
assert.equal(webhookPostData.action, "VOICE_CONFIRMATION_REQUIRED");
console.log("PASS: /api/whatsapp/webhook POST voice/text extraction returns 200 with confirmation");

// 11. WhatsApp Twilio Sandbox TwiML Check
const twilioParams = new URLSearchParams();
twilioParams.append("From", "whatsapp:+919876543210");
twilioParams.append("To", "whatsapp:+14155238886");
twilioParams.append("Body", "kahan jaun?");

const twilioPostRes = await fetch(new URL("/api/whatsapp/webhook", base), {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: twilioParams.toString(),
});
assert.equal(twilioPostRes.status, 200);
const twilioXml = await twilioPostRes.text();
assert.match(twilioXml, /<Response>/);
assert.match(twilioXml, /<Message>/);
assert.match(twilioXml, /High Demand Zones/);
console.log("PASS: /api/whatsapp/webhook POST Twilio form returns valid TwiML XML with recommendations");

