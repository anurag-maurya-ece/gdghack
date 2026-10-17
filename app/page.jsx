"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutDataCard from "../components/AboutDataCard";
import LoginCard from "../components/LoginCards";
import ReviewCarousel from "../components/ReviewCarousel";
import { ArrowRight, MapPin, Store } from "lucide-react";

const statsData = [
  { picImg: "scholarship", number: 100, title: "Vendors" },
  { picImg: "people", number: 2000, title: "Consumers" },
  { picImg: "vidcam", number: 5000, title: "Transactions" },
  { picImg: "audience", number: 3000, title: "Reviews" },
];

export default function Home() {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      {/* 1. Main Hero Section with Original Green Ambience */}
      <section className="relative flex flex-col md:flex-row justify-center min-h-[85vh] items-center px-6 sm:px-10 md:px-20 lg:px-28 gap-8 py-12 overflow-hidden">
        {/* Floating Geometric Ambient Green Glows */}
        <div className="absolute top-12 left-8 w-32 h-32 sm:w-44 sm:h-44 bg-[#DCFCE7] rounded-full filter blur-2xl opacity-75 pointer-events-none" />
        <div className="absolute top-24 right-10 w-40 h-40 sm:w-56 sm:h-56 bg-[#DCFCE7] rounded-full filter blur-3xl opacity-80 pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-48 h-48 bg-[#DCFCE7] rounded-full filter blur-3xl opacity-60 pointer-events-none" />

        <div className="flex flex-col justify-center gap-6 max-w-full md:max-w-[50vw] z-10">
          <h5 className="text-xs sm:text-sm font-black text-[#16A34A] tracking-widest uppercase">
            START TO SUCCESS
          </h5>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-950">
            Empowering your long-lived{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#22C55E]">
              trust
            </span>{" "}
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#22C55E]">
              technology
            </span>{" "}
            and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#22C55E]">
              love
            </span>
          </h1>

          <h5 className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed">
            Restoring the connection between vendors and consumers in a split second.
          </h5>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/customer"
              className="px-8 py-4 rounded-2xl bg-[#16A34A] hover:bg-[#15803d] active:scale-95 text-white font-extrabold text-lg shadow-lg shadow-[#16A34A]/30 hover:shadow-xl hover:scale-105 flex items-center gap-2 transition-all"
            >
              <MapPin className="w-5 h-5 text-white" />
              <span>Explore Live Thelas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/vendor"
              className="px-8 py-4 rounded-2xl bg-white hover:bg-emerald-50 active:scale-95 text-[#16A34A] font-extrabold text-lg border-2 border-[#16A34A] shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2 transition-all"
            >
              <Store className="w-5 h-5 text-[#16A34A]" />
              <span>Vendor Portal</span>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-[48vw] flex justify-center relative z-10">
          {/* Luminous Green Glow behind Hero Illustration */}
          <div className="absolute inset-0 bg-[#DCFCE7]/70 rounded-full blur-3xl opacity-80 scale-[1.25] pointer-events-none" />
          <Image
            src="/assets/herosec.gif"
            width={650}
            height={650}
            className="w-full max-w-lg md:max-w-none h-auto object-contain relative z-10 drop-shadow-xl"
            alt="WEkreta Hero Animation"
            unoptimized={true}
            priority
          />
        </div>
      </section>

      {/* 2. Platform Stats with Emerald Accents */}
      <section className="bg-gray-950 border-y border-emerald-950/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-12 w-full py-8">
        {statsData.map((data, index) => (
          <AboutDataCard
            key={index}
            picImg={data.picImg}
            number={data.number}
            title={data.title}
          />
        ))}
      </section>

      {/* 3. Role Portals for Vendor and Consumer */}
      <section className="px-4 sm:px-10 md:px-24 pt-16 sm:pt-20">
        <div className="rounded-3xl bg-gray-950 text-white px-6 sm:px-16 md:px-32 py-16 sm:py-24 flex flex-col items-center text-center relative overflow-hidden border border-emerald-950/40">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#16A34A]/15 rounded-full blur-3xl pointer-events-none" />
          <p className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-4xl relative z-10">
            It&apos;s your time to make the move with{" "}
            <span className="text-[#22C55E]">
              WE<span className="text-white">kreta</span>
            </span>
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-4 max-w-lg relative z-10">
            Choose your role to get started with live street cart commerce.
          </p>
        </div>

        {/* Div surrounding vendor and consumer cards */}
        <div
          id="cardssection"
          className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 px-4 relative -mt-16 sm:-mt-24 z-10"
        >
          <LoginCard
            name="Vendor"
            imgName="vendor"
            text="Bahut hua online ka prahaar, ab phone hi badhaega apki raftaar. Voice listing se saman jodein aur grahak payein."
          />
          <LoginCard
            name="Consumer"
            imgName="consumer"
            text="Ordering stuff is easy without making your pocket squeezy. Track nearby thelas live and order fresh produce."
          />
        </div>
      </section>

      {/* 4. Customer Feedback Carousel */}
      <section className="flex flex-col gap-6 w-full py-12 mx-auto relative">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl sm:text-5xl font-extrabold text-gray-950">
            Hear it from our customers!
          </h2>
          <p className="text-gray-500 text-base sm:text-lg text-center font-medium">
            Real feedback from local street vendors and regular neighborhood consumers.
          </p>
        </div>
        <ReviewCarousel />
      </section>

      <Footer />
    </div>
  );
}
