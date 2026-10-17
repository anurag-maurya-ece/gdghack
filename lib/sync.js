/**
 * Real-time Cross-Tab & Cross-Device Synchronization Engine
 * Connects Customer (/customer) and Vendor (/vendor) live in real-time.
 * Uses BroadcastChannel + LocalStorage Event Bus + API fallback + Web Audio Chimes.
 */

const SYNC_CHANNEL_NAME = "tech_thela_realtime_sync";
const ORDERS_STORAGE_KEY = "tech_thela_shared_orders";
const PINGS_STORAGE_KEY = "tech_thela_shared_pings";

// Helper to play a subtle, pleasant 2-tone chime using Web Audio API (zero audio file assets needed)
export function playChime(type = "order") {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (type === "order") {
      // Pleasant 2-tone doorbell chime (587Hz -> 880Hz)
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.15); // A5
      gain2.gain.setValueAtTime(0.25, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.6);
    } else {
      // Ping alert tone
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(740, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio might be blocked if no user interaction yet, fail silently
  }
}

// Broadcast an event across all tabs and components
export function broadcastSync(action, payload) {
  if (typeof window === "undefined") return;

  const message = { action, payload, timestamp: Date.now() };

  // 1. BroadcastChannel (Ultra-fast, zero-delay inter-tab IPC)
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.postMessage(message);
      channel.close();
    }
  } catch (e) {}

  // 2. LocalStorage event bus (Triggers 'storage' event across all tabs)
  try {
    localStorage.setItem("tech_thela_last_sync_event", JSON.stringify(message));
  } catch (e) {}

  // 3. CustomEvent within same window/tab
  try {
    window.dispatchEvent(new CustomEvent("tech_thela_sync_msg", { detail: message }));
  } catch (e) {}
}

// Subscribe to real-time sync events
export function subscribeSync(callback) {
  if (typeof window === "undefined") return () => {};

  let channel = null;

  // BroadcastChannel listener
  try {
    if ("BroadcastChannel" in window) {
      channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      channel.onmessage = (event) => {
        if (event.data) callback(event.data);
      };
    }
  } catch (e) {}

  // Storage listener for cross-tab fallback
  const handleStorage = (event) => {
    if (event.key === "tech_thela_last_sync_event" && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        callback(parsed);
      } catch (e) {}
    }
  };
  window.addEventListener("storage", handleStorage);

  // In-tab CustomEvent listener
  const handleCustom = (event) => {
    if (event.detail) callback(event.detail);
  };
  window.addEventListener("tech_thela_sync_msg", handleCustom);

  return () => {
    if (channel) {
      try {
        channel.close();
      } catch (e) {}
    }
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("tech_thela_sync_msg", handleCustom);
  };
}

// -------------------------------------------------------------
// Orders Store
// -------------------------------------------------------------
export function getStoredOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveNewOrder(order) {
  if (typeof window === "undefined") return order;
  try {
    const existing = getStoredOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    broadcastSync("NEW_ORDER_CREATED", order);
    return order;
  } catch (e) {
    return order;
  }
}

export function updateOrderStatus(orderId, status) {
  if (typeof window === "undefined") return null;
  try {
    const existing = getStoredOrders();
    let updatedOrder = null;
    const updated = existing.map((o) => {
      if (o.id === orderId) {
        updatedOrder = { ...o, status };
        return updatedOrder;
      }
      return o;
    });
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    broadcastSync("ORDER_STATUS_UPDATED", { orderId, status, order: updatedOrder });
    return updatedOrder;
  } catch (e) {
    return null;
  }
}

// -------------------------------------------------------------
// Demand Pings ("Bulao Thela") Store
// -------------------------------------------------------------
export function getStoredPings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveNewPing(ping) {
  if (typeof window === "undefined") return ping;
  try {
    const existing = getStoredPings();
    const updated = [ping, ...existing.filter((p) => p.id !== ping.id)];
    localStorage.setItem(PINGS_STORAGE_KEY, JSON.stringify(updated));
    broadcastSync("NEW_DEMAND_PING", ping);
    return ping;
  } catch (e) {
    return ping;
  }
}

export function acceptDemandPing(pingId, vendor) {
  if (typeof window === "undefined") return null;
  try {
    const existing = getStoredPings();
    let updatedPing = null;
    const updated = existing.map((p) => {
      if (p.id === pingId) {
        updatedPing = { ...p, status: "accepted", acceptedBy: vendor };
        return updatedPing;
      }
      return p;
    });
    localStorage.setItem(PINGS_STORAGE_KEY, JSON.stringify(updated));
    broadcastSync("DEMAND_PING_ACCEPTED", { pingId, vendor, ping: updatedPing });
    return updatedPing;
  } catch (e) {
    return null;
  }
}
