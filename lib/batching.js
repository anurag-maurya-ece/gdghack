/**
 * Spatio-Temporal Batching & Inventory-First Allocation Engine
 * Tech Thela / WEkreta Platform
 *
 * Implements:
 * 1. Inventory Completeness Matcher (100% full match priority -> stepped greedy fallback)
 * 2. 30-Minute "Mohalla Batching Room" (1.5 km Core Zone + 0.5 km Edge Buffer = 2.0 km Geofence)
 */

// Geodesic distance calculation via Haversine formula
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --------------------------------------------------------------------------
// 1. INVENTORY-FIRST VENDOR ALLOCATION ENGINE
// --------------------------------------------------------------------------

/**
 * Evaluates cart items against all online vendors to find the best match.
 * Priority 1: 100% Full Match (Vendor has all requested items in stock)
 * Priority 2: Stepped Fallback (Greedy vendor with highest item coverage + split step)
 *
 * @param {Array} cartItems - e.g. [{ id, name, quantity }]
 * @param {Array} vendors - Array of vendor objects with inventory
 * @param {Object} customerLocation - { lat, lng }
 */
export function matchVendorInventory(cartItems = [], vendors = [], customerLocation = { lat: 28.6304, lng: 77.2177 }) {
  if (!cartItems.length || !vendors.length) {
    return {
      bestVendor: vendors[0] || null,
      fullMatches: [],
      partialMatches: [],
      matchType: "none",
      coveragePercentage: 0,
    };
  }

  const requestedNames = cartItems.map((c) =>
    (c.item?.name || c.name || "").toLowerCase().trim()
  );

  const scoredVendors = vendors
    .filter((v) => v.isOnline)
    .map((vendor) => {
      const inventoryNames = (vendor.inventory || [])
        .filter((i) => i.inStock !== false && (i.stock === undefined || i.stock > 0))
        .map((i) => (i.name || "").toLowerCase().trim());

      let matchedItems = [];
      let missingItems = [];

      requestedNames.forEach((reqName, idx) => {
        // Substring / keyword fuzzy match (e.g. "Aaloo" matches "Aaloo (Desi Potato)")
        const found = inventoryNames.some(
          (inv) => inv.includes(reqName) || reqName.includes(inv)
        );
        if (found) {
          matchedItems.push(cartItems[idx]);
        } else {
          missingItems.push(cartItems[idx]);
        }
      });

      const coverageRatio = matchedItems.length / requestedNames.length;
      const coveragePercentage = Math.round(coverageRatio * 100);

      // Distance from customer
      const distanceKm = vendor.lat && vendor.lng
        ? calculateHaversineDistanceKm(customerLocation.lat, customerLocation.lng, vendor.lat, vendor.lng)
        : (vendor.distanceMeters || 200) / 1000;

      return {
        vendor,
        matchedItems,
        missingItems,
        matchCount: matchedItems.length,
        totalRequested: requestedNames.length,
        coveragePercentage,
        is100Percent: coveragePercentage === 100,
        distanceKm: Number(distanceKm.toFixed(2)),
        distanceMeters: Math.round(distanceKm * 1000),
      };
    });

  // Sort logic:
  // 1. Coverage percentage DESC (100% first)
  // 2. Distance meters ASC (closest first)
  scoredVendors.sort((a, b) => {
    if (b.coveragePercentage !== a.coveragePercentage) {
      return b.coveragePercentage - a.coveragePercentage;
    }
    return a.distanceMeters - b.distanceMeters;
  });

  const fullMatches = scoredVendors.filter((s) => s.is100Percent);
  const partialMatches = scoredVendors.filter((s) => !s.is100Percent);

  // Best candidate selection
  if (fullMatches.length > 0) {
    const best = fullMatches[0];
    return {
      bestVendor: best.vendor,
      matchType: "100_percent_match",
      coveragePercentage: 100,
      matchedItems: best.matchedItems,
      missingItems: [],
      distanceKm: best.distanceKm,
      fullMatches,
      partialMatches,
      steppedRecommendation: null,
    };
  }

  // Stepped Fallback: Pick highest partial coverage vendor, find secondary for missing
  const primary = scoredVendors[0];
  let secondary = null;

  if (primary && primary.missingItems.length > 0) {
    // Find a nearby vendor who has the missing items
    const missingNames = primary.missingItems.map((m) =>
      (m.item?.name || m.name || "").toLowerCase().trim()
    );

    const candidatesForMissing = scoredVendors.slice(1).filter((cand) => {
      const candInventory = (cand.vendor.inventory || []).map((i) =>
        (i.name || "").toLowerCase().trim()
      );
      return missingNames.some((m) =>
        candInventory.some((inv) => inv.includes(m) || m.includes(inv))
      );
    });

    if (candidatesForMissing.length > 0) {
      secondary = candidatesForMissing[0];
    }
  }

  return {
    bestVendor: primary ? primary.vendor : null,
    matchType: "stepped_partial_match",
    coveragePercentage: primary ? primary.coveragePercentage : 0,
    matchedItems: primary ? primary.matchedItems : [],
    missingItems: primary ? primary.missingItems : [],
    distanceKm: primary ? primary.distanceKm : 0,
    fullMatches: [],
    partialMatches,
    steppedRecommendation: primary
      ? {
          primaryVendor: primary.vendor,
          primaryCovers: primary.matchedItems,
          secondaryVendor: secondary ? secondary.vendor : null,
          secondaryCovers: secondary ? secondary.matchedItems : [],
          unfulfilled: secondary
            ? primary.missingItems.filter(
                (m) =>
                  !secondary.matchedItems.some(
                    (sm) => (sm.item?.name || sm.name) === (m.item?.name || m.name)
                  )
              )
            : primary.missingItems,
        }
      : null,
  };
}

