"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

function isValidCoord(lat: any, lng: any): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

const DESTINATION_FALLBACK_COORDS: Record<string, [number, number]> = {
  "manali": [32.2396, 77.1887],
  "delhi": [28.6139, 77.2090],
  "new delhi": [28.6139, 77.2090],
  "jaipur": [26.9124, 75.7873],
  "udaipur": [24.5854, 73.7125],
  "jodhpur": [26.2389, 73.0243],
  "jaisalmer": [26.9157, 70.9083],
  "shimla": [31.1048, 77.1734],
  "dharamshala": [32.2190, 76.3234],
  "rishikesh": [30.0869, 78.2676],
  "nainital": [29.3919, 79.4542],
  "mussoorie": [30.4598, 78.0644],
  "goa": [15.2993, 74.1240],
  "mumbai": [19.0760, 72.8777],
  "pune": [18.5204, 73.8567],
  "bengaluru": [12.9716, 77.5946],
  "coorg": [12.3375, 75.8069],
  "ooty": [11.4102, 76.6950],
  "munnar": [10.0889, 77.0595],
  "kochi": [9.9312, 76.2673],
  "varanasi": [25.3176, 82.9739],
  "agra": [27.1767, 78.0081],
  "amritsar": [31.6340, 74.8723],
  "srinagar": [34.0837, 74.7973],
  "leh": [34.1526, 77.5771]
};

const HotelIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AttractionIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const RestaurantIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const EmergencyIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AirportIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const AIRPORT_COORDS: Record<string, [number, number]> = {
  "DEL": [28.5562, 77.1000],
  "BOM": [19.0896, 72.8656],
  "BLR": [13.1986, 77.7066],
  "JAI": [26.8242, 75.8122],
  "AGR": [27.1558, 77.9608],
  "PAT": [25.5912, 85.0881],
  "GAY": [24.7447, 84.9512],
  "COK": [10.1520, 76.4019]
};

function ChangeView({ center, coords }: { center: [number, number]; coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    try {
      const validCoords = (coords || []).filter(
        (c) => Array.isArray(c) && c.length === 2 && isValidCoord(c[0], c[1])
      );
      if (validCoords.length > 1) {
        const bounds = L.latLngBounds(validCoords);
        if (bounds && bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
          return;
        }
      }
      if (Array.isArray(center) && center.length === 2 && isValidCoord(center[0], center[1])) {
        map.setView(center, 11);
      }
    } catch (err) {
      console.warn("Leaflet ChangeView error guarded:", err);
    }
  }, [center, coords, map]);
  return null;
}

interface MapProps {
  hotel?: { lat?: number; lng?: number; name?: string } | null;
  days?: Array<{
    day_number?: number;
    day?: number;
    schedule?: Array<{ lat?: number; lng?: number; name?: string; category?: string; start_time?: string; activity?: string; location?: string }>;
    timeline?: Array<{ lat?: number; lng?: number; name?: string; category?: string; start_time?: string; activity?: string; location?: string }>;
  }>;
  emergencyServices?: Array<{ lat?: number; lng?: number; name?: string; distance_km?: number }> | null;
  flight?: { origin_airport?: string; destination_airport?: string; flight_number?: string } | null;
  destCoords?: { lat?: number; lng?: number } | null;
  destinationName?: string;
}

