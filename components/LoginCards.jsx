"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginCard({ imgName, name, text }) {
  const isVendor = name.toLowerCase().includes("vendor");
  const targetHref = isVendor ? "/Vendorlogin" : "/Customerlogin";

  return (
    <div className="flex flex-col gap-4 sm:gap-6 items-center py-8 sm:py-12 md:py-14 bg-white rounded-2xl px-4 sm:px-8 md:px-12 text-center justify-center w-full sm:w-80 md:w-96 lg:w-[420px] shadow-sm border border-gray-100 hover:border-[#16A34A] hover:shadow-[0_15px_50px_-10px_rgba(22,163,74,0.15)] transition-all duration-500 z-20">
      <div
        className="relative w-full flex justify-center mb-2 sm:mb-4 transition-transform hover:scale-105 duration-500 min-h-[180px] sm:min-h-[220px] md:min-h-[250px] items-center"
        style={{ filter: "drop-shadow(0 15px 25px rgba(22, 163, 74, 0.2))" }}
      >
        <Image
          src={`/assets/${imgName}.png`}
          width={350}
          height={350}
          alt={name}
          priority
          className="w-full h-auto object-contain drop-shadow-xl"
          style={{ maxWidth: "280px", maxHeight: "220px", height: "auto" }}
        />
      </div>

      <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111]">
        Are you a <span className="text-[#16A34A]">{name}</span>?
      </h2>

      <h5 className="text-xs sm:text-sm md:text-base text-[#4B5563] font-medium leading-relaxed min-h-[44px]">
        {text}
      </h5>

      <Link href={targetHref} className="w-full mt-2 sm:mt-4">
        <button className="w-full text-sm sm:text-base md:text-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-bold px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-md shadow-[#16A34A]/20 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300">
          Join now
        </button>
      </Link>
    </div>
  );
}
