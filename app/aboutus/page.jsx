"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AboutUsPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-10 py-12">
        {/* Main Header & Story */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Left Text */}
          <div className="flex flex-col gap-6 max-w-xl">
            <h1 className="text-5xl sm:text-6xl font-black text-gray-950">
              ABOUT <span className="text-green-500">US</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-medium">
              WEkreta is aimed to solve the problems of street vendors by becoming a platform providing the ailment to all their daily problems.
            </p>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Ranging from converting their hard work into smart work to providing the feel of working in an organized way are some of the benefits for vendors to use us. Customers on the other hand get the power of bargaining back in their hands with a sense of added security and community building.
            </p>

            <div className="pt-2">
              <Link
                href="/customer"
                className="inline-flex px-8 py-3.5 bg-green-500 hover:bg-green-600 text-black font-extrabold text-base rounded-2xl border-2 border-black shadow-[3px_3px_0_#000000] active:translate-y-[1px] transition-all"
              >
                Explore Live Thelas
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="w-full md:w-[45vw] max-w-md flex justify-center">
            <Image
              src="/assets/about.gif"
              width={500}
              height={500}
              className="w-full h-auto object-contain rounded-3xl"
              alt="About WEkreta"
              unoptimized={true}
            />
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-gray-200">
          <div className="p-6 rounded-3xl bg-purple-50 border-2 border-black shadow-[4px_4px_0_#000000]">
            <span className="text-3xl">🥦</span>
            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">
              For Vendors
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Zero typing voice listing, predictive selling locations, and direct orders with no platform cut.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-black shadow-[4px_4px_0_#000000]">
            <span className="text-3xl">📍</span>
            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">
              For Consumers
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Live pushcart map tracking, doorstep demand pings, and fresh daily farm produce at your door.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-amber-50 border-2 border-black shadow-[4px_4px_0_#000000]">
            <span className="text-3xl">🤝</span>
            <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">
              Community Trust
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Customer reviews reward local thelas with trust badges and give buyers instant savings coins.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
