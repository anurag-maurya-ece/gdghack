"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function AboutDataCard({ picImg, number, title }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = number / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= number) {
        setCount(number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="flex flex-col md:flex-row gap-5 items-center py-6 sm:py-8 justify-center group">
      <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0 p-2 rounded-2xl bg-white/5 border border-white/10 group-hover:border-[#22C55E]/40 transition-colors">
        <Image
          src={`/assets/${picImg}.svg`}
          alt={title}
          width={80}
          height={80}
          className="w-full h-full object-contain drop-shadow-[0_4px_10px_rgba(34,197,94,0.3)]"
        />
      </div>
      <div className="flex flex-col gap-1 text-center md:text-left">
        <span className="font-extrabold text-3xl sm:text-4xl text-[#22C55E] tracking-tight">
          {count.toLocaleString()}+
        </span>
        <h5 className="text-base sm:text-lg text-gray-200 font-medium">{title}</h5>
      </div>
    </div>
  );
}
