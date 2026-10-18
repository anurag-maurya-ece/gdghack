"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock, Zap, Percent } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function PricingPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FDFCFB] text-gray-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-28">
        {/* Header */}
        <div className="mx-auto max-w-screen-md text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fair & Transparent Street Economics</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-4">
            Affordable for Homes, <br />
            <span className="text-[#16A34A]">Empowering for Vendors</span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Zero hidden charges. No inflated delivery markups. Consumers get fresh doorstep savings, while street vendors pay a simple ₹10 daily pass only on active selling days.
          </p>
        </div>

        {/* 3 Core Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Consumer Free Tier */}
          <div className="flex flex-col p-8 bg-white rounded-3xl border-2 border-gray-200 shadow-md justify-between hover:border-gray-400 transition-all">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                For Everyday Homes
              </span>
              <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Customer - Free</h3>
              <p className="text-xs text-gray-600 font-medium mb-6">
                Discover live street thelas, track nearby carts, and request doorstep delivery with zero fee.
              </p>

              <div className="my-6 pb-6 border-b border-gray-100">
                <span className="text-5xl font-black text-gray-950">₹0</span>
                <span className="text-xs text-gray-500 font-bold ml-1">/ Free Forever</span>
                <p className="text-[11px] text-[#16A34A] font-extrabold mt-1">₹0 Platform Fee • ₹0 Delivery Fee</p>
              </div>

              <ul className="text-left text-xs font-bold text-gray-700 flex flex-col gap-3 mb-8">
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

          {/* Card 2: Consumer Daily Sabzi Savings Pass (Highlighted) */}
          <div className="flex flex-col p-8 bg-emerald-50/70 rounded-3xl border-2 border-[#16A34A] shadow-xl justify-between relative ring-2 ring-[#16A34A]/20">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#16A34A] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
              Best For Daily Produce
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Monthly Savings Pass
              </span>
              <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Daily Sabzi Pass</h3>
              <p className="text-xs text-gray-600 font-medium mb-6">
                Guaranteed daily discounts for families buying fresh vegetables & fruits every morning.
              </p>

              <div className="my-6 pb-6 border-b border-emerald-200/80">
                <span className="text-5xl font-black text-gray-950">₹99</span>
                <span className="text-xs text-gray-500 font-bold ml-1">/ month</span>
                <p className="text-[11px] text-[#16A34A] font-black mt-1">Saves ~₹400 - ₹600 every month!</p>
              </div>

              <ul className="text-left text-xs font-bold text-gray-800 flex flex-col gap-3 mb-8">
                <li className="flex items-center gap-2 text-emerald-900 font-black">
                  <Percent className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>10% Flat Daily Discount on all Sabzi & Fruits</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-900 font-black">
                  <Clock className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Extra 7% OFF on 1-Day Advance Pre-Orders</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#16A34A] shrink-0" />
                  <span>Priority morning delivery slot (7:00 - 8:30 AM)</span>
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
              <span>Get 10% Daily Discount</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Vendor Daily Sachet Pass */}
          <div className="flex flex-col p-8 bg-amber-50/60 rounded-3xl border-2 border-amber-300 shadow-md justify-between hover:border-amber-500 transition-all">
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                Street Vendor Pass
              </span>
              <h3 className="mt-3 mb-2 text-2xl font-black text-gray-950">Vendor - ₹10/Day</h3>
              <p className="text-xs text-gray-600 font-medium mb-6">
                Pay only on active selling days. Zero commission. 15-day free trial for all onboarding thelas.
              </p>

              <div className="my-6 pb-6 border-b border-amber-200">
                <span className="text-5xl font-black text-gray-950">₹10</span>
                <span className="text-xs text-gray-500 font-bold ml-1">/ active day</span>
                <p className="text-[11px] text-amber-700 font-extrabold mt-1">₹0 on days off • 15 Days Free Trial</p>
              </div>

              <ul className="text-left text-xs font-bold text-gray-800 flex flex-col gap-3 mb-8">
                <li className="flex items-center gap-2 font-black text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>0% Commission on street sales</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Voice listing in Hindi & Hinglish (Gemini AI)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>30-min Mohalla Batching Room (1.5km + 0.5km buffer)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>AI Demand Heatmaps & High-demand hotspots</span>
                </li>
              </ul>
            </div>

            <Link
              href="/Vendorlogin"
              className="w-full text-center text-sm font-black bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Start 15-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Feature Highlight: Advance Pre-Order Savings */}
        <div className="mt-14 p-6 sm:p-8 bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black text-[#16A34A] uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Zero-Wastage Pre-Order Model</span>
            </div>
            <h4 className="text-xl font-black text-gray-900">
              Why do we give up to 17% discount on 1-day advance pre-orders?
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              When consumers book their morning vegetables before 10 PM, vendors buy the exact quantity directly from mandi at dawn. This eliminates 100% of vendor produce spoilage & unsold food wastage — and the saved margins are returned directly to the consumer as discounts!
            </p>
          </div>
          <Link
            href="/customer"
            className="px-6 py-3.5 bg-gray-900 hover:bg-black text-white text-xs font-black rounded-2xl shrink-0 transition-all"
          >
            Pre-Order Tomorrow&apos;s Sabzi &rarr;
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
