"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { MapPin, LocateFixed, Loader2 } from "lucide-react";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  value: LatLng | null;
  onChange: (location: LatLng) => void;
  required?: boolean;
}

export function LocationPicker({ value, onChange, required }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  const updateMarker = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (L: any, map: any, latlng: LatLng) => {
      if (markerRef.current) {
        markerRef.current.setLatLng([latlng.lat, latlng.lng]);
      } else {
        const icon = L.divIcon({
          html: `<div style="
            width:36px;height:36px;
            background:linear-gradient(135deg,#1a1a1a,#b45309);
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 4px 12px rgba(0,0,0,0.35);
          "></div>`,
          className: "",
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });
        markerRef.current = L.marker([latlng.lat, latlng.lng], { icon }).addTo(map);
      }
      map.setView([latlng.lat, latlng.lng], map.getZoom() < 13 ? 13 : map.getZoom());
    },
    []
  );

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let isMounted = true;

    import("leaflet").then((L) => {
      if (!isMounted || !mapRef.current || mapInstanceRef.current) return;

      // Fix default icon paths for Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [30.0444, 31.2357], // Cairo default
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // If value already set, place marker
      if (value) {
        updateMarker(L, map, value);
      }

      // Click to place marker
      map.on("click", (e: { latlng: { lat: number; lng: number } }) => {
        const latlng: LatLng = { lat: parseFloat(e.latlng.lat.toFixed(6)), lng: parseFloat(e.latlng.lng.toFixed(6)) };
        updateMarker(L, map, latlng);
        onChange(latlng);
      });

      setIsMapReady(true);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes to map
  useEffect(() => {
    if (!mapInstanceRef.current || !value || !isMapReady) return;
    import("leaflet").then((L) => {
      updateMarker(L, mapInstanceRef.current, value);
    });
  }, [value, isMapReady, updateMarker]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latlng: LatLng = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        };
        onChange(latlng);
        if (mapInstanceRef.current) {
          import("leaflet").then((L) => {
            updateMarker(L, mapInstanceRef.current, latlng);
          });
        }
        setIsLocating(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please allow location access or click on the map."
            : "Unable to retrieve your location. Click on the map instead."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-amber-600" />
          <span className="text-sm font-medium text-slate-700">
            Your Location
            {required && <span className="ml-1 text-amber-600">*</span>}
          </span>
        </div>
        <button
          type="button"
          onClick={detectLocation}
          disabled={isLocating}
          className="
            inline-flex items-center gap-1.5 rounded-lg border border-amber-200
            bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700
            hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-150
          "
        >
          {isLocating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LocateFixed className="h-3.5 w-3.5" />
          )}
          {isLocating ? "Detecting…" : "Use My Location"}
        </button>
      </div>

      {/* Map container */}
      <div className="relative overflow-hidden rounded-xl border border-slate-200 shadow-sm">
        <div ref={mapRef} style={{ height: "260px", width: "100%" }} />
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          </div>
        )}
        {/* Hint overlay */}
        {isMapReady && !value && (
          <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm whitespace-nowrap">
            Click on the map to set your location
          </div>
        )}
      </div>

      {/* Coordinates display */}
      {value ? (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>
            <span className="font-semibold">Lat:</span> {value.lat.toFixed(5)} &nbsp;
            <span className="font-semibold">Lng:</span> {value.lng.toFixed(5)}
          </span>
          <span className="ml-auto text-green-500 font-medium">✓ Location set</span>
        </div>
      ) : (
        required && (
          <p className="text-xs text-slate-400">
            Click the map or use &ldquo;Use My Location&rdquo; to set your coordinates.
          </p>
        )
      )}

      {locationError && (
        <p className="text-xs text-red-500">{locationError}</p>
      )}
    </div>
  );
}
