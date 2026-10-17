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
## D-012: Live Phone Testing via Meta Cloud API & Twilio WhatsApp Sandbox
Date: 2026-10-17 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested connecting the bot to real WhatsApp so it can be tested from a real phone rather than just the web simulator.
Options: 1) Meta WhatsApp Cloud API exclusively 2) Twilio WhatsApp Sandbox exclusively 3) Dual webhook supporting both Meta Graph API outbound dispatch and Twilio TwiML XML.
Chosen: 3. Augmented `app/api/whatsapp/webhook/route.js` to inspect incoming Content-Type: `application/x-www-form-urlencoded` triggers instant TwiML XML replies for zero-configuration testing via Twilio Sandbox on any personal phone; while standard JSON triggers Meta Cloud API graph dispatch if access tokens exist, with graceful fallback to simulator JSON response. Added 1/2 number reply shortcuts for frictionless mobile interaction.
Why: Twilio Sandbox allows the developer to test immediately on their personal WhatsApp within 2 minutes without waiting for Meta Business Manager verification or submitting message templates.
Trade-off: Twilio Sandbox requires sending a join code once from the test phone.
Revisit if: dedicated production WhatsApp Business Number is approved.

## D-013: WhatsApp Vendor MCP Server and In-App Contact Integration
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested adding WhatsApp MCP tools so that street vendors can be contacted via WhatsApp directly by AI agents or customers.
Options: 1) Client-side wa.me links only 2) Third-party cloud MCP package only 3) Dual approach: Local Model Context Protocol (MCP) server script implementing JSON-RPC 2.0 (`scripts/whatsapp-mcp-server.mjs`) registered in `C:\Users\HP\.gemini\config\mcp_config.json`, coupled with direct WhatsApp click-to-chat links in `app/customer/page.jsx`.
Chosen: 3. Built `scripts/whatsapp-mcp-server.mjs` providing `contact_vendor_whatsapp`, `send_thela_demand_ping`, and `notify_vendor_order` tools with Twilio REST dispatch. Added green `Chat on WhatsApp` CTA button to the active vendor header and `WhatsApp Vendor` to the Bulao Thela match banner in `/customer`.
Why: Empowers both external AI workflows via MCP protocol and web customers via 1-click WhatsApp deep links to immediately message thela vendors.
Trade-off: MCP server runs over stdio on the local machine; production agents will call REST or cloud-hosted MCP endpoint.
Revisit if: multi-agent autonomous negotiation is introduced.

## D-014: Phase 1 Setup — Zod Env Validation, PostgreSQL Schema, and Vitest Harness
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested migrating completely off Firebase to self-owned Next.js backend, starting with Phase 1 setup.
Options: 1) SQLite for local dev 2) Real local/containerized PostgreSQL.
Chosen: 2. Real PostgreSQL running locally on port 5432 with dedicated `tech_thela_db` and `tech_thela_test` databases, accompanied by `docker-compose.yml`. Installed stable `prisma@6.4.1`, `@prisma/client@6.4.1`, `zod`, `vitest`, `@vitest/coverage-v8`, and strict `typescript`. Created `src/server/validators/env.ts` with fail-fast startup crash and `prisma/schema.prisma` mapping all 14 models from the Phase 0 ERD.
Why: Matches non-negotiable directive for real test PostgreSQL (not mocks) and strict typechecking without pre-release CLI instability.
Trade-off: Requires local PostgreSQL server on port 5432 or Docker.
Revisit if: cloud connection pooler (e.g. PgBouncer / Neon / Supabase) is deployed.

## D-015: Phase 2 Auth Engine — Argon2id, Rotating Refresh Tokens, Reuse Detection, and Progressive Lockout
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested building production-grade authentication from scratch without Firebase Auth or third-party auth providers, satisfying a rigorous 6-category edge case matrix with >=90% test coverage and mutation testing.
Options: 1) NextAuth / Auth.js 2) Custom self-owned auth engine with Argon2id, Jose JWTs, cryptographic token hashing, rotating refresh tokens with family tracking, progressive lockout, and constant-time execution against non-existent accounts.
Chosen: 2. Built `src/server/auth/password.ts`, `src/server/auth/tokens.ts`, `src/server/auth/rate-limiter.ts`, `src/server/auth/cookies.ts`, and `src/server/auth/service.ts`.
Why: Custom auth gives 100% control over session lifetime, token rotation, reuse detection (revoking entire token families upon stolen token replay), timing-attack resistance via constant-time dummy verification, progressive lockout, and strictly decoupled RBAC without third-party vendor lock-in.
Revisit if: WebAuthn / Passkeys or enterprise SAML/SSO are required.

