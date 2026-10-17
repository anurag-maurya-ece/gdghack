"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Globe, Check } from "lucide-react";

export default function LanguageSelector({ variant = "default" }) {
  const { lang, setLang, supportedLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLang = supportedLanguages.find((l) => l.code === lang) || supportedLanguages[0];

  // Mobile / Full-width segmented buttons variant
  if (variant === "mobile") {
    return (
      <div className="w-full bg-gray-100/90 p-1 rounded-2xl border border-gray-200/80 flex items-center justify-between gap-1 shadow-inner">
        {supportedLanguages.map((l) => {
          const isActive = l.code === lang;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              className={`flex-1 py-2 px-2 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200 scale-102"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <span>{l.label}</span>
              {isActive && <Check className="w-3.5 h-3.5 text-[#16A34A]" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Segmented Pill for Desktop
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 bg-gray-100/90 hover:bg-gray-200/80 border border-gray-300/80 transition-all duration-200 shadow-2xs hover:scale-102 active:scale-98 cursor-pointer"
        aria-label="Select Language"
        title="Change Language (English / हिंदी / Hinglish)"
      >
        <Globe className="w-3.5 h-3.5 text-[#16A34A]" />
        <span className="font-extrabold text-gray-900">{activeLang.label}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-gray-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-100 mb-1">
            Choose Language
          </div>
          {supportedLanguages.map((l) => {
            const isSelected = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => {
                  setLang(l.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 text-[#16A34A] font-black"
                    : "text-gray-700 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{l.label}</span>
                  <span className="text-[10px] text-gray-400">({l.short})</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#16A34A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
