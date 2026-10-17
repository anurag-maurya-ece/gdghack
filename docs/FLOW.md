# FLOW

## Implemented local preview
Browser GET / -> Next.js root layout + hello page -> compiled CSS and self-hosted fonts.
"Tech Thela kya hai?" -> #about on the same page.
Unknown route -> HTTP 404 with "Wapas chalein" link to /.

No vendor/customer data is collected or stored. Product, location, order, voice and chat flows are not implemented.

## Illustration interaction
Initial HTML -> static illustration -> client reads reduced-motion -> idle motion starts only while visible.
Mouse over card -> bounded spring tilt -> layered person/cart depth.
Pause -> loops freeze and tilt resets; Play -> resumes if motion permitted.
Reduced-motion, scene offscreen or hidden tab -> stops automatically.
