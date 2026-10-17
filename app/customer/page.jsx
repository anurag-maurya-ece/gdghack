"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { INITIAL_VENDORS } from "../../lib/mock-data";
import {
  Search,
  SlidersHorizontal,
  Navigation,
  Clock,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  BellRing,
  X,
  Phone,
  Radio,
  Sparkles,
} from "lucide-react";

// Dynamically load the Leaflet map to avoid server-side window errors
const LeafletMap = dynamic(() => import("../../components/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-gray-100 flex flex-col items-center justify-center border-2 border-[#111111] gap-3">
      <div className="w-10 h-10 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-bold text-gray-700">Loading OpenStreetMap Live Tracking...</p>
    </div>
  ),
});

export default function CustomerPage() {
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVendor, setActiveVendor] = useState(INITIAL_VENDORS[0]);
  const [cart, setCart] = useState({}); // { [itemId]: { vendorId, item, quantity } }
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // 'placed' | 'accepted' | 'enroute' | 'delivered'
  const [pingModalOpen, setPingModalOpen] = useState(false);
  const [pingItem, setPingItem] = useState("");
  const [pingBroadcastActive, setPingBroadcastActive] = useState(false);
  const [pingAcceptedVendor, setPingAcceptedVendor] = useState(null);

  // Filter vendors by category and search
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesCategory =
        selectedCategory === "All" || vendor.category === selectedCategory;
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.inventory.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [vendors, selectedCategory, searchQuery]);

  // Cart operations
  const addToCart = (vendor, item) => {
    setCart((prev) => {
      const current = prev[item.id];
      const newQty = (current?.quantity || 0) + 1;
      return {
        ...prev,
        [item.id]: {
          vendorId: vendor.id,
          vendorName: vendor.name,
          item,
          quantity: newQty,
        },
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const current = prev[itemId];
      if (!current) return prev;
      if (current.quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...current, quantity: current.quantity - 1 },
      };
    });
  };

  const cartItemsList = Object.values(cart);
  const totalCartPrice = cartItemsList.reduce(
    (acc, curr) => acc + curr.item.price * curr.quantity,
    0
  );

  // Simulate Order Flow
  const handlePlaceOrder = () => {
    setOrderStatus("placed");
    setTimeout(() => {
      setOrderStatus("accepted");
    }, 2500);
    setTimeout(() => {
      setOrderStatus("enroute");
    }, 6000);
  };

  // Simulate Ping Demand Flow
  const handleSendPing = (e) => {
    e.preventDefault();
    if (!pingItem.trim()) return;
    setPingBroadcastActive(true);
    setPingAcceptedVendor(null);

    // Simulate nearby vendor matching after 2.5s
    setTimeout(() => {
      setPingBroadcastActive(false);
      setPingAcceptedVendor({
        name: "Ramesh Bhaiya (Sabzi Thela)",
        phone: "+91 98765 43210",
        item: pingItem,
        eta: "5 mins",
        distance: "180m",
      });
    }, 2800);
  };

  const categories = [
    { id: "All", label: "Sabhi (All)", icon: "🛒" },
    { id: "Sabzi", label: "Sabzi (Vegetables)", icon: "🥦" },
    { id: "Phal", label: "Phal (Fruits)", icon: "🍎" },
    { id: "Chaat", label: "Chaat & Snacks", icon: "🥙" },
    { id: "Chai", label: "Chai & Bites", icon: "☕" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 shell px-4 sm:px-6 py-8">
        {/* Top Header & Ping Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#22C55E] animate-ping" />
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Live Thela <mark>Nakshe Par</mark>
              </h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Real-time door-to-door fresh produce & snacks right around your street.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setPingItem("");
                setPingAcceptedVendor(null);
                setPingBroadcastActive(false);
                setPingModalOpen(true);
              }}
              className="button bg-[#D9C8F5] text-[#111111] hover:bg-[#c9b4ee] px-4 py-2 text-sm"
            >
              <BellRing className="w-4 h-4 text-[#0F172A]" />
              <span>Bulao Thela (Ping Demand)</span>
            </button>
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-6">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border-2 transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? "bg-[#22C55E] text-[#111111] border-[#111111] shadow-[2px_2px_0_#111111]"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-400"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search aloo, tamatar, seb..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border-2 border-gray-200 focus:border-[#111111] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Main Grid: Interactive Map + Active Vendors List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Map View (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <LeafletMap
              vendors={filteredVendors}
              selectedVendor={activeVendor}
              onSelectVendor={(v) => setActiveVendor(v)}
              height="540px"
            />

            {/* Quick Map Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs text-gray-600 bg-[#F8F4FF] p-3 rounded-2xl border border-gray-200">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                  <span>Aapka Ghar (You)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#22C55E] inline-block"></span>
                  <span>Chalta Thela (Live Vendor)</span>
                </span>
              </div>
              <span className="font-bold text-gray-800">
                Tap any vendor pin on map to inspect items
              </span>
            </div>
          </div>

          {/* Right: Vendor Cards & Selected Vendor Drawer (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Active Selected Vendor Detail Card */}
            {activeVendor && (
              <div className="outline-card p-5 bg-[#F8F4FF] border-2 border-[#111111]">
                <div className="flex items-start justify-between pb-3 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#111111] flex items-center justify-center text-2xl shadow-[2px_2px_0_#111111]">
                      {activeVendor.avatar}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 leading-tight">
                        {activeVendor.name}
                      </h3>
                      <p className="text-xs text-gray-600 font-medium">{activeVendor.shopName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {activeVendor.rating} ({activeVendor.reviewsCount})
                        </span>
                        <span className="text-[11px] font-bold text-gray-500">
                          • {activeVendor.distanceMeters}m away
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#22C55E]/20 text-[#0F172A] text-xs font-black border border-[#22C55E]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                    ONLINE
                  </span>
                </div>

                {/* Items List */}
                <div className="pt-4 flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                    Available on Thela Today
                  </h4>
                  {activeVendor.inventory.map((item) => {
                    const inCartQty = cart[item.id]?.quantity || 0;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 hover:border-gray-400 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{item.icon}</span>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{item.name}</p>
                            <p className="text-[11px] font-extrabold text-[#0B6B6B]">
                              ₹{item.price} <span className="text-gray-400 font-normal">/ {item.unit}</span>
                            </p>
                          </div>
                        </div>

                        {/* Add / Qty controls */}
                        <div className="flex items-center gap-2">
                          {inCartQty > 0 ? (
                            <div className="flex items-center gap-1.5 bg-gray-100 rounded-full p-1 border border-gray-300">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold text-gray-700 hover:bg-gray-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-extrabold px-1.5">{inCartQty}</span>
                              <button
                                onClick={() => addToCart(activeVendor, item)}
                                className="w-6 h-6 rounded-full bg-[#22C55E] text-[#111111] flex items-center justify-center font-bold shadow-sm"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(activeVendor, item)}
                              className="px-3 py-1 rounded-full bg-[#22C55E] text-[#111111] text-xs font-bold border border-[#111111] shadow-[1px_1px_0_#111111] hover:translate-y-[-1px] active:translate-y-[1px] transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Other Nearby Thelas Horizontal/List Cards */}
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                All Nearby Verified Thelas ({filteredVendors.length})
              </h4>
              <div className="flex flex-col gap-2.5">
                {filteredVendors.map((vendor) => {
                  const isCurrent = activeVendor?.id === vendor.id;
                  return (
                    <div
                      key={vendor.id}
                      onClick={() => setActiveVendor(vendor)}
                      className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                        isCurrent
                          ? "bg-white border-[#111111] shadow-[3px_3px_0_#111111]"
                          : "bg-gray-50 border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{vendor.avatar}</span>
                        <div>
                          <p className="text-sm font-extrabold text-gray-900 leading-none">
                            {vendor.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{vendor.categoryLabel}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0B6B6B] block">
                          {vendor.distanceMeters}m away
                        </span>
                        <span className="text-[11px] font-semibold text-gray-500">
                          {vendor.inventory.length} items
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Cart Drawer (if items added) */}
        {cartItemsList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-lg bg-[#0F172A] border-2 border-[#111111] text-white p-4 rounded-3xl shadow-[4px_4px_0_#111111] flex items-center justify-between animate-in slide-in-from-bottom-5 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#22C55E] text-[#111111] flex items-center justify-center font-extrabold text-lg">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-300 font-medium">
                  {cartItemsList.length} item(s) in basket
                </p>
                <p className="text-lg font-extrabold text-[#22C55E]">
                  ₹{totalCartPrice} <span className="text-xs text-gray-400 font-normal">(Cash/UPI on delivery)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderStatus(null);
                setOrderModalOpen(true);
              }}
              className="button bg-[#22C55E] text-[#111111] px-5 py-2 text-sm font-black"
            >
              Order Doorstep
            </button>
          </div>
        )}

        {/* Order Modal Drawer */}
        {orderModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="outline-card bg-white p-6 sm:p-8 max-w-md w-full relative flex flex-col gap-5">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {orderStatus ? "Live Order Tracking" : "Confirm Doorstep Delivery"}
                </h3>
                <p className="text-xs text-gray-500">
                  Direct connection with {activeVendor?.name} — zero middleman cut!
                </p>
              </div>

              {!orderStatus ? (
                <>
                  <div className="flex flex-col gap-2 max-h-52 overflow-y-auto border-y border-gray-100 py-3">
                    {cartItemsList.map((entry) => (
                      <div key={entry.item.id} className="flex justify-between items-center text-sm">
                        <span>
                          {entry.item.icon} {entry.item.name} × {entry.quantity}
                        </span>
                        <span className="font-extrabold">₹{entry.item.price * entry.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-base font-extrabold">
                    <span>Total Amount:</span>
                    <span className="text-xl text-[#0B6B6B]">₹{totalCartPrice}</span>
                  </div>

                  <div className="bg-[#F8F4FF] p-3 rounded-2xl border border-gray-200 text-xs text-gray-600">
                    <p className="font-bold text-gray-900">📍 Delivery to: Current Location Beacon</p>
                    <p className="mt-0.5">Payment mode: Cash or UPI Scanner directly to thela cart.</p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="button w-full bg-[#22C55E] text-[#111111] py-3 text-base font-extrabold"
                  >
                    Bhejo Order (Send Order to Thela)
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-6 py-2">
                  {/* Stepper */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#22C55E] text-[#111111] flex items-center justify-center font-bold text-sm">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Order Sent to Vendor</p>
                        <p className="text-[11px] text-gray-500">Delivered directly via local webhook</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          orderStatus === "accepted" || orderStatus === "enroute"
                            ? "bg-[#22C55E] text-[#111111]"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {orderStatus === "accepted" || orderStatus === "enroute" ? "✓" : "2"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Thela Accepted Order</p>
                        <p className="text-[11px] text-gray-500">Vendor packing fresh produce</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          orderStatus === "enroute"
                            ? "bg-[#22C55E] text-[#111111] animate-pulse"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        3
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Thela Arriving at your Gate</p>
                        <p className="text-[11px] text-gray-500">Estimated time: ~3 mins</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#22C55E]/15 border border-[#22C55E] p-4 rounded-2xl flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-[#22C55E] shrink-0" />
                    <p className="text-xs text-gray-800 font-medium">
                      After receiving your fresh items, give a quick review in Rewards to earn <strong className="text-[#0F172A]">+25 coins</strong>!
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCart({});
                      setOrderModalOpen(false);
                      setOrderStatus(null);
                    }}
                    className="button bg-[#111111] text-white py-3 w-full"
                  >
                    Done & Return to Map
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* "Bulao Thela" Ping Demand Radar Modal */}
        {pingModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="outline-card bg-white p-6 sm:p-8 max-w-md w-full relative flex flex-col gap-5">
              <button
                onClick={() => setPingModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#22C55E] bg-[#22C55E]/15 px-2.5 py-1 rounded-full">
                  Doorstep Demand Ping
                </span>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                  Bulao Thela <mark>Apni Gali Mein</mark>
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Want fresh vegetables or fruits right at your society gate? Broadcast a direct ping to nearby roaming thelas!
                </p>
              </div>

              {!pingAcceptedVendor ? (
                <form onSubmit={handleSendPing} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Kya chahiye aapko? (What do you need?)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 kg Tamatar, fresh Adrak, Hari Mirchi"
                      value={pingItem}
                      onChange={(e) => setPingItem(e.target.value)}
                      className="px-4 py-3 text-sm rounded-xl border-2 border-gray-300 focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  {/* Quick Pill presets */}
                  <div className="flex flex-wrap gap-1.5">
                    {["Aaloo & Pyaaz", "Fresh Dhaniya & Mirchi", "Kela (1 Dozen)", "Evening Golgappe"].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPingItem(preset)}
                          className="px-2.5 py-1 rounded-full bg-gray-100 text-[11px] font-bold text-gray-700 hover:bg-[#D9C8F5] transition-colors"
                        >
                          + {preset}
                        </button>
                      )
                    )}
                  </div>

                  {pingBroadcastActive ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-3 bg-[#F8F4FF] rounded-2xl border border-gray-200">
                      <div className="relative flex items-center justify-center w-16 h-16">
                        <span className="absolute w-16 h-16 rounded-full bg-[#22C55E]/30 animate-ping" />
                        <span className="relative w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-white">
                          <Radio className="w-5 h-5 animate-spin" />
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-gray-800">
                        Broadcasting to 4 roaming thelas nearby...
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={!pingItem.trim()}
                      className="button w-full bg-[#22C55E] text-[#111111] py-3.5 text-base font-extrabold disabled:opacity-50"
                    >
                      Bhejo Ping (Send Demand Ping)
                    </button>
                  )}
                </form>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-[#22C55E] flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-[#22C55E] shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold text-emerald-950">
                        Thela Accepted Your Ping!
                      </p>
                      <p className="text-xs text-emerald-800">
                        {pingAcceptedVendor.name} is on the way to your lane.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F4FF] p-4 rounded-2xl border border-gray-200 text-xs flex flex-col gap-1.5">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Requested Items:</span>
                      <span className="font-bold text-gray-900">{pingAcceptedVendor.item}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Distance:</span>
                      <span className="font-bold text-[#0B6B6B]">{pingAcceptedVendor.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Arrival (ETA):</span>
                      <span className="font-bold text-[#0F172A]">{pingAcceptedVendor.eta}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPingModalOpen(false)}
                    className="button w-full bg-[#0F172A] text-white py-3 text-sm font-bold"
                  >
                    Track Cart on Map
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
