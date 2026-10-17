"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import VendorSidebar from "../../components/VendorSidebar";
import { DEMAND_ZONES, INITIAL_VENDORS } from "../../lib/mock-data";
import {
  Mic,
  MicOff,
  Power,
  MapPin,
  TrendingUp,
  CheckCircle,
  XCircle,
  Package,
  Plus,
  Minus,
  Sparkles,
  Volume2,
  AlertTriangle,
  RotateCcw,
  Navigation,
  Award,
  Bell,
  Star,
  Trophy,
  ShoppingCart,
  ShoppingBag,
  Radio,
  Phone,
  ShieldCheck,
  Check,
  X,
  Clock,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import {
  getStoredOrders,
  getStoredPings,
  updateOrderStatus as updateSyncOrderStatus,
  acceptDemandPing as acceptSyncDemandPing,
  subscribeSync,
  playChime,
} from "../../lib/sync";
import { getActiveBatchingRoom, BATCHING_CONFIG } from "../../lib/batching";

// Dynamically load the Leaflet map to avoid server-side window errors
const LeafletMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] rounded-3xl bg-gray-100 flex flex-col items-center justify-center border-2 border-gray-200 gap-3">
      <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-bold text-gray-700">Loading Smart Navigation Map...</p>
    </div>
  ),
});

