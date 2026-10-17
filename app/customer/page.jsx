"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CustomerSidebar from "../../components/CustomerSidebar";
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
  Trophy,
  Send,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Check,
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
  const router = useRouter();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("tech_thela_user");
        if (!stored) {
          router.push("/Customerlogin");
        }
      }
    } catch (e) {}
  }, [router]);

  const [activeTab, setActiveTab] = useState("vendors");
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVendor, setActiveVendor] = useState(INITIAL_VENDORS[0]);
  const [cart, setCart] = useState({}); // { [itemId]: { vendorId, item, quantity } }
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null); // 'placed' | 'accepted' | 'enroute' | 'delivered'
  
  // Locate Product & Pincode Filter
  const pincodes = ["110080", "110081", "110082", "110083", "110084", "110085"];
  const [selectedPin, setSelectedPin] = useState("110080");
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Demand Ping State
  const [pingItem, setPingItem] = useState("Fresh Golgappe & Tamatar");
  const [pingQty, setPingQty] = useState("1 kg");
  const [pingNotes, setPingNotes] = useState("Deliver near Gate 2, Flat 302");
  const [pingBroadcastActive, setPingBroadcastActive] = useState(false);
  const [pingAcceptedVendor, setPingAcceptedVendor] = useState(null);

  // Review System State
  const [coins, setCoins] = useState(125);
  const [reviewVendor, setReviewVendor] = useState("Ramesh Bhaiya");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewsList, setReviewsList] = useState([
    {
      id: 1,
      vendor: "Ramesh Bhaiya",
      author: "Mansi Chaubey",
      rating: 5,
      comment: "Bilkul fresh sabzi deliver ki! Ekdum farm fresh tamatar aur palak.",
      time: "20 mins ago",
    },
    {
      id: 2,
      vendor: "Suresh Cart",
      author: "Vikram Malhotra",
      rating: 5,
      comment: "Bulao Thela ping karne par 5 minute me aa gaye. Bahut badhiya service!",
      time: "1 hour ago",
    },
  ]);

  // Leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Ramesh Kumar", area: "Dwarka Sec 14", rating: 4.8, reviews: 52, medal: "🥇" },
    { rank: 2, name: "Suresh Patel", area: "Janakpuri Pocket B", rating: 4.6, reviews: 47, medal: "🥈" },
    { rank: 3, name: "Anita Devi", area: "Uttam Nagar East", rating: 4.5, reviews: 39, medal: "🥉" },
    { rank: 4, name: "Chhotu Chaat", area: "Subhash Nagar", rating: 4.4, reviews: 31, medal: "#4" },
    { rank: 5, name: "Ramu Fruits", area: "Tilak Nagar", rating: 4.3, reviews: 26, medal: "#5" },
  ];

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
    }, 2000);
    setTimeout(() => {
      setOrderStatus("enroute");
    }, 4500);
  };

  // Simulate Ping Demand Flow
  const handleSendPing = (e) => {
    e.preventDefault();
    if (!pingItem.trim()) return;
    setPingBroadcastActive(true);
    setPingAcceptedVendor(null);

    // Simulate nearby vendor matching after 2.8s
    setTimeout(() => {
      setPingBroadcastActive(false);
      setPingAcceptedVendor({
        name: "Ram Kumar (Fresh Cart)",
        phone: "+91 98765 43210",
        item: pingItem,
        eta: "4 mins",
        distance: "140m",
      });
    }, 2800);
  };

  // Submit Review Flow
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    const newRev = {
      id: Date.now(),
      vendor: reviewVendor,
      author: "Mr. Oberoi (You)",
      rating: reviewRating,
      comment: reviewComment,
      time: "Just now",
    };
    setReviewsList([newRev, ...reviewsList]);
    setCoins((c) => c + 25);
    setReviewComment("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  const categories = [
    { id: "All", label: "Sabhi (All)", icon: "🛒" },
    { id: "Sabzi", label: "Sabzi (Vegetables)", icon: "🥦" },
    { id: "Phal", label: "Phal (Fruits)", icon: "🍎" },
    { id: "Chaat", label: "Chaat & Snacks", icon: "🥙" },
    { id: "Chai", label: "Chai & Bites", icon: "☕" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Customer Top Bar Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Customer Dashboard • Tech Thela Live
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              Apni Gali Ka <span className="text-[#16A34A]">Live Thela</span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Pincode {selectedPin} • Real-time street vendors, door-to-door fresh supply & instant demand ping.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("demand_ping")}
              className="inline-flex items-center gap-2 bg-[#16A34A] hover:bg-[#15803D] text-white px-5 py-3 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Bulao Thela (Ping Demand)</span>
            </button>
            
            {cartItemsList.length > 0 && (
              <button
                onClick={() => setOrderModalOpen(true)}
                className="inline-flex items-center gap-2 bg-[#111111] text-white px-4 py-3 rounded-2xl font-bold text-sm shadow-md hover:bg-gray-800 transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-400" />
                <span>Basket ({cartItemsList.length})</span>
                <span className="bg-[#16A34A] text-xs px-2 py-0.5 rounded-full font-black">
                  ₹{totalCartPrice}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Main Grid: Sidebar + Dynamic Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Customer Sidebar */}
          <CustomerSidebar activeTab={activeTab} onChangeTab={setActiveTab} />

          {/* Main Tab Panels */}
          <div className="flex-1 w-full space-y-8">
            {/* TAB 1: VENDORS NEAR ME & LIVE MAP */}
            {activeTab === "vendors" && (
              <div className="space-y-6">
                {/* Search & Pincode Filter (LocateProduct from Customer.tsx) */}
                <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                      <MapPin className="w-4 h-4 text-[#16A34A]" />
                      <span>Pincode:</span>
                      <select
                        value={selectedPin}
                        onChange={(e) => {
                          setSelectedPin(e.target.value);
                          setSearchTriggered(true);
                        }}
                        className="bg-transparent font-black text-gray-900 focus:outline-none cursor-pointer"
                      >
                        {pincodes.map((pin) => (
                          <option key={pin} value={pin}>
                            {pin} (Delhi NCR)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCategory(c.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            selectedCategory === c.id
                              ? "bg-[#16A34A] text-white shadow-sm font-black"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {c.icon} {c.label.split(" ")[0]}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search aloo, tamatar, chai..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                    />
                  </div>
                </div>

                {/* Nearby Matching Vendor Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Ramesh Bhaiya</h4>
                      <p className="text-[10px] text-emerald-700 font-bold">Sabzi Thela • 180m</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Suresh Cart</h4>
                      <p className="text-[10px] text-gray-600 font-bold">Fresh Fruits • 340m</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Chhotu Chaat</h4>
                      <p className="text-[10px] text-gray-600 font-bold">Snacks & Chai • 490m</p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>
                </div>

                {/* Interactive Map Section */}
                <div className="rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm bg-white p-3">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Live GPS Thela Tracker (OpenStreetMap)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-gray-500">
                      Auto-updates every 15s
                    </span>
                  </div>
                  <LeafletMap
                    vendors={filteredVendors}
                    selectedVendor={activeVendor}
                    onSelectVendor={setActiveVendor}
                    height="420px"
                  />
                </div>

                {/* Product Inventory Drawer for Selected Vendor */}
                <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100 mb-6">
                    <div>
                      <span className="text-[11px] font-bold text-[#16A34A] uppercase tracking-wider">
                        Active Selected Thela
                      </span>
                      <h3 className="text-xl font-extrabold text-[#111111]">
                        {activeVendor.name} — {activeVendor.shopName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {activeVendor.distance} away • ⭐ {activeVendor.rating} ({activeVendor.reviewsCount} reviews) • Verified Vendor
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-black">
                        ● Online Now
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-gray-900 mb-4">
                    Available Produce on Thela Today:
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {activeVendor.inventory.map((item) => {
                      const inCart = cart[item.id]?.quantity || 0;
                      return (
                        <div
                          key={item.id}
                          className="bg-gray-50/80 rounded-2xl p-4 border border-gray-200/70 hover:border-[#16A34A] transition-all flex items-center justify-between"
                        >
                          <div>
                            <p className="font-extrabold text-sm text-[#111111]">{item.name}</p>
                            <p className="text-xs font-bold text-[#16A34A] mt-0.5">
                              ₹{item.price} <span className="text-gray-500 font-normal">/ {item.unit}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {inCart > 0 ? (
                              <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-gray-200 shadow-xs">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-6 h-6 rounded-lg bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black text-gray-900 w-4 text-center">
                                  {inCart}
                                </span>
                                <button
                                  onClick={() => addToCart(activeVendor, item)}
                                  className="w-6 h-6 rounded-lg bg-[#16A34A] text-white flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(activeVendor, item)}
                                className="inline-flex items-center gap-1 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-transform active:scale-95"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DEMAND PING (BETA) - BULAO THELA */}
            {activeTab === "demand_ping" && (
              <div className="space-y-6">
                {/* Simulation Badge */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-2xl shadow-xs flex items-center gap-3">
                  <Radio className="w-5 h-5 text-blue-500 animate-pulse flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-black text-blue-900 uppercase">
                      5G Mesh Demand Broadcast Engine
                    </h4>
                    <p className="text-xs text-blue-700 mt-0.5 font-medium">
                      Street vendors nearby receive real-time audio & push notifications of customer demand requests.
                    </p>
                  </div>
                </div>

                {/* Demand Request Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <h3 className="text-2xl font-black text-[#111111] mb-2">
                    Bulao Thela (Demand Ping)
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Aapke gate par thela nahi hai? Ping karein aur 5 minute me nearby vendor ko direct bulaayein.
                  </p>

                  <form onSubmit={handleSendPing} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                        Produce / Snacks Needed
                      </label>
                      <input
                        type="text"
                        value={pingItem}
                        onChange={(e) => setPingItem(e.target.value)}
                        placeholder="e.g. 2 kg Aaloo, 1 kg Tamatar, Golgappe"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                          Approx Quantity
                        </label>
                        <input
                          type="text"
                          value={pingQty}
                          onChange={(e) => setPingQty(e.target.value)}
                          placeholder="e.g. 1 kg / 2 plates"
                          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                          Delivery Spot / Landmark
                        </label>
                        <input
                          type="text"
                          value={pingNotes}
                          onChange={(e) => setPingNotes(e.target.value)}
                          placeholder="e.g. Near Gate 2, Flat 302"
                          className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={pingBroadcastActive}
                      className="w-full mt-4 bg-[#16A34A] hover:bg-[#15803D] text-white py-3.5 px-6 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-60"
                    >
                      <Radio className={`w-5 h-5 ${pingBroadcastActive ? "animate-spin" : ""}`} />
                      <span>
                        {pingBroadcastActive
                          ? "Broadcasting To 5 Nearby Thelas..."
                          : "Broadcast Live Demand Ping 📡"}
                      </span>
                    </button>
                  </form>

                  {/* Broadcast Result */}
                  {pingAcceptedVendor && (
                    <div className="mt-6 p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 animate-fadeIn">
                      <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm mb-1">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>Vendor Accepted Your Ping!</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-medium">
                        <strong>{pingAcceptedVendor.name}</strong> is heading toward your street with{" "}
                        <em>{pingAcceptedVendor.item}</em>.
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-xs font-bold text-gray-800">
                        <span>ETA: {pingAcceptedVendor.eta}</span>
                        <span>•</span>
                        <span>Distance: {pingAcceptedVendor.distance}</span>
                        <span>•</span>
                        <span>Phone: {pingAcceptedVendor.phone}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: REVIEW VENDORS & EARN COINS */}
            {activeTab === "review" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-2xl font-black text-[#111111]">
                        Review Your Street Vendor
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Rate produce quality & speed. Every genuine review rewards you with +25 Tech Thela Coins!
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold">
                      <span>💰 Wallet Balance:</span>
                      <span className="text-sm font-black text-amber-600">{coins} Coins</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                        Select Thela Vendor
                      </label>
                      <select
                        value={reviewVendor}
                        onChange={(e) => setReviewVendor(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                      >
                        <option value="Ramesh Bhaiya">Ramesh Bhaiya (Sabzi Thela • Dwarka)</option>
                        <option value="Suresh Cart">Suresh Patel (Fresh Fruits • Janakpuri)</option>
                        <option value="Anita Devi">Anita Devi (Organic Produce • Uttam Nagar)</option>
                        <option value="Chhotu Chaat">Chhotu (Golgappe & Snacks)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                        Star Rating
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-2xl transition-transform hover:scale-110"
                          >
                            <span className={star <= reviewRating ? "text-amber-400" : "text-gray-300"}>
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="text-xs font-bold text-gray-600 ml-2">
                          {reviewRating} out of 5 stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-700 uppercase mb-1.5">
                        Your Feedback
                      </label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Kaisa laga fresh produce? Sahi bhav tha?"
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#16A34A]"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#16A34A] hover:bg-[#15803D] text-white py-3 px-6 rounded-2xl font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Submit Review & Claim +25 Coins 🎁
                    </button>

                    {reviewSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-fadeIn">
                        ✓ Review saved successfully! 25 Coins credited to your wallet.
                      </div>
                    )}
                  </form>

                  {/* Existing Reviews */}
                  <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
                    <h4 className="text-xs font-black text-gray-700 uppercase">
                      Recent Community Reviews
                    </h4>
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/60">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-extrabold text-gray-900">{rev.vendor}</span>
                          <span className="text-amber-500 font-bold">{"★".repeat(rev.rating)}</span>
                        </div>
                        <p className="text-xs text-gray-700">{rev.comment}</p>
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">
                          By {rev.author} • {rev.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: MOHALLA LEADERBOARD */}
            {activeTab === "leaderboard" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="text-2xl font-black text-[#111111]">
                        🏆 Mohalla Thela Leaderboard
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Ranked by customer trust, produce freshness & quick delivery responses.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.map((item) => (
                      <div
                        key={item.rank}
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                          item.rank <= 3
                            ? "bg-amber-50/50 border-amber-200"
                            : "bg-gray-50/60 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl w-8 text-center">{item.medal}</span>
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.area}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-black text-[#16A34A]">⭐ {item.rating}</div>
                          <div className="text-[10px] text-gray-500 font-bold">
                            {item.reviews} verified reviews
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Vendor Recommendations Section (from Customer.tsx) */}
        <div className="mt-12 bg-gradient-to-br from-emerald-50/60 via-green-50/40 to-white p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-sm relative overflow-hidden">
          <div className="mb-6">
            <span className="text-[11px] font-black text-[#16A34A] uppercase tracking-wider">
              ✨ Household Smart AI Engine
            </span>
            <h3 className="text-2xl font-extrabold text-[#111111] mt-0.5">
              Personalized Thela Recommendations
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              Curated from your onboarding questionnaire & weekly dietary needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Organic Greens",
                type: "Fresh Vegetables",
                score: "98% Match",
                icon: "🥦",
                desc: "Matches your daily green leafy preference and elders in family.",
              },
              {
                name: "Suresh's Selection",
                type: "Seasonal Fruits",
                score: "94% Match",
                icon: "🍎",
                desc: "Pure naturally ripened fruits tailored for kids and family health.",
              },
              {
                name: "Global Spices & Herbs",
                type: "Exotic & Desi Combo",
                score: "89% Match",
                icon: "🌶️",
                desc: "Fresh adrak, lasan, mirchi with zero doorstep delivery fees.",
              },
            ].map((rec, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/80 hover:border-[#16A34A] transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-3">{rec.icon}</div>
                <h4 className="font-extrabold text-base text-gray-900">{rec.name}</h4>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  {rec.type}
                </p>
                <p className="text-xs text-gray-600 mt-2 mb-4 leading-relaxed">{rec.desc}</p>
                <div className="inline-block bg-emerald-100 text-[#16A34A] font-black px-3 py-1 rounded-full text-xs">
                  {rec.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Cart & Pre-Order Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-200 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-extrabold text-lg text-gray-900">Your Fresh Produce Basket</h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 max-h-60 overflow-y-auto">
              {cartItemsList.map(({ item, quantity }) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <span className="text-gray-500 text-xs ml-2">x {quantity} {item.unit}</span>
                  </div>
                  <span className="font-black text-[#16A34A]">₹{item.price * quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-gray-700 text-sm">Total Payable:</span>
                <span className="font-black text-xl text-gray-900">₹{totalCartPrice}</span>
              </div>

              {orderStatus ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#16A34A] mx-auto animate-bounce" />
                  <p className="font-black text-sm text-emerald-900 capitalize">
                    Order Status: {orderStatus}
                  </p>
                  <p className="text-xs text-emerald-700">
                    Vendor is bringing fresh stock right to your doorstep. Cash or UPI on delivery!
                  </p>
                </div>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-[#16A34A] hover:bg-[#15803D] text-white py-3.5 rounded-2xl font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer"
                >
                  Confirm Doorstep Order (Cash/UPI)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
