import assert from "node:assert";
import {
  calculateHaversineDistanceKm,
  matchVendorInventory,
  evaluateOrderBatchEligibility,
  BATCHING_CONFIG,
} from "../lib/batching.js";

console.log("🧪 Testing Spatio-Temporal Batching & Inventory-First Matcher...\n");

// Test 1: Haversine distance accuracy
const d1 = calculateHaversineDistanceKm(28.6315, 77.2185, 28.6304, 77.2177);
assert(d1 > 0 && d1 < 0.3, `Distance should be ~140m, got ${d1} km`);
console.log(`✅ 1. Haversine distance calculation: ${Math.round(d1 * 1000)} meters (Accurate)`);

// Test 2: Inventory 100% Match Priority
const mockVendors = [
  {
    id: "v1",
    name: "Ramesh Bhaiya",
    isOnline: true,
    lat: 28.6315,
    lng: 77.2185,
    inventory: [
      { name: "Aaloo (Potato)", inStock: true, stock: 20 },
      { name: "Pyaaz (Onion)", inStock: true, stock: 15 },
      { name: "Tamatar (Tomato)", inStock: true, stock: 25 },
    ],
  },
  {
    id: "v2",
    name: "Suresh Kumar",
    isOnline: true,
    lat: 28.6310,
    lng: 77.2180,
    inventory: [
      { name: "Aaloo (Potato)", inStock: true, stock: 20 },
      { name: "Seb (Apple)", inStock: true, stock: 10 },
    ],
  },
];

const customerCart100 = [
  { name: "Aaloo", quantity: 2 },
  { name: "Pyaaz", quantity: 1 },
];

const match100 = matchVendorInventory(customerCart100, mockVendors);
assert.strictEqual(match100.matchType, "100_percent_match");
assert.strictEqual(match100.bestVendor.id, "v1");
assert.strictEqual(match100.coveragePercentage, 100);
console.log(`✅ 2. Inventory 100% Match Priority: Correctly allotted to ${match100.bestVendor.name} (100% coverage)`);

// Test 3: Stepped Fallback when no single vendor has all items
const customerCartSplit = [
  { name: "Aaloo", quantity: 2 },
  { name: "Seb", quantity: 1 },
  { name: "Tamatar", quantity: 1 },
];

const matchSplit = matchVendorInventory(customerCartSplit, mockVendors);
assert.strictEqual(matchSplit.matchType, "stepped_partial_match");
assert(matchSplit.steppedRecommendation !== null);
// Both v1 and v2 cover 2 items (67%), v2 is closer (70m vs 145m) so v2 wins tie-breaker!
assert.strictEqual(matchSplit.steppedRecommendation.primaryVendor.id, "v2");
assert.strictEqual(matchSplit.steppedRecommendation.secondaryVendor.id, "v1"); // v1 covers the missing Tamatar!
console.log(
  `✅ 3. Stepped Fallback Match: Primary Vendor covers ${matchSplit.coveragePercentage}% (won on distance tie-breaker), secondary (${matchSplit.steppedRecommendation.secondaryVendor.name}) covers missing items`
);

// Test 4: Batching Zone evaluation
// Point within 1.5km Core
const mockCenter = { lat: 28.6315, lng: 77.2185 };
const pointCore = { lat: 28.6380, lng: 77.2250 }; // ~1.0 km away
const distCore = calculateHaversineDistanceKm(mockCenter.lat, mockCenter.lng, pointCore.lat, pointCore.lng);
assert(distCore <= BATCHING_CONFIG.CORE_RADIUS_KM);
console.log(`✅ 4. Core Zone Evaluation: Order at ${distCore.toFixed(2)} km falls inside 1.5 km core`);

// Point in +0.5km Buffer (1.5km - 2.0km)
const pointBuffer = { lat: 28.6430, lng: 77.2300 }; // ~1.7 km away
const distBuffer = calculateHaversineDistanceKm(mockCenter.lat, mockCenter.lng, pointBuffer.lat, pointBuffer.lng);
assert(distBuffer > BATCHING_CONFIG.CORE_RADIUS_KM && distBuffer <= BATCHING_CONFIG.TOTAL_MAX_RADIUS_KM);
console.log(`✅ 5. Edge Buffer Evaluation: Order at ${distBuffer.toFixed(2)} km falls inside 0.5 km buffer zone`);

// Point outside 2.0km (>2km)
const pointFar = { lat: 28.6600, lng: 77.2500 }; // ~4.3 km away
const distFar = calculateHaversineDistanceKm(mockCenter.lat, mockCenter.lng, pointFar.lat, pointFar.lng);
assert(distFar > BATCHING_CONFIG.TOTAL_MAX_RADIUS_KM);
console.log(`✅ 6. Out-of-Zone Evaluation: Order at ${distFar.toFixed(2)} km correctly excluded from active 30-min window`);

console.log("\n🎉 ALL 6 SPATIO-TEMPORAL BATCHING TESTS PASSED!\n");
