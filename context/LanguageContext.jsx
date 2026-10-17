"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../lib/i18n";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", short: "EN", flag: "EN" },
  { code: "hi", label: "हिंदी", short: "हिं", flag: "HI" },
  { code: "hinglish", label: "Hinglish", short: "Hinglish", flag: "HING" },
];

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  supportedLanguages: SUPPORTED_LANGUAGES,
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem("tech_thela_lang");
        if (savedLang && (savedLang === "en" || savedLang === "hi" || savedLang === "hinglish")) {
          setLangState(savedLang);
        }
      }
    } catch (e) {
      console.warn("Could not read language from localStorage:", e);
    }
  }, []);

  const setLang = (newLang) => {
    if (newLang === "en" || newLang === "hi" || newLang === "hinglish") {
      setLangState(newLang);
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("tech_thela_lang", newLang);
          window.dispatchEvent(new Event("lang_change"));
        }
      } catch (e) {
        console.warn("Could not save language to localStorage:", e);
      }
    }
  };

  const t = (key) => {
    const dict = translations[lang] || translations.hinglish || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, supportedLanguages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
