# CONSTRAINTS
NEVER: read/commit secrets or .env; run destructive commands; disable
tests/validation/auth; deploy to prod; add dependencies without asking;
share vendor location when OFF; expose customer phone/address beyond
an accepted order; ship a screen that breaks docs/UI-DESIGN.md rules.
ALWAYS: verify WhatsApp webhooks; validate inputs; rate-limit; confirm
voice-parsed data with the vendor before saving; stop and ask if a rule
blocks you.
PROTECTED AREAS: auth, webhook verification, order status logic,
location privacy.
