import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation, Store } from "lucide-react";
import type { StorageFacility } from "../types/facility";

interface FacilityLocationCardProps {
  facilities: StorageFacility[];
  selectedFacility: StorageFacility;
  onSelectFacility?: (facility: StorageFacility) => void;
}

// Custom Active Pin (Brand Accent Orange: #e68e0e)
const activeIcon = L.divIcon({
  className: "custom-active-pin",
  html: `<div style="
    background-color: #e68e0e; 
    width: 38px; 
    height: 38px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border: 3px solid #ffffff; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// Custom Secondary Pin (Brand Deep Green: #0a4022)
const defaultIcon = L.divIcon({
  className: "custom-default-pin",
  html: `<div style="
    background-color: #0a4022; 
    width: 26px; 
    height: 26px; 
    border-radius: 50%; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  ">
    <div style="width: 8px; height: 8px; background-color: #ffffff; border-radius: 50%;"></div>
  </div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

// Smoothly Pans camera to selected coordinates
function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], 12, {
      duration: 1.2,
    });
  }, [lat, lng, map]);

  return null;
}

export default function FacilityLocationCard({
  facilities,
  selectedFacility,
  onSelectFacility,
}: FacilityLocationCardProps) {
  return (
    <div className="">
      <h3 className="text-xl font-semibold text-text-main mb-4 font-sans">
        Location
      </h3>

      <div className="w-full rounded-3xl overflow-hidden border border-border-light bg-surface-card shadow-xs">
        {/* Map View Wrapper */}
        <div className="w-full h-[280px] sm:h-[340px] relative z-0">
          <MapContainer
            center={[selectedFacility.lat, selectedFacility.lng]}
            zoom={12}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapRecenter lat={selectedFacility.lat} lng={selectedFacility.lng} />

            {facilities.map((facility) => {
              const isSelected = facility.id === selectedFacility.id;
              return (
                <Marker
                  key={facility.id}
                  position={[facility.lat, facility.lng]}
                  icon={isSelected ? activeIcon : defaultIcon}
                  eventHandlers={{
                    click: () => onSelectFacility?.(facility),
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs">
                      <p className="font-semibold text-brand-primary">{facility.name}</p>
                      <p className="text-text-subtle mt-0.5">{facility.locationName}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Info Footer Bar (Matches Figma Design) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-card border-t border-border-light">
          {/* Driving Directions */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary shrink-0">
              <Navigation className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-main">
                Driving directions
              </h4>
              <p className="text-xs text-text-subtle mt-1 leading-relaxed">
                {selectedFacility.drivingDirections}
              </p>
            </div>
          </div>

          {/* Nearest Markets */}
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary shrink-0">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-main">
                Nearest markets
              </h4>
              <div className="text-xs text-text-subtle mt-1 space-y-1">
                {selectedFacility.nearestMarkets.map((market, idx) => (
                  <p key={idx}>
                    <span className="font-medium text-text-main">{market.name}</span> – {market.distance} ({market.duration})
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}