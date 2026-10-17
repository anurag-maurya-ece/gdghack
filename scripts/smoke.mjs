import assert from "node:assert/strict";

// Run against a real local server, never a mocked response or production endpoint.
const base = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
assert.ok(["127.0.0.1", "localhost", "[::1]"].includes(base.hostname), "Smoke checks must stay local");

const response = await fetch(base, { signal: AbortSignal.timeout(15_000) });
assert.equal(response.status, 200);
const html = await response.text();
assert.match(html, /Tech Thela \| Apni gali, apna thela/);
assert.match(html, /id="main"/);
assert.match(html, /id="about"/);
assert.match(html, /ordering and chat are not available yet/);
console.log("PASS: home returns 200 with title, navigation targets and honest preview status");

const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css(?:\?[^\"]*)?)"[^>]*>/g)];
assert.ok(styles.length > 0, "Built stylesheet must be linked");
for (const [, path] of styles) {
  const css = await fetch(new URL(path.replaceAll("&amp;", "&"), base));
  assert.equal(css.status, 200);
  assert.match(await css.text(), /--color-green/);
}
console.log("PASS: compiled stylesheet is served and includes brand tokens");

const missing = await fetch(new URL("/missing-smoke-check-page", base));
assert.equal(missing.status, 404);
assert.match(await missing.text(), /Yeh gali abhi khaali hai/);
console.log("PASS: unknown route returns 404 with friendly recovery page");
