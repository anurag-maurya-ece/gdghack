"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#0F172A] text-gray-300 pt-16 pb-8 overflow-hidden border-t border-white/10">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#16A34A] to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="inline-block transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/assets/tech thela logo.png"
                width={180}
                height={50}
                alt="Tech Thela"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              Revolutionizing the street vendor ecosystem with real-time tracking, AI inventory, and seamless digital connectivity. Empowering micro-entrepreneurs across India.
            </p>
          </div>

          {/* Solution Column */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Solution</h3>
            <ul className="space-y-4">
              {[
                { name: "Live Thela Map", href: "/customer" },
                { name: "Vendor Portal", href: "/vendor" },
                { name: "Rewards & Reviews", href: "/rewards" },
                { name: "Bulao Thela Radar", href: "/customer" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[#16A34A] transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]/40 mr-2 group-hover:bg-[#16A34A] transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Company</h3>
            <ul className="space-y-4">
              {[
                { name: "About Us", href: "/aboutus" },
                { name: "Pricing Plans", href: "/pricing" },
                { name: "Vendor Join", href: "/Vendorlogin" },
                { name: "Customer Join", href: "/Customerlogin" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-[#16A34A] transition-colors duration-200 flex items-center group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]/40 mr-2 group-hover:bg-[#16A34A] transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h3 className="text-white font-bold mb-2 text-lg">Join the Movement</h3>
            <p className="text-sm text-gray-400">
              Stay updated with the latest in street-tech innovation.
            </p>
            <div className="relative group">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#16A34A] focus:ring-1 focus:ring-[#16A34A] transition-all text-white placeholder-gray-500"
              />
              <button className="absolute right-2 top-2 bg-[#16A34A] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#15803d] transition-colors">
                Send
              </button>
            </div>
            <div className="flex space-x-4 pt-2">
              <span className="text-xs text-gray-500">© 2026 Tech Thela™. All Rights Reserved.</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <div>Empowering street vendors across India with zero-typing technology.</div>
          <div className="flex items-center space-x-1">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
