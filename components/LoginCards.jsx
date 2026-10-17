"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginCard({ name, imgName, text }) {
  const isVendor = name.toLowerCase().includes("vendor");
  const targetHref = isVendor ? "/Vendorlogin" : "/Customerlogin";

  return (
    <div className="flex flex-col gap-5 items-center py-8 sm:py-12 bg-white rounded-3xl px-6 sm:px-10 text-center justify-between w-full max-w-sm sm:max-w-md border-2 border-gray-100 hover:border-[#16A34A] shadow-md hover:shadow-[0_20px_50px_-10px_rgba(22,163,74,0.25)] transition-all duration-300 group">
      {/* Visual illustration with luminous green drop shadow */}
      <div
        className="relative w-full h-48 sm:h-56 flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
        style={{ filter: "drop-shadow(0 15px 25px rgba(22, 163, 74, 0.22))" }}
      >
        <Image
          src={`/assets/${imgName}.png`}
          width={280}
          height={220}
          alt={name}
          priority
          className="max-h-full w-auto object-contain"
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
        Are you a <span className="text-[#16A34A]">{name}</span>?
      </h2>

      <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed min-h-[50px]">
        {text}
      </p>

      <div className="w-full flex flex-col gap-2 mt-2">
        <Link href={targetHref} className="w-full">
          <button className="w-full text-base sm:text-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-extrabold py-3.5 px-6 rounded-xl shadow-md shadow-[#16A34A]/30 hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
            Join now
          </button>
        </Link>
        <Link
          href={isVendor ? "/vendor" : "/customer"}
          className="text-xs text-gray-400 hover:text-[#16A34A] font-semibold transition-colors py-1"
        >
          Direct {isVendor ? "Vendor Dashboard" : "Customer Map"} &rarr;
        </Link>
      </div>
    </div>
  );
}
