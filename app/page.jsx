"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AboutDataCard from "../components/AboutDataCard";
import LoginCard from "../components/LoginCards";
import ReviewCarousel from "../components/ReviewCarousel";

const statsData = [
  { picImg: "scholarship", number: 100, title: "Vendors" },
  { picImg: "people", number: 2000, title: "Consumers" },
  { picImg: "vidcam", number: 5000, title: "Transactions" },
  { picImg: "audience", number: 3000, title: "Reviews" },
];

export default function Home() {
  return (
    <div className="bg-white text-[#4B5563] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Main Hero Section */}
      <section className="flex flex-col md:flex-row justify-center min-h-[90vh] items-center px-6 sm:px-10 md:px-20 gap-8 py-10 pt-28 sm:pt-36 lg:pt-40 relative overflow-hidden">
        {/* Floating Geometric Ambient Shapes */}
        <div
          className="absolute top-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"
          style={{ animationDelay: "0s", animationDuration: "7s" }}
        />
        <div
          className="absolute top-40 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-xl opacity-80 animate-float"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-8 left-20 w-32 h-32 sm:w-40 sm:h-40 bg-[#DCFCE7] rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"
          style={{ animationDelay: "4s", animationDuration: "9s" }}
        />

        <div className="flex flex-col justify-center gap-6 sm:gap-8 w-full md:max-w-[48vw] z-10 text-center md:text-left">
          <h5 className="text-xs sm:text-sm text-[#16A34A] font-bold tracking-widest uppercase">
            START TO SUCCESS
          </h5>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-[#111111] leading-tight">
            Empowering your long-lived{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d]">
              trust{" "}
              <svg
                className="inline w-6 h-6 sm:w-8 sm:h-8 -mt-1 text-[#16A34A]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </span>{" "}
            with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d]">
              technology{" "}
              <svg
                className="inline w-6 h-6 sm:w-8 sm:h-8 -mt-1 text-[#16A34A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </span>{" "}
            and{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16A34A] to-[#15803d]">
              love
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[#4B5563] leading-relaxed">
            Restoring the connection between vendors and consumers in a split second. Experience seamless, reliable, and real-time community commerce.
          </p>

          <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
            <Link href="#cardssection">
              <button className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803d] text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                Get Started
              </button>
            </Link>
            <Link href="/customer">
              <button className="w-full sm:w-auto bg-white border-2 border-[#16A34A] text-[#16A34A] hover:bg-emerald-50 font-bold text-lg px-8 py-4 rounded-2xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
                Live Thela Map
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full md:w-[48vw] flex items-center justify-center relative pl-0 md:pl-10 mt-8 md:mt-0">
          <div className="absolute inset-0 bg-[#DCFCE7]/60 rounded-full blur-3xl opacity-70 scale-[1.2] sm:scale-[1.35] pointer-events-none" />
          <Image
            src="/assets/herosec.gif"
            width={1200}
            height={1200}
            unoptimized={true}
            className="w-full h-auto relative z-10 drop-shadow-2xl object-contain max-w-[90%] sm:max-w-full"
            style={{
              height: "auto",
              maxHeight: "60vh",
              WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)",
            }}
            alt="Tech Thela Hero Animation"
            priority
          />
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="bg-gray-50/70 border-y border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 sm:px-10 py-10 sm:py-16 w-full gap-8">
        {statsData.map((data, index) => (
          <AboutDataCard
            key={index}
            picImg={data.picImg}
            number={data.number}
            title={data.title}
          />
        ))}
      </section>

      {/* Role Cards for Vendor and Consumer */}
      <section className="bg-white px-4 md:px-24 lg:px-32 py-16 sm:py-24 relative">
        <div
          id="cardssection"
          className="rounded-3xl bg-gray-50 border border-gray-100 shadow-sm px-4 md:px-24 flex flex-col items-center text-center pb-24 sm:pb-32 pt-16 sm:pt-20"
        >
          <p className="text-3xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight text-[#111111]">
            It&apos;s your time to make the move with{" "}
            <span className="text-[#111111]">Tech </span>
            <span className="text-[#16A34A]">Thela</span>
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-16 justify-center w-full z-10 relative -mt-12 sm:-mt-16">
          <LoginCard
            imgName="consumer"
            name="Customer"
            text="Get the best deals available in your local market. Track nearby thelas live and order fresh produce."
          />
          <LoginCard
            imgName="vendor"
            name="Vendor"
            text="Boost sales by reaching thousands of local customers digitally with voice-assisted listings."
          />
        </div>
      </section>

      {/* Customer Feedback Carousel */}
      <div className="bg-white flex flex-col gap-10 w-full md:w-4/5 py-16 mx-auto relative">
        <div className="flex flex-col gap-2">
          <h2 className="xl:text-5xl text-4xl font-extrabold text-[#111111] text-center">
            Hear it from our customers!
          </h2>
          <p className="text-[#4B5563] text-lg text-center font-medium">
            Thousands trust Tech Thela every day.
          </p>
        </div>
        <ReviewCarousel />
      </div>

      <Footer />
    </div>
  );
}
