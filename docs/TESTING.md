# TESTING

## Foundation checks — 2026-10-17
Environment: Windows, Node 24.13.0, npm 11.6.2. Run npm ci, npm run build, npm start; then npm test in a second terminal.

Actual npm install output:
```text
added 43 packages, and audited 44 packages in 1m
found 0 vulnerabilities
```

Actual npm run build output (excerpt):
```text
Next.js 16.4.2 (Turbopack)
Compiled successfully in 3.2s
Generating static pages using 4 workers (3/3) in 538ms
```

Actual npm test output:
```text
PASS: home returns 200 with title, navigation targets and honest preview status
PASS: compiled stylesheet is served and includes brand tokens
PASS: unknown route returns 404 with friendly recovery page
```

Browser checks used pre-existing bundled Playwright against installed Edge (no project dependency added). Default bundled Chromium launch failed because its browser binary is absent; Edge fallback completed the checks:
```text
PASS: mobile no overflow, CTA >=56px; {"width":360,"scroll":360,"ctaHeight":56}
PASS: desktop no overflow, CTA >=56px; {"width":1440,"scroll":1440,"ctaHeight":56}
PASS: keyboard skip link moves focus to main
PASS: reduced-motion removes button transition
PASS: no browser runtime errors
```

Both screenshots visually inspected: readable Hindi and Latin fonts, thick outlined lavender card, navy header/footer, no clipping. UI-DESIGN sections 2/3/4 checked for applicable foundation styling: two font weights, 24px card corners, hard shadows, transform-only button transition, reduced-motion support, warm copy, no gradients or template card row. Landing tilt/parallax, product/map animations and vendor controls remain pending.

Limits: browser viewport emulation is not a real Android-device test. No feature, voice, Firebase, auth or load tests exist yet. The required two-language voice check is outstanding until voice implementation. npm test requires a running local server and does not start one automatically.
