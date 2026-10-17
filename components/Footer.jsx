import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart, PhoneCall, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F172A] border-t-2 border-[#111111] text-white pt-14 pb-10">
      <div className="shell px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#22C55E] border-2 border-[#111111] flex items-center justify-center text-xl font-black text-[#111111]">
                🛒
              </div>
              <span className="font-extrabold text-2xl tracking-tight">
                WEkreta <span className="text-[#22C55E]">Tech Thela</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
              Bridging the gap between hardworking Indian street vendors (*thela wale*) and modern urban households. Realtime live mapping, voice-assisted stock updates, and door-to-door fresh supply.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-gray-700 text-xs font-semibold text-gray-300">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                GDG Hackathon 2026: Bridge the Gap
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-gray-700 text-xs font-semibold text-gray-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Zero-Commission Platform
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-base text-[#22C55E] uppercase tracking-wider text-xs">Platform Links</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-300">
              <li>
                <Link href="/customer" className="hover:text-[#22C55E] transition-colors">
                  📍 Live Thela Map & Orders
                </Link>
              </li>
              <li>
                <Link href="/vendor" className="hover:text-[#22C55E] transition-colors">
                  🏪 Vendor Portal & Voice Listing
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-[#22C55E] transition-colors">
                  🏆 Community Leaderboard & Rewards
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-[#22C55E] transition-colors">
                  ℹ️ About WEkreta Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vendor Support & Trust */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-base text-[#22C55E] uppercase tracking-wider text-xs">Vendor Saathi Helpline</h4>
            <p className="text-xs text-gray-400">
              Need assistance setting up your thela on WhatsApp or live web? Our community volunteers are ready to help.
            </p>
            <div className="p-3 bg-[#1E293B] rounded-2xl border border-gray-700 flex items-center gap-3 mt-1">
              <PhoneCall className="w-5 h-5 text-[#22C55E] shrink-0" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Toll-Free Vendor Support</p>
                <p className="text-sm font-bold text-white">1800-THELA-WALE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 WEkreta / Tech Thela. Built with pride for Indian Street Commerce.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the unsung heroes of daily fresh food.
          </p>
        </div>
      </div>
    </footer>
  );
}
