"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const reviewsData = [
  {
    name: "Suresh",
    designation: "Vendor (Sabzi Cart)",
    image: "vendor1",
    comment:
      "Rozz ka kam se kam 500 ki sabzi jyada bikne lagi hai jab se inse judee hoon. Daily sales have gone up by at least INR 500 from the time of joining Tech Thela.",
  },
  {
    name: "Mansi Chaubey",
    designation: "Working Woman",
    image: "cust1",
    comment:
      "I am a working woman and have subscribed to Tech Thela. Fixing time slots enables me to have the vendor near my home at odd times. The weekly community engagement has definitely been the center of attraction for me.",
  },
  {
    name: "Mona Singh",
    designation: "Housewife",
    image: "cust2",
    comment:
      "I am a housewife and a regular customer at Tech Thela. This is great that I can plan my daily go-to vegetables. Vendors also are polite, well-mannered, and conscious about the reviews we enter.",
  },
  {
    name: "Ranjan Kumar",
    designation: "Vendor (Fruit Cart)",
    image: "vendor2",
    comment:
      "Saare fruits shaam hote hote bikk jaate hain toh nuksaan kuch nahi hota aur thoda aaram bhi mil jaata hai. All fruits get sold out by sunset and I get more time to relax with family.",
  },
  {
    name: "Nancy Garg",
    designation: "Student",
    image: "cust3",
    comment:
      "I am pursuing my Masters. As of now, I earn discount coupons by just reviewing the street vendors on their platform. I can certainly make a fresh purchase after verifying the fruits myself. Kudos to WEkreta!",
  },
];

export default function ReviewCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Cards Display Grid / Slider */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((offset) => {
          const index = (currentIndex + offset) % reviewsData.length;
          const data = reviewsData[index];
          const isCenter = offset === 1;

          return (
            <div
              key={index}
              className={`h-full bg-purple-50 rounded-3xl p-6 sm:p-8 flex flex-col justify-between border-2 border-black/10 shadow-md transition-all duration-300 ${
                isCenter ? "md:scale-105 border-green-500 ring-2 ring-green-400/30" : "hidden md:flex opacity-85"
              }`}
            >
              <div className="flex flex-col gap-4">
                <div className="flex w-full justify-between items-center pb-4 border-b border-purple-200">
                  <div className="flex gap-3.5 items-center">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-green-500 bg-white">
                      <Image
                        src={`/reviews/${data.image}.svg`}
                        alt={data.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-lg font-bold text-[#1B1D1F]">{data.name}</h4>
                      <p className="text-xs text-gray-500 font-semibold">{data.designation}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 opacity-75">
                    <Image
                      src="/reviews/quoteLogo.svg"
                      alt="Quote"
                      width={32}
                      height={32}
                    />
                  </div>
                </div>

                <p className="text-sm text-[#363A3D] leading-relaxed italic">
                  &ldquo;{data.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-500 pt-4 mt-2">
                {"★★★★★"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Slider Nav Buttons */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white border-2 border-black shadow-[2px_2px_0_#000000] hover:bg-gray-100 active:translate-y-[1px] transition-all"
          aria-label="Previous review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex gap-2">
          {reviewsData.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === currentIndex ? "w-8 bg-green-500" : "w-2.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white border-2 border-black shadow-[2px_2px_0_#000000] hover:bg-gray-100 active:translate-y-[1px] transition-all"
          aria-label="Next review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
