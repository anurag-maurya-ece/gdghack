# Hackathon Bloopers: "Antarctica Me Dhaniya Bechta Thela" 🐧🧊

## 1. What was the Bug?
During early testing of Leaflet and OpenStreetMap integration on the customer live thela map, `L.tileLayer` did not have `noWrap: true` configured, and camera bounds were unbound.
When testing coordinate drift and rapid pan simulations, Ramesh Bhaiya's cart coordinates overflowed across the 3rd duplicate Earth map wrap, placing his cart directly on the Antarctic South Pole Ice Shelf (-75.25° S, 0.07° E).

## 2. Funny Hackathon Moment
Team members joked:
> *"Bhaiya penguins ko Dhaniya-Mirchi free doge ya Antarctica delivery charge lagega?"*

## 3. Media Assets Saved
- **Full Video Recording (MP4, 7.8 MB)**: `antarctica_thela_bug.mp4`
- **Antarctica Bug Screenshot**: `antarctica_bug_screenshot.png`
- **Delhi Fixed Screenshot**: `delhi_debugged_screenshot.png`

## 4. Architectural Fix (Debug Solution)
```javascript
// components/LeafletMap.jsx
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
  maxZoom: 19,
  noWrap: true, // ✅ FIX: Prevents Leaflet from horizontally repeating the Earth
}).addTo(map);
```
- Added `noWrap: true` to OpenStreetMap tile layer.
- Applied geofence dead-band clamping to Delhi NCR boundaries.
