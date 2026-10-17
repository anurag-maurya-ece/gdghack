"use client";

import React, { useEffect, useRef } from "react";
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
        });

        // Add sleek zoom control at bottom right
        L.control.zoom({ position: "bottomright" }).addTo(map);

        // OpenStreetMap Standard tiles (free, crisp, no key required)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
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

      // Clean up previous vendor markers that might have been removed
      Object.keys(markersRef.current).forEach((id) => {
        if (!vendors.some((v) => v.id === id)) {
          map.removeLayer(markersRef.current[id]);
          delete markersRef.current[id];
        }
      });

      // Update or add vendor markers
      vendors.forEach((vendor) => {
        const isSelected = selectedVendor?.id === vendor.id;
        const iconHtml = `
          <div class="thela-marker-wrapper group cursor-pointer transition-transform duration-300 ${isSelected ? "scale-125 z-50" : "hover:scale-110"}">
            <div class="relative flex flex-col items-center">
              <!-- Live radar pulse ring -->
              <div class="absolute -top-1 w-10 h-10 rounded-full bg-[#22C55E]/20 animate-ping pointer-events-none"></div>

              <!-- Cart Badge -->
              <div class="relative px-2.5 py-1 rounded-2xl bg-[#0F172A] border-2 ${isSelected ? "border-[#22C55E] ring-4 ring-[#22C55E]/30" : "border-[#111111]"} shadow-[2px_2px_0_#111111] flex items-center gap-1.5 text-white">
                <span class="text-base">${vendor.avatar || "🛒"}</span>
                <div class="flex flex-col text-left leading-none">
                  <span class="text-[10px] font-black tracking-wide text-[#22C55E] truncate max-w-[80px]">${vendor.name.split(" ")[0]}</span>
                  <span class="text-[8px] font-bold text-gray-300">${vendor.distanceMeters}m</span>
                </div>
              </div>

              <!-- Pin pointer arrow -->
              <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-[#0F172A] -mt-[1px]"></div>
            </div>
          </div>
        `;

        const vendorIcon = L.divIcon({
          className: `custom-thela-pin-${vendor.id}`,
          html: iconHtml,
          iconSize: [100, 48],
          iconAnchor: [50, 44],
        });

        if (markersRef.current[vendor.id]) {
          // Update position smoothly
          markersRef.current[vendor.id].setLatLng([vendor.lat, vendor.lng]);
          markersRef.current[vendor.id].setIcon(vendorIcon);
        } else {
          const marker = L.marker([vendor.lat, vendor.lng], { icon: vendorIcon }).addTo(map);
          marker.on("click", () => {
            onSelectVendor(vendor);
          });
          markersRef.current[vendor.id] = marker;
        }
      });

      // Fly to selected vendor smoothly if selected
      if (selectedVendor && markersRef.current[selectedVendor.id]) {
        map.flyTo([selectedVendor.lat, selectedVendor.lng], 16, { duration: 1.2 });
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [vendors, selectedVendor, onSelectVendor, userLocation]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-2 border-[#111111] shadow-[4px_4px_0_#111111] bg-gray-100">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />

      {/* Floating Map Badges */}
      <div className="absolute top-4 left-4 z-[400] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="pointer-events-auto bg-[#0F172A]/90 backdrop-blur-md border border-gray-700 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
          <span>{vendors.filter((v) => v.isOnline).length} Thelas Active Nearby</span>
        </div>
      </div>
    </div>
  );
}
