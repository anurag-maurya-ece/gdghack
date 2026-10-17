"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Store, Phone, Lock, ArrowRight, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function VendorLoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [phone, setPhone] = useState("9876543210");
  const [password, setPassword] = useState("vendor123");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const saveVendorAuth = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tech_thela_logged_out");
      localStorage.setItem(
        "tech_thela_user",
        JSON.stringify({
          role: "vendor",
          name: "Ramesh Bhaiya",
          phone: phone || "9876543210",
          category: "Sabzi Thela",
          isOnline: true,
        })
      );
      window.dispatchEvent(new Event("auth_change"));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    saveVendorAuth();

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/vendor");
      }, 500);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-stretch pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center gap-12 justify-between">
          {/* Left Side: Brand Visual (Light Mode) */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-[#16A34A] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vendor Growth Engine • Zero Typing</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
              {t("vendorGrowthHeroTitle")}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
              {t("vendorGrowthHeroDesc")}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <p className="text-3xl font-black text-[#16A34A]">0%</p>
                <p className="text-xs font-bold text-gray-600 mt-1">{t("commissionFree")}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200/80 shadow-xs">
                <p className="text-3xl font-black text-[#16A34A]">2-Tap</p>
                <p className="text-xs font-bold text-gray-600 mt-1">{t("twoTapVoice")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>{t("verifiedPlatform")}</span>
            </div>
          </div>

          {/* Right Side: Login Form (Pure Crisp Light Card) */}
          <div className="w-full lg:w-5/12">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/90 shadow-xl space-y-6">
              {/* Header */}
              <div className="text-center sm:text-left space-y-2">
                <div className="inline-block p-1">
                  <Image
                    src="/assets/tech thela logo.png"
                    alt="Tech Thela"
                    width={180}
                    height={50}
                    priority
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {t("loginVendorTitle")}
                </h2>
                <p className="text-sm text-gray-500 font-medium">
                  {t("loginVendorSubtitle")}
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                    {t("phoneNumber")}
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-5 h-5 absolute left-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-base font-semibold transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-gray-700">
                      {t("password")}
                    </label>
                    <span className="text-xs text-[#16A34A] font-bold">
                      {t("defaultVendorPassword")}
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="w-5 h-5 absolute left-4 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/20 text-base font-semibold transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full py-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] active:scale-[0.98] text-white font-black tracking-wide uppercase shadow-lg shadow-green-700/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      <span>{t("signInToBusiness")}...</span>
                    </>
                  ) : (
                    <>
                      <span>{t("signInToBusiness")}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Helper Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-gray-800 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#16A34A]">{t("quickLoginTitle")}</span>
                  <p className="text-gray-600 mt-0.5">{t("quickLoginSubtitle")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    saveVendorAuth();
                    router.push("/vendor");
                  }}
                  className="px-3 py-1.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold rounded-xl transition-colors cursor-pointer"
                >
                  {t("skipToPortal")}
                </button>
              </div>

              {/* Footer Switch Link */}
              <div className="text-center text-xs text-gray-500 pt-2">
                <Link href="/Customerlogin" className="text-[#16A34A] font-extrabold hover:underline">
                  {t("switchToCustomer")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
