# TESTING

## Firebase foundation — 2026-10-17
Actual output:
```text
functions: Using node@22 from host.
All emulators ready! It is now safe to connect your app.
PASS: unauthenticated and authenticated clients cannot read or write unspecified collections
```
The PERMISSION_DENIED messages during negative rule tests are expected. npm audit --omit=dev and the functions runtime audit both report `found 0 vulnerabilities`. Full root audit still reports 8 development-tool findings (5 moderate, 3 high); no forced downgrade or disabled validation was used.

## Animated preview — 2026-10-17
Production build and existing HTTP smoke checks passed after restarting the server. Actual build: `Compiled successfully in 781ms`. Installation: `added 3 packages, and audited 47 packages in 3s` / `found 0 vulnerabilities`.

Actual browser output (bundled Playwright, installed Edge):
```text
PASS: thela moves between actual rendered frames
PASS: vendor walking animation changes between frames
PASS: pointer creates 3D card transform
PASS: Pause freezes scene and exposes pressed state
PASS: Play resumes scene
PASS: reduced-motion disables movement and 3D tilt
PASS: desktop screenshot captured, no overflow, motion control >=56px
PASS: mobile screenshot captured, no overflow, motion control >=56px
PASS: scene pauses when scrolled out of view
PASS: no browser runtime errors
```

Visually inspected 360px/1440px full-page screenshots. UI-DESIGN 2/3/4: exact palette, flat lavender/teal character, depth layers, two weights, outlined card, transform-only loops, reduced-motion and no gradients. Native motion button outside the moving surface. Full landing requirements remain pending. Real Android FPS and actual background-tab lifecycle unverified.

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