// --------------------------------------------------------------------------
// 2. 30-MINUTE MOHALLA BATCHING ROOM ENGINE (1.5 km Core + 0.5 km Buffer)
// --------------------------------------------------------------------------

export const BATCHING_CONFIG = {
  CORE_RADIUS_KM: 1.5,
  BUFFER_RADIUS_KM: 0.5,
  TOTAL_MAX_RADIUS_KM: 2.0, // 1.5 + 0.5
  WINDOW_DURATION_MS: 30 * 60 * 1000, // 30 minutes
  STORAGE_KEY_PREFIX: "tech_thela_batching_room_",
};

/**
 * Retrieves the currently active 30-minute batching room for a vendor
 */
export function getActiveBatchingRoom(vendorId = "v1") {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${BATCHING_CONFIG.STORAGE_KEY_PREFIX}${vendorId}`);
    if (!raw) return null;

    const room = JSON.parse(raw);
    const now = Date.now();

    // Check if the 30-min window expired
    if (now >= room.endTime) {
      room.status = "expired";
      localStorage.setItem(`${BATCHING_CONFIG.STORAGE_KEY_PREFIX}${vendorId}`, JSON.stringify(room));
      return null;
    }

    room.timeLeftMs = room.endTime - now;
    room.timeLeftMinutes = Math.ceil(room.timeLeftMs / 60000);
    return room;
  } catch (e) {
    return null;
  }
}

/**
 * Initializes or refreshes a 30-minute batching room when the first order is placed
 */
export function startBatchingRoom(vendorId = "v1", centerLocation = { lat: 28.6315, lng: 77.2185 }, initialOrderId = "ord-1") {
  if (typeof window === "undefined") return null;
  try {
    const existing = getActiveBatchingRoom(vendorId);
    if (existing) {
      // If already active, add order to existing batch
      if (!existing.orders.includes(initialOrderId)) {
        existing.orders.push(initialOrderId);
        localStorage.setItem(`${BATCHING_CONFIG.STORAGE_KEY_PREFIX}${vendorId}`, JSON.stringify(existing));
      }
      return existing;
    }

    const now = Date.now();
    const newRoom = {
      roomId: `room-${vendorId}-${Date.now().toString().slice(-4)}`,
      vendorId,
      center: centerLocation,
      startTime: now,
      endTime: now + BATCHING_CONFIG.WINDOW_DURATION_MS,
      coreRadiusKm: BATCHING_CONFIG.CORE_RADIUS_KM,
      bufferRadiusKm: BATCHING_CONFIG.BUFFER_RADIUS_KM,
      totalRadiusKm: BATCHING_CONFIG.TOTAL_MAX_RADIUS_KM,
      orders: [initialOrderId],
      status: "active",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`${BATCHING_CONFIG.STORAGE_KEY_PREFIX}${vendorId}`, JSON.stringify(newRoom));
    return newRoom;
  } catch (e) {
    return null;
  }
}

/**
 * Evaluates whether a new customer order falls inside the vendor's active batching window & zone
 */
export function evaluateOrderBatchEligibility(vendorId, orderLocation) {
  const room = getActiveBatchingRoom(vendorId);

  // If no room is running, this order will start a brand new room
  if (!room) {
    return {
      canBatch: true,
      batchStatus: "starts_new_room",
      distanceKm: 0,
      zone: "center",
      reason: "First order in cluster: Starts 30-minute Mohalla Batching Room",
      activeRoom: null,
    };
  }

  const distanceKm = calculateHaversineDistanceKm(
    room.center.lat,
    room.center.lng,
    orderLocation.lat,
    orderLocation.lng
  );

  const roundedDist = Number(distanceKm.toFixed(2));

  // Case A: Inside 1.5 km Core Catchment
  if (roundedDist <= BATCHING_CONFIG.CORE_RADIUS_KM) {
    return {
      canBatch: true,
      batchStatus: "core_zone",
      distanceKm: roundedDist,
      zone: "1.5km Core Zone",
      timeLeftMinutes: room.timeLeftMinutes,
      reason: `Batched! Inside ${roundedDist} km of active ${room.timeLeftMinutes}-min run.`,
      activeRoom: room,
    };
  }

  // Case B: Inside 0.5 km Buffer Zone (1.5 km to 2.0 km)
  if (roundedDist <= BATCHING_CONFIG.TOTAL_MAX_RADIUS_KM) {
    return {
      canBatch: true,
      batchStatus: "buffer_zone",
      distanceKm: roundedDist,
      zone: "+0.5km Edge Buffer (Boundary)",
      timeLeftMinutes: room.timeLeftMinutes,
      reason: `Batched via Edge Buffer (${roundedDist} km). Prevents near-boundary order loss.`,
      activeRoom: room,
    };
  }

  // Case C: Outside 2.0 km -> Held for post-30-minute window or adjacent sector cart
  return {
    canBatch: false,
    batchStatus: "out_of_zone",
    distanceKm: roundedDist,
    zone: "Outside 2.0km Sector",
    timeLeftMinutes: room.timeLeftMinutes,
    reason: `Distance (${roundedDist} km) exceeds 2.0 km geofence. Dispatches after current 30-min window or allots to adjacent sector thela.`,
    activeRoom: room,
  };
}
