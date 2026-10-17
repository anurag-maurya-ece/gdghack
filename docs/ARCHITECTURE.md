# ARCHITECTURE

5. Architecture (high level)
Modules and what each owns
WhatsApp Bot service (/functions): receives webhooks, verifies them, routes voice/text to the intent parser, replies in the vendor's language.
AI wrapper (/lib/ai): one place for speech-to-text, translation and intent extraction. Swap providers here only.
Web app (/app): customer map, cart, orders, chat; vendor dashboard (orders, products, demand tab).
Firestore: source of truth and realtime layer.
Demand engine (/functions/demand): scheduled job that recomputes grid-cell scores.
Data flow
Vendor voice note -> WhatsApp -> Webhook (verify) -> Speech-to-text -> Intent parser
   -> confirm with vendor -> Firestore (products)
Vendor live location -> Firestore (locations) -> realtime -> Customer map
Customer order -> Firestore (orders) -> Cloud Function -> WhatsApp message to vendor
Vendor taps Accept -> Firestore -> realtime -> Customer sees status
Chat message -> Function -> translate -> Firestore (messages) -> both users
Orders + searches -> Demand engine -> cell scores -> Vendor asks where to go
Trust boundaries (where outside input enters): WhatsApp webhook, customer chat and order forms, voice transcripts, location updates. Always validate these.

## Implemented foundation (2026-10-17)
- Next.js App Router with JavaScript server components: app/layout.jsx, app/page.jsx and app/not-found.jsx.
- Tailwind v4 via PostCSS; app/globals.css owns the exact brand palette, font, card, button, focus and reduced-motion styles.
- next/font downloads Outfit and Noto Sans Devanagari during build and serves them locally. Two font weights: 400 and 600.
- functions/ and lib/ are placeholders only. No Firebase client, backend, auth or external application API calls exist yet.
- scripts/smoke.mjs checks a running localhost server through real HTTP; no test-framework dependency.

## Animated preview
app/thela-scene.jsx is a client boundary inside the server-rendered home. Layered SVG art stays in source; no media/CDN calls. framer-motion springs handle bounded pointer tilt; CSS transforms animate cart, wheels and vendor. IntersectionObserver, visibilitychange and reduced-motion preference gate animation. Local Pause/Play freezes loops; no device sensors.
