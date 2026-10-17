"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Store, Award, MapPin, Menu, X, Globe, Radio } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("hi"); // 'hi' | 'en' | 'hinglish'

  const navLinks = [
    { href: "/customer", label: "Live Map & Order", hindiLabel: "लाइव ठेला नक्शा", icon: MapPin },
    { href: "/vendor", label: "Vendor Portal", hindiLabel: "ठेला वाला पोर्टल", icon: Store },
    { href: "/rewards", label: "Rewards & Reviews", hindiLabel: "इनाम व रिव्यु", icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0F172A] border-b-2 border-[#111111] text-white shadow-md">
      <div className="shell flex items-center justify-between h-20 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-12 h-12 rounded-2xl bg-[#22C55E] border-2 border-[#111111] flex items-center justify-center text-[#111111] font-extrabold text-2xl shadow-[2px_2px_0_#111111] group-hover:rotate-6 transition-transform">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                WEkreta <span className="text-[#22C55E]">Tech Thela</span>
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded-full border border-[#22C55E]/40">
                <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                LIVE
              </span>
            </div>
            <p className="text-[12px] text-gray-300 font-medium hidden sm:block">
              {language === "hi" ? "आपका ठेला, अब सबकी नज़र में" : "Connecting Street Carts to Your Doorstep"}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#1E293B] p-1.5 rounded-full border border-gray-700">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  isActive
                    ? "bg-[#22C55E] text-[#111111] shadow-[2px_2px_0_#111111]"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{language === "hi" ? link.hindiLabel : link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Language Selector */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#1E293B] border border-gray-700 px-3 py-1.5 rounded-full text-xs font-bold text-gray-200">
            <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
            <select
              value={language}
              aria-label="Select Language"
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="hi" className="bg-[#0F172A] text-white">हिंदी (Hindi)</option>
              <option value="hinglish" className="bg-[#0F172A] text-white">Hinglish</option>
              <option value="en" className="bg-[#0F172A] text-white">English</option>
            </select>
          </div>

          <Link
            href="/customer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#22C55E] text-[#111111] font-bold text-sm border-2 border-[#111111] shadow-[3px_3px_0_#111111] hover:shadow-[1px_1px_0_#111111] hover:translate-x-[2px] hover:translate-y-[2px] active:translate-y-[3px] active:shadow-none transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{language === "hi" ? "ठेला देखें" : "Track Thela"}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[#1E293B] text-white border border-gray-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b-2 border-[#111111] px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Navigation</span>
            <div className="flex items-center gap-2 text-xs font-bold bg-[#1E293B] px-3 py-1.5 rounded-full">
              <Globe className="w-3.5 h-3.5 text-[#22C55E]" />
              <select
                value={language}
                aria-label="Select Language Mobile"
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-white focus:outline-none"
              >
                <option value="hi" className="bg-[#0F172A]">हिंदी</option>
                <option value="hinglish" className="bg-[#0F172A]">Hinglish</option>
                <option value="en" className="bg-[#0F172A]">English</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-base border-2 transition-all ${
                    isActive
                      ? "bg-[#22C55E] text-[#111111] border-[#111111] shadow-[3px_3px_0_#111111]"
                      : "bg-[#1E293B] text-gray-200 border-gray-700 hover:border-[#22C55E]"
                  }`}
                >
                  <Icon className="w-5 h-5 text-current" />
                  <span>{language === "hi" ? link.hindiLabel : link.label}</span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 py-4 rounded-2xl bg-[#22C55E] text-[#111111] font-extrabold text-center border-2 border-[#111111] shadow-[4px_4px_0_#111111] flex items-center justify-center gap-2"
          >
            <Radio className="w-5 h-5" />
            <span>{language === "hi" ? "आसपास के ठेले ढूंढें" : "Find Nearby Thelas"}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
