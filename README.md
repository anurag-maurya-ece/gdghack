# Tech Thela

WEkreta / Tech Thela bridges street vendors and online customers through a vendor WhatsApp bot and a customer/vendor website or PWA. Core features are live mapping, ordering, translated chat, voice product listing and rule-based demand routing.

## Current status

Local Next.js scaffold with brand tokens, a hello preview and a friendly 404 page. The full animated landing page, Firebase, vendor flows and deployment are still pending. The master Word document is the source of truth. Read AGENTS.md, then follow its Session START protocol. The user-authorized build-order clarification is D-002 in docs/DECISIONS.md.

## Confirmed stack

Next.js (React), Tailwind, framer-motion, lucide-react; Firebase Firestore, Auth and Cloud Functions; Leaflet with OpenStreetMap; WhatsApp Cloud API or Twilio sandbox; one swappable speech/translation/intent API wrapper. Hosting target: Vercel for web and Firebase for functions. Installed foundation versions are pinned in package.json and package-lock.json; other packages are deferred until their tasks. WhatsApp and speech providers remain undecided. Optional 3D is not part of initial setup.

## Install, run and test

Use Node.js 24.x and npm (verified locally with Node 24.13.0 and npm 11.6.2). Install exactly the committed lockfile:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For a production build and local production server:

```sh
npm run build
npm start
```

With that server running, use a second terminal for the HTTP smoke checks:

```sh
npm test
# If the local server uses another port:
npm test -- http://127.0.0.1:3100
```

Smoke checks exercise the actual home response, compiled CSS and 404 response using Node's built-in assertions. No test framework is installed. These do not validate future vendor, voice, security or Firebase flows. Fonts are downloaded from Google at build time by next/font and self-hosted by Next.js thereafter; the build requires network access for the first font download. Firebase emulator/backend commands remain pending.

Current repository checks:

```sh
git status
git log --oneline -15
git diff --check
```

## Configuration

.env.example contains variable names only, with no assignments or values, per the master doc. It is an inventory, not a usable dotenv file. Names currently cover proposed Firebase web configuration. Provider-specific names will be added after selection. Never ask an AI tool to read, print, edit or commit real secrets or .env files. No credentials are required for this documentation setup.

## Build order

Setup -> landing -> vendor/products (text first) -> live location/map -> orders -> WhatsApp -> voice listing -> translated chat -> demand -> polish/demo. One approved task at a time. Deployments require explicit approval.

## Demo scope

Hackathon PoC (Lane A). No demo data exists yet. Future seeded history and other simulated data must be explicitly labeled in both UI and README. No payment integration: cash or UPI on delivery for the demo. Real-user use promotes this to Lane B and requires complete threat, failure and rollback documentation.

## Project memory

All project memory lives in docs/. UI-DESIGN.md controls screens. ARCHITECTURE.md, DATA.md and THREAT.md preserve master sections 5, 6 and 9, including the source tables. FLOW.md, ALTERNATIVES.md, FAILURE.md, TESTING.md and ROLLBACK.md are intentionally title-only until their relevant tasks.
