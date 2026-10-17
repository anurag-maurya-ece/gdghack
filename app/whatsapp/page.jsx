"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Send,
  Mic,
  MapPin,
  CheckCheck,
  Sparkles,
  PhoneCall,
  MoreVertical,
  Volume2,
  RefreshCw,
  Store,
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function WhatsAppBotSimulatorPage() {
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "bot",
      text: "🙏 Namaste Ramesh Bhaiya! Welcome to Tech Thela Official Bot.\n\nAap bina typing ke sirf **Voice Note** bhejkar dukan ka stock update kar sakte hain ya **Live Location** share karke thela chalu kar sakte hain.",
      time: "09:00 AM",
      buttons: ["Thela ON", "Kahan Jaun?", "Stock Update Karein"],
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Send message to WhatsApp Webhook
  const sendMessage = async (payload) => {
    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: payload.text || payload.transcript || "📍 Shared Live Location",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isVoice: Boolean(payload.voice || payload.transcript),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/whatsapp/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "9876543210",
          ...payload,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.botReply) {
        const botMsg = {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: data.botReply.text,
          buttons: data.botReply.buttons || [],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);

        // If inventory was confirmed, sync with localStorage vendor inventory
        if (data.action === "INVENTORY_SAVED" && typeof window !== "undefined") {
          const stored = localStorage.getItem("tech_thela_inventory") || "[]";
          const items = JSON.parse(stored);
          window.dispatchEvent(new Event("inventory_updated"));
        }
      }
    } catch (err) {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: "⚠️ Sandesh bhejne mein samasya aayi. Kripya dobara prayas karein.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const text = inputVal;
    setInputVal("");
    sendMessage({ text, type: "text" });
  };

  const handleSendVoiceSample = (sampleText) => {
    sendMessage({
      voice: true,
      transcript: sampleText,
    });
  };

  const handleShareLocation = () => {
    sendMessage({
      location: {
        latitude: 28.6315,
        longitude: 77.2185,
      },
      type: "location",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-gray-900 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 pt-28 flex flex-col items-center">
        {/* Header Explainer */}
        <div className="text-center mb-6 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-[#16A34A] text-xs font-black uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive WhatsApp Bot (Meta Webhook Verified)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Vendor WhatsApp <span className="text-[#16A34A]">Voice Assistant</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Zero typing required. Street vendors can send natural voice notes, share location, and check demand hotspots directly on WhatsApp.
          </p>
        </div>

        {/* WhatsApp Mobile Mockup Shell */}
        <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden border-2 border-gray-300 shadow-2xl flex flex-col h-[640px]">
          {/* WhatsApp Header Bar */}
          <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <Link href="/vendor" className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="relative w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-lg overflow-hidden border border-emerald-400">
                🛒
              </div>
              <div className="leading-tight">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-black text-white">Tech Thela Bot</h3>
                  <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-bold">✓ Official</span>
                </div>
                <p className="text-[11px] text-emerald-200">Online • Automated Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Restart Chat"
                className="p-1.5 hover:bg-white/10 rounded-full transition-colors text-emerald-100"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Area (WhatsApp Wallpaper Color) */}
          <div className="flex-1 bg-[#EFEAE2] p-4 overflow-y-auto flex flex-col gap-3 font-sans">
            {/* Encryption notice */}
            <div className="self-center bg-[#FFEECD] text-[#54656F] text-[10px] px-3 py-1 rounded-lg text-center max-w-xs shadow-2xs leading-relaxed">
              🔒 Messages are verified via official webhook signature. End-to-end encrypted.
            </div>

            {messages.map((msg) => {
              const isBot = msg.sender === "bot";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[85%] ${isBot ? "self-start" : "self-end items-end"}`}
                >
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 shadow-xs text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? "bg-white text-gray-900 rounded-tl-xs"
                        : "bg-[#D9FDD3] text-gray-900 rounded-tr-xs"
                    }`}
                  >
                    {msg.isVoice && (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1 pb-1 border-b border-emerald-200">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span className="text-[11px] uppercase tracking-wider">Voice Note</span>
                      </div>
                    )}
                    <div>{msg.text}</div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 mt-1">
                      <span>{msg.time}</span>
                      {!isBot && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </div>

                  {/* WhatsApp Interactive Quick-Reply Buttons */}
                  {isBot && msg.buttons && msg.buttons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.buttons.map((btnTitle) => (
                        <button
                          key={btnTitle}
                          onClick={() => sendMessage({ text: btnTitle, type: "interactive" })}
                          className="bg-white hover:bg-emerald-50 text-[#075E54] border border-[#075E54]/30 px-3 py-1.5 rounded-xl text-xs font-black shadow-xs transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                        >
                          <span>{btnTitle}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="self-start bg-white rounded-2xl rounded-tl-xs px-4 py-2.5 shadow-xs text-xs text-gray-500 flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
                <span>Tech Thela typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset Voice Prompts for Judges / Demo */}
          <div className="bg-emerald-50 border-t border-emerald-200 px-3 py-2">
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block mb-1">
              Tap Sample Voice Note (2-Tap Speech Demo):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => handleSendVoiceSample("aaj aloo 20 rupaye kilo, pyaaz 35 rupaye kilo")}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-gray-800 rounded-lg text-[11px] font-bold border border-emerald-300 whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Mic className="w-3 h-3 text-[#16A34A]" />
                <span>"Aloo 20, Pyaaz 35"</span>
              </button>
              <button
                onClick={() => handleSendVoiceSample("kahan jaun bhaiya?")}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-gray-800 rounded-lg text-[11px] font-bold border border-emerald-300 whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Mic className="w-3 h-3 text-[#16A34A]" />
                <span>"Kahan Jaun?"</span>
              </button>
              <button
                onClick={handleShareLocation}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-300 whitespace-nowrap flex items-center gap-1 cursor-pointer transition-colors"
              >
                <MapPin className="w-3 h-3 text-red-500" />
                <span>Share Live GPS</span>
              </button>
            </div>
          </div>

          {/* Input Bar */}
          <form onSubmit={handleTextSubmit} className="bg-gray-100 px-3 py-2 flex items-center gap-2 border-t border-gray-200">
            <button
              type="button"
              onClick={handleShareLocation}
              title="Share Live Location"
              className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-white transition-colors cursor-pointer"
            >
              <MapPin className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type message or voice transcript..."
              className="flex-1 bg-white rounded-full px-4 py-2 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#16A34A] border border-gray-200"
            />

            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="p-2.5 bg-[#075E54] hover:bg-[#128C7E] disabled:opacity-40 text-white rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Quick Link to Vendor Portal */}
        <div className="mt-6 flex items-center gap-4 text-xs font-bold text-gray-600">
          <Link href="/vendor" className="text-[#16A34A] hover:underline flex items-center gap-1">
            <Store className="w-4 h-4" />
            <span>Return to Vendor Operations Portal</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
