"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { INITIAL_VENDORS, REWARDS_COUPONS, TESTIMONIALS } from "../../lib/mock-data";
import {
  Award,
  Coins,
  Star,
  Gift,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export default function RewardsPage() {
  const [userCoins, setUserCoins] = useState(125);
  const [selectedVendorId, setSelectedVendorId] = useState(INITIAL_VENDORS[0].id);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittedReviewSuccess, setSubmittedReviewSuccess] = useState(false);
  const [redeemedCoupons, setRedeemedCoupons] = useState([]);

  // Handle Review Submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setUserCoins((prev) => prev + 25);
    setSubmittedReviewSuccess(true);
    setReviewComment("");
    setTimeout(() => {
      setSubmittedReviewSuccess(false);
    }, 4000);
  };

  // Handle Coupon Redeem
  const handleRedeemCoupon = (coupon) => {
    if (userCoins < coupon.pointsCost) return;
    setUserCoins((prev) => prev - coupon.pointsCost);
    setRedeemedCoupons((prev) => [...prev, coupon.id]);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 shell px-4 sm:px-6 py-8 pt-28">
        {/* Header & Wallet Banner */}
        <div className="outline-card p-6 sm:p-8 bg-emerald-50/70 text-gray-900 border-2 border-[#111111] shadow-[4px_4px_0_#111111] mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#15803d] bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                Community Trust & Rewards
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-3 text-gray-900">
                Review Thelas, <mark className="bg-[#22C55E] text-[#111111] px-1.5 py-0.5 rounded-md">Earn Daily Savings</mark>
              </h1>
              <p className="text-sm text-gray-700 mt-1 max-w-lg">
                Every genuine review empowers your local street vendors with better platform visibility and rewards you with instant discount coupons!
              </p>
            </div>

            {/* Wallet Box */}
            <div className="bg-white border-2 border-[#22C55E] p-5 rounded-3xl flex items-center gap-4 shadow-md min-w-[220px]">
              <div className="w-14 h-14 rounded-2xl bg-[#22C55E] text-[#111111] flex items-center justify-center text-3xl font-black shadow-[2px_2px_0_#111111]">
                🪙
              </div>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">Aapke Coins</span>
                <p className="text-3xl font-black text-gray-900">{userCoins}</p>
                <span className="text-[11px] font-bold text-[#15803d]">+25 per review</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Section: Leaderboard + Review Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          {/* Left: Top Vendors Leaderboard (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#111111]">
                  Mohalla Leaderboard 🏆
                </h2>
                <p className="text-xs text-gray-600">Top rated street vendors based on customer reviews</p>
              </div>
              <span className="text-xs font-bold text-[#0B6B6B] bg-[#D9C8F5] px-2.5 py-1 rounded-full border border-[#111111]">
                Verified Ratings
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {INITIAL_VENDORS.map((vendor, index) => (
                <div
                  key={vendor.id}
                  className="outline-card p-4 bg-white border-2 border-[#111111] flex items-center justify-between hover:bg-[#F8F4FF] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center font-black text-sm shrink-0">
                      #{index + 1}
                    </span>
                    <span className="text-2xl">{vendor.avatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-gray-900">{vendor.name}</h4>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          {vendor.trustBadge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{vendor.shopName}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 justify-end font-extrabold text-sm text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{vendor.rating}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold">
                      {vendor.reviewsCount} reviews
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Write a Review Form (6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="outline-card p-6 sm:p-8 bg-[#F8F4FF] border-2 border-[#111111]">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <MessageSquare className="w-5 h-5 text-[#22C55E]" />
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">
                    Vendor Ko Review Karein
                  </h3>
                  <p className="text-xs text-gray-600">
                    Give feedback & get <strong>+25 Coins</strong> automatically!
                  </p>
                </div>
              </div>

              {submittedReviewSuccess ? (
                <div className="py-8 flex flex-col items-center text-center gap-3 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-[#22C55E] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    ✓
                  </div>
                  <h4 className="text-lg font-extrabold text-gray-900">
                    Dhanyawad! Review Save Ho Gaya.
                  </h4>
                  <p className="text-xs text-gray-600 max-w-xs">
                    +25 coins aapke Tech Thela wallet mein add ho chuke hain. Niche coupon redeem karein!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="pt-4 flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Choose Thela Vendor:
                    </label>
                    <select
                      value={selectedVendorId}
                      onChange={(e) => setSelectedVendorId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-gray-300 bg-white focus:border-[#111111] focus:outline-none"
                    >
                      {INITIAL_VENDORS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.avatar} {v.name} ({v.shopName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Rating (1 - 5 Sitare):
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-2xl focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? "fill-amber-400 text-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-600 ml-2">
                        {rating} out of 5
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Kaisa laga saman aur swabhav? (Review comment):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Tamatar bilkul taze the aur Ramesh bhaiya ne time par deliver kiya."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full p-3 text-xs rounded-xl border-2 border-gray-300 bg-white focus:border-[#111111] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!reviewComment.trim()}
                    className="button w-full bg-[#22C55E] text-[#111111] py-3 text-sm font-extrabold disabled:opacity-50"
                  >
                    Submit Review (+25 Coins)
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Coupons Store Section */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#111111]">
                Redeem Discount Coupons 🏷️
              </h2>
              <p className="text-xs text-gray-600">
                Use your coins to get instant money off on your next doorstep order
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REWARDS_COUPONS.map((coupon) => {
              const isRedeemed = redeemedCoupons.includes(coupon.id);
              const canAfford = userCoins >= coupon.pointsCost;

              return (
                <div
                  key={coupon.id}
                  className="outline-card p-5 bg-white border-2 border-[#111111] flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-[#D9C8F5] text-[#111111] border border-[#111111]">
                        {coupon.pointsCost} Coins
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">
                        Min ₹{coupon.minOrder}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-gray-900 leading-snug">
                      {coupon.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1">{coupon.description}</p>
                  </div>

                  {isRedeemed ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-400 text-center">
                      <p className="text-[10px] font-bold text-emerald-800">Coupon Code:</p>
                      <p className="text-sm font-black text-emerald-950 font-mono tracking-wider">
                        {coupon.code}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRedeemCoupon(coupon)}
                      disabled={!canAfford}
                      className={`w-full py-2.5 rounded-xl text-xs font-black border-2 border-[#111111] transition-all ${
                        canAfford
                          ? "bg-[#22C55E] text-[#111111] shadow-[2px_2px_0_#111111] hover:bg-[#1eb054]"
                          : "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {canAfford ? `Redeem (${coupon.pointsCost} pts)` : "Need More Coins"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Community Testimonials / Authentic Stories */}
        <div className="pt-6 border-t-2 border-gray-100">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-extrabold text-[#111111]">
              Hamari Galiyon Ki <mark>Asli Awazein</mark>
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Real experiences from local pushcart vendors and regular neighborhood consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="outline-card p-5 bg-[#F8F4FF] border-2 border-[#111111] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-800 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-200">
                  <span className="text-2xl">{t.avatar}</span>
                  <div>
                    <h5 className="text-xs font-extrabold text-gray-900">{t.name}</h5>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
