# FLOW

## Implemented Web Application Flows (2026-10-17)

### 1. Landing Flow (`/`)
- Root layout with responsive Navbar and Footer.
- Hero with layered animated SVG ThelaScene and quick action buttons.
- Stats section displaying 4 verified metric counters.
- 3D Tilt Role Cards for Consumer (Grahak) and Street Vendor (Thela Wale).
- Four core feature pillars showcase (Live Map, Voice Listing, Demand Ping, Predictive Heatmap).
- Community testimonials grid and mission overview.

### 2. Customer Discovery & Live Ordering Flow (`/customer`)
- OpenStreetMap Leaflet integration with custom animated SVG thela pins (`L.divIcon`).
- Realtime vendor markers with walking distance indicators and category badges.
- Category filters: Sabhi (All), Sabzi, Phal, Chaat, Chai.
- Live vendor selection -> inspect today's thela inventory with prices.
- 2-tap doorstep basket pre-order with live order stepper (Placed -> Accepted -> Enroute).
- "Bulao Thela" reverse-demand radar: customer inputs needed produce (e.g. "1 kg Tamatar, Adrak") -> broadcasts to nearby roaming thelas -> instant simulated vendor acceptance.

### 3. Vendor Operations Flow (`/vendor`)
- Giant "Thela ON / OFF" switch with immediate location privacy protection.
- Live GPS beacon coordinates with "Simulate Movement (Chalte Raho)" button.
- Voice-to-inventory listing: mic button with ripple animation -> Gemini intent parsing simulation -> reads back parsed items -> big "Sahi Hai" (Save) vs "Galat Hai" (Retry) confirmation buttons.
- Realtime incoming orders and customer demand pings with 56px "Accept" / "Reject" controls.
- Predictive community demand heatmap with peak hours and high-demand product recommendations.

### 4. Community Rewards & Leaderboard Flow (`/rewards`)
- Coins wallet (+25 coins earned per verified review).
- Mohalla Leaderboard ranking top street vendors with trust badges.
- Interactive review submission form (1-5 stars, comments, instant coin credit).
- Discount coupon redemption store (e.g. Flat ₹25 off on fresh vegetables).