export default function MapComponent({ hotel, days, emergencyServices, flight, destCoords, destinationName }: MapProps) {
  // Resolve base coordinate fallback
  const fallbackKey = (destinationName || "").toLowerCase().trim();
  const knownCityCoord = DESTINATION_FALLBACK_COORDS[fallbackKey];
  const defaultCenter: [number, number] = (destCoords && isValidCoord(destCoords.lat, destCoords.lng))
    ? [destCoords.lat, destCoords.lng]
    : knownCityCoord || [28.6139, 77.2090];

  const allCoords: [number, number][] = [];
  const markers: { lat: number; lng: number; name: string; type: "hotel" | "attraction" | "restaurant" | "emergency" | "airport"; info?: string }[] = [];
  const flightCoords: [number, number][] = [];
  const [osrmRoute, setOsrmRoute] = useState<[number, number][]>([]);

  // 1. Add Flight Path
  if (flight) {
    const orig_code = flight.origin_airport || "";
    const dest_code = flight.destination_airport || "";
    const orig_c = AIRPORT_COORDS[orig_code];
    const dest_c = AIRPORT_COORDS[dest_code];

    if (orig_c && dest_c && isValidCoord(orig_c[0], orig_c[1]) && isValidCoord(dest_c[0], dest_c[1])) {
      markers.push({ lat: orig_c[0], lng: orig_c[1], name: `Origin Airport: ${orig_code}`, type: "airport", info: "Flight departure origin point." });
      markers.push({ lat: dest_c[0], lng: dest_c[1], name: `Destination Airport: ${dest_code}`, type: "airport", info: "Flight arrival gateway." });
      flightCoords.push(orig_c);
      flightCoords.push(dest_c);
      allCoords.push(orig_c);
      allCoords.push(dest_c);
    }
  }

  // 2. Add Hotel Stay with safe fallback
  if (hotel) {
    let hLat = hotel.lat;
    let hLng = hotel.lng;
    if (!isValidCoord(hLat, hLng)) {
      hLat = defaultCenter[0] + 0.004;
      hLng = defaultCenter[1] + 0.004;
    }
    if (isValidCoord(hLat, hLng)) {
      markers.push({ lat: hLat, lng: hLng, name: hotel.name || "Accommodation Stay", type: "hotel", info: "Verified Accommodation" });
      allCoords.push([hLat, hLng]);
    }
  }

  // 3. Add Attractions & Restaurants with safe fallback
  (days || []).forEach((day, dIdx) => {
    const dayNum = day.day_number || day.day || (dIdx + 1);
    const scheduleItems = day.schedule || day.timeline || [];
    scheduleItems.forEach((item, itemIdx) => {
      let iLat = item.lat;
      let iLng = item.lng;
      if (!isValidCoord(iLat, iLng)) {
        const angle = ((dIdx * 3 + itemIdx) * 60 * Math.PI) / 180;
        const radius = 0.012 + (itemIdx * 0.007);
        iLat = defaultCenter[0] + Math.sin(angle) * radius;
        iLng = defaultCenter[1] + Math.cos(angle) * radius;
      }
      if (isValidCoord(iLat, iLng)) {
        const markerType = item.category === "food" ? "restaurant" : "attraction";
        markers.push({
          lat: iLat,
          lng: iLng,
          name: item.name || item.activity || "Sightseeing Destination",
          type: markerType,
          info: item.start_time ? `Day ${dayNum} at ${item.start_time}` : `Day ${dayNum}`
        });
        allCoords.push([iLat, iLng]);
      }
    });
  });

  // 4. Add Emergency coordinates if SOS is active
  if (Array.isArray(emergencyServices)) {
    emergencyServices.forEach((serv) => {
      if (isValidCoord(serv.lat, serv.lng)) {
        markers.push({
          lat: serv.lat,
          lng: serv.lng,
          name: serv.name || "Emergency Medical Station",
          type: "emergency",
          info: `Emergency support (${serv.distance_km || 0} km)`
        });
        allCoords.push([serv.lat, serv.lng]);
      }
    });
  }

  // Fetch OSRM polyline path
  useEffect(() => {
    const fetchOSRMRoute = async () => {
      const roadCoords = allCoords.filter(c => {
        if (flightCoords.length === 2) {
          return c !== flightCoords[0] && c !== flightCoords[1];
        }
        return true;
      });

      if (roadCoords.length < 2) {
        setOsrmRoute([]);
        return;
      }

      const coordStr = roadCoords.slice(0, 15).map(c => `${c[1]},${c[0]}`).join(";");
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`);
        if (res.status === 200) {
          const data = await res.json();
          const routeGeom = data.routes[0]?.geometry?.coordinates;
          if (routeGeom) {
            const formatted: [number, number][] = routeGeom
              .filter((c: any) => Array.isArray(c) && c.length === 2 && isValidCoord(c[1], c[0]))
              .map((c: any) => [c[1], c[0]]);
            setOsrmRoute(formatted);
            return;
          }
        }
      } catch (e) {
        console.error("OSRM Route lookup fallback:", e);
      }
      setOsrmRoute([]);
    };

    fetchOSRMRoute();
  }, [hotel, days, emergencyServices, flight]);

  // Ensure center is strictly a valid [number, number]
  const validCoordsList = allCoords.filter(c => isValidCoord(c[0], c[1]));
  const center: [number, number] = validCoordsList.length > 0 ? validCoordsList[0] : defaultCenter;

  return (
    <div className="w-full h-full min-h-[420px] rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative z-0 bg-[#090b10]">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%", background: "#090b10" }}
        scrollWheelZoom={true}
      >
        {/* Sleek Dark Canvas Map Tiles — 100% Watermark Free */}
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />
        <TileLayer
          attribution=""
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={16}
        />

        {markers
          .filter(marker => isValidCoord(marker.lat, marker.lng))
          .map((marker, idx) => {
            let icon = AttractionIcon;
            if (marker.type === "hotel") icon = HotelIcon;
            else if (marker.type === "restaurant") icon = RestaurantIcon;
            else if (marker.type === "emergency") icon = EmergencyIcon;
            else if (marker.type === "airport") icon = AirportIcon;

            return (
              <Marker key={`marker-${marker.lat}-${marker.lng}-${idx}`} position={[marker.lat, marker.lng]} icon={icon}>
                <Popup className="dark-leaflet-popup">
                  <div className="text-xs p-1">
                    <span className="font-bold text-slate-900 block">{marker.name}</span>
                    <p className="text-slate-600 m-0 mt-0.5">{marker.info}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

        {/* Draw Flight Path Line */}
        {flightCoords.length === 2 && flightCoords.every(c => isValidCoord(c[0], c[1])) && (
          <Polyline
            positions={flightCoords}
            color="#a78bfa"
            weight={4}
            opacity={0.95}
            dashArray="8, 8"
          />
        )}

        {/* Draw Real OSRM Road Route Path */}
        {osrmRoute.length > 1 && osrmRoute.every(c => isValidCoord(c[0], c[1])) ? (
          <Polyline
            positions={osrmRoute}
            color="#38bdf8"
            weight={5}
            opacity={0.95}
          />
        ) : (
          /* Fallback straight dashed lines */
          validCoordsList.length > 1 && (
            <Polyline
              positions={validCoordsList.filter(c => !flightCoords.includes(c))}
              color="#38bdf8"
              weight={4}
              opacity={0.85}
              dashArray="6, 6"
            />
          )
        )}

        <ChangeView center={center} coords={validCoordsList} />
      </MapContainer>
    </div>
  );
}