export default function VendorDashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tech_thela_user");
        if (!stored) {
          router.push("/Vendorlogin");
        }
      }
    } catch (e) {}
  }, [router]);

  const [activeTab, setActiveTab] = useState("locate_customer");
  const [isThelaOnline, setIsThelaOnline] = useState(true);
  const [vendorLocation, setVendorLocation] = useState({ lat: 28.6315, lng: 77.2185 });
  const [stepCount, setStepCount] = useState(0);

  // Vendor inventory state
  const [inventory, setInventory] = useState(INITIAL_VENDORS[0].inventory);

  // Voice listing state
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [parsedItems, setParsedItems] = useState(null);
  const [voiceConfirmedMessage, setVoiceConfirmedMessage] = useState(null);

  // Live incoming orders / alerts
  const [incomingOrders, setIncomingOrders] = useState([
    {
      id: "ord-101",
      customerName: "Mrs. Verma (Flat 302, Pocket B)",
      distance: "140m away",
      items: "2 kg Aaloo, 1 kg Tamatar, Adrak Mirchi combo",
      total: 95,
      time: "2 mins ago",
      status: "pending", // 'pending' | 'accepted' | 'rejected'
    },
    {
      id: "ord-102",
      customerName: "Aman Gupta (Near Park Bench)",
      distance: "210m away",
      items: "1 kg Nasik Pyaaz",
      total: 35,
      time: "Just now",
      status: "pending",
    },
  ]);

  // Live demand pings ("Bulao Thela")
  const [livePings, setLivePings] = useState([
    {
      id: "ping-demo-1",
      consumerName: "Sanjay Singhal",
      item: "2 kg Fresh Tamatar & Dhaniya",
      quantity: "2 kg",
      notes: "Gate No. 2 ke paas delivery chahiye",
      pin: "110075",
      time: "3 mins ago",
      status: "broadcasting",
    },
  ]);

  // Toast notification for incoming orders / pings
  const [toastNotification, setToastNotification] = useState(null);

  // 30-Minute Mohalla Batching Room state
  const [batchingRoom, setBatchingRoom] = useState(null);

  useEffect(() => {
    const checkRoom = () => {
      const room = getActiveBatchingRoom("v1") || getActiveBatchingRoom("vendor-ramesh");
      setBatchingRoom(room);
    };
    checkRoom();
    const interval = setInterval(checkRoom, 5000);
    return () => clearInterval(interval);
  }, []);

  // Real-time synchronization with Customer portal
  useEffect(() => {
    // 1. Initial hydration from shared storage
    const storedOrders = getStoredOrders();
    if (storedOrders.length > 0) {
      setIncomingOrders((prev) => {
        const ids = new Set(storedOrders.map((o) => o.id));
        return [...storedOrders, ...prev.filter((o) => !ids.has(o.id))];
      });
    }

    const storedPings = getStoredPings();
    if (storedPings.length > 0) {
      setLivePings((prev) => {
        const ids = new Set(storedPings.map((p) => p.id));
        return [...storedPings, ...prev.filter((p) => !ids.has(p.id))];
      });
    }

    // 2. Subscribe to real-time events across tabs/devices
    const unsubscribe = subscribeSync((event) => {
      if (event.action === "NEW_ORDER_CREATED") {
        const order = event.payload;
        playChime("order");
        setIncomingOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
        setToastNotification({
          type: "order",
          title: "🔔 Naya Order Aaya!",
          subtitle: `${order.customerName} • ₹${order.total} (${order.items})`,
          orderId: order.id,
        });
        setTimeout(() => setToastNotification(null), 10000);
      } else if (event.action === "NEW_DEMAND_PING") {
        const ping = event.payload;
        playChime("ping");
        setLivePings((prev) => [ping, ...prev.filter((p) => p.id !== ping.id)]);
        setToastNotification({
          type: "ping",
          title: "📍 Grahak ne Thela Bulaya! (Bulao Thela)",
          subtitle: `${ping.consumerName || "Grahak"} wants: ${ping.item} (${ping.quantity || "1 kg"})`,
          pingId: ping.id,
        });
        setTimeout(() => setToastNotification(null), 10000);
      } else if (event.action === "ORDER_STATUS_UPDATED") {
        const { orderId, status } = event.payload || {};
        setIncomingOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      } else if (event.action === "DEMAND_PING_ACCEPTED") {
        const { pingId } = event.payload || {};
        setLivePings((prev) =>
          prev.map((p) => (p.id === pingId ? { ...p, status: "accepted" } : p))
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // Pre-Orders state
  const [preOrders, setPreOrders] = useState([
    {
      id: "pre-1",
      customer: "Dr. Rajesh Sharma",
      timeSlot: "Tomorrow Morning (7:00 AM - 8:30 AM)",
      items: "5 kg Desi Aloo, 2 kg Tamatar, 1 bunch Palak",
      address: "House 42, Pocket 1, Dwarka",
      status: "Confirmed",
      amount: "₹240",
    },
    {
      id: "pre-2",
      customer: "Pooja Malhotra",
      timeSlot: "Today Evening (5:30 PM - 6:30 PM)",
      items: "1 kg Shimla Mirch, 500g Adrak, 1 kg Kheera",
      address: "B-12, Sector 14",
      status: "Confirmed",
      amount: "₹130",
    },
  ]);

  // Voice presets for simulation
  const voicePresets = [
    "aaj aaloo 25 rupaye kilo, pyaaz 35, tamatar 30",
    "kinnaur seb 120 rupaye kilo, taza kela 50 darjan",
    "gobi 30 rupaye piece, palak 20 rupaye gaddi",
  ];

  // Toggle Thela Online / Offline
  const handleToggleOnline = async () => {
    const nextStatus = !isThelaOnline;
    setIsThelaOnline(nextStatus);

    try {
      await fetch("/api/vendor/update-location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: "9876543210",
          isActive: nextStatus,
          latitude: vendorLocation.lat,
          longitude: vendorLocation.lng,
        }),
      });
    } catch (e) {
      console.log("Status synced locally");
    }
  };

  // Simulate GPS walk / cart movement
  const handleSimulateMove = () => {
    setStepCount((prev) => prev + 1);
    setVendorLocation((prev) => ({
      lat: prev.lat + (Math.random() - 0.45) * 0.0008,
      lng: prev.lng + (Math.random() - 0.45) * 0.0008,
    }));
  };

  // Simulate Voice Note Processing
  const handleStartVoice = (presetText) => {
    setIsListening(true);
    setVoiceConfirmedMessage(null);
    setParsedItems(null);
    setVoiceTranscript(presetText || voicePresets[0]);

    setTimeout(() => {
      setIsListening(false);
      // Simulate speech-to-intent parsing
      if ((presetText || voicePresets[0]).includes("seb")) {
        setParsedItems([
          { name: "Kinnaur Seb", price: 120, unit: "kg", icon: "🍎" },
          { name: "Taza Kela", price: 50, unit: "dozen", icon: "🍌" },
        ]);
      } else {
        setParsedItems([
          { name: "Aaloo (Fresh Potato)", price: 25, unit: "kg", icon: "🥔" },
          { name: "Pyaaz (Nasik Onion)", price: 35, unit: "kg", icon: "🧅" },
          { name: "Tamatar (Red Tomato)", price: 30, unit: "kg", icon: "🍅" },
        ]);
      }
    }, 1500);
  };

  // Confirm voice items (Vendor-first "Sahi Hai" rule)
  const handleConfirmVoice = () => {
    if (!parsedItems) return;
    const newItems = parsedItems.map((p, idx) => ({
      id: `voice-${Date.now()}-${idx}`,
      name: p.name,
      price: p.price,
      unit: p.unit,
      inStock: true,
    }));

    setInventory((prev) => [...newItems, ...prev]);
    setVoiceConfirmedMessage("Bhav safalta-purvak add ho gaya! (Stock live ho gaya)");
    setParsedItems(null);
    setVoiceTranscript("");
  };

  // Manual price adjustment
  const handleUpdatePrice = (itemId, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, price: Math.max(5, item.price + delta) }
          : item
      )
    );
  };

  // Toggle in stock
  const handleToggleStock = (itemId) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Accept or reject incoming demand alert
  const handleOrderAction = (orderId, newStatus) => {
    setIncomingOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );

    // Broadcast status change immediately to Customer tab
    updateSyncOrderStatus(orderId, newStatus);

    try {
      fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      }).catch(() => {});
    } catch (e) {}

    if (toastNotification && toastNotification.orderId === orderId) {
      setToastNotification(null);
    }
  };

  // Accept a demand ping ("Bulao Thela")
  const handleAcceptPing = (pingId) => {
    const vendorInfo = {
      name: "Ramesh Bhaiya (Fresh Sabzi Thela)",
      phone: "+91 98765 43210",
      eta: "3-4 mins",
      distance: "120m away",
    };

    setLivePings((prev) =>
      prev.map((p) => (p.id === pingId ? { ...p, status: "accepted", acceptedBy: vendorInfo } : p))
    );

    acceptSyncDemandPing(pingId, vendorInfo);

    try {
      fetch("/api/ping/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pingId, vendorId: "vendor-ramesh" }),
      }).catch(() => {});
    } catch (e) {}

    if (toastNotification && toastNotification.pingId === pingId) {
      setToastNotification(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Real-time Order & Ping Toast Notification Banner */}
        {toastNotification && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700 text-white shadow-xl flex items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {toastNotification.type === "order" ? (
                  <ShoppingBag className="w-5 h-5 text-white" />
                ) : (
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                )}
              </div>
              <div>
                <p className="font-black text-sm tracking-wide">{toastNotification.title}</p>
                <p className="text-xs text-white/90 font-medium">{toastNotification.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setActiveTab("demand_alerts");
                  if (toastNotification.type === "order" && toastNotification.orderId) {
                    handleOrderAction(toastNotification.orderId, "accepted");
                  } else if (toastNotification.type === "ping" && toastNotification.pingId) {
                    handleAcceptPing(toastNotification.pingId);
                  }
                }}
                className="bg-white text-emerald-800 text-xs font-black px-4 py-2 rounded-xl shadow-xs hover:bg-emerald-50 transition-all cursor-pointer whitespace-nowrap"
              >
                ✓ Sweekar Karein (Accept)
              </button>
              <button
                onClick={() => setToastNotification(null)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        {/* 30-Minute Mohalla Batching Room Status Banner */}
        <div className="mb-6 p-4 rounded-3xl bg-white border border-emerald-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-[#16A34A] animate-spin" style={{ animationDuration: "10s" }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                  batchingRoom
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                }`}>
                  {batchingRoom ? "● Room Active (Batching Live)" : "● Standby (Ready to Batch)"}
                </span>
                <span className="text-xs font-bold text-gray-500">• 1.5 km Core + 0.5 km Buffer</span>
              </div>
              <h4 className="text-base font-black text-gray-900 mt-0.5">
                {batchingRoom
                  ? `Mohalla Batching Room: ${batchingRoom.timeLeftMinutes || 28} mins remaining`
                  : "Mohalla 30-Minute Dynamic Batching Window"}
              </h4>
              <p className="text-xs text-gray-600">
                {batchingRoom
                  ? `Orders within 2.0 km geofence are batched to your active run. Next sector (>2 km) unlocks after window ends.`
                  : "First incoming customer order starts a 30-min window, grouping all orders within 2.0 km into your active route."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-xl font-black text-gray-900">
                {batchingRoom?.orders?.length || incomingOrders.length} Orders
              </span>
              <p className="text-[10px] text-gray-400 font-bold">Batched in Current Run</p>
            </div>
          </div>
        </div>

        {/* Top Stat Cards matching The-Hashira---tech-thela */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Account Status */}
          <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Account Status
              </span>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">Active Pro</h3>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#16A34A]">
                Zero Platform Commission
              </span>
            </div>
          </div>

          {/* Card 2: Live Location Switch */}
          <div
            onClick={handleToggleOnline}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs cursor-pointer hover:border-[#16A34A] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Live Thela GPS
              </span>
              <Navigation className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {isThelaOnline ? "Thela ON" : "Thela OFF"}
            </h3>
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  isThelaOnline ? "bg-emerald-500 animate-ping" : "bg-gray-400"
                }`}
              />
              <span className="text-xs font-bold text-gray-600">
                {isThelaOnline ? "Signal Strong (Broadcasting)" : "Tap to go Online"}
              </span>
            </div>
          </div>

          {/* Card 3: Smart Routing */}
          <div
            onClick={() => setActiveTab("locate_customer")}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs cursor-pointer hover:border-[#16A34A] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Smart Routing
              </span>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">AI Enabled</h3>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-600">
                3 Demand Hotspots Nearby
              </span>
            </div>
          </div>

          {/* Card 4: Market Insights */}
          <div
            onClick={() => setActiveTab("demand_alerts")}
            className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs cursor-pointer hover:border-[#16A34A] transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                Market Insights
              </span>
              <Bell className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-2xl font-black text-gray-900">
              {incomingOrders.filter((o) => o.status === "pending").length} Pending
            </h3>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-xs font-bold text-purple-600">
                Customer Demand Pings
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid: Sidebar + Dynamic Tabs */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Vendor Sidebar */}
          <VendorSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Main Tab Panels */}
          <div className="flex-1 w-full space-y-6">
            {/* TAB 1: SMART ROUTING & LOCATE CUSTOMER */}
            {activeTab === "locate_customer" && (
              <div className="space-y-6">
                {/* Giant Live Thela Toggle Button */}
                <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-[#111111]">
                      Live Status: {isThelaOnline ? "Thela ON (Online)" : "Thela OFF (Offline)"}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      {isThelaOnline
                        ? "Aas-paas ke grahak nakshe par aapka thela dekh sakte hain aur live bula sakte hain."
                        : "Aapka thela band hai. Online hone par grahak aapki dukaan dekh payenge."}
                    </p>
                  </div>

                  <button
                    onClick={handleToggleOnline}
                    className={`px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                      isThelaOnline
                        ? "bg-[#16A34A] hover:bg-[#15803D] text-white shadow-green-900/20"
                        : "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20"
                    }`}
                  >
                    <Power className="w-5 h-5" />
                    <span>{isThelaOnline ? t("turnThelaOn") : t("turnThelaOff")}</span>
                  </button>
                </div>

                {/* Smart Route OpenStreetMap */}
                <div className="bg-white rounded-3xl p-4 border border-gray-200/80 shadow-sm space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Smart Thela Route & Customer Hotspots
                      </span>
                    </div>
                    <button
                      onClick={handleSimulateMove}
                      className="text-xs font-bold text-[#16A34A] hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Simulate Step ({stepCount})</span>
                    </button>
                  </div>

                  <LeafletMap
                    vendors={INITIAL_VENDORS}
                    userLocation={vendorLocation}
                    height="380px"
                  />
                </div>

                {/* High Demand Zones */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                  <h4 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-wider">
                    High Demand Zones Right Now (Suggested by AI):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {DEMAND_ZONES.map((zone) => (
                      <div
                        key={zone.id}
                        className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 hover:border-[#16A34A] transition-all"
                      >
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-extrabold text-gray-900">{zone.name}</span>
                          <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                            {zone.score} Demand
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                          {zone.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: UPDATE INVENTORY (VOICE / TEXT) */}
            {activeTab === "update" && (
              <div className="space-y-6">
                {/* Voice-First Assistant Box */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-black uppercase text-[#16A34A] tracking-wider">
                    Zero Typing • Voice Listing Assistant
                  </span>
                  <h3 className="text-2xl font-black text-[#111111] mt-1 mb-2">
                    {t("voiceListingTitle")} 🎙️
                  </h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto mb-6">
                    {t("voiceListingSubtitle")}
                  </p>

                  <div className="flex flex-col items-center justify-center gap-4">
                    <button
                      onClick={() => handleStartVoice()}
                      disabled={isListening}
                      className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                        isListening
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-[#16A34A] hover:bg-[#15803D] text-white"
                      }`}
                    >
                      {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                    </button>
                    <span className="text-xs font-bold text-gray-700">
                      {isListening ? t("voiceListening") : t("startVoiceBtn")}
                    </span>
                  </div>

                  {/* Voice Simulation Presets */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
                      Demo Quick Voice Presets:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {voicePresets.map((preset, i) => (
                        <button
                          key={i}
                          onClick={() => handleStartVoice(preset)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-xl font-medium transition-colors"
                        >
                          &ldquo;{preset}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Parsed Result (Vendor-First "Sahi Hai" Confirmation) */}
                  {parsedItems && (
                    <div className="mt-6 p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left animate-fadeIn">
                      <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-3">
                        <Volume2 className="w-5 h-5 text-amber-600" />
                        <span>AI ne yeh bhav samjha (Sahi Hai?):</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {parsedItems.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm font-bold bg-white p-2.5 rounded-xl border border-amber-200"
                          >
                            <span>
                              {p.icon} {p.name}
                            </span>
                            <span className="text-[#16A34A]">
                              ₹{p.price} / {p.unit}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleConfirmVoice}
                          className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white py-2.5 rounded-xl font-black text-xs shadow-xs cursor-pointer"
                        >
                          ✓ {t("confirmSaveBtn")}
                        </button>
                        <button
                          onClick={() => setParsedItems(null)}
                          className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
                        >
                          ✕ {t("retryVoiceBtn")}
                        </button>
                      </div>
                    </div>
                  )}

                  {voiceConfirmedMessage && (
                    <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                      {voiceConfirmedMessage}
                    </div>
                  )}
                </div>

                {/* Manual Inventory List & Stock Toggle */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                    <h4 className="text-base font-black text-gray-900">
                      Thela Inventory ({inventory.length} items)
                    </h4>
                    <span className="text-xs text-gray-500 font-bold">
                      Tap + / - to adjust live prices
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {inventory.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          item.inStock
                            ? "bg-gray-50/70 border-gray-200"
                            : "bg-gray-100/60 border-gray-200 opacity-60"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h5 className="font-extrabold text-sm text-gray-900">{item.name}</h5>
                            <p className="text-xs font-black text-[#16A34A]">
                              ₹{item.price}{" "}
                              <span className="text-gray-400 font-normal">/ {item.unit}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => handleToggleStock(item.id)}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              item.inStock
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-gray-300 text-gray-700"
                            }`}
                          >
                            {item.inStock ? "In Stock" : "Out of Stock"}
                          </button>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-gray-200/60">
                          <button
                            onClick={() => handleUpdatePrice(item.id, -5)}
                            className="w-7 h-7 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-700" />
                          </button>
                          <span className="text-xs font-mono font-bold text-gray-800 w-8 text-center">
                            ₹{item.price}
                          </span>
                          <button
                            onClick={() => handleUpdatePrice(item.id, +5)}
                            className="w-7 h-7 rounded-lg bg-[#16A34A] text-white hover:bg-[#15803D] flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DEMAND ALERTS (ORDERS & BULAO THELA PINGS) */}
            {activeTab === "demand_alerts" && (
              <div className="space-y-6">
                {/* Section 1: Live Doorstep Orders */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                          Live Doorstep Orders
                        </h3>
                        <span className="text-xs font-black bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                          {incomingOrders.filter((o) => o.status === "pending").length} New
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Grahak jinhone direct doorstep delivery order kiya hai. Sweekar karein aur rasta dekhein.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {incomingOrders.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No pending doorstep orders.</p>
                    ) : (
                      incomingOrders.map((ord) => (
                        <div
                          key={ord.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            ord.status === "accepted"
                              ? "bg-emerald-50 border-emerald-300"
                              : ord.status === "rejected"
                              ? "bg-gray-100 border-gray-200 opacity-50"
                              : "bg-white border-gray-200 hover:border-[#16A34A]"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {ord.status === "pending" && (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                              )}
                              <h4 className="font-extrabold text-sm text-gray-900">
                                {ord.customerName}
                              </h4>
                              <span className="text-xs text-gray-400">• {ord.time}</span>
                            </div>
                            <span className="text-xs font-extrabold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              📍 {ord.distance}
                            </span>
                          </div>

                          <p className="text-xs text-gray-700 font-medium mb-3">
                            <strong>Requested Items:</strong> {ord.items} •{" "}
                            <span className="font-bold text-gray-900">Total: ₹{ord.total}</span>
                          </p>

                          {ord.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleOrderAction(ord.id, "accepted")}
                                className="bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                              >
                                ✓ {t("acceptBtn")}
                              </button>
                              <button
                                onClick={() => handleOrderAction(ord.id, "rejected")}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                              >
                                ✕ {t("rejectBtn")}
                              </button>
                            </div>
                          )}

                          {ord.status === "accepted" && (
                            <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Accepted! Navigation route live on your phone. Deliver to doorstep.</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section 2: Live Bulao Thela Pings */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <Radio className="w-5 h-5 text-amber-500 animate-pulse" />
                        <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                          Live &quot;Bulao Thela&quot; Demand Pings
                        </h3>
                        <span className="text-xs font-black bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                          {livePings.filter((p) => p.status !== "accepted").length} Live
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Aas-paas ke mohalla grahak jo thela apni gali me bulana chahte hain. Sweekar karein aur rasta dekhein.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {livePings.length === 0 ? (
                      <p className="text-xs text-gray-500 py-4 text-center">No active demand pings.</p>
                    ) : (
                      livePings.map((ping) => (
                        <div
                          key={ping.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            ping.status === "accepted"
                              ? "bg-amber-50/70 border-amber-300"
                              : "bg-white border-amber-200 hover:border-amber-400"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              {ping.status !== "accepted" && (
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                              )}
                              <h4 className="font-extrabold text-sm text-gray-900">
                                {ping.consumerName || "Mohalla Grahak"}
                              </h4>
                              <span className="text-xs text-gray-400">• {ping.time}</span>
                            </div>
                            <span className="text-xs font-extrabold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                              📍 Pincode: {ping.pin || "110075"}
                            </span>
                          </div>

                          <div className="text-xs text-gray-800 font-medium space-y-1 mb-3">
                            <p>
                              <strong>Chahiye:</strong> {ping.item} {ping.quantity && `(${ping.quantity})`}
                            </p>
                            {ping.notes && (
                              <p className="text-gray-500 italic">
                                &quot;{ping.notes}&quot;
                              </p>
                            )}
                          </div>

                          {ping.status !== "accepted" ? (
                            <button
                              onClick={() => handleAcceptPing(ping.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
                            >
                              ✓ Sweekar Karein & Thela Le Jaayein (Accept & Go)
                            </button>
                          ) : (
                            <div className="text-xs font-extrabold text-amber-800 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4 text-emerald-600" />
                              <span>Accepted! Grahak ko notify kar diya gaya hai. ETA ~3 mins.</span>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PRE-ORDERS */}
            {activeTab === "preorder" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="pb-4 border-b border-gray-100 mb-6">
                    <h3 className="text-2xl font-black text-[#111111]">
                      Household Morning Pre-Orders
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Customers who booked advance stock for morning delivery in your mohalla.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {preOrders.map((po) => (
                      <div
                        key={po.id}
                        className="p-5 rounded-2xl bg-gray-50/70 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-extrabold text-sm text-gray-900">{po.customer}</h4>
                            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              {po.status}
                            </span>
                          </div>
                          <p className="text-xs text-emerald-700 font-bold mb-1">🕒 {po.timeSlot}</p>
                          <p className="text-xs text-gray-700 font-medium">📦 {po.items}</p>
                          <p className="text-[11px] text-gray-500 font-mono mt-1">📍 {po.address}</p>
                        </div>

                        <div className="text-right">
                          <span className="text-base font-black text-gray-900">{po.amount}</span>
                          <p className="text-[10px] text-gray-500 font-bold">UPI / Cash on Delivery</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: CUSTOMER REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-[#111111]">
                        Ramesh Bhaiya &apos; s Trust & Reviews
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Verified ratings from local mohalla residents.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-[#16A34A]">4.8 ★</div>
                      <p className="text-[10px] text-gray-400 font-bold">52 Total Reviews</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "Mansi Chaubey",
                        area: "Dwarka Pocket B",
                        comment: "Bilkul fresh sabzi deliver ki! Ekdum farm fresh tamatar aur palak.",
                        rating: 5,
                      },
                      {
                        name: "Vikram Malhotra",
                        area: "Sector 14",
                        comment: "Bulao Thela ping karne par 5 minute me aa gaye. Bahut badhiya service!",
                        rating: 5,
                      },
                      {
                        name: "Kavita Sharma",
                        area: "Pocket 1",
                        comment: "Pyaaz aur aaloo ekdum badhiya size ke the. Zero complaints.",
                        rating: 4,
                      },
                    ].map((rev, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="font-extrabold text-gray-900">{rev.name} ({rev.area})</span>
                          <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs text-gray-700">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: MOHALLA LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="pb-4 border-b border-gray-100 mb-6">
                    <h3 className="text-2xl font-black text-[#111111]">
                      🏆 Dwarka Sector 14 Leaderboard
                    </h3>
                    <p className="text-xs text-gray-600 mt-1">
                      Top vendors in your zone based on customer reviews and on-time response.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { rank: "🥇", name: "Ramesh Kumar (You)", area: "Dwarka Sec 14", rating: "4.8 ★", reviews: "52 reviews", isMe: true },
                      { rank: "🥈", name: "Suresh Patel", area: "Janakpuri Pocket B", rating: "4.6 ★", reviews: "47 reviews" },
                      { rank: "🥉", name: "Anita Devi", area: "Uttam Nagar East", rating: "4.5 ★", reviews: "39 reviews" },
                      { rank: "#4", name: "Chhotu Chaat", area: "Subhash Nagar", rating: "4.4 ★", reviews: "31 reviews" },
                    ].map((v, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          v.isMe
                            ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl w-6 text-center">{v.rank}</span>
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900">{v.name}</h4>
                            <p className="text-xs text-gray-500">{v.area}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-[#16A34A]">{v.rating}</span>
                          <p className="text-[10px] text-gray-500">{v.reviews}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