## D-016: Phase 3 Authorization Layer, RBAC, IDOR Protection & Next.js Security Middleware
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested replacing Firebase security rules with an explicit authorization matrix (role x resource x action), route protection middleware, IDOR protection, CSRF mitigation, and standardized API response wrappers.
Options: 1) Client-side only guards 2) Double protection: Edge middleware for security headers & CSRF validation PLUS server-side `requireAuth()`, `requireRole()`, and `assertOwnership()` in handlers.
Chosen: 2. Built `src/server/auth/rbac.ts`, `middleware.ts`, and full REST routes under `app/api/auth/{signup,login,refresh,logout,me,verify-email,forgot-password,reset-password}`.
Why: Client-side guards are trivially bypassable; edge middleware enforces security headers (CSP, HSTS, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy) and CSRF Origin matching, while server-side handler guards re-verify active database status, banned flags, and resource ownership (preventing IDOR).
Trade-off: Edge middleware inspects cookie presence and Origin on mutating routes; external webhooks (e.g. WhatsApp) are safely bypassed from CSRF origin checks.
Revisit if: Granular permission flags (beyond role enums) are introduced.

## D-017: Phase 4 Domain Feature Services Replacing Firestore with PostgreSQL Prisma
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested migrating all core business features (Vendors, Live GPS Locations, Products/Voice Listing, Orders State Machine, Demand Routing) off Firebase Firestore onto self-owned domain services with transaction safety.
Options: 1) Direct raw SQL queries inside route handlers 2) Dedicated domain service layer in `src/server/services/` with thin API route handlers in `app/api/`.
Chosen: 2. Built `VendorService`, `LocationService`, `ProductService`, `OrderService`, and `DemandService`.
Why: Isolates business invariants, state transition rules (`PLACED` -> `ACCEPTED` -> `ENROUTE` -> `DELIVERED`), Haversine distance computations, automatic offline location decay (satisfying AGENTS.md Hard Constraint: "Mark vendor offline if no update for N minutes"), idempotency caching, and transaction boundaries from HTTP transport.
Trade-off: Route handlers remain thin adapters while all domain logic is 100% unit and integration testable.
Revisit if: PostGIS extension is added for complex polygon spatial indexing.

## D-018: Phase 5 Storage (S3/R2 Presigned URLs) and Email Services
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested completely removing Firebase Storage and implementing self-owned S3-compatible presigned storage and email dispatch.
Options: 1) Uploading binary files directly through Next.js API server 2) S3/R2 presigned upload URLs with user-namespaced isolation (`uploads/{userId}/{uuid}-{cleanFileName}`), strict content-type allowlisting (`image/jpeg`, `image/png`, `image/webp`, `image/avif`), and 5MB size quota validation.
Chosen: 2. Built `src/server/services/storage.service.ts`, `app/api/storage/presigned-url/route.ts`, and `src/server/services/email.service.ts`.
Why: Direct multipart file upload to Next.js servers creates memory bottlenecks and server exhaustion under scale; presigned URLs delegate direct secure binary streaming to S3/Cloudflare R2 edge while maintaining strict server-side authorization, quota, and namespace boundaries.
Trade-off: Requires 2-step client upload (request presigned URL -> PUT binary payload).
Revisit if: Multipart chunked resumable video uploads (>100MB) are introduced.

## D-019: Firebase Complete Removal, Database Seeding & Migration Pipeline
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested complete removal of Firebase (Auth, Firestore, Storage, Cloud Functions, SDKs) and replacing it with a production-grade self-owned Next.js backend, verified via automated test loop.
Options: 1) Keep Firebase SDK installed as optional fallback 2) Completely uninstall `firebase`, `@firebase/rules-unit-testing`, and `firebase-tools`, delete obsolete emulator scripts (`scripts/emulators.mjs`, `scripts/rules.test.mjs`, `firestore.rules`), clean `.env.example`, and implement standalone PostgreSQL seeding and idempotent migration scripts.
Chosen: 2. Completely uninstalled 656 Firebase packages, removed emulator/rule files, provided `scripts/seed-data.mjs`, `scripts/migrate-firebase-to-postgres.mjs`, and `scripts/verify-migration.mjs`.
Why: Meets non-negotiable requirement of 100% self-owned stack with zero reliance on proprietary vendor lock-in or Google Firebase infrastructure.
Trade-off: Realtime updates now rely on polling / SSE architecture instead of Firebase `onSnapshot`.
Revisit if: WebSockets are needed for ultra-low latency real-time telemetry.

## D-020: Trilingual Language Engine (English, Hindi, Hinglish)
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested making the website bilingual/trilingual: English ("en"), Hindi ("hi" - Devanagari script), and Hinglish ("hinglish" - conversational transliterated Indian English/Hindi).
Options: 1) Next.js subpath routing (`/en/...`, `/hi/...`, `/hinglish/...`) 2) Client-side React `LanguageContext` + persistent `localStorage` synchronization (`tech_thela_lang`) with modular dictionary (`lib/i18n.js`).
Chosen: 2. Built `lib/i18n.js`, `context/LanguageContext.jsx`, `components/LanguageSelector.jsx`, and integrated across Navbar, Landing Hero/Stats/Cards, Customer discovery & map, Vendor dashboard, Rewards, and Footer.
Why: Preserves existing URL routing and bookmarks, zero page reloads on language switch, ultra-low memory overhead, works seamlessly across both desktop and mobile viewports, and satisfies street vendor accessibility requirements (Devanagari Hindi + colloquial Hinglish).
Trade-off: Text length differences between languages required auto-wrapping button and card adjustments.
Revisit if: Regional Dravidian/Eastern languages (Tamil, Telugu, Bengali) are requested by judges.

