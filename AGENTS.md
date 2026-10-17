# AGENTS.md: WEkreta / Tech Thela

## 0. WHO YOU ARE WORKING FOR
I am a student building this in a hackathon (theme: "Bridge the Gap").
You are one of several AI tools (Codex, Antigravity, Claude, Gemini, etc.)
that may work on this repo. You will NOT remember previous sessions.
The repo is the only memory. I direct, you build. I must be able to
explain every decision to judges at a whiteboard.

## 1. PROJECT BRIEF
Name: WEkreta / Tech Thela
Goal: connect street vendors (thela wale) and online customers.
Platform = WhatsApp Bot (vendors) + Website/PWA (customers and vendors).

Customer features: live thela location on a map, online ordering,
direct chat with the vendor (auto-translated).
Vendor features: list products (voice/text), accept orders,
check high-demand areas.

Core USPs (prioritise in this order if time is short):
1. Auto-translated customer-vendor chat.
2. Live phygital mapping (vendor live location on a map).
3. Voice-activated multilingual WhatsApp bot (voice note -> action).
4. Community predictive routing (demand heatmap + suggested zones).

Target users: (a) vendors with low tech literacy, possibly low literacy,
speaking regional languages; (b) urban customers.
Design rule: vendor flows need ZERO typing and at most 2 taps or voice
notes per action.

## 2. MODE
Hackathon PoC (Lane A): speed over polish, but never skip the rules
below. Get one happy path working end to end first, then widen. Use
seeded demo data where real data is not possible and LABEL it clearly
as demo data in the UI and README.

## 3. TECH STACK (confirmed unless I change it in DECISIONS.md)
- Frontend: Next.js (React) + Tailwind, PWA-friendly, mobile-first
- UI motion: framer-motion; icons: lucide-react; 3D optional (three,
  @react-three/fiber, lazy-loaded)
- Backend/DB/Auth/Realtime: Firebase (Firestore, Auth, Cloud Functions)
- Map: Leaflet + OpenStreetMap (no paid key) unless I approve Google Maps
- WhatsApp: WhatsApp Cloud API (Meta) or Twilio sandbox, via webhook
- Voice -> text, translation, intent parsing: one LLM/speech API
  (e.g. Gemini) behind ONE wrapper module so it can be swapped
- Hosting: Vercel (web) + Firebase (functions)
Do NOT add other libraries, services, or paid APIs without asking me.

## 4. UI RULES
Read docs/UI-DESIGN.md before building ANY screen and follow it exactly:
brand tokens, thick-outline cards, 3D tilt cards, hero parallax, map
animations, vendor-first usability, and the "must not look AI-generated"
rules. Only animate transform/opacity, lazy-load 3D, respect
prefers-reduced-motion. After each screen, check it against the rules
and tell me what you checked.

## 5. REPO LAYOUT
/app            web frontend
/functions      backend (webhooks, bot logic, translate, demand scoring)
/lib            shared helpers (ai wrapper, geo, i18n)
/docs           all project memory (see section 6)
/scripts        seed data, local test helpers
.env.example    env var NAMES only, always kept current

## 6. DOCS YOU MUST READ AND MAINTAIN (in /docs)
HANDOVER.md, CONSTRAINTS.md, ARCHITECTURE.md, FLOW.md, DECISIONS.md,
ALTERNATIVES.md, DATA.md, THREAT.md, FAILURE.md, TESTING.md,
ROLLBACK.md, DEFENSE.md, UI-DESIGN.md. Keep each short. Outdated docs
are worse than none. If code and docs disagree, code is truth: tell me
and fix the doc.

## 7. HARD CONSTRAINTS (never break; if blocked, STOP and ask)
- Never read, print, edit, or commit secrets or .env files. Use env var
  names only. Never hardcode keys, tokens, or phone numbers.
- Never run destructive commands (rm -rf, force push, history rewrite,
  dropping DB/collections) without my explicit approval.
- Never disable tests, validation, auth, or security rules to make
  something pass.
- Never deploy to production or touch live data without approval.
- Vendor live location is shared ONLY while the vendor has switched it
  ON. Always provide an OFF switch. Never expose a vendor's home or
  exact location when OFF.
- Customer phone numbers/addresses are never shown to vendors beyond
  what an accepted order needs.
- Validate and sanitise every external input: WhatsApp webhooks (verify
  signature/token), chat messages, order payloads, voice transcripts.
- Rate-limit chat, orders, and bot messages per user.
- One logical change per request. No unrelated refactors.
- No new dependency or paid API without asking.

