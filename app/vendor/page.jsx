"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
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
} from "lucide-react";

export default function VendorDashboard() {
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
      distance: "140m",
      items: "2 kg Aaloo, 1 kg Tamatar, Adrak Mirchi combo",
      total: 95,
      time: "2 mins ago",
      status: "pending", // 'pending' | 'accepted' | 'rejected'
    },
    {
      id: "ord-102",
      customerName: "Aman Gupta (Near Park Bench)",
      distance: "210m",
      items: "1 kg Nasik Pyaaz",
      total: 35,
      time: "Just now",
      status: "pending",
    },
  ]);

  // Voice presets for simulation
  const voicePresets = [
    "aaj aaloo 25 rupaye kilo, pyaaz 35, tamatar 30",
    "kinnaur seb 120 rupaye kilo, taza kela 50 darjan",
    "gobi 30 rupaye piece, palak 20 rupaye gaddi",
  ];

  // Simulate Voice Note Processing
  const handleStartVoice = (presetText) => {
    setIsListening(true);
    setVoiceConfirmedMessage(null);
    setParsedItems(null);
    setVoiceTranscript(presetText || voicePresets[0]);

    setTimeout(() => {
      setIsListening(false);
      // Simulate Gemini speech-to-intent parsing
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
      stock: 20,
      inStock: true,
      icon: p.icon || "📦",
    }));

    setInventory((prev) => [...newItems, ...prev]);
    setVoiceConfirmedMessage("Shabash! Sabhi item live customer menu mein jud gaye.");
    setParsedItems(null);
    setVoiceTranscript("");
  };

  // Simulate movement (GPS step for live demo)
  const handleSimulateMovement = () => {
    setVendorLocation((prev) => ({
      lat: prev.lat + 0.0003,
      lng: prev.lng + 0.0002,
    }));
    setStepCount((prev) => prev + 1);
  };

  // Toggle Stock status
  const toggleStock = (itemId) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Quick adjust price (+/- ₹5)
  const adjustPrice = (itemId, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, price: Math.max(5, item.price + delta) }
          : item
      )
    );
  };

  // Accept Order
  const handleAcceptOrder = (orderId) => {
    setIncomingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "accepted" } : o))
    );
  };

  // Reject Order
  const handleRejectOrder = (orderId) => {
    setIncomingOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: "rejected" } : o))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F4FF] text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 shell px-4 sm:px-6 py-8">
        {/* Top Vendor Status Header */}
        <div className="outline-card p-6 sm:p-8 bg-white mb-8 border-2 border-[#111111]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#22C55E] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center text-3xl font-extrabold">
                🧑🏽‍🌾
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                    Ramesh Bhaiya <span className="text-[#0B6B6B] font-bold text-lg">(Sabzi Thela)</span>
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mt-0.5">
                  ID: TH-DEL-9842 • Dwarka Sector 14 / Connaught Place Area
                </p>
              </div>
            </div>

            {/* Giant Thela ON/OFF Switch */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => setIsThelaOnline(!isThelaOnline)}
                className={`w-full sm:w-auto min-h-[56px] px-8 rounded-full font-black text-base border-2 border-[#111111] shadow-[4px_4px_0_#111111] flex items-center justify-center gap-3 transition-all active:translate-y-[2px] active:shadow-none ${
                  isThelaOnline
                    ? "bg-[#22C55E] text-[#111111] hover:bg-[#1eb054]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Power className="w-6 h-6" />
                <span>{isThelaOnline ? "Thela ON (Live Grahak Dekh Sakte Hain)" : "Thela OFF (Dukaan Band)"}</span>
              </button>
            </div>
          </div>

          {/* Location Bar & Movement Simulator */}
          {isThelaOnline && (
            <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-bold text-gray-700 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-ping" />
                <span>Live GPS Active: {vendorLocation.lat.toFixed(4)}, {vendorLocation.lng.toFixed(4)}</span>
                <span className="text-gray-500 font-normal">({stepCount} movements simulated)</span>
              </div>

              <button
                onClick={handleSimulateMovement}
                className="px-4 py-2 rounded-full bg-[#0F172A] text-white hover:bg-gray-800 transition-all flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>Simulate Movement (Chalte Raho)</span>
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Operational Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Voice Listing + Inventory Management */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Feature: Voice-Activated Product Listing */}
            <div className="outline-card p-6 sm:p-8 bg-white border-2 border-[#111111]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-[#D9C8F5] border border-[#111111]">
                    <Mic className="w-5 h-5 text-[#0F172A]" />
                  </span>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#111111]">
                      Bol Kar Item Jodein <mark>(Voice Listing)</mark>
                    </h2>
                    <p className="text-xs text-gray-600">Zero typing needed • Bolen aur list live karein</p>
                  </div>
                </div>
              </div>

              {/* Big Mic Button & Presets */}
              <div className="py-6 flex flex-col items-center justify-center text-center gap-4">
                <button
                  onClick={() => handleStartVoice()}
                  disabled={isListening}
                  className={`relative w-24 h-24 rounded-full border-3 border-[#111111] flex items-center justify-center shadow-[4px_4px_0_#111111] transition-transform active:scale-95 ${
                    isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-[#22C55E] text-[#111111] hover:scale-105"
                  }`}
                  aria-label="Mic Record Button"
                >
                  {isListening ? <Volume2 className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
                </button>

                <p className="text-sm font-extrabold text-gray-800">
                  {isListening
                    ? "Sun rahe hain... (Listening...)"
                    : "Mic dabayein aur apna bhav bolein"}
                </p>

                {/* Quick Presets for Demo */}
                <div className="flex flex-col gap-2 w-full pt-2">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Ya in demo voice notes par tap karein:
                  </span>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {voicePresets.map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStartVoice(preset)}
                        className="px-3 py-1.5 rounded-full bg-[#F8F4FF] hover:bg-[#D9C8F5] text-xs font-bold border border-gray-300 text-gray-800 transition-colors"
                      >
                        🎙️ &ldquo;{preset}&rdquo;
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parsed Result & Sahi Hai Confirmation */}
              {parsedItems && (
                <div className="mt-4 p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm mb-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>AI Ne Ye Samjha (Voice Intent Parsed):</span>
                  </div>
                  <p className="text-xs text-gray-600 italic mb-3">
                    &ldquo;{voiceTranscript}&rdquo;
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                    {parsedItems.map((item, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-amber-300 text-xs">
                        <span className="text-lg">{item.icon}</span>
                        <p className="font-bold text-gray-900 mt-1">{item.name}</p>
                        <p className="font-extrabold text-[#0B6B6B]">
                          ₹{item.price} / {item.unit}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* 2-Button Rule: Big Sahi Hai vs Galat Hai */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={handleConfirmVoice}
                      className="min-h-[56px] rounded-xl bg-[#22C55E] text-[#111111] font-black text-base border-2 border-[#111111] shadow-[2px_2px_0_#111111] flex items-center justify-center gap-2 hover:bg-[#1eb054]"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Sahi Hai (Save)</span>
                    </button>
                    <button
                      onClick={() => setParsedItems(null)}
                      className="min-h-[56px] rounded-xl bg-rose-100 text-rose-900 font-black text-base border-2 border-rose-400 flex items-center justify-center gap-2 hover:bg-rose-200"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Galat Hai (Retry)</span>
                    </button>
                  </div>
                </div>
              )}

              {voiceConfirmedMessage && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-100 border border-emerald-400 text-emerald-950 font-bold text-xs flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{voiceConfirmedMessage}</span>
                </div>
              )}
            </div>

            {/* Inventory Manager */}
            <div className="outline-card p-6 sm:p-8 bg-white border-2 border-[#111111]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-[#22C55E]" />
                  <h2 className="text-xl font-extrabold text-[#111111]">Thela Saman (Inventory)</h2>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {inventory.filter((i) => i.inStock).length} of {inventory.length} In-Stock
                </span>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      item.inStock
                        ? "bg-white border-gray-200"
                        : "bg-gray-100 border-gray-300 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Unit: {item.unit} • Stock: ~{item.stock} {item.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Price adjustment buttons */}
                      <div className="flex items-center gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        <button
                          onClick={() => adjustPrice(item.id, -5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-black px-2 min-w-[50px] text-center">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => adjustPrice(item.id, 5)}
                          className="w-7 h-7 rounded-lg bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* In-Stock / Out-of-Stock Toggle */}
                      <button
                        onClick={() => toggleStock(item.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                          item.inStock
                            ? "bg-[#22C55E]/15 text-emerald-900 border-[#22C55E]"
                            : "bg-gray-200 text-gray-600 border-gray-400"
                        }`}
                      >
                        {item.inStock ? "Dukaan Mein Hai" : "Khatam (Out)"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Live Orders & Demand Heatmap */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Incoming Orders & Doorstep Pings */}
            <div className="outline-card p-6 bg-white border-2 border-[#111111]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Aaye Hue Orders ({incomingOrders.filter((o) => o.status === "pending").length})
                  </h2>
                </div>
                <span className="text-xs font-bold text-gray-500">Live Webhook</span>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                {incomingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#F8F4FF] border-2 border-[#111111] flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-500">{order.time}</p>
                        <h4 className="text-sm font-extrabold text-gray-900">
                          {order.customerName}
                        </h4>
                        <span className="text-[11px] font-bold text-[#0B6B6B]">
                          📍 {order.distance} away
                        </span>
                      </div>
                      <span className="text-base font-extrabold text-gray-900">
                        ₹{order.total}
                      </span>
                    </div>

                    <p className="text-xs text-gray-700 bg-white p-2 rounded-xl border border-gray-200">
                      <strong>Items:</strong> {order.items}
                    </p>

                    {order.status === "pending" ? (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="min-h-[48px] rounded-xl bg-[#22C55E] text-[#111111] font-black text-sm border-2 border-[#111111] shadow-[2px_2px_0_#111111] hover:bg-[#1eb054]"
                        >
                          Sweekar (Accept)
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="min-h-[48px] rounded-xl bg-gray-200 text-gray-700 font-bold text-sm border border-gray-300 hover:bg-gray-300"
                        >
                          Chhod Do
                        </button>
                      </div>
                    ) : order.status === "accepted" ? (
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Order Accepted! Deliver to gate.</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-xl bg-gray-200 text-gray-600 text-xs font-bold text-center">
                        Order Rejected
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Predictive Demand Heatmap / Hotspots */}
            <div className="outline-card p-6 bg-white border-2 border-[#111111]">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Kahan Zyada Bikkri Hogi?
                  </h2>
                  <p className="text-xs text-gray-500">AI Community Demand Heatmap</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3.5">
                {DEMAND_ZONES.map((zone) => (
                  <div
                    key={zone.id}
                    className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 hover:border-[#111111] transition-colors flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-900">{zone.locationName}</h4>
                        <p className="text-[11px] font-bold text-[#0B6B6B]">
                          ⏰ Peak: {zone.peakHours}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/20 text-[#0F172A] font-extrabold text-xs">
                        {zone.score}% Hot
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-600 leading-snug">
                      {zone.reasonHinglish}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {zone.recommendedItems.map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-gray-700"
                        >
                          + {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
