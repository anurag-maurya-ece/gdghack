"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/customer", label: "Live Thela Map" },
    { href: "/vendor", label: "Vendor Portal" },
    { href: "/rewards", label: "Rewards" },
    { href: "/aboutus", label: "About" },
    { href: "/pricing", label: "Pricing" },
  ];

  return (
    <>
      <header className="fixed top-4 w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
        <nav className="pointer-events-auto bg-white/85 backdrop-blur-2xl border border-gray-200/70 rounded-full px-5 py-2 flex justify-between items-center shadow-[0_10px_35px_rgba(0,0,0,0.08)] w-full max-w-5xl transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center group -my-2 sm:-my-3">
            <Image
              src="/assets/tech thela logo.png"
              width={220}
              height={70}
              alt="Tech Thela Logo"
              priority
              className="h-10 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Center Pill Links (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100/70 rounded-full p-1 border border-gray-200/40 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 lg:px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-white text-[#111111] shadow-sm font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Join Now Gradient Pill Button */}
            <Link href="/#cardssection" className="hidden sm:block">
              <div className="relative rounded-full p-[2px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-white px-5 py-2 transition-all duration-300 group-hover:bg-opacity-0">
                  <span className="font-bold text-[#111111] group-hover:text-white text-sm tracking-wide transition-colors">
                    Join Now
                  </span>
                </div>
              </div>
            </Link>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden animate-in fade-in duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed top-0 right-0 w-[290px] h-full bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-gray-100">
          <Link href="/" onClick={() => setMobileMenuOpen(false)}>
            <Image
              src="/assets/tech thela logo.png"
              width={140}
              height={45}
              alt="Tech Thela"
              className="h-9 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-2xl font-bold text-base transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700 font-extrabold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            <Link
              href="/#cardssection"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-2xl shadow-md transition-all"
            >
              Join Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
