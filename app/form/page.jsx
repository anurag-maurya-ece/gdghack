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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        router.push("/customer");
      }, 1000);
    }, 600);
  };

  const isFormValid =
    familyMembers &&
    youngestAge &&
    oldestAge &&
    /^\d+$/.test(familyMembers) &&
    /^\d+$/.test(youngestAge) &&
    /^\d+$/.test(oldestAge);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 pt-28 relative overflow-hidden">
        {/* Ambient green glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-1/4 w-80 h-80 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-xl bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl relative z-10">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Recommendation Profile</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Let us know something about you!
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto">
              Help Tech Thela tailor daily cart alerts and fresh seasonal produce suited for your household.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Field 1: Family members */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>How many members are there in your family?</span>
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={familyMembers}
                onChange={(e) => setFamilyMembers(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white font-medium text-lg transition-all"
                placeholder="e.g. 4"
              />
            </div>

            {/* Field 2: Youngest age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>Mention the age of the youngest member in your family:</span>
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={youngestAge}
                onChange={(e) => setYoungestAge(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white font-medium text-lg transition-all"
                placeholder="e.g. 8"
              />
            </div>

            {/* Field 3: Oldest age */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-zinc-300 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>Mention the age of the oldest member in your family:</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={oldestAge}
                onChange={(e) => setOldestAge(e.target.value)}
                required
                className="w-full px-5 py-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-white font-medium text-lg transition-all"
                placeholder="e.g. 64"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading || submitted}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold tracking-wide uppercase shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 text-base"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : submitted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Profile Saved! Opening Live Thela Map...</span>
                </>
              ) : (
                <>
                  <span>Save & Explore Live Thelas</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Skip Option */}
          <div className="mt-6 text-center">
            <Link
              href="/customer"
              className="text-xs font-semibold text-zinc-500 hover:text-emerald-400 transition-colors"
            >
              Skip for now and open map directly &rarr;
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
