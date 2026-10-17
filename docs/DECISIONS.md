## D-001: Leaflet + OpenStreetMap instead of Google Maps
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: Need a live map with no billing setup during the hackathon.
Options: 1) Google Maps 2) Mapbox 3) Leaflet + OSM
Chosen: 3
Why: Free, no key, fast to set up.
Trade-off: Fewer built-in features, basic geocoding.
Revisit if: we need turn-by-turn routing or Places search.

## D-002: Section 7 controls implementation order
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: Master Section 7 and AGENTS.md section 9 prescribe different build orders. The user authorized choosing the appropriate order after the conflict was reported.
Options: 1) Section 7 web-first build plan 2) AGENTS.md section 9 WhatsApp-first sequence.
Chosen: 1. Setup -> landing -> vendor/products (text first) -> live map -> orders -> WhatsApp -> voice listing -> translated chat -> demand -> polish/demo.
Why: Establish and verify the core web flow before adding external messaging and speech integrations.
Trade-off: WhatsApp onboarding arrives later. AGENTS.md remains verbatim; its feature requirements still apply, but Section 7 controls sequencing. UI-DESIGN screen order applies within the approved build tasks where compatible with this sequence.
Revisit if: the user explicitly changes the order.

## D-003: Documentation-only initial setup
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: STEP 0 authorizes memory files and first commit, with no feature code.
Options: 1) Documentation only 2) Scaffold the application immediately.
Chosen: 1. Preserve the master DOCX in the repository; add documentation and secret-file exclusions. List intended future commands honestly in README.
Why: Application scaffolding, dependency installation, Firebase configuration, and deployment require the next approved task.
Trade-off: No installable app, build, or test suite exists yet. Environment names are provisional Firebase web configuration names only; add provider-specific names when those providers are selected.
Revisit if: the first implementation task is approved.

## D-004: Minimal local scaffold using the approved stack
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: User approved Next.js/Tailwind scaffold, design tokens and a local hello page.
Options: 1) Minimal manual JavaScript App Router scaffold 2) Generated template with additional tooling and boilerplate.
Chosen: 1. npm with exact dependency versions and lockfile; Node 24.x. Next 16.4.2, React/react-dom 19.3.1, lucide-react 1.59.0; Tailwind/@tailwindcss/postcss 4.3.3 and PostCSS 8.5.30 as build tooling. Versions obtained from npm registry before installation.
Why: Uses the approved stack without unrelated template UI, additional test frameworks or TypeScript tooling. Native Node assertions provide HTTP smoke checks.
Trade-off: JavaScript has no compile-time type checks; no linter installed. Fonts use next/font Google downloads at build time. Full landing motion and Firebase remain separate tasks.
Revisit if: the user approves stronger type/lint tooling or offline build requirements.

## D-005: Accessible green highlight and honest hello preview
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: Exact brand green is too light for normal text on white; this task is a hello preview, not the full landing or a vendor flow.
Options: 1) Ink text over exact green highlight 2) Green text over white.
Chosen: 1. Keep the prescribed palette and highlight one heading word using green as its background. Use a static custom flat cart illustration and real in-page link.
Why: Keeps the design identity while preserving contrast and avoiding fake feature controls.
Trade-off: Full tilt/parallax, language picker and recording controls are deferred to their actual landing/vendor tasks. A two-language voice check cannot run before voice features exist; it remains outstanding, not passed.
Revisit if: the complete landing task is approved.

## D-006: Animated cart and layered vendor before Firebase
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: User explicitly selected moving thela + person 3D effect first, Firebase afterward.
Options: 1) Layered SVG/CSS with spring tilt 2) Full WebGL model.
Chosen: 1. Pre-approved framer-motion 14.3.0 for tilt springs (maximum target 6 degrees, perspective 900px); transform-only CSS loops for cart, wheels and vendor. Vendor depth 60px, cart 36px, backdrop 0px.
Why: Preserves flat lavender/teal illustrations while adding light depth without model downloads or WebGL.
Trade-off: Illustrative depth, not a modeled 3D person. Mobile uses idle movement without sensors. Adds approved motion dependency and its transitive packages. Full landing and Firebase remain separate tasks.
Accessibility/performance: Static server render until preferences are known, live reduced-motion handling, 56px Pause/Play, offscreen/hidden-tab pause.
Revisit if: a real model is requested after mobile performance measurement.

