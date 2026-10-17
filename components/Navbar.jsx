"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, Store, Award, Info, Tag } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/customer", label: "Live Thela Map", icon: MapPin },
    { href: "/vendor", label: "Vendor Portal", icon: Store },
    { href: "/rewards", label: "Rewards & Reviews", icon: Award },
    { href: "/aboutus", label: "About Us", icon: Info },
    { href: "/pricing", label: "Pricing", icon: Tag },
  ];

  return (
    <nav className="relative border-b border-gray-800 z-50 bg-gray-900 text-white">
      <div className="flex flex-wrap h-20 justify-between items-center mx-auto max-w-screen-xl px-4 md:px-8">
        {/* Brand Logo matching SIH-Wekreta */}
        <Link href="/" className="flex items-center gap-2">
          <span className="self-center text-3xl sm:text-4xl font-extrabold whitespace-nowrap text-white tracking-tight">
            <span className="text-green-500">WE</span>kreta
          </span>
          <span className="text-[11px] font-bold bg-green-500/20 text-green-400 border border-green-500/40 px-2 py-0.5 rounded-full ml-1 hidden sm:inline-block">
            Tech Thela
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-base font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? "text-green-400 font-bold border-b-2 border-green-500"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/customer"
            className="text-sm font-bold bg-green-500 hover:bg-green-600 text-black px-5 py-2.5 rounded-xl border border-black shadow-[2px_2px_0_#000000] active:translate-y-[1px] transition-all flex items-center gap-1.5"
          >
            <MapPin className="w-4 h-4" />
            <span>Track Thela Live</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-6 flex flex-col gap-3 animate-in slide-in-from-top-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-lg text-base font-semibold ${
                  isActive ? "bg-green-500/20 text-green-400" : "text-gray-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/customer"
            onClick={() => setMobileMenuOpen(false)}
            className="w-full mt-2 text-center py-3 bg-green-500 text-black font-bold rounded-xl"
          >
            Track Thela Live
          </Link>
        </div>
      )}
    </nav>
  );
}
