"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PricingPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-screen-xl mx-auto px-6 sm:px-10 py-16 pt-28">
        <div className="mx-auto max-w-screen-md text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-300">
            Transparent & Fair
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-950 mt-3 mb-4">
            Designed for a smooth experience
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Here at Tech Thela we focus on bridging street commerce with technology, innovation, and trust to unlock long-term value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan 1 */}
          <div className="flex flex-col p-8 bg-purple-50 rounded-3xl border-4 border-black shadow-[4px_4px_0_#000000] text-center justify-between">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-950">Customer - Free</h3>
              <p className="text-sm text-gray-600 mb-6">
                Best option for household daily produce discovery & live tracking.
              </p>
              <div className="my-6">
                <span className="text-5xl font-black text-gray-950">Free</span>
              </div>
              <ul className="text-left text-xs font-bold text-gray-700 flex flex-col gap-2.5 mb-8">
                <li>✓ Live Thela Map Tracking</li>
                <li>✓ Doorstep Delivery Requests</li>
                <li>✓ Cash or UPI on Delivery</li>
                <li>✓ Earn review credit points</li>
              </ul>
            </div>
            <Link
              href="/customer"
              className="w-full text-base font-bold bg-green-500 hover:bg-green-600 text-black py-3 rounded-2xl border-2 border-black shadow-[2px_2px_0_#000000] transition-all"
            >
              Get started
            </Link>
          </div>

          {/* Plan 2 */}
          <div className="flex flex-col p-8 bg-emerald-50 rounded-3xl border-4 border-black shadow-[6px_6px_0_#000000] text-center justify-between ring-2 ring-green-500">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-green-500 text-white px-3 py-1 rounded-full">
                Most Popular
              </span>
              <h3 className="mt-2 mb-2 text-2xl font-bold text-gray-950">Street Vendor</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tailored for thela owners with zero typing voice inventory tools.
              </p>
              <div className="my-6">
                <span className="text-5xl font-black text-gray-950">₹0</span>
                <span className="text-xs text-gray-500 font-bold ml-1">/ 100% Free for Hackathon</span>
              </div>
              <ul className="text-left text-xs font-bold text-gray-700 flex flex-col gap-2.5 mb-8">
                <li>✓ Zero Platform Commission</li>
                <li>✓ Voice-to-Stock in Hindi/Hinglish</li>
                <li>✓ Thela ON / OFF live switch</li>
                <li>✓ Predictive Demand Hotspots</li>
              </ul>
            </div>
            <Link
              href="/vendor"
              className="w-full text-base font-bold bg-green-500 hover:bg-green-600 text-black py-3 rounded-2xl border-2 border-black shadow-[2px_2px_0_#000000] transition-all"
            >
              Join as Vendor
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="flex flex-col p-8 bg-white rounded-3xl border-4 border-black shadow-[4px_4px_0_#000000] text-center justify-between">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-950">Customer - Pro</h3>
              <p className="text-sm text-gray-600 mb-6">
                Priority scheduling, time slot vendor booking & exclusive savings.
              </p>
              <div className="my-6">
                <span className="text-5xl font-black text-gray-950">₹120</span>
                <span className="text-xs text-gray-500 font-bold ml-1">/ month</span>
              </div>
              <ul className="text-left text-xs font-bold text-gray-700 flex flex-col gap-2.5 mb-8">
                <li>✓ Everything in Free</li>
                <li>✓ Scheduled recurring thela visits</li>
                <li>✓ Priority demand ping response</li>
                <li>✓ 2x Reward coins per review</li>
              </ul>
            </div>
            <Link
              href="/customer"
              className="w-full text-base font-bold bg-purple-100 hover:bg-purple-200 text-gray-900 py-3 rounded-2xl border-2 border-black shadow-[2px_2px_0_#000000] transition-all"
            >
              Get started
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
