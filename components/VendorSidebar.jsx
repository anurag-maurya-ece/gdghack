"use client";

import React from "react";
import {
  Navigation,
  ShoppingCart,
  Bell,
  Package,
  Star,
  Trophy,
  Award,
  QrCode,
  Sparkles,
  LogOut,
  UserCheck,
} from "lucide-react";

export default function VendorSidebar({ activeTab = "locate_customer", onChangeTab = () => {} }) {
  const menuItems = [
    {
      id: "locate_customer",
      label: "Smart Routing & Map",
      icon: Navigation,
      badge: "Live GPS",
    },
    {
      id: "update",
      label: "Update Inventory",
      icon: ShoppingCart,
      badge: "Voice/Text",
    },
    {
      id: "demand_alerts",
      label: "Demand Alerts (Pings)",
      icon: Bell,
      badge: "2 New",
      isPulse: true,
    },
    {
      id: "preorder",
      label: "Pre-Order Stock",
      icon: Package,
    },
    {
      id: "reviews",
      label: "Customer Reviews",
      icon: Star,
      badge: "4.8 ★",
    },
    {
      id: "leaderboard",
      label: "Mohalla Leaderboard",
      icon: Trophy,
      badge: "Rank #1",
    },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-gray-900 text-white rounded-3xl p-6 shadow-xl border border-gray-800 flex flex-col justify-between">
      <div>
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-800">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 p-1">
              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-2xl font-black text-white overflow-hidden">
                👨‍🌾
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-white">Ramesh Bhaiya</h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">+91 98765 43210</p>
          <p className="text-[11px] text-emerald-400 font-bold mt-1">
            Sabzi Thela • Dwarka Sec 14
          </p>

          <div className="mt-4 flex items-center justify-between w-full bg-gray-800/80 border border-gray-700 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-gray-300 font-semibold uppercase">Vendor Credits</span>
            </div>
            <span className="text-base font-black text-amber-400">689</span>
          </div>

          {/* QR Code Pill */}
          <div className="mt-3 w-full bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-xs">
            <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
              <QrCode className="w-16 h-16 text-gray-900" />
            </div>
            <p className="text-[10px] text-gray-700 font-bold mt-1.5 uppercase tracking-wider">
              UPI Grahak Scan QR
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 text-left ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-lg shadow-green-900/30 font-black scale-[1.02]"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
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

      {/* Pro Tips Footer */}
      <div className="pt-6 border-t border-gray-800 mt-6">
        <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-3.5">
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro Vendor Tip</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            Keep inventory updated to get <strong className="text-emerald-400">2x more demand alerts</strong> on your route.
          </p>
        </div>
      </div>
    </aside>
  );
}
