"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";

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
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView(center, 10);
    }
  }, [center, coords, map]);
  return null;
}

interface MapProps {
  hotel: { lat: number; lng: number; name: string } | null;
  days: Array<{
    day_number: number;
    schedule: Array<{ lat: number; lng: number; name: string; category: string; start_time?: string }>;
  }>;
  emergencyServices: Array<{ lat: number; lng: number; name: string; distance_km: number }> | null;
  flight: { origin_airport: string; destination_airport: string; flight_number: string } | null;
}

export default function MapComponent({ hotel, days, emergencyServices, flight }: MapProps) {
  const defaultCenter: [number, number] = [28.6139, 77.2295];
  const allCoords: [number, number][] = [];
  const markers: { lat: number; lng: number; name: string; type: "hotel" | "attraction" | "restaurant" | "emergency" | "airport"; info?: string }[] = [];
  const flightCoords: [number, number][] = [];
  const [osrmRoute, setOsrmRoute] = useState<[number, number][]>([]);

  // 1. Add Flight Path
  if (flight) {
    const orig_code = flight.origin_airport;
    const dest_code = flight.destination_airport;
    const orig_c = AIRPORT_COORDS[orig_code];
    const dest_c = AIRPORT_COORDS[dest_code];

    if (orig_c && dest_c) {
      markers.push({ lat: orig_c[0], lng: orig_c[1], name: `Origin Airport: ${orig_code}`, type: "airport", info: "Flight departure origin point." });
      markers.push({ lat: dest_c[0], lng: dest_c[1], name: `Destination Airport: ${dest_code}`, type: "airport", info: "Flight arrival gateway." });
      flightCoords.push(orig_c);
      flightCoords.push(dest_c);
      allCoords.push(orig_c);
      allCoords.push(dest_c);
    }
  }

  // 2. Add Hotel Stay
  if (hotel) {
    markers.push({ lat: hotel.lat, lng: hotel.lng, name: hotel.name, type: "hotel", info: "Accommodation Stay" });
    allCoords.push([hotel.lat, hotel.lng]);
  }

  // 3. Add Attractions & Restaurants
  days.forEach((day) => {
    day.schedule.forEach((item) => {
      if (item.lat && item.lng) {
        const markerType = item.category === "food" ? "restaurant" : "attraction";
        markers.push({
          lat: item.lat,
          lng: item.lng,
          name: item.name,
          type: markerType,
          info: item.start_time ? `Day ${day.day_number} at ${item.start_time}` : `Day ${day.day_number}`
        });
        allCoords.push([item.lat, item.lng]);
      }
    });
  });

  // 4. Add Emergency coordinates if SOS is active
  if (emergencyServices) {
    emergencyServices.forEach((serv) => {
      markers.push({
        lat: serv.lat,
        lng: serv.lng,
        name: serv.name,
        type: "emergency",
        info: `Emergency support (${serv.distance_km} km)`
      });
      allCoords.push([serv.lat, serv.lng]);
    });
  }

  // Fetch OSRM polyline path
  useEffect(() => {
    const fetchOSRMRoute = async () => {
      const roadCoords = allCoords.filter(c => {
        // exclude flight coordinates to only calculate road transit path
        if (flightCoords.length === 2) {
          return c !== flightCoords[0] && c !== flightCoords[1];
        }
        return true;
      });

      if (roadCoords.length < 2) {
        setOsrmRoute([]);
        return;
      }

      // Max OSRM coordinates query limits safety
      const coordStr = roadCoords.slice(0, 15).map(c => `${c[1]},${c[0]}`).join(";");
      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`);
        if (res.status === 200) {
          const data = await res.json();
          const routeGeom = data.routes[0]?.geometry?.coordinates;
          if (routeGeom) {
            const formatted: [number, number][] = routeGeom.map((c: any) => [c[1], c[0]]);
            setOsrmRoute(formatted);
            return;
          }
        }
      } catch (e) {
        console.error("OSRM Route lookup failed, falling back to straight lines:", e);
      }
      setOsrmRoute([]);
    };

    fetchOSRMRoute();
  }, [hotel, days, emergencyServices, flight]);

  const center = allCoords.length > 0 ? allCoords[0] : defaultCenter;

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden shadow-inner relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, idx) => {
          let icon = AttractionIcon;
          if (marker.type === "hotel") icon = HotelIcon;
          else if (marker.type === "restaurant") icon = RestaurantIcon;
          else if (marker.type === "emergency") icon = EmergencyIcon;
          else if (marker.type === "airport") icon = AirportIcon;

          return (
            <Marker key={idx} position={[marker.lat, marker.lng]} icon={icon}>
              <Popup>
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">{marker.name}</span>
                  <p className="text-slate-500 m-0">{marker.info}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Draw Flight Path Line */}
        {flightCoords.length === 2 && (
          <Polyline
            positions={flightCoords}
            color="#4338ca"
            weight={5}
            opacity={0.9}
            dashArray="10, 10"
          />
        )}

        {/* Draw Real OSRM Road Route Path */}
        {osrmRoute.length > 0 ? (
          <Polyline
            positions={osrmRoute}
            color="#0ea5e9"
            weight={5}
            opacity={0.9}
          />
        ) : (
          /* Fallback straight dashed lines */
          allCoords.length > 1 && (
            <Polyline
              positions={allCoords.filter(c => !flightCoords.includes(c))}
              color="#0ea5e9"
              weight={4}
              opacity={0.8}
              dashArray="5, 5"
            />
          )
        )}

        <ChangeView center={center} coords={allCoords} />
      </MapContainer>
    </div>
  );
}
