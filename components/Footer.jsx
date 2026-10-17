import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-6 sm:p-12 bg-gray-950 text-white border-t border-gray-800">
      <div className="max-w-screen-xl mx-auto md:flex md:justify-between items-start gap-10">
        <div className="mb-8 md:mb-0 max-w-sm">
          <Link href="/" className="flex items-center">
            <span className="self-center text-4xl font-extrabold whitespace-nowrap text-white">
              <span className="text-green-500">WE</span>kreta
            </span>
          </Link>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Empowering street vendors (*thela wale*) with modern technology, live mapping, and voice-assisted commerce. Restoring the connection between vendors and consumers.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:gap-12 sm:grid-cols-3 text-sm">
          <div>
            <h2 className="mb-4 text-xs font-bold text-gray-300 uppercase tracking-wider">
              Quick Links
            </h2>
            <ul className="text-gray-400 flex flex-col gap-2.5">
              <li>
                <Link href="/customer" className="hover:text-green-400 transition-colors">
                  Live Thela Map
                </Link>
              </li>
              <li>
                <Link href="/vendor" className="hover:text-green-400 transition-colors">
                  Vendor Portal
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="hover:text-green-400 transition-colors">
                  Reviews & Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-bold text-gray-300 uppercase tracking-wider">
              Information
            </h2>
            <ul className="text-gray-400 flex flex-col gap-2.5">
              <li>
                <Link href="/aboutus" className="hover:text-green-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-green-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <a href="#cardssection" className="hover:text-green-400 transition-colors">
                  Join as Vendor
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-bold text-gray-300 uppercase tracking-wider">
              Hackathon
            </h2>
            <ul className="text-gray-400 flex flex-col gap-2.5">
              <li>
                <span className="text-green-400 font-semibold">GDG Hackathon 2026</span>
              </li>
              <li>
                <span className="text-gray-400">Theme: Bridge the Gap</span>
              </li>
              <li>
                <span className="text-gray-500 text-xs">Zero-Commission Initiative</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <hr className="my-8 border-gray-800" />

      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <span>© 2026 WEkreta™. All Rights Reserved.</span>
        <span>Built with pride for street vendors and local communities.</span>
      </div>
    </footer>
  );
}
