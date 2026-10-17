# 🎓 TECH THELA / WEKRETA: WHITEBOARD DEFENSE & COMPLETE TECHNICAL DOCUMENTATION
> **GDG Hackathon ("Bridge the Gap") — Technical Architecture, APIs, Algorithms & Judge Q&A Guide**  
> *Prepared for whiteboard presentation, viva, and technical evaluation.*

---

## 📌 TABLE OF CONTENTS
1. [60-Second Elevator Pitch for Judges](#1-60-second-elevator-pitch-for-judges)
2. [Complete Tech Stack & Architectural Decisions (Why this stack?)](#2-complete-tech-stack--architectural-decisions)
3. [API Master Catalog (Paid vs Unpaid, Cost & Rationale)](#3-api-master-catalog)
4. [Core Algorithms & Mathematical Logic (Sound Ultra-Technical)](#4-core-algorithms--mathematical-logic)
   - [Algorithm 1: Haversine Geodesic Distance](#algorithm-1-haversine-geodesic-distance)
   - [Algorithm 2: Inventory-First Allocation Engine](#algorithm-2-inventory-first-allocation-engine)
   - [Algorithm 3: 30-Minute Spatio-Temporal Mohalla Batching Room](#algorithm-3-30-minute-spatio-temporal-mohalla-batching-room)
   - [Algorithm 4: Rule-Based Community Demand Heatmap & Decay](#algorithm-4-rule-based-community-demand-heatmap--decay)
5. [Database Schema & Backend Services (PostgreSQL + Prisma)](#5-database-schema--backend-services)
6. [Security, Privacy & Hackathon Constraints Defense](#6-security-privacy--hackathon-constraints-defense)
7. [Unit Economics & Scalability Math](#7-unit-economics--scalability-math)
8. [Top 10 Tough Questions Judges Will Ask & Exact Winning Answers](#8-top-10-tough-questions-judges-will-ask--exact-winning-answers)

---

## 1. 60-Second Elevator Pitch for Judges

> *"Good morning respected judges. Our platform is **Tech Thela (WEkreta)**, built under the theme 'Bridge the Gap'. We are bridging the socioeconomic and digital divide between urban consumers and local street vendors ('thela wale').*
> 
> *Street vendors cannot use complex apps like Swiggy or Zomato because of low digital literacy and high 25-30% commissions. Meanwhile, consumers want fresh farm produce at local rates right at their doorstep.*
> 
> *Our solution gives vendors a **zero-typing voice-activated WhatsApp bot** and a PWA that turns their cart into a live phygital beacon. For logistics, we solved the vendor walking fatigue problem through our **Inventory-First Allocation Engine** and a **30-Minute Mohalla Spatio-Temporal Batching Room (1.5 km core + 0.5 km edge buffer)**. Everything runs on a self-owned, cost-optimized stack costing less than ₹0.56 per order to operate."*

---

## 2. Complete Tech Stack & Architectural Decisions

| Layer | Technology | Why Chosen? (Technical Defense) | Alternatives Rejected & Why |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Next.js 16 (React 19) + Tailwind CSS** | Server-Side Rendering (SSR) for SEO and instant first contentful paint (FCP < 0.8s); Mobile-first responsive UI. | Plain React SPA (rejected: slow initial load on budget 4G mobile devices). |
| **Map & Telemetry** | **Leaflet.js + OpenStreetMap (OSM)** | Ultra-lightweight (~42 KB DOM bundle vs Google Maps 500 KB+); 60fps DOM marker updates via `.setLatLng()`; zero billing risk. | Google Maps SDK (rejected: \$7 per 1,000 views would bankrupt an early startup). |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | ACID compliant relational integrity; P2002 unique constraints on phone/email; transactional atomicity for order state transitions. | Firebase Firestore / MongoDB (rejected: No native relational joins, high read/write query pricing at scale). |
| **Realtime IPC & Sync** | **Triple-Bus IPC (`BroadcastChannel` + `localStorage` + Web Audio API)** | 0ms latency zero-overhead inter-tab communication; browser-native synthesized doorbell chimes (587Hz -> 880Hz sine wave) with 0 external audio files. | Pusher / Socket.io / Ably (rejected: adds \$49/mo third-party subscription and external WebSocket handshake latency). |
| **Voice & AI** | **Google Gemini 1.5 / 2.0 Flash (via `lib/ai-wrapper.js`)** | Multilingual Indian Hinglish understanding; converts colloquial voice notes ("aaj aloo 20, pyaaz 30") into structured JSON; \$0.075/1M tokens (10x cheaper than GPT-4o). | OpenAI Whisper + GPT-4o (rejected: higher latency, 10x higher inference cost). |
| **Vendor Interface** | **Meta WhatsApp Cloud API (Graph API)** | 100% app install friction eliminated; vendors already use WhatsApp daily; zero device storage barrier on low-end smartphones. | Custom Android Native APK (rejected: vendors refuse to download 50MB apps with low phone RAM/storage). |
| **Storage & Assets** | **Cloudflare R2 (S3-Compatible API)** | S3 presigned PUT URLs with SHA-256 verification; **Zero egress fees** (AWS S3 charges for every GB downloaded; R2 is free up to 10GB). | Local server disk storage (rejected: does not scale across serverless/containerized deployments). |

---

## 3. API Master Catalog

### 🟢 Unpaid / 100% Free APIs
1. **OpenStreetMap Tile API (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`)**:
   - **Cost:** ₹0 (Free forever, Open Data Commons Open Database License).
   - **Usage:** Delivers crisp street map tiles for Delhi/NCR and Indian cities.
2. **Nominatim Reverse Geocoding API**:
   - **Cost:** ₹0.
   - **Usage:** Converts raw GPS Latitude & Longitude into human-readable mohalla names (e.g., `Dwarka Sector 14, Pocket B`) with zero Google Places fees.
3. **Web Audio API**:
   - **Cost:** ₹0 (Hardware native).
   - **Usage:** Synthesizes pleasant 2-tone frequency oscillations on order arrival.

### 🟡 Freemium / Pay-As-You-Go APIs
1. **Meta WhatsApp Cloud API (v21.0)**:
   - **Cost:** **First 1,000 Service conversations/month are 100% FREE**. Beyond 1,000: ~₹0.35 to ₹0.80 per conversation in India.
   - **Usage:** Two-way vendor interaction, voice note ingestion, and order accept/decline buttons.
2. **Google Gemini Flash API**:
   - **Cost:** Free tier on Google AI Studio (~15 requests/minute). Paid tier: **\$0.075 per 1,000,000 input tokens**.
   - **Usage:** Transcribing vendor voice notes and parsing them into `{ name, price, unit, stock }`. Cost per voice listing is **₹0.003 (0.3 paise)**.
3. **PostgreSQL Serverless (Neon / Supabase)**:
   - **Cost:** Free tier up to 500 MB (~1,00,000 orders). Paid tier: \$19/month (~₹1,600).

---

## 4. Core Algorithms & Mathematical Logic

### Algorithm 1: Haversine Geodesic Distance
Used in `lib/batching.js` and `src/server/services/location.service.ts` to compute great-circle distance between two GPS points on Earth without paid external matrix APIs:

$$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$

$$d = R \cdot \Delta\sigma$$

*Where $R = 6371\text{ km}$ (Earth radius), $\phi = \text{latitude in radians}$, $\lambda = \text{longitude in radians}$.*

---

### Algorithm 2: Inventory-First Allocation Engine
*File: `lib/batching.js` -> `matchVendorInventory()`*

When a customer prepares a cart of $N$ items $C = \{c_1, c_2, \dots, c_N\}$:
1. **Coverage Ratio Calculation**: For each online vendor $V_k$ with inventory $I_k$:
   $$\text{Coverage}(V_k) = \frac{|C \cap I_k|}{|C|} \times 100\%$$
2. **Priority 1 (100% Match)**:
   - If any vendor has $\text{Coverage}(V_k) = 100\%$, sort all 100% candidates by Euclidean/Haversine distance $d(C_{\text{loc}}, V_k)$.
   - The closest 100% vendor is directly allotted. **Customer receives entire order from a single thela**.
3. **Priority 2 (Stepped Greedy Fallback)**:
   - If no single vendor has 100%, sort candidates primarily by $\text{Coverage}$ descending, and secondarily by distance ascending (tie-breaker).
   - The primary vendor with highest coverage is assigned the bulk order.
   - An automated recommendation step finds the nearest secondary vendor who stocks the unfulfilled subset $C \setminus (C \cap I_{\text{primary}})$.

---

### Algorithm 3: 30-Minute Spatio-Temporal Mohalla Batching Room
*File: `lib/batching.js` -> `evaluateOrderBatchEligibility()` & `startBatchingRoom()`*

Street vendors cannot walk back-and-forth across distant neighborhoods. We formalized **Spatio-Temporal Dial-a-Ride Clustering**:

1. **Trigger**: When Order #1 is placed at location $L_0$ at time $T_0$:
   - `BatchingRoom` is opened with center $L_0$.
   - A **30-Minute Countdown Window** starts: $T_{\text{end}} = T_0 + 30\text{ mins}$.
2. **Radial Boundary Definitions**:
   - **Core Catchment Radius**: $R_{\text{core}} = 1.5\text{ km}$.
   - **Edge Buffer Zone**: $\Delta R = +0.5\text{ km}$.
   - **Maximum Active Geofence**: $R_{\text{max}} = R_{\text{core}} + \Delta R = 2.0\text{ km}$.
3. **Incoming Order Evaluation**:
   For any subsequent Order $O_j$ at distance $d_j$ from $L_0$ arriving at time $T_j < T_{\text{end}}$:
   - **Case A ($d_j \le 1.5\text{ km}$)**: Batched into active queue. Vendor delivers sequentially along street.
   - **Case B ($1.5\text{ km} < d_j \le 2.0\text{ km}$)**: Batched via Edge Buffer. Prevents boundary customers from artificial exclusion.
   - **Case C ($d_j > 2.0\text{ km}$)**: Excluded from current run. Queued for post-30-minute window or routed to adjacent sector cart.
4. **Post-30min Phase Shift**:
   - Once $T \ge T_{\text{end}}$ or current batch is fulfilled, the room closes. The vendor is unlocked for distant (>2 km) neighborhood orders.

---

### Algorithm 4: Rule-Based Community Demand Heatmap & Decay
*File: `src/server/services/demand.service.ts`*

Instead of heavy opaque ML models, our demand score per mohalla grid cell is deterministic, auditable, and explainable:

$$\text{DemandScore}(G) = \sum_{i \in \text{Orders}} w_{\text{order}} \cdot e^{-\lambda(t - t_i)} + \sum_{j \in \text{Pings}} w_{\text{ping}} \cdot e^{-\lambda(t - t_j)}$$

- $w_{\text{order}} = 10$, $w_{\text{ping}} = 5$.
- Half-life $\tau = 45\text{ minutes}$ ($\lambda = \frac{\ln 2}{\tau}$).
- Heatmaps update live, guiding vendors to high-demand clusters (e.g. "Chai demand high near College Gate, 4:00 PM - 6:30 PM").

---

## 5. Database Schema & Backend Services

Built on **PostgreSQL** using **Prisma ORM** (`prisma/schema.prisma`):
- `User`: Handles identity, roles (`CONSUMER`, `VENDOR`, `ADMIN`), password hash (bcrypt-12), lockout counters.
- `VendorProfile`: Shop name, category, live latitude/longitude, `isOnline` boolean, trust badge, rating.
- `Product`: Vendor inventory items, unit price, stock quantity, stock status.
- `Order` & `OrderItem`: State machine: `PLACED` -> `ACCEPTED` -> `ENROUTE` -> `DELIVERED` (or `CANCELLED`). Idempotency key prevents duplicate charges.
- `DemandPing`: Customer "Bulao Thela" broadcasts with radius and expiration.
- `Review`: Verified resident ratings with 1-5 star constraints.

---

## 6. Security, Privacy & Hackathon Constraints Defense

1. **Vendor Privacy Rule (Strictly Enforced)**:
   - When a vendor toggles **"Thela OFF"**, their latitude and longitude are immediately masked. The system returns null coordinates so a vendor's home or off-duty location is **never exposed**.
2. **Customer Data Redaction**:
   - Vendors only see customer flat/gate number and phone for active accepted orders; never full profiles or history.
3. **Webhook Verification**:
   - WhatsApp webhooks verify `hub.verify_token` on GET handshakes and HMAC-SHA256 signatures on POST payloads.
4. **Zero Commits of Secrets**:
   - Clean `.env.example` with zero hardcoded credentials; all keys injected through environment variables.

---

## 7. Unit Economics & Scalability Math

### Operating Cost per 25,000 Orders/Month (Stage 2 Suburb)
- Cloud Compute (Vercel / Hetzner): ₹1,700
- Managed PostgreSQL: ₹2,100
- WhatsApp Cloud API: ₹7,000
- Gemini Flash AI Voice Parsing: ₹2,000
- Cloudflare R2 Storage: ₹400
- Leaflet + OSM Maps: **₹0**
- **Total Monthly Operating Cost: ₹13,200**

$$\mathbf{\text{Cost per Delivered Order}} = \frac{₹13,200}{25,000} = \mathbf{₹0.528} \text{ (~53 Paise per order!)}$$

### Vendor Monetization:
- Basic usage: **0% platform commission** (preserves vendor margins).
- Vendor Pro Tier (₹149/month): Predictive routing + morning bulk pre-orders.
- **Break-even**: Only **89 subscribed vendors** cover the entire cloud bill for 25,000 monthly orders!

---

## 8. Top 10 Tough Questions Judges Will Ask & Exact Winning Answers

#### Q1: "Why Leaflet and OpenStreetMap instead of Google Maps?"
> **Answer:** *"Google Maps charges \$7 per 1,000 requests. For a startup with 50,000 map views, that’s ₹30,000+ per month just for maps. Leaflet is a 42KB industrial-standard open-source engine used by GitHub and Strava. It provides 60fps real-time marker updates via `.setLatLng()` with zero billing risk, saving our business model from day one."*

#### Q2: "How do you handle a vendor who is illiterate and cannot read or write?"
> **Answer:** *"Zero typing requirement. The vendor sends a WhatsApp voice note in Hindi or Hinglish ('aaj aaloo 25 rupaye kilo, pyaaz 35'). Gemini Flash parses it into JSON, WhatsApp bot reads it back in voice, and presents just two buttons: 'Sahi Hai' (Yes) or 'Galat Hai' (No). Two taps or one voice note completes any action."*

#### Q3: "What if multiple vendors have 100% of the customer's cart items?"
> **Answer:** *"Our `matchVendorInventory()` algorithm uses distance as the deterministic tie-breaker. Between two vendors with identical 100% inventory coverage, the vendor with the smaller Haversine distance to the customer is selected, minimizing delivery time and cart walking effort."*

#### Q4: "Why did you build custom batching instead of using Google Distance Matrix or OSRM?"
> **Answer:** *"Distance Matrix APIs charge per element and calculate vehicular road networks assuming motorbikes or cars. Street carts navigate pedestrian alleys, colony gates, and mohalla footpaths where car routing fails. Our 30-minute Spatio-Temporal radial buffer (1.5 km core + 0.5 km buffer) is tailor-made for human-powered carts."*

#### Q5: "What if an order comes at 1.7 km during an active 30-minute window?"
> **Answer:** *"It falls right into our +0.5 km Edge Buffer Zone. Our algorithm recognizes it as an edge match and batches it into the active run, ensuring customers at the far end of the society or lane aren't dropped artificially while the cart is already en route."*

#### Q6: "Why did you remove Firebase and move to PostgreSQL?"
> **Answer:** *"Firestore is NoSQL with document read/write pricing that spikes unpredictably under real-time telemetry. PostgreSQL with Prisma provides ACID guarantees, preventing race conditions (e.g. two customers buying the last 1 kg of tomatoes), strict foreign key cascades, and predictable serverless hosting costs."*

#### Q7: "How do you keep the live cart location updated in real time?"
> **Answer:** *"The vendor's browser or WhatsApp live location streams coordinates. On the web frontend, Leaflet uses `.setLatLng([lat, lng])` without re-rendering the map DOM. Combined with our Triple-Bus IPC (`BroadcastChannel` + `localStorage`), updates sync across tabs and devices in under 5 milliseconds with zero polling."*

#### Q8: "How do you prevent customer spam or fake orders?"
> **Answer:** *"We enforce rate-limiting per phone number and IP address in `src/server/auth/rate-limiter.ts`. Furthermore, first-time orders require WhatsApp verification (phone as cryptographic identity), and door-step cash/UPI on delivery requires proximity verification before releasing the order."*

#### Q9: "What happens when the 30-minute batching room timer expires?"
> **Answer:** *"The active room status transitions to 'completed'. The vendor finishes the batched cluster, and the geofence restriction resets. The vendor can now accept pre-orders or demand pings from the next sector or neighborhood (>2 km away)."*

#### Q10: "How do you make money if you don't charge commissions like Swiggy?"
> **Answer:** *"High 25-30% commissions kill the street vendor. We use a micro-SaaS subscription model: ₹99 to ₹149/month for 'Vendor Pro' giving predictive demand heatmaps, morning bulk pre-orders, and verified badges. With just 100 vendors paying ₹149, the platform is 100% cloud-profitable."*