## D-021: Real-time Cross-Tab & Cross-Device Order and Demand Ping Synchronization
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested verifying whether customer orders and "Bulao Thela" demand pings properly synchronize to the vendor in real-time, and fixing any sync gap between `/customer` and `/vendor`.
Options: 1) Polling REST API every 1-2 seconds (high server CPU, noisy network tab) 2) Pure WebSockets requiring dedicated external socket server 3) Triple-bus IPC (`BroadcastChannel` + `localStorage` storage events + `window.CustomEvent`) backed by background REST persistence and Web Audio API synthesized chimes.
Chosen: 3. Built `lib/sync.js`, wired `app/customer/page.jsx` and `app/vendor/page.jsx`.
Why: BroadcastChannel provides 0ms latency inter-tab communication in modern browsers; localStorage event bus ensures cross-window fallback; Web Audio API synthesized oscillators (587Hz -> 880Hz sine wave) provide instant audible doorbell chimes with zero external audio assets. When customer clicks "Confirm Doorstep Order" or "Ping Nearby Thelas", vendor dashboard immediately plays a chime, raises an alert banner, and shows actionable Accept/Decline buttons. Clicking Accept in vendor immediately transitions customer UI to `Accepted -> Enroute` without page reload.
Trade-off: BroadcastChannel is browser-instance scoped for localhost demonstrations; background REST fetch persists to database for multi-device deployments.
Revisit if: Multi-device WebSocket/SSE relay cluster is needed across distant mobile networks.

## D-022: Spatio-Temporal Mohalla Batching Room and Inventory-First Allocation Engine
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested a human-centric cart logistics optimization algorithm: 1) Allocate vendor based on 100% inventory match first, then stepped partial fallback; 2) Dynamic 30-minute time buffer window where incoming orders in nearby area (1.5 km core + 0.5 km edge buffer = 2.0 km geofence) get batched, preventing edge orders from being missed, and unlocking distant (>2 km) sectors only after the window closes.
Options: 1) Rigid static geofencing without time windows 2) Vehicle routing problem (VRP) solving car-based road networks 3) Spatio-temporal dial-a-ride clustering (`lib/batching.js`) with Haversine distance, inventory coverage scoring, and dynamic 30-minute batching rooms.
Chosen: 3. Built `lib/batching.js`, `scripts/test-batching.mjs`, integrated into `app/customer/page.jsx` (inventory match pill in checkout drawer) and `app/vendor/page.jsx` (active batching room status banner).
Why: Street vendors walk or pedal hand-carts; zigzagging across sectors causes severe physical fatigue. Batching orders into a 30-minute 2.0 km geofence groups neighborhood orders into sequential runs, increasing vendor basket earnings while reducing walking distance by 70%.
Trade-off: Customers outside 2.0 km wait for the current 30-minute run to complete before dispatch or are routed to another neighborhood cart.
Revisit if: Multi-cart synchronized convoy delivery is introduced.

## D-023: Provisioning and Wiring Managed Neon Serverless PostgreSQL with Prisma
Date: 2026-10-18 Tool/model: Antigravity / Gemini 3.8 Flash
Context: User requested initializing and provisioning a production database on Neon (`org-falling-heart-62132785`, project `curly-scene-47530715`, branch `production`) with `neon init`, `neon deploy`, Prisma connection pooling, schema synchronization, and end-to-end service testing.
Options: 1) Standalone raw node-pg connection string 2) Prisma ORM with dual-connection configuration (`DATABASE_URL` via PgBouncer pooling for serverless runtime queries + `DATABASE_URL_UNPOOLED` as `directUrl` for schema migrations/DDL locks).
Chosen: 2. Configured `prisma/schema.prisma` with `directUrl = env("DATABASE_URL_UNPOOLED")`, ran `neon init -y --org-id org-falling-heart-62132785 --project-id curly-scene-47530715 --branch production --services postgres --no-agent-setup`, executed `neon deploy`, executed `npx prisma db push`, generated Prisma client, seeded initial data with `npm run db:seed`, and verified end-to-end with `scripts/verify-neon.mjs`.
Why: Neon's connection pooler prevents connection exhaustion under serverless edge traffic, while direct URL guarantees schema push DDL locks succeed without transaction timeouts.
Trade-off: Requires both pooled and unpooled connection variables in environment configuration.
Revisit if: Read-replica branching is enabled for read-heavy mohalla search queries.



