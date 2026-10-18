"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Clock,
  Zap,
  Percent,
  ShoppingCart,
  Store,
  BadgePercent,
  TrendingUp,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function PricingPage() {
  const { t } = useLanguage();
  const [selectedRole, setSelectedRole] = useState("customer"); // 'customer' | 'vendor'

  return (
    <div className="bg-[#FDFCFB] text-gray-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28">
        {/* Header */}
        <div className="mx-auto max-w-screen-md text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair & Transparent Street Economics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-4">
            Clear Plans for <br />
            <span className="text-[#16A34A]">Customers & Vendors</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Zero hidden charges. No inflated delivery markups. Customers get fresh doorstep savings, while street vendors pay a simple ₹10 daily pass only when they operate.
          </p>

          {/* Interactive Role Switcher Toggle */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-gray-100 border-2 border-gray-300 shadow-inner gap-2">
            <button
              onClick={() => setSelectedRole("customer")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                selectedRole === "customer"
                  ? "bg-[#16A34A] text-white shadow-md shadow-green-900/20 scale-[1.02]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>For Customers (Grahak)</span>
            </button>

            <button
              onClick={() => setSelectedRole("vendor")}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-black text-sm sm:text-base transition-all duration-300 cursor-pointer ${
                selectedRole === "vendor"
                  ? "bg-amber-500 text-white shadow-md shadow-amber-900/20 scale-[1.02]"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-200/60"
              }`}
            >
              <Store className="w-5 h-5" />
              <span>For Street Vendors (Thela Wale)</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 1. CUSTOMER PLANS VIEW (Selected when selectedRole === 'customer')       */}
        {/* ========================================================================= */}
        {selectedRole === "customer" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              
              {/* Customer Plan 1: Free Forever */}
              <div className="flex flex-col p-8 bg-white rounded-3xl border-2 border-gray-200 shadow-md justify-between hover:border-gray-400 transition-all">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    Regular Grahak
                  </span>
                  <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Customer - Free</h3>
                  <p className="text-xs text-gray-600 font-medium mb-6">
                    Discover nearby authentic street thelas, track live carts on the map, and order fresh produce directly with zero fees.
                  </p>

                  <div className="my-6 pb-6 border-b border-gray-100">
                    <span className="text-5xl font-black text-gray-950">₹0</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">/ Free Forever</span>
                    <p className="text-[11px] text-[#16A34A] font-extrabold mt-1">₹0 Platform Fee • ₹0 Delivery Fee</p>
                  </div>

                  <ul className="text-left text-xs font-bold text-gray-700 flex flex-col gap-3.5 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Live Thela GPS tracking on OpenStreetMap</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>&quot;Bulao Thela&quot; street demand ping radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Pay via Direct UPI or Cash on Delivery</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Earn Mohalla review coins (+25 coins)</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/customer"
                  className="w-full text-center text-sm font-black bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-2xl border border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore Live Map</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Customer Plan 2: Daily Sabzi Savings Pass (Recommended) */}
              <div className="flex flex-col p-8 bg-emerald-50/70 rounded-3xl border-2 border-[#16A34A] shadow-xl justify-between relative ring-2 ring-[#16A34A]/20">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Most Popular For Families
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                    Monthly Savings Club
                  </span>
                  <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Daily Sabzi Pass</h3>
                  <p className="text-xs text-gray-600 font-medium mb-6">
                    Guaranteed daily discounts for households buying fresh vegetables & fruits every single day.
                  </p>

                  <div className="my-6 pb-6 border-b border-emerald-200/80">
                    <span className="text-5xl font-black text-gray-950">₹99</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">/ month</span>
                    <p className="text-[11px] text-[#16A34A] font-black mt-1">Saves ~₹400 - ₹600 every month on produce!</p>
                  </div>

                  <ul className="text-left text-xs font-bold text-gray-800 flex flex-col gap-3.5 mb-8">
                    <li className="flex items-center gap-2 text-emerald-900 font-black">
                      <Percent className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>5% Flat Daily Discount on all Sabzi & Fruits</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-900 font-black">
                      <Clock className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Extra +7% OFF on 1-Day Advance Pre-Orders (5% + 7% = 12% Total)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Priority morning delivery slot (7:00 - 8:30 AM)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>Zero minimum order value</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                      <span>2x Mohalla reward coins on reviews</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/customer"
                  className="w-full text-center text-sm font-black bg-[#16A34A] hover:bg-[#15803D] text-white py-3.5 rounded-2xl shadow-lg shadow-green-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Claim 5% + 7% Daily Discount</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

            {/* Advance Pre-Order Feature Banner */}
            <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-white border-2 border-emerald-200 rounded-3xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 text-xs font-black text-[#16A34A] uppercase tracking-wider">
                  <BadgePercent className="w-4 h-4" />
                  <span>How Advance Pre-Order Discount Works</span>
                </div>
                <h4 className="text-xl font-black text-gray-900">
                  Book 1 day in advance &rarr; 5% Base + 7% Pre-Order = up to 12% total savings!
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed font-medium">
                  When you order before 10 PM for tomorrow morning, the street vendor buys exactly what is needed directly from the APMC Mandi at dawn. This eliminates 100% of unsold food spoilage & waste for the thela — and that exact saved margin is given to you as a discount!
                </p>
              </div>
              <Link
                href="/customer"
                className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-black rounded-2xl shrink-0 shadow-md transition-all flex items-center gap-2"
              >
                <span>Pre-Order Tomorrow&apos;s Sabzi</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. VENDOR PLANS VIEW (Selected when selectedRole === 'vendor')           */}
        {/* ========================================================================= */}
        {selectedRole === "vendor" && (
          <div className="space-y-12 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              
              {/* Vendor Plan 1: ₹10 Daily Sachet Pass */}
              <div className="flex flex-col p-8 bg-amber-50/70 rounded-3xl border-2 border-amber-400 shadow-xl justify-between relative ring-2 ring-amber-400/20">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                  Simple Sachet Model
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                    Active Day Pass
                  </span>
                  <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Daily &quot;Thela ON&quot; Pass</h3>
                  <p className="text-xs text-gray-600 font-medium mb-6">
                    Pay only when you operate your cart. No monthly lock-in. No commission on your sales.
                  </p>

                  <div className="my-6 pb-6 border-b border-amber-200">
                    <span className="text-5xl font-black text-gray-950">₹10</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">/ active day</span>
                    <p className="text-[11px] text-amber-800 font-black mt-1">₹0 on days off • 15 Days 100% Free Trial</p>
                  </div>

                  <ul className="text-left text-xs font-bold text-gray-800 flex flex-col gap-3.5 mb-8">
                    <li className="flex items-center gap-2 text-amber-950 font-black">
                      <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>0% Commission on all street sales</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Voice product listing in Hindi / Hinglish (Gemini AI)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>30-min Mohalla Batching Room (1.5km core + 0.5km buffer)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Live OpenStreetMap cart tracking & customer ping radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Instant Direct UPI settlement to your bank</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/Vendorlogin"
                  className="w-full text-center text-sm font-black bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Start 15-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Vendor Plan 2: B2B Mandi Wholesale Partnership (Coming Soon) */}
              <div className="flex flex-col p-8 bg-gray-50/70 rounded-3xl border-2 border-dashed border-gray-300 shadow-xs justify-between relative">
                <div className="absolute -top-3.5 right-6 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs">
                  Coming Soon • Phase 2
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-0.5 rounded-full">
                      Wholesale Aggregation
                    </span>
                  </div>
                  <h3 className="mt-2 mb-2 text-2xl font-black text-gray-950">B2B Mandi Supply</h3>
                  <p className="text-xs text-gray-600 font-medium mb-6">
                    Bulk-procured fresh produce delivered directly to your thela at dawn. Cheaper than local retail mandis.
                  </p>

                  <div className="my-6 pb-6 border-b border-gray-200">
                    <span className="text-5xl font-black text-gray-800">5% OFF</span>
                    <span className="text-xs text-gray-500 font-bold ml-1">below retail mandi rates</span>
                    <p className="text-[11px] text-purple-700 font-extrabold mt-1">Direct morning delivery to your route</p>
                  </div>

                  <ul className="text-left text-xs font-bold text-gray-600 flex flex-col gap-3.5 mb-8">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Direct APMC Mandi bulk purchasing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Zero transit time: Fresh crates at 5:00 AM</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>Demand aggregated from advance pre-orders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-purple-500 shrink-0" />
                      <span>PM SVANidhi collateral-free working capital tie-up</span>
                    </li>
                  </ul>
                </div>

                <div className="w-full text-center text-xs font-black uppercase tracking-wider bg-gray-200 text-gray-600 py-3.5 rounded-2xl border border-gray-300 cursor-not-allowed">
                  Coming Soon (Mandi Pilot)
                </div>
              </div>

            </div>

            {/* Vendor FAQ / Trust Callout */}
            <div className="max-w-4xl mx-auto p-6 sm:p-8 bg-amber-50/50 border border-amber-200 rounded-3xl shadow-xs">
              <h4 className="text-lg font-black text-gray-900 mb-2">
                Why ₹10/day instead of a monthly fee?
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Street vendors operate with daily cash-flows. If it rains or a vendor takes a day off, paying a fixed monthly fee is unfair. With our ₹10/day pass, if your thela is OFF, you pay ₹0. When you turn your thela ON, just one single customer order easily earns you ₹40-50 in profit, making the ₹10 pass instantly 4x profitable on day 1!
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
