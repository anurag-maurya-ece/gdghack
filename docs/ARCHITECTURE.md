## Production Self-Owned Architecture (Post-Firebase Migration)

Tech Thela is 100% migrated off Google Firebase to a self-owned, enterprise-grade Next.js App Router backend powered by PostgreSQL, Prisma ORM, Argon2id, and S3-compatible object storage.

### 1. Modules & Ownership
- **WhatsApp Webhook Bot (`/api/whatsapp/webhook`)**: Receives Meta Cloud API / Twilio webhooks, verifies HMAC signature / verification tokens, parses voice notes and text, interfaces with AI service, and communicates back with vendors in regional languages.
- **AI Wrapper (`/lib/ai`)**: Single swap-ready module for speech-to-text, translation, and intent parsing.
- **Web App (`/app`)**: Customer discovery map, basket ordering, real-time demand radar, auto-translated chat, vendor operations dashboard (Thela ON/OFF, voice catalog, instant order acceptance, demand hotspots).
- **Core Domain Services (`src/server/services`)**:
  - `VendorService`: Profile CRUD, active status, geospatial nearest-vendor lookup using Haversine algorithm.
  - `LocationService`: Real-time GPS coordinate streaming with automatic stale telemetry decay (offline if >15m).
  - `ProductService`: Vendor catalog management, bulk voice listing creation with atomic commits.
  - `OrderService`: Multi-item orders + chat thread initialization inside PostgreSQL transactions (`$transaction`), idempotency key tracking, strict status transition state machine.
  - `DemandService`: "Bulao Thela" customer pings, dynamic demand hotspot grid scoring, and high-demand zone recommendations.
  - `StorageService`: User-namespaced presigned S3/R2 direct upload generation, MIME type allowlist, 5MB quota check.
  - `EmailService`: Transactional HTML email dispatcher for email verification and password reset.
- **Database & Data Layer (`prisma/schema.prisma`, `src/server/lib/db.ts`)**: Relational PostgreSQL database managed via Prisma 6.4.1. Strict foreign key constraints, cascading lifecycle cleanup, unique constraints, and B-Tree indexes.
- **Authentication & Security Engine (`src/server/auth`)**:
  - Argon2id password hashing with constant-time dummy verification against timing attacks.
  - Rotating dual-token session architecture: 15-minute access JWT + 7-day SHA-256 hashed refresh token in `httpOnly`, `SameSite: Lax`, `Secure` cookies.
  - Stolen refresh token reuse detection with full token-family session revocation.
  - Progressive brute-force lockout rate-limiting per account and IP.
  - RBAC authorization (`requireAuth`, `requireRole`, `assertOwnership`) protecting against IDOR.
  - Strict security middleware: CSP, HSTS, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy, CSRF origin verification.

### 2. Data Flow
- Vendor voice note -> WhatsApp Webhook -> STT -> Intent Parser -> JSON -> Confirmation ("Sahi Hai?") -> `ProductService.bulkCreateProducts` -> PostgreSQL
- Vendor live location -> `LocationService.updateVendorLocation` -> PostgreSQL -> Customer Map API (`/api/vendor/nearby`)
- Customer order -> `OrderService.createOrder` (`$transaction`) -> WhatsApp vendor notification
- Vendor status update (`ACCEPTED` / `ENROUTE` / `DELIVERED`) -> `OrderService.updateOrderStatus` -> Realtime polling / customer live tracker
- Customer "Bulao Thela" ping -> `DemandService.recordDemandPing` -> Demand hotspot aggregator -> Vendor suggestions

## Implemented foundation (2026-10-17)
- Next.js App Router with JavaScript server components: app/layout.jsx, app/page.jsx and app/not-found.jsx.
- Tailwind v4 via PostCSS; app/globals.css owns the exact brand palette, font, card, button, focus and reduced-motion styles.
- next/font downloads Outfit and Noto Sans Devanagari during build and serves them locally. Two font weights: 400 and 600.
- functions/ and lib/ are placeholders only. No Firebase client, backend, auth or external application API calls exist yet.
- scripts/smoke.mjs checks a running localhost server through real HTTP; no test-framework dependency.

## Animated preview
app/thela-scene.jsx is a client boundary inside the server-rendered home. Layered SVG art stays in source; no media/CDN calls. framer-motion springs handle bounded pointer tilt; CSS transforms animate cart, wheels and vendor. IntersectionObserver, visibilitychange and reduced-motion preference gate animation. Local Pause/Play freezes loops; no device sensors.

## Implemented Web Application Architecture (2026-10-17)
- **Shared Data & State (`lib/mock-data.js`)**: Authentic Delhi/NCR street vendor profiles, product catalog, demand zones, review database, and coupon definitions.
- **Leaflet OpenStreetMap Integration (`components/LeafletMap.jsx`)**: Client-side dynamically imported Leaflet with Carto Voyager raster tiles. Custom `L.divIcon` rendered SVG thela carts with live pulsating status rings and category emojis.
- **Motion & 3D Tilt System (`components/TiltCard.jsx`)**: Reusable Framer Motion spring physics with preserve-3d, `translateZ` layer separation, and strict `prefers-reduced-motion` compliance.
- **Customer Portal (`app/customer/page.jsx`)**: Split-pane layout with reactive category filtering, vendor drawer, 2-tap doorstep basket pre-ordering, and "Bulao Thela" reverse-demand radar.
- **Vendor Operations Dashboard (`app/vendor/page.jsx`)**: Low-literacy accessible interface featuring giant "Thela ON / OFF" switch, live GPS movement simulation, voice-to-inventory pipeline with "Sahi Hai" verification, instant order acceptance, and predictive demand hotspots.
- **Community Rewards & Leaderboard (`app/rewards/page.jsx`)**: Coins wallet with automatic +25 coin reward per vendor review, verified Mohalla Leaderboard, and discount coupon redemption.

