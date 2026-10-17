"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sync auth state from localStorage or route context
  useEffect(() => {
    const updateAuth = () => {
      try {
        if (typeof window === "undefined") return;
        const isExplicitlyLoggedOut = sessionStorage.getItem("tech_thela_logged_out") === "true";
        const stored = localStorage.getItem("tech_thela_user");

        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        } else if (!isExplicitlyLoggedOut && pathname.startsWith("/vendor")) {
          // Direct visit fallback to vendor mode
          const defaultVendor = {
            role: "vendor",
            name: "Ramesh Bhaiya",
            phone: "+91 98765 43210",
            category: "Sabzi Thela",
            isOnline: true,
          };
          localStorage.setItem("tech_thela_user", JSON.stringify(defaultVendor));
          setUser(defaultVendor);
        } else if (!isExplicitlyLoggedOut && (pathname.startsWith("/customer") || pathname === "/form")) {
          // Direct visit fallback to customer mode
          const defaultCustomer = {
            role: "customer",
            name: "Mr. Oberoi",
            email: "customer@techthela.ai",
            coins: 125,
          };
          localStorage.setItem("tech_thela_user", JSON.stringify(defaultCustomer));
          setUser(defaultCustomer);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      }
    };

    updateAuth();
    window.addEventListener("auth_change", updateAuth);
    window.addEventListener("storage", updateAuth);
    return () => {
      window.removeEventListener("auth_change", updateAuth);
      window.removeEventListener("storage", updateAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tech_thela_user");
        sessionStorage.setItem("tech_thela_logged_out", "true");
        window.dispatchEvent(new Event("auth_change"));
        setUser(null);
        setMobileMenuOpen(false);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Determine active role based on user object or current route
  const isVendor = user?.role === "vendor";
  const isCustomer = user?.role === "customer" && !isVendor;
  const isLoggedIn = isVendor || isCustomer;

  // Context-aware navigation links
  const navLinks = isVendor
    ? [
        { href: "/vendor", label: "Vendor Portal", badge: "Live" },
        { href: "/customer", label: "Customer Map" },
        { href: "/rewards", label: "Rewards & Reviews" },
        { href: "/", label: "Home" },
      ]
    : isCustomer
    ? [
        { href: "/customer", label: "Live Thela Map", badge: "GPS" },
        { href: "/rewards", label: "Rewards & Coins", badge: "🪙 125" },
        { href: "/vendor", label: "Vendor Portal" },
        { href: "/", label: "Home" },
      ]
    : [
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
        <nav className="pointer-events-auto bg-white/90 backdrop-blur-2xl border-2 border-gray-200/90 rounded-full px-4 sm:px-6 py-2 flex justify-between items-center shadow-[0_10px_35px_rgba(0,0,0,0.06)] w-full max-w-5xl transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center group -my-2 sm:-my-3">
            <Image
              src="/assets/tech thela logo.png"
              width={220}
              height={70}
              alt="Tech Thela Logo"
              priority
              className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Center Pill Links (Desktop) */}
          <div className="hidden md:flex items-center bg-gray-100/80 rounded-full p-1 border border-gray-200/60 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 lg:px-4 py-1.5 rounded-full font-bold text-xs lg:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm font-black"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-emerald-100 text-[#16A34A]"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn ? (
              // Logged-in Profile Badge + Logout
              <div className="flex items-center gap-2 sm:gap-2.5">
                {isVendor ? (
                  // Vendor Profile Badge
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 py-1 px-2.5 sm:px-3 rounded-full">
                    <span className="text-base">👨‍🌾</span>
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-xs font-black text-gray-900">
                        {user?.name || "Ramesh Bhaiya"}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#16A34A] flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                        Vendor (Live)
                      </span>
                    </div>
                  </div>
                ) : (
                  // Customer Profile Badge
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/90 py-1 px-2.5 sm:px-3 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-black">
                      MO
                    </div>
                    <div className="hidden sm:flex flex-col text-left leading-none">
                      <span className="text-xs font-black text-gray-900">
                        {user?.name || "Mr. Oberoi"}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-600 mt-0.5">
                        🪙 125 Coins
                      </span>
                    </div>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
                  <span className="hidden sm:inline font-bold">Logout</span>
                </button>
              </div>
            ) : (
              // Public / Unauthenticated: "Join Now"
              <Link href="/#cardssection" className="hidden sm:block">
                <div className="relative rounded-full p-[2px] bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white px-5 py-2 transition-all duration-300 group-hover:bg-opacity-0">
                    <span className="font-bold text-[#111111] group-hover:text-white text-sm tracking-wide transition-colors">
                      Join Now
                    </span>
                  </div>
                </div>
              </Link>
            )}

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

        {/* Profile preview if logged in */}
        {isLoggedIn && (
          <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{isVendor ? "👨‍🌾" : "👤"}</span>
              <div>
                <p className="text-xs font-black text-gray-900">
                  {isVendor ? (user?.name || "Ramesh Bhaiya") : (user?.name || "Mr. Oberoi")}
                </p>
                <p className="text-[10px] font-bold text-emerald-700">
                  {isVendor ? "Verified Sabzi Thela" : "Prime Member • 125 Coins"}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  isActive
                    ? "bg-green-50 text-[#16A34A] font-extrabold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A]">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            ) : (
              <Link
                href="/#cardssection"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold rounded-2xl shadow-md transition-all"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
