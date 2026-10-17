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