## D-007: Autonomous build within existing constraints
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: User said "do all fast" and "ok proceed", approving remaining work without repeated routine approvals. User explicitly approved Java/Firebase tooling installation and selected Meta WhatsApp Cloud API + Gemini.
Options: Repeated task approvals or sequential implementation under this authorization.
Chosen: Sequential tasks with explanations, tests and separate commits. No production deployment or live-data access.
Why: User requested speed while retaining the master stack and rules.
Trade-off: Defaults requiring later confirmation: Hindi/English demo and a clearly labeled sample Delhi area; no real vendor identity or location is implied.
Revisit if: user changes scope or a new service/paid API is needed.

## D-008: Isolated Firebase emulator foundation
Date: 2026-10-17 Tool/model: Codex / GPT-6
Context: No local Java; live Firebase project and credentials are not configured.
Options: Local official emulators or immediate cloud setup.
Chosen: demo-tech-thela, localhost-only Auth/Firestore/Functions. Default-deny rules. Official SDK/CLI and rules-test tooling; workspace-local checksum-verified Temurin Java 21 and Node 22 for Functions, with Node 24 retained for Next.js.
Why: Exercise real Firebase behavior without live resources or secrets.
Trade-off: Firebase CLI development-only dependency audit findings remain; runtime audits are clean after overriding the Firebase SDK's vulnerable gRPC dependency to 1.14.6. Emulator downloads require network.
Revisit if: staging deployment is approved or upstream fixes the dependency pins.

## D-009: Web application priority and feature suite architecture
Date: 2026-10-17 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User authorized prioritizing core web user journeys first to establish complete end-to-end functionality before external WhatsApp bot integration.
Options: 1) Build complete Next.js App Router web screens with brand tokens, Leaflet OSM, and interactive role portals 2) Defer web features until bot completion.
Chosen: 1. Created rich demo dataset (lib/mock-data.js) and 4 core web flows: customer map discovery with animated SVG markers & ping radar (/customer), vendor operational dashboard with voice listing simulation & demand heatmap (/vendor), and community rewards & leaderboard (/rewards). Installed confirmed Leaflet 1.9.4.
Why: Satisfies Section 9 feature specs (F2 voice listing, F3 live location, F4 customer discovery, F5 orders, F7 demand routing) in an immediate, testable web format.
Trade-off: WhatsApp Cloud API webhook deferred to a later milestone; live coordinates use client simulation.
Revisit if: live Meta WhatsApp credentials or cloud hosting are configured.

## D-011: Multilingual WhatsApp Bot & Meta Cloud Webhook Architecture
Date: 2026-10-17 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested implementing the WhatsApp Bot for low-literacy vendors (F1 onboarding, F2 voice listing, F3 live location, F7 demand routing).
Options: 1) Cloud Function webhook only 2) Unified AI wrapper + Meta-compatible App Router webhook + in-browser interactive WhatsApp simulator.
Chosen: 2. Implemented `lib/ai-wrapper.js` for speech intent extraction and translation, `app/api/whatsapp/webhook/route.js` for Meta Cloud API verification and message handling with rate limiting, and `app/whatsapp/page.jsx` as an interactive visual WhatsApp simulator.
Why: Ensures official webhook compatibility with Meta WhatsApp Cloud API while providing an infallible, fail-safe visual demonstration environment for judges even if external webhook tunnels fail.
Trade-off: In-memory rate limiting and mock store sync for local demo; production requires Redis or Firestore rate limit backend.
Revisit if: live Meta Business Manager production credentials are provided.



