# Tech Thela

WEkreta / Tech Thela bridges street vendors and online customers through a vendor WhatsApp bot and a customer/vendor website or PWA. Core features are live mapping, ordering, translated chat, voice product listing and rule-based demand routing.

## Current status

Documentation-only setup. No feature code, installed dependencies, package manifest, runtime scripts, test suite or deployment exists. The master Word document is the source of truth. Read AGENTS.md, then follow its Session START protocol. The user-authorized build-order clarification is D-002 in docs/DECISIONS.md.

## Confirmed stack

Next.js (React), Tailwind, framer-motion, lucide-react; Firebase Firestore, Auth and Cloud Functions; Leaflet with OpenStreetMap; WhatsApp Cloud API or Twilio sandbox; one swappable speech/translation/intent API wrapper. Hosting target: Vercel for web and Firebase for functions. Providers and exact package versions remain to be approved. Optional 3D is not part of initial setup.

## Install, run and test

These are intended commands after the application scaffold and scripts are approved and created; they are not runnable application checks at this stage. npm is a proposed package manager.

```sh
npm install
npm run dev
npm run build
npm test
```

The scaffold must define dev/build scripts. The test command requires a separately approved test setup. Do not interpret the commands above as successful test results. Node version, Firebase emulator setup and backend commands will be documented with the corresponding implementation task.

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
