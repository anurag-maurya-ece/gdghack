"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutDataCard from "../components/AboutDataCard";
import LoginCard from "../components/LoginCards";
import ReviewCarousel from "../components/ReviewCarousel";
import ThelaScene from "./thela-scene";
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

      {/* 1. Main Hero Section */}
      <section className="flex flex-col md:flex-row justify-center min-h-[85vh] items-center px-6 sm:px-10 md:px-20 lg:px-28 gap-8 py-12">
        <div className="flex flex-col justify-center gap-6 max-w-full md:max-w-[50vw]">
          <h5 className="text-xl sm:text-2xl text-purple-600 font-bold tracking-wide uppercase">
            START TO SUCCESS
          </h5>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-gray-950">
            Empowering your long-lived{" "}
            <span className="text-green-500 font-extrabold">trust</span> with{" "}
            <span className="text-green-500 font-extrabold">technology</span> and{" "}
            <span className="text-green-500 font-extrabold">love</span>
          </h1>

          <h5 className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            Restoring the connection between vendors and consumers in a split second.
          </h5>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/customer"
              className="px-8 py-4 rounded-2xl bg-green-500 hover:bg-green-600 active:scale-95 text-black font-extrabold text-lg border-2 border-black shadow-[4px_4px_0_#000000] flex items-center gap-2 transition-all"
            >
              <MapPin className="w-5 h-5" />
              <span>Explore Live Thelas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/vendor"
              className="px-8 py-4 rounded-2xl bg-purple-100 hover:bg-purple-200 active:scale-95 text-gray-900 font-extrabold text-lg border-2 border-black shadow-[4px_4px_0_#000000] flex items-center gap-2 transition-all"
            >
              <Store className="w-5 h-5 text-purple-700" />
              <span>Vendor Portal</span>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-[48vw] flex justify-center">
          <Image
            src="/assets/herosec.gif"
            width={650}
            height={650}
            className="w-full max-w-lg md:max-w-none h-auto object-contain"
            alt="WEkreta Hero Animation"
            unoptimized={true}
            priority
          />
        </div>
      </section>

      {/* 2. Platform Stats */}
      <section className="bg-gray-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 md:px-12 w-full py-6">
        {statsData.map((data, index) => (
          <AboutDataCard
            key={index}
            picImg={data.picImg}
            number={data.number}
            title={data.title}
          />
        ))}
      </section>

      {/* 3. Role Portals */}
      <section className="px-4 sm:px-10 md:px-24 pt-16 sm:pt-20">
        <div className="rounded-3xl bg-black text-white px-6 sm:px-16 md:px-32 py-16 sm:py-24 flex flex-col items-center text-center">
          <p className="text-3xl sm:text-5xl md:text-6xl font-bold leading-tight max-w-4xl">
            It&apos;s your time to make the move with{" "}
            <span className="text-green-500">
              WE<span className="text-white">kreta</span>
            </span>
          </p>
          <p className="text-sm sm:text-base text-gray-400 mt-4 max-w-lg">
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

      {/* 4. Interactive 3D Thela Scene Teaser */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="p-8 sm:p-12 rounded-3xl bg-purple-50 border-4 border-black shadow-[6px_6px_0_#000000] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-200 px-3 py-1 rounded-full">
              Realtime Depth Engine
            </span>
            <h3 className="text-3xl font-extrabold text-gray-950 mt-3 mb-2">
              Chalta Thela, <span className="text-green-600">Jeevant Nakshe Par</span>
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">
              Every pushcart moves smoothly across OpenStreetMap with real-time GPS coordinates. Tap below to test the full live tracking system.
            </p>
            <Link
              href="/customer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-black font-extrabold border-2 border-black shadow-[2px_2px_0_#000000] transition-all"
            >
              <span>Open Customer Discovery Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full md:w-80">
            <ThelaScene />
          </div>
        </div>
      </section>

      {/* 5. Customer Feedback Carousel */}
      <section className="flex flex-col gap-6 w-full py-12 mx-auto relative">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl sm:text-5xl font-bold text-gray-950">
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
