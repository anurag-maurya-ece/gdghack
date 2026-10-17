"use client";

import React from "react";
import {
  MapPin,
  Radar,
  Star,
  Trophy,
  Crown,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function CustomerSidebar({ activeTab = "vendors", onChangeTab = () => {} }) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: "vendors",
      label: t("findNearbyThela"),
      icon: MapPin,
      badge: "Live GPS",
    },
    {
      id: "demand_ping",
      label: t("bulaoThelaTitle"),
      icon: Radar,
      badge: "Bulao Thela",
      isPulse: true,
    },
    {
      id: "review",
      label: t("writeReviewTitle"),
      icon: Star,
      badge: `+25 ${t("coins")}`,
    },
    {
      id: "leaderboard",
      label: t("mohallaLeaderboard"),
      icon: Trophy,
    },
  ];

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-white text-gray-900 rounded-3xl p-6 shadow-xl border-2 border-gray-200/90 flex flex-col justify-between">
      {/* Profile Header */}
      <div>
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-200">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-green-300 p-1">
              <div className="w-full h-full rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-2xl font-black text-emerald-800">
                MO
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-gray-900 rounded-full p-1.5 shadow-md">
              <Crown className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-gray-900">Mr. Oberoi</h2>
          <p className="text-xs text-gray-500 font-mono mt-0.5">ID: TH-CUST-007</p>

          <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-900 shadow-2xs">
            <span>🪙 125 {t("coins")}</span>
            <span className="text-amber-500">•</span>
            <span className="text-emerald-800">Prime Grahak</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onChangeTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#16A34A] text-white shadow-lg shadow-green-900/20 font-black scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-[#16A34A]"
                    } ${item.isPulse ? "animate-pulse" : ""}`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
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

      {/* Customer Perks Footer */}
      <div className="pt-6 border-t border-gray-200 mt-6">
        <div className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-bold">
          <Sparkles className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
          <span className="text-[11px] leading-tight">🪙 125 {t("coins")} Ready to Redeem on your next Sabzi order!</span>
        </div>
      </div>
    </aside>
  );
}
