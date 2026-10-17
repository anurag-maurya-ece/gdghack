"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Users, UserCheck, Heart, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function PreferencesFormPage() {
  const router = useRouter();
  const [familyMembers, setFamilyMembers] = useState("4");
  const [youngestAge, setYoungestAge] = useState("8");
  const [oldestAge, setOldestAge] = useState("64");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!familyMembers || !youngestAge || !oldestAge) return;

    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tech_thela_logged_out");
      localStorage.setItem(
        "tech_thela_user",
        JSON.stringify({
          role: "customer",
          name: "Mr. Oberoi",
          email: "customer@techthela.ai",
          coins: 125,
          familyDetails: { familyMembers, youngestAge, oldestAge },
        })
      );
      window.dispatchEvent(new Event("auth_change"));
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/customer");
      }, 600);
    }, 400);
  };

  const isFormValid =
    familyMembers &&
    youngestAge &&
    oldestAge &&
    /^\d+$/.test(familyMembers) &&
    /^\d+$/.test(youngestAge) &&
    /^\d+$/.test(oldestAge);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-28">
        <div className="w-full max-w-xl bg-white border border-gray-200/90 rounded-3xl p-8 sm:p-12 shadow-xl relative z-10">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Profile</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Let us know something about you!
            </h1>

            <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
              Help Tech Thela tailor daily cart alerts and fresh seasonal produce suited for your household.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Family members */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#16A34A]" />
                <span>How many members are there in your family?</span>
              </label>
              <input
                type="number"
                min="1"
                max="25"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                required
                placeholder="e.g. 4"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-base font-semibold transition-all"
              />
            </div>

            {/* Field 2: Youngest age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#16A34A]" />
                <span>Mention the age of the youngest member in your family:</span>
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={youngestAge}
                onChange={(e) => setYoungestAge(e.target.value)}
                required
                placeholder="e.g. 8"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-base font-semibold transition-all"
              />
            </div>

            {/* Field 3: Oldest age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#16A34A]" />
                <span>Mention the age of the oldest member in your family:</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={oldestAge}
                onChange={(e) => setOldestAge(e.target.value)}
                required
                placeholder="e.g. 64"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-base font-semibold transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || submitted || !isFormValid}
              className="w-full py-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-black tracking-wide uppercase shadow-lg shadow-green-700/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Profile Saved! Loading Thela Map...</span>
                </>
              ) : (
                <>
                  <span>Save & Explore Live Thelas</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <Link
              href="/customer"
              className="text-xs font-extrabold text-gray-500 hover:text-[#16A34A] transition-colors"
            >
              Skip setup and go to map &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
