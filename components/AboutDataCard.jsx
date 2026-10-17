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
    <div className="flex flex-col md:flex-row gap-5 items-center py-8 justify-center">
      <div className="relative w-16 h-16 md:w-20 md:h-20 shrink-0">
        <Image
          src={`/assets/${picImg}.svg`}
          alt={title}
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1 text-center md:text-left">
        <span className="font-bold text-3xl sm:text-4xl text-green-500">
          {count.toLocaleString()}+
        </span>
        <h5 className="text-lg sm:text-xl text-white font-medium">{title}</h5>
      </div>
    </div>
  );
}