## 8. HOW TO WORK (every session)
### Session START (before touching code)
1. Read in order: AGENTS.md -> docs/HANDOVER.md -> docs/CONSTRAINTS.md
   -> docs/ARCHITECTURE.md -> docs/FLOW.md -> docs/UI-DESIGN.md
   -> last 5 entries of docs/DECISIONS.md.
2. Run `git log --oneline -15` and `git status`.
3. Reply with a 5-line summary: what the project is, what is done,
   what is in progress, what is broken, what you will do next.
   WAIT for my approval before editing.
4. If docs conflict with code, tell me. Do not guess.

### During the session
- Explain your plan and alternatives first, then code after I approve.
- Ask "what could go wrong with this plan?" and answer it yourself.
- Small steps. Commit after each accepted change (message = what + why).
- Log every non-trivial decision in DECISIONS.md: date, tool + model
  version, context, options, choice, why, trade-off, revisit-if.
- Comment non-obvious logic with WHY and invariants (not syntax).
- Paste REAL command output for tests/builds. Never just say "works".
- At the end of each task tell me: "What did I assume that you did not
  tell me?" and add unverified items to HANDOVER.md.
- Show a diff summary: files changed, anything deleted, any new network
  call or dependency.

### Session END (or when I say "switching tool")
1. Update docs/HANDOVER.md (newest entry on top) with: date, tool +
   model | Done | In progress | Broken/risky | Next (exact first step)
   | Do not touch | Run/test commands | Unverified assumptions.
2. Update DECISIONS, FLOW, ARCHITECTURE if they changed.
3. Final commit. Report the hash as "last good commit".
4. Output a 5-line paste-message for the next AI:
   "Read AGENTS.md and docs/HANDOVER.md first. Last good commit: <hash>.
   Next task: <exact task>. Do not touch: <list>."

### When you are the NEW tool taking over
- Do not trust the previous tool's claims. Re-run build/tests yourself
  and report real results before building further.
- Re-verify everything marked "unverified" in HANDOVER.md.
- Do not change the stack or structure unless I approve.
- If a half-finished change exists, show `git diff` and ask: continue
  or revert?
- If the previous tool stopped abruptly: read git log + git diff,
  reconstruct what was in progress, update HANDOVER.md, then continue.

## 9. FEATURE SPECS (build in this order)
### F1. Vendor onboarding (WhatsApp)
Vendor sends "Hi" -> bot asks preferred language (buttons) -> asks shop
name/type by voice or text -> creates the vendor profile. Phone number
is the identity. Verify the webhook before processing.

### F2. Voice product listing
Vendor sends a voice note (e.g. "aaj aloo 20 rupaye kilo, pyaaz 30").
Pipeline: audio -> transcript -> structured JSON {name, price, unit,
stock?} -> bot reads it back in the vendor's language and asks
"Sahi hai?" (Yes/No buttons) -> saves ONLY after confirmation.

### F3. Live location
Vendor taps "Thela ON" and shares WhatsApp live location (or web
geolocation). Backend stores {vendorId, lat, lng, updatedAt, isOnline}.
Customer map reads it in realtime. Mark the vendor offline if no update
for N minutes. "Thela OFF" stops sharing immediately.

### F4. Customer map and discovery
Map shows online vendors nearby with product tags and distance.
Tap vendor -> product list -> add to cart -> place order.

### F5. Orders
Status flow: placed -> accepted/rejected -> ready -> completed.
Vendor gets a WhatsApp message with Accept/Reject buttons (and can use
the website too). Customer sees live status. Payment: cash or
UPI-on-delivery for the demo; no real payment integration unless I
approve.

### F6. Auto-translated chat
Each user has a language field. Store the original message plus the
translation for the other party. Both see their own language; tap to
see the original. Vendor can reply by voice note (transcribed, then
translated). Cache translations; if the translation API fails, show the
original with a small "not translated" tag.

### F7. Demand heatmap and predictive routing
MVP is rule-based, not ML. Divide the city into grid cells (geohash or
fixed lat/lng grid). Demand score per cell = weighted sum of recent
orders, customer searches/map opens and product requests, decayed by
recency and filtered by time of day. Vendor asks the bot "where should
I go?" or opens the Demand tab -> gets the top 3 zones with a short
reason (e.g. "chai demand high near college gate, 4-7 PM"). Use seeded
history for the demo and label it.

## 10. DEFINITION OF DONE (per task)
- Works on the real happy path, with real output pasted.
- UI checked against docs/UI-DESIGN.md.
- No secrets in code or diff.
- Docs and HANDOVER updated, committed.
- Vendor flow tested with voice notes in at least 2 languages.

## 11. WHEN IN DOUBT
Stop and ask me. A short question is cheaper than a wrong 200 lines.
