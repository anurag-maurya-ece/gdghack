"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Pause, Play } from "lucide-react";

const stroke = { stroke: "var(--color-teal)", strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round" };

function SceneArt() {
  return (
    <div className="street-scene" aria-hidden="true">
      <svg className="scene-layer street-backdrop" viewBox="0 0 480 320">
        <g {...stroke} fill="none" opacity="0.35">
          <path d="M24 252V126l48-32 48 32v58m-72-48h24v32H48m48-12h24M384 220V88h56v164m-40-144h24m-24 24h24m-24 24h24" />
          <path d="M136 88h120m-96 24h56" />
          <circle cx="322" cy="70" r="24" fill="var(--color-lavender)" />
          <path d="M24 276h432" />
        </g>
        <g {...stroke} className="street-dashes" opacity="0.45">
          <path d="M56 292h40m72 0h40m72 0h40m72 0h40" />
        </g>
      </svg>
      <div className="scene-layer cart-depth">
        <svg className="cart-travel" viewBox="0 0 480 320">
          <g {...stroke}>
            <g className="cart-bob">
              <path d="M72 130v98m192-98v98" fill="none" />
              <path d="m52 128 24-64h172l32 64Z" fill="var(--color-lavender)" />
              <path d="m120 64-8 64m52-64 4 64m36-64 20 64" fill="none" />
              <path d="M52 128v8q0 24 23 24t23-24q0 24 23 24t23-24q0 24 23 24t23-24q0 24 23 24t23-24q0 24 22 24t22-24v-8Z" fill="var(--color-lavender)" />
              <path d="M64 220h208v40H64z" fill="var(--color-lavender)" />
              <path d="m272 220 16-8v36l-16 12Z" fill="var(--color-teal)" />
              <path d="M288 220h32" fill="none" />
              <path d="M88 220v-24h64v24m32 0v-32h56v32" fill="var(--color-green)" />
              <path d="M120 196v24m88-32v32" fill="none" />
              <path d="M80 232h56" fill="none" />
            </g>
            {[104, 240].map((x) => (
              <g key={x} className="cart-wheel" style={{ transformOrigin: `${x}px 262px` }}>
                <circle cx={x} cy="262" r="16" fill="var(--color-page)" />
                <path d={`M${x} 248v28m-14-14h28`} />
                <circle cx={x} cy="262" r="4" fill="var(--color-teal)" />
              </g>
            ))}
          </g>
        </svg>
      </div>
      <div className="scene-layer vendor-depth">
        <svg className="vendor-travel" viewBox="0 0 480 320">
          <g {...stroke}>
            <g className="vendor-leg vendor-leg-back">
              <path d="m364 224 14 28-8 26h-20" fill="none" strokeWidth="12" />
            </g>
            <g className="vendor-leg vendor-leg-front">
              <path d="m348 224-8 28-14 24h-16" fill="none" strokeWidth="12" />
            </g>
            <g className="vendor-body">
              <path d="m346 146-14 36 8 44h40l-8-64Z" fill="var(--color-green)" />
              <path d="m364 152 8 10 8 64h-12Z" fill="var(--color-teal)" />
              <path d="m348 176-16 28-18 12" fill="none" strokeWidth="12" />
              <path d="m314 216-10 2" fill="none" strokeWidth="8" />
              <path d="M350 148v-16h16v18" fill="var(--color-page)" />
              <path d="M338 102q-8 6-6 22l-5 8h10q2 15 18 14 22-2 22-25v-18Z" fill="var(--color-page)" />
              <path d="M334 108q-4-25 23-25 26 0 24 27l-16 4v-14Z" fill="var(--color-lavender)" />
              <path d="M332 101h34m-28 18h2m-2 16h8" fill="none" />
              <path d="M372 117q10-6 10 3t-10 8" fill="var(--color-page)" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function ThelaScene() {
  const region = useRef(null);
  const [paused, setPaused] = useState(false);
  // Start static on SSR: motion must never flash before preferences are known.
  const [reduced, setReduced] = useState(true);
  const [visible, setVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const rotateX = useSpring(0, { stiffness: 120, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 120, damping: 22 });
  const running = !paused && !reduced && visible && tabVisible;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduced(preference.matches);
    const syncVisibility = () => setTabVisible(!document.hidden);
    syncPreference();
    syncVisibility();
    preference.addEventListener("change", syncPreference);
    document.addEventListener("visibilitychange", syncVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(region.current);
    return () => {
      preference.removeEventListener("change", syncPreference);
      document.removeEventListener("visibilitychange", syncVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) {
      rotateX.jump(0);
      rotateY.jump(0);
    }
  }, [running, rotateX, rotateY]);

  function tilt(event) {
    if (!running || event.pointerType !== "mouse") return;
    const rect = region.current.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
    const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    rotateX.set(-y * 6);
    rotateY.set(x * 6);
  }

  return (
    <aside className="scene-preview" aria-label="Tech Thela preview">
      <div ref={region} className="scene-perspective" onPointerMove={tilt} onPointerLeave={() => { rotateX.set(0); rotateY.set(0); }}>
        <motion.div className="outline-card hello-card scene-card" data-running={running} data-reduced={reduced} style={{ rotateX, rotateY }}>
          <p className="font-semibold text-teal scene-heading">Namaste, mohalla!</p>
          <SceneArt />
          <div className="scene-caption">
            <p className="text-2xl font-semibold" lang="hi">अपना ठेला, अपनी पहचान।</p>
            <p className="mt-4">Abhi taiyaari chal rahi hai. Jaldi milte hain.</p>
          </div>
        </motion.div>
      </div>
      <button type="button" className="motion-toggle" aria-pressed={paused} disabled={reduced} onClick={() => setPaused(!paused)}>
        {paused || reduced ? <Play size={20} aria-hidden="true" /> : <Pause size={20} aria-hidden="true" />}
        {reduced ? "Motion off · device setting" : paused ? "Play animation" : "Pause animation"}
      </button>
    </aside>
  );
}
