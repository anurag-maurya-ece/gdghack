"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, Store, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sync auth state from localStorage
  useEffect(() => {
    const syncAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("tech_thela_user");
          setUser(stored ? JSON.parse(stored) : null);
        }
      } catch (err) {
        console.error("Auth sync error:", err);
      }
    };

    syncAuth();
    window.addEventListener("auth_change", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth_change", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, [pathname]);

  // Universal Logout: Purges session and returns to normal public homepage
  const handleLogout = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tech_thela_user");
        sessionStorage.clear();
        window.dispatchEvent(new Event("auth_change"));
        setUser(null);
        setMobileMenuOpen(false);
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Determine active authenticated role strictly when logged in
  const isVendorLoggedIn = user?.role === "vendor" && (pathname === "/vendor" || pathname === "/rewards");
  const isCustomerLoggedIn = user?.role === "customer" && (pathname === "/customer" || pathname === "/form" || pathname === "/rewards");

  // ==========================================
  // 1. VENDOR NAVBAR (Only for logged-in Vendor)
  // ==========================================
  if (isVendorLoggedIn) {
    const vendorLinks = [
      { href: "/vendor", label: "Smart Routing & Map" },
      { href: "/rewards", label: "Mohalla Leaderboard" },
    ];

    return (
      <>
        <header className="fixed top-4 w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
          <nav className="pointer-events-auto bg-white/95 backdrop-blur-2xl border-2 border-emerald-500/40 rounded-full px-4 sm:px-6 py-2 flex justify-between items-center shadow-[0_10px_35px_rgba(22,163,74,0.12)] w-full max-w-5xl transition-all duration-300">
            {/* Logo + Vendor Badge */}
            <div className="flex items-center gap-2.5">
              <Link href="/vendor" className="flex items-center group -my-2 sm:-my-3">
                <Image
                  src="/assets/tech thela logo.png"
                  width={220}
                  height={70}
                  alt="Tech Thela Logo"
                  priority
                  className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-[#16A34A] border border-emerald-300">
                <Store className="w-3 h-3" />
                Vendor Workspace
              </span>
            </div>

            {/* Vendor Links Only */}
            <div className="hidden md:flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200 shadow-inner">
              {vendorLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full font-bold text-xs lg:text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm font-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Vendor Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1 px-2.5 sm:px-3 rounded-full">
                <span className="text-base">👨‍🌾</span>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-black text-gray-900">
                    {user?.name || "Ramesh Bhaiya"}
                  </span>
                  <span className="text-[10px] font-extrabold text-[#16A34A] flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
                    Thela Online
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Vendor Logout"
              >
                <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
                <span className="hidden sm:inline font-bold">Logout</span>
              </button>

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

        {/* Mobile Drawer (Vendor Only) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 w-[290px] h-full bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <span className="text-xs font-black uppercase text-[#16A34A] tracking-wider flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> Vendor Portal
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center gap-3">
            <span className="text-3xl">👨‍🌾</span>
            <div>
              <p className="text-sm font-black text-gray-900">{user?.name || "Ramesh Bhaiya"}</p>
              <p className="text-xs text-gray-600 font-medium">Sabzi Thela • Dwarka Sec 14</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#16A34A] mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span> Thela Online
              </span>
            </div>
          </div>
          <div className="flex-1 py-4 px-4 flex flex-col gap-2">
            {vendorLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  pathname === link.href ? "bg-emerald-50 text-[#16A34A] font-black" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Vendor Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // 2. CUSTOMER NAVBAR (Only for logged-in Customer)
  // ==========================================
  if (isCustomerLoggedIn) {
    const customerLinks = [
      { href: "/customer", label: "Live Thela Map", badge: "GPS" },
      { href: "/rewards", label: "Mohalla Rewards", badge: "🪙 125 Coins" },
    ];

    return (
      <>
        <header className="fixed top-4 w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-300">
          <nav className="pointer-events-auto bg-white/95 backdrop-blur-2xl border-2 border-emerald-500/40 rounded-full px-4 sm:px-6 py-2 flex justify-between items-center shadow-[0_10px_35px_rgba(22,163,74,0.12)] w-full max-w-5xl transition-all duration-300">
            {/* Logo + Customer Badge */}
            <div className="flex items-center gap-2.5">
              <Link href="/customer" className="flex items-center group -my-2 sm:-my-3">
                <Image
                  src="/assets/tech thela logo.png"
                  width={220}
                  height={70}
                  alt="Tech Thela Logo"
                  priority
                  className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-[#16A34A] border border-emerald-300">
                <ShoppingBag className="w-3 h-3" />
                Grahak Portal
              </span>
            </div>

            {/* Customer Links Only */}
            <div className="hidden md:flex items-center bg-gray-100/90 rounded-full p-1 border border-gray-200 shadow-inner">
              {customerLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-1.5 rounded-full font-bold text-xs lg:text-sm transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm font-black"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#16A34A]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Customer Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 py-1 px-2.5 sm:px-3 rounded-full">
                <div className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-black shadow-xs">
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

              <button
                onClick={handleLogout}
                className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Customer Logout"
              >
                <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
                <span className="hidden sm:inline font-bold">Logout</span>
              </button>

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

        {/* Mobile Drawer (Customer Only) */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
        <div
          className={`fixed top-0 right-0 w-[290px] h-full bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <span className="text-xs font-black uppercase text-[#16A34A] tracking-wider flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" /> Grahak Portal
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-sm font-black">
              MO
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">{user?.name || "Mr. Oberoi"}</p>
              <p className="text-xs text-amber-600 font-extrabold">Prime Member • 🪙 125 Coins</p>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-600 mt-0.5">
                Pincode: 110080
              </span>
            </div>
          </div>
          <div className="flex-1 py-4 px-4 flex flex-col gap-2">
            {customerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                  pathname === link.href ? "bg-emerald-50 text-[#16A34A] font-black" : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-[#16A34A]">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div className="mt-auto pt-4 border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="w-full text-center py-3 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold rounded-2xl border border-red-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Customer Logout</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ==========================================
  // 3. PUBLIC WEBSITE NAVBAR (Home, About, Pricing, Login Pages)
  // ==========================================
  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/aboutus", label: "About Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/rewards", label: "Rewards" },
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
            {publicLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full font-bold text-xs lg:text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-white text-gray-900 shadow-sm font-black"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action: Separate Customer & Vendor Login Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Link
              href="/Customerlogin"
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-300/80 transition-colors"
            >
              Customer Login
            </Link>

            <Link
              href="/Vendorlogin"
              className="px-4 py-2 rounded-full text-xs font-black bg-[#16A34A] hover:bg-[#15803D] text-white shadow-md shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Vendor Login</span>
            </Link>

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

      {/* Mobile Drawer (Public) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 w-[290px] h-full bg-white z-50 shadow-2xl transition-transform duration-300 md:hidden flex flex-col ${
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
          <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-colors ${
                pathname === link.href ? "bg-green-50 text-[#16A34A] font-extrabold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            <Link
              href="/Customerlogin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-extrabold rounded-2xl transition-all"
            >
              Customer Login
            </Link>
            <Link
              href="/Vendorlogin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold rounded-2xl shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Store className="w-4 h-4" />
              <span>Vendor Login</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
