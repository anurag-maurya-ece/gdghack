3. UI design brief (save as docs/UI-DESIGN.md)
Goal: a friendly, human, slightly playful UI with real 3D depth and motion, that does not look like generic AI output. The reference is the existing WEkreta landing page: dark navy navbar, green accent, lavender flat illustrations, thick black-outlined rounded cards, warm Hinglish copy.
# UI-DESIGN: WEkreta / Tech Thela

## 1. Visual identity (sampled from the reference screenshot; approximate)
- Navy (nav, footer, dark sections): #0F172A
- Brand green (primary CTA, highlights, live status): #22C55E
- Teal (illustration outlines, icons): #0B6B6B
- Lavender (illustration fill, soft sections): #D9C8F5
- Card background: #F8F4FF   Page background: #FFFFFF
- Ink (text and outlines): #111111
- Warning/busy: amber #F59E0B   Error: #EF4444
Define all of these as CSS variables / Tailwind tokens. Never hardcode
colors in components.

## 2. Type and shape
- One geometric rounded sans for headings and body (Outfit or a similar
  free Google font) with a Noto Sans Devanagari / regional-script fallback.
- Big, confident headings with ONE highlighted word in green, as in the
  hero ("trust", "technology", "love").
- Cards: 2px solid ink border, 20-24px radius, hard offset shadow
  (4px 4px 0 ink) that grows on hover. Consistent everywhere.
- Buttons: green pill, ink text, pressed state moves down 2px and loses
  its shadow (feels physical).
- Illustration style: flat, lavender fills, teal outlines, no gradients,
  no stock 3D renders, no photoreal images.

## 3. 3D and motion (the "wow", but light)
Must-have:
1. TILT CARDS: Vendor and Consumer cards (and product cards) tilt in 3D
   toward the pointer (perspective ~900px, max ~8deg rotateX/Y, smooth
   spring). On phones use a subtle device-tilt or a gentle idle float.
   Inner layers (illustration, title, button) sit at different translateZ
   so they separate as the card tilts.
2. HERO DEPTH: the scooter + phone illustration is split into layers
   (scooter, phone, floating boxes, map lines) that parallax at different
   speeds on pointer move and on scroll. The phone screen shows a live
   mini-map with a pulsing thela pin.
3. SCROLL-IN CARDS: cards rise and settle (translateY + slight rotateX
   to 0) with a short stagger as they enter the viewport. Once only.
4. MAP LIFE: pins drop in with a small bounce; a live thela pin glides
   smoothly between GPS updates (interpolate, never teleport) and has a
   soft pulse ring. Offline vendors fade to grey.
5. MICRO-INTERACTIONS: mic button ripple while recording; "Thela ON"
   toggle slides and the cart icon does a tiny wheel-spin; order status
   steps fill with a progress line; chat bubbles pop in.
Nice-to-have (only if time remains): one lightweight 3D object (a toy-style
scooter or phone) with react-three-fiber, lazy-loaded, with the 2D
illustration as fallback.

Performance rules:
- Animate only transform and opacity. Target 60fps on a mid-range Android.
- Lazy-load anything 3D. Keep the first load fast on 4G.
- Respect prefers-reduced-motion: disable tilt, parallax and bounce, keep
  simple fades.
- Never block interaction while an animation plays.

Pre-approved UI libraries: framer-motion (or motion), lucide-react,
Optional: three, @react-three/fiber, @react-three/drei (lazy only).

## 4. Make it NOT look AI-generated (hard rules)
- No generic purple-to-blue gradient hero, no glowing blobs, no glassmorphism
  everywhere, no emoji used as icons.
- No row of three identical centered icon cards. Vary layout: asymmetry,
  overlapping elements, illustration breaking out of its card.
- No filler copy ("Welcome to the future", "Revolutionizing...", lorem
  ipsum). Copy is short, warm, specific, Hinglish where it fits
  (e.g. "Aapka thela, ab sabki nazar mein").
- Real, consistent icon set (lucide-react) at one stroke width.
- Every empty state, loading state and error has a designed, friendly
  message and a small illustration, never a bare spinner or "Error".
- Spacing on an 8px grid. Max two font weights per screen.
- Check each screen: if it could belong to any random startup, redesign it.

## 5. Vendor-first usability (vendors may have low literacy)
- First screen: language picker with each language written in its own
  script. Remember the choice.
- Tap targets at least 56px. One main action per screen.
- Icon + voice first, text second. Mic button always visible.
- Confirm voice-parsed data with big "Sahi hai / Galat hai" buttons and
  read it back aloud.
- High contrast, works in bright sunlight. Status by color AND icon.
- Works on slow networks: skeleton loaders, retry, last-known state shown.

## 6. Customer usability
- Map is the home screen: nearby online thelas, product chips, distance.
- Max 3 taps from opening the app to placing an order.
- Chat shows the message in the user's language; tap to see the original.
- Order tracking is a simple stepper: Placed, Accepted, Ready, Done.

## 7. Screens to build (in order)
Landing (hero + Vendor/Consumer cards) > Customer map/discover > Vendor
page + cart > Order status > Chat > Vendor dashboard (orders, product
list, demand tab) > Join flows.

## 8. Accessibility and quality bar
- Visible focus states, labelled buttons, alt text, color contrast AA.
- Mobile-first (360px width first), then tablet and desktop.
- Every screen reviewed against sections 2, 3, 4 before it is done.
