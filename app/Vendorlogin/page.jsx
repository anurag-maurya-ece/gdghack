"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Store, Phone, Lock, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function VendorLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("vendor123");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/vendor");
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-stretch">
        <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
          {/* Left Side: Brand Visual */}
          <div className="hidden lg:flex w-1/2 relative bg-zinc-950 items-center justify-center p-12 overflow-hidden border-r border-zinc-800/80">
            {/* Ambient emerald lights */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-lg z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vendor Growth Engine</span>
              </div>

              <h1 className="text-5xl font-black tracking-tight leading-tight">
                Grow Your <span className="text-emerald-500">Business</span> Faster.
              </h1>

              <p className="text-lg text-zinc-300 font-medium leading-relaxed">
                Join the Tech Thela network. Broadcast your live cart location, list products using natural voice notes, and receive instant orders from nearby neighborhood customers.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 text-sm text-zinc-300">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <p className="text-2xl font-black text-emerald-400">0%</p>
                  <p className="text-xs text-zinc-400 mt-1">Platform commission on street sales</p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <p className="text-2xl font-black text-emerald-400">2-Tap</p>
                  <p className="text-xs text-zinc-400 mt-1">Voice-to-inventory & order acceptance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#0B0B0B]">
            <div className="w-full max-w-md space-y-8">
              {/* Header */}
              <div className="space-y-3 text-center lg:text-left">
                <div className="inline-block bg-white/5 border border-white/10 px-4 py-2 rounded-2xl mb-2 backdrop-blur-md">
                  <div className="relative h-9 w-36">
                    <Image
                      src="/assets/tech thela logo.png"
                      alt="Tech Thela"
                      fill
                      sizes="150px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-3xl font-black tracking-tight">Vendor Login</h2>
                <p className="text-zinc-400 text-sm">
                  Access your live cart controls, voice inventory, and customer orders.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 ml-1">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-5 h-5 absolute left-4 text-zinc-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-base font-medium transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Password
                    </label>
                    <span className="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">
                      Default: vendor123
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 absolute left-4 text-zinc-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-base font-medium transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-extrabold tracking-wide uppercase shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>Welcome! Opening Dashboard...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Business</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Helper Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-zinc-300 flex items-center justify-between">
                <div>
                  <span className="font-bold text-emerald-400">Hackathon Quick Login:</span>
                  <p className="text-zinc-400 mt-0.5">Pre-filled credentials for instant demo inspection.</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/vendor")}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold rounded-lg transition-colors"
                >
                  Skip to Portal &rarr;
                </button>
              </div>

              {/* Footer Links */}
              <div className="text-center text-sm text-zinc-500 space-y-2">
                <p>
                  Need customer tracking?{" "}
                  <Link href="/Customerlogin" className="text-emerald-400 font-bold hover:underline">
                    Switch to Customer Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
