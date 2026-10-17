"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginCard({ name, imgName, text }) {
  const targetHref = name.toLowerCase().includes("vendor") ? "/vendor" : "/customer";

  return (
    <div className="flex flex-col gap-4 items-center border-4 py-8 bg-purple-50 border-black rounded-3xl px-8 sm:px-12 text-center justify-between w-full max-w-sm sm:max-w-md shadow-[6px_6px_0_#000000] hover:shadow-[8px_8px_0_#000000] hover:-translate-y-1 transition-all">
      <div className="relative w-full h-44 sm:h-52 flex items-center justify-center">
        <Image
          src={`/assets/${imgName}.svg`}
          width={280}
          height={180}
          alt={name}
          className="max-h-full w-auto object-contain"
        />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
        Are you a <span className="text-green-500">{name}</span>?
      </h2>

      <p className="text-sm sm:text-base text-gray-700 leading-relaxed min-h-[50px]">
        {text}
      </p>

      <Link href={targetHref} className="w-full mt-2">
        <button className="w-full text-lg sm:text-xl bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3.5 px-6 rounded-2xl border-2 border-black shadow-[3px_3px_0_#000000] transition-all">
          Join now
        </button>
      </Link>
    </div>
  );
}
