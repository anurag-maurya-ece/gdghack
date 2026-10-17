"use client";

import React from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThelaScene from "./thela-scene";
import TiltCard from "../components/TiltCard";
import { STATS_HIGHLIGHTS, TESTIMONIALS } from "../lib/mock-data";
import {
  MapPin,
  Mic,
  Radio,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Store,
  Star,
  Users,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main id="main" className="flex-1" tabIndex={-1}>
        {/* 1. Hero Section */}
        <section className="shell py-12 md:py-16">
          <div className="hello-layout">
            <div className="flex flex-col items-start gap-5">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22C55E]/15 border-2 border-[#22C55E] text-xs font-black text-[#0B6B6B] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#22C55E]" />
                GDG Hackathon 2026 • Bridge The Gap
              </span>

              <h1 className="hello-title">
                Aapka <mark>thela,</mark>
                <br />
                ab sabki nazar mein.
              </h1>

              <p className="text-lg sm:text-xl text-gray-700 max-w-xl leading-relaxed">
                Connecting Indian street vendors (*thela wale*) directly to urban homes with realtime OpenStreetMap live tracking, voice inventory updates, and instant doorstep demand pings.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/customer"
                  className="button bg-[#22C55E] text-[#111111] text-base font-extrabold flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Aas-Paas Ke Thele Dekhein</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/vendor"
                  className="button bg-[#D9C8F5] text-[#111111] hover:bg-[#cbb6ee] text-base font-extrabold flex items-center gap-2"
                >
                  <Store className="w-5 h-5 text-[#0F172A]" />
                  <span>Thela Wala Portal</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  Zero Platform Commission
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  Voice-First Low-Literacy UI
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                  Cash or Direct UPI Delivery
                </span>
              </div>
            </div>

            {/* Moving Thela Interactive Depth Scene */}
            <div className="w-full">
              <ThelaScene />
            </div>
          </div>
        </section>

        {/* 2. Stats Section */}
        <section className="bg-[#0F172A] border-y-2 border-[#111111] text-white py-12">
          <div className="shell grid grid-cols-2 lg:grid-cols-4 gap-6 px-4">
            {STATS_HIGHLIGHTS.map((stat, index) => (
              <div
                key={index}
                className="bg-[#1E293B] border-2 border-gray-700 p-5 rounded-3xl flex flex-col justify-between"
              >
                <span className="text-3xl sm:text-4xl font-black text-[#22C55E]">
                  {stat.value}
                </span>
                <div className="mt-2">
                  <h4 className="text-sm font-extrabold text-white">{stat.label}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 3D Tilt Role Cards: Vendor vs Customer */}
        <section id="roles" className="shell py-16 md:py-24">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#0B6B6B] bg-[#D9C8F5] px-3 py-1 rounded-full border border-[#111111]">
              Two-End Digital Bridge
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-3">
              Kiske Liye Bana Hai <mark>Tech Thela?</mark>
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Empowering pushcart vendors with smart tools while delivering fresh, affordable doorstep food to customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* Role 1: Customer Card with 3D Tilt */}
            <TiltCard className="bg-[#F8F4FF] flex flex-col justify-between h-full">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#22C55E] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center text-3xl font-black mb-6">
                  🥗
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  For Consumers <span className="text-[#0B6B6B]">(Grahak)</span>
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  No more waiting or wondering when the sabzi or fruit thela will cross your lane. Track them live, pre-order in 2 taps, or ping them to your society gate!
                </p>

                <ul className="flex flex-col gap-3 text-xs font-bold text-gray-800 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22C55E]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    Live OpenStreetMap GPS Tracking with smooth updates
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22C55E]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    &ldquo;Bulao Thela&rdquo; instant demand ping when you need fresh items
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#22C55E]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    Review your vendor & earn coin points for discount coupons
                  </li>
                </ul>
              </div>

              <Link
                href="/customer"
                className="button w-full bg-[#22C55E] text-[#111111] font-black text-center"
              >
                Track Thelas On Map
              </Link>
            </TiltCard>

            {/* Role 2: Vendor Card with 3D Tilt */}
            <TiltCard className="bg-[#FFFBEB] flex flex-col justify-between h-full">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-[#F59E0B] border-2 border-[#111111] shadow-[3px_3px_0_#111111] flex items-center justify-center text-3xl font-black mb-6">
                  🛒
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  For Street Vendors <span className="text-[#0B6B6B]">(Thela Wale Bhaiya)</span>
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-6">
                  Zero typing needed. Just speak into the mic or tap the &ldquo;Thela ON&rdquo; switch. Get direct customer orders and discover high-demand zones!
                </p>

                <ul className="flex flex-col gap-3 text-xs font-bold text-gray-800 mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F59E0B]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    Voice-to-inventory in Hindi/regional languages with &ldquo;Sahi Hai&rdquo; check
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F59E0B]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    One-touch &ldquo;Thela ON / OFF&rdquo; with immediate location privacy protection
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#F59E0B]/20 text-[#0F172A] flex items-center justify-center text-xs">✓</span>
                    Predictive demand hotspots (where to go to increase daily sales)
                  </li>
                </ul>
              </div>

              <Link
                href="/vendor"
                className="button w-full bg-[#F59E0B] text-[#111111] font-black text-center"
              >
                Enter Vendor Portal
              </Link>
            </TiltCard>
          </div>
        </section>

        {/* 4. Core Features Showcase */}
        <section className="bg-[#F8F4FF] border-t-2 border-[#111111] py-16">
          <div className="shell px-4">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Four Pillars of <mark>Tech Thela</mark>
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Built specifically for Indian urban dynamics and regional accessibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="outline-card p-6 bg-white border-2 border-[#111111]">
                <div className="w-12 h-12 rounded-2xl bg-[#D9C8F5] border-2 border-[#111111] flex items-center justify-center text-xl font-bold mb-4 shadow-[2px_2px_0_#111111]">
                  📍
                </div>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">
                  Phygital Live Map
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Realtime OpenStreetMap showing roaming carts nearby with category icons and accurate walking distance.
                </p>
              </div>

              <div className="outline-card p-6 bg-white border-2 border-[#111111]">
                <div className="w-12 h-12 rounded-2xl bg-[#22C55E] border-2 border-[#111111] flex items-center justify-center text-xl font-bold mb-4 shadow-[2px_2px_0_#111111]">
                  🎙️
                </div>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">
                  Voice Stock Listing
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Vendors speak item prices naturally (&ldquo;aaloo 25, tamatar 30&rdquo;); AI extracts JSON and asks confirmation.
                </p>
              </div>

              <div className="outline-card p-6 bg-white border-2 border-[#111111]">
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B] border-2 border-[#111111] flex items-center justify-center text-xl font-bold mb-4 shadow-[2px_2px_0_#111111]">
                  📡
                </div>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">
                  Doorstep Demand Ping
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Need fresh vegetables or evening snacks? Ping nearby carts to bring their thela to your society gate.
                </p>
              </div>

              <div className="outline-card p-6 bg-white border-2 border-[#111111]">
                <div className="w-12 h-12 rounded-2xl bg-sky-200 border-2 border-[#111111] flex items-center justify-center text-xl font-bold mb-4 shadow-[2px_2px_0_#111111]">
                  🔥
                </div>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">
                  Predictive Heatmap
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Historical orders and footfall data suggest top 3 selling spots to vendors by time of day for 30%+ higher sales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Community Testimonials */}
        <section className="shell py-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Mohalle Ki Kahaniyan <mark>(Real Feedback)</mark>
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Trusted by genuine neighborhood vendors and families across Delhi NCR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="outline-card p-5 bg-white border-2 border-[#111111] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-900">{t.name}</h5>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. About Section */}
        <section id="about" className="shell py-12 border-t-2 border-gray-100 mb-8">
          <div className="outline-card p-8 bg-[#0F172A] text-white border-2 border-[#111111]">
            <span className="text-xs font-black uppercase text-[#22C55E]">Our Mission</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 mb-4">
              Bridge the Gap: <mark className="bg-[#22C55E] text-[#111111]">Street Vendor Empowerment</mark>
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              Street food and produce vendors form the backbone of India&apos;s daily economy. However, lack of real-time visibility, erratic customer demand, and absence of digital tools cause heavy daily food wastage and income insecurity. WEkreta / Tech Thela equips every thela with simple, voice-first digital presence without fees or complicated smartphone training.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link href="/customer" className="button bg-[#22C55E] text-[#111111] text-sm">
                Explore Live Map
              </Link>
              <Link href="/rewards" className="button bg-transparent text-white border-white hover:bg-white/10 text-sm">
                View Community Leaderboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
