"use client";

import React from "react";
import {
  MapPin,
  Radar,
  Star,
  Trophy,
  Crown,
  LogOut,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

export default function CustomerSidebar({ activeTab = "vendors", onChangeTab = () => {} }) {
  const navItems = [
    {
      id: "vendors",
      label: "Vendors Near Me",
      icon: MapPin,
      badge: "Live GPS",
    },
    {
      id: "demand_ping",
      label: "Demand Ping (Beta)",
      icon: Radar,
      badge: "Bulao Thela",
      isPulse: true,
    },
    {
      id: "review",
      label: "Review Vendors",
      icon: Star,
      badge: "+25 Coins",
    },
    {
      id: "leaderboard",
      label: "Mohalla Leaderboard",
      icon: Trophy,
    },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-gray-900 text-white rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
      {/* Profile Header */}
      <div>
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-800">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl font-black text-white">
                MO
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-gray-900 rounded-full p-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-white">Mr. Oberoi</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">ID: TH-CUST-007</p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prime Member • 125 Coins</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-lg shadow-green-900/30 font-black scale-[1.02]"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-emerald-400"
                    } ${item.isPulse ? "animate-pulse" : ""}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gray-800 text-emerald-400 border border-emerald-500/20"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Switch / Footer */}
      <div className="pt-6 border-t border-gray-800 mt-6">
        <a
          href="/Vendorlogin"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-xs text-gray-300 hover:text-white border border-gray-700 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Switch to Vendor Portal</span>
        </a>
      </div>
    </aside>
  );
}
