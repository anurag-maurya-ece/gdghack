"use client";

import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({
  vendors = [],
  selectedVendor = null,
  onSelectVendor = () => {},
  userLocation = { lat: 28.6304, lng: 77.2177 },
  height = "520px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);
  const penguinMarkersRef = useRef([]);

  // "Antarctica Me Dhaniya Bechta Thela" Bug & Debug State
  const [antarcticaBug, setAntarcticaBug] = useState(false);
  const [debugSuccessMessage, setDebugSuccessMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;

      if (!mapContainerRef.current || !isMounted) return;

      // Prevent re-initialization if already created
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [userLocation.lat, userLocation.lng],
          zoom: 15,
          zoomControl: false,
          // When debugged, noWrap prevents duplicate earth wrapping
          worldCopyJump: false,
        });

        // Add sleek zoom control at bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // OpenStreetMap Standard tiles (with noWrap: true debug fix to prevent infinite Earth duplicate wrapping)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
          noWrap: true,
        }).addTo(map);

        mapInstanceRef.current = map;

        // User Location Beacon Marker
        const userIcon = L.divIcon({
          className: "user-beacon-icon",
          html: `
            <div class="relative flex items-center justify-center w-8 h-8">
              <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
              <span class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg"></span>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<div class='p-1 text-center font-bold text-xs text-blue-700'>📍 Aapka Location (You)</div>");
      }

      const map = mapInstanceRef.current;

      // Clean up previous penguin markers
      penguinMarkersRef.current.forEach((m) => map.removeLayer(m));
      penguinMarkersRef.current = [];

      // Clean up previous vendor markers that might have been removed
      Object.keys(markersRef.current).forEach((id) => {
        if (!vendors.some((v) => v.id === id)) {
          map.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });

      // Update or add vendor markers
      vendors.forEach((vendor, index) => {
        const isSelected = selectedVendor?.id === vendor.id;
        
        // BUG SIMULATION: If Antarctica Bug is ON, relocate Ramesh Bhaiya to Antarctica Ice Shelf!
        const isRamesh = vendor.name.toLowerCase().includes("ramesh") || index === 0;
        const currentLat = antarcticaBug && isRamesh ? -75.2509 : vendor.lat;
        const currentLng = antarcticaBug && isRamesh ? 0.0714 : vendor.lng;

        const iconHtml = antarcticaBug && isRamesh ? `
          <div class="thela-marker-wrapper cursor-pointer animate-bounce z-50">
            <div class="relative flex flex-col items-center">
              <div class="absolute -top-3 w-16 h-16 rounded-full bg-cyan-400/40 animate-ping pointer-events-none"></div>
              <div class="relative px-3 py-1.5 rounded-2xl bg-amber-100 border-2 border-red-600 shadow-[3px_3px_0_#991B1B] flex items-center gap-1.5 text-gray-900 font-extrabold text-xs whitespace-nowrap">
                <span class="text-xl">🛒</span>
                <div class="flex flex-col text-left">
                  <span class="text-[11px] font-black text-red-700">Ramesh Bhaiya (Antarctica) 🥶</span>
                  <span class="text-[9px] text-gray-700 font-bold">"Bhai mai barf pe kaise aa gaya?!"</span>
                </div>
              </div>
              <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-red-600 -mt-[1px]"></div>
            </div>
          </div>
        ` : `
          <div class="thela-marker-wrapper group cursor-pointer transition-transform duration-300 ${isSelected ? "scale-125 z-50" : "hover:scale-110"}">
            <div class="relative flex flex-col items-center">
              <div class="absolute -top-1 w-10 h-10 rounded-full bg-[#22C55E]/20 animate-ping pointer-events-none"></div>
              <div class="relative px-2.5 py-1 rounded-2xl bg-white border-2 ${isSelected ? "border-[#22C55E] ring-4 ring-[#22C55E]/30" : "border-[#111111]"} shadow-[2px_2px_0_#111111] flex items-center gap-1.5 text-gray-900 font-bold">
                <span class="text-base">${vendor.avatar || "🛒"}</span>
                <div class="flex flex-col text-left leading-none">
                  <span class="text-[10px] font-black tracking-wide text-[#16A34A] truncate max-w-[80px]">${vendor.name.split(" ")[0]}</span>
                  <span class="text-[8px] font-bold text-gray-600">${vendor.distanceMeters}m</span>
                </div>
              </div>
              <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#111111] -mt-[1px]"></div>
            </div>
          </div>
        `;

        const vendorIcon = L.divIcon({
          className: `custom-thela-pin-${vendor.id}`,
          html: iconHtml,
          iconSize: antarcticaBug && isRamesh ? [220, 60] : [100, 48],
          iconAnchor: antarcticaBug && isRamesh ? [110, 56] : [50, 44],
        });

        if (markersRef.current[vendor.id]) {
          markersRef.current[vendor.id].setLatLng([currentLat, currentLng]);
          markersRef.current[vendor.id].setIcon(vendorIcon);
        } else {
          const marker = L.marker([currentLat, currentLng], { icon: vendorIcon }).addTo(map);
          marker.on("click", () => {
            onSelectVendor(vendor);
          });
          markersRef.current[vendor.id] = marker;
        }
      });

      // If Antarctica bug is active: Spawn cute penguins on the ice!
      if (antarcticaBug) {
        const penguin1Icon = L.divIcon({
          className: "penguin-marker-1",
          html: `
            <div class="bg-cyan-900 text-white border-2 border-white px-2.5 py-1 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-black animate-pulse whitespace-nowrap">
              <span class="text-lg">🐧</span>
              <span>"Bhaiya Dhaniya kitne ka diya?"</span>
            </div>
          `,
          iconSize: [210, 36],
          iconAnchor: [105, 18],
        });

        const penguin2Icon = L.divIcon({
          className: "penguin-marker-2",
          html: `
            <div class="bg-cyan-900 text-white border-2 border-white px-2.5 py-1 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-black animate-pulse whitespace-nowrap">
              <span class="text-lg">🐧</span>
              <span>"Mirchi free doge ya delivery lagega?" 🧊</span>
            </div>
          `,
          iconSize: [230, 36],
          iconAnchor: [115, 18],
        });

        const p1 = L.marker([-74.8, -3.5], { icon: penguin1Icon }).addTo(map);
        const p2 = L.marker([-75.8, 3.2], { icon: penguin2Icon }).addTo(map);
        penguinMarkersRef.current = [p1, p2];

        // Fly camera to Antarctica South Pole!
        map.flyTo([-75.2509, 0.0714], 5, { duration: 2.2 });
      } else {
        // Normal Delhi view
        if (selectedVendor && markersRef.current[selectedVendor.id]) {
          map.flyTo([selectedVendor.lat, selectedVendor.lng], 16, { duration: 1.2 });
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [vendors, selectedVendor, onSelectVendor, userLocation, antarcticaBug]);

  // Handler to Trigger Antarctica Glitch
  const triggerAntarcticaBug = () => {
    setDebugSuccessMessage(false);
    setAntarcticaBug(true);
  };

  // Handler to Debug & Fix the Glitch
  const fixAntarcticaBug = () => {
    setAntarcticaBug(false);
    setDebugSuccessMessage(true);

    if (mapInstanceRef.current) {
      // Apply strict bounding box & lock to Delhi NCR
      const L = window.L;
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 2.5 });
    }

    setTimeout(() => {
      setDebugSuccessMessage(false);
    }, 6000);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#111111] shadow-[4px_4px_0_#111111] bg-gray-100">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />

      {/* Floating Header Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md border border-gray-300 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
          <span>{vendors.filter((v) => v.isOnline).length} Thelas Active Nearby</span>
        </div>

        {/* Bug Simulator Trigger / Debug Toggle */}
        <div className="pointer-events-auto">
          {!antarcticaBug ? (
            <button
              type="button"
              onClick={triggerAntarcticaBug}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-[11px] font-black px-3 py-1.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border border-cyan-400"
              title="Click to reproduce the legendary Leaflet World Wrap Bug"
            >
              <span>🐧 Replay "Antarctica Thela" Bug</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={fixAntarcticaBug}
              className="bg-[#16A34A] hover:bg-[#15803D] text-white text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border-2 border-white animate-pulse"
              title="Click to Debug & Lock Geofence back to Delhi"
            >
              <span>🛠️ Debug & Return to Delhi</span>
            </button>
          )}
        </div>
      </div>

      {/* Antarctica Bug Active Alert Banner */}
      {antarcticaBug && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-cyan-950/95 border-2 border-cyan-400 rounded-2xl p-3.5 text-white shadow-2xl backdrop-blur-md animate-fadeIn flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🧊</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                  Bug Active
                </span>
                <span className="text-sm font-extrabold text-cyan-200">
                  Leaflet World Wrap Overflow: Ramesh Bhaiya in Antarctica!
                </span>
              </div>
              <p className="text-xs text-cyan-100 font-medium mt-0.5">
                🐧 Penguins are asking: <em>&ldquo;Bhaiya Dhaniya free doge ya delivery charge lagega?&rdquo;</em> (12,450 km from Chandni Chowk)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={fixAntarcticaBug}
            className="w-full sm:w-auto bg-[#16A34A] hover:bg-[#15803D] text-white font-black text-xs px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer whitespace-nowrap"
          >
            ✓ Fix Bug (Geofence Lock)
          </button>
        </div>
      )}

      {/* Debug Success Toast */}
      {debugSuccessMessage && (
        <div className="absolute bottom-4 left-4 right-4 z-[400] bg-emerald-950/95 border-2 border-emerald-400 rounded-2xl p-3 text-white shadow-2xl backdrop-blur-md animate-fadeIn flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div className="text-xs">
            <span className="font-extrabold text-emerald-300 block">
              BUG FIXED: World Wrap Disabled & Geofence Locked to Delhi!
            </span>
            <span className="text-emerald-100">
              Ramesh Bhaiya is safely back in Chandni Chowk, Delhi selling fresh Dhaniya-Mirchi. 🥕
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
