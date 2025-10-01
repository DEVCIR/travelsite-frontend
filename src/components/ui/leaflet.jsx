"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useJsApiLoader,
} from "@react-google-maps/api";
import { SearchIcon } from "lucide-react";

const GOOGLE_MAPS_API_KEY = "AIzaSyDmeFbM5UZEg91Nt6GSLbsLAOdP11RYDlk";

const containerStyle = {
  width: "100%",
  height: "400px", // h-56
  maxWidth: "100%",
};

export default function GoogleMapsComponent({ onRouteInfoChange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const [mapHeight, setMapHeight] = useState("400px");

  useEffect(() => {
    const updateMapHeight = () => {
      const widthInRem = window.innerWidth / parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (widthInRem >= 240) {
        setMapHeight("1000px");
      } else if (widthInRem >= 160) {
        setMapHeight("800px");
      } else if (widthInRem >= 120) {
        setMapHeight("600px");
      } else {
        setMapHeight("400px");
      }
    };

    updateMapHeight(); // Initial check
    window.addEventListener("resize", updateMapHeight);
    return () => window.removeEventListener("resize", updateMapHeight);
  }, []);

  // Get data from URL parameters
  const stops = useMemo(() => {
    const stopsArray = [];
    let i = 1;
    while (searchParams.get(`stop${i}`)) {
      stopsArray.push(searchParams.get(`stop${i}`));
      i++;
    }
    return stopsArray;
  }, [searchParams]);

  // Compose all locations
  const locations = useMemo(
    () => [from, ...stops, to].filter(Boolean),
    [from, stops, to]
  );

  // State for directions
  const [directions, setDirections] = useState(null);
  const [routeInfo, setRouteInfo] = useState({ distance: "", duration: "" });
  const [chargingStations, setChargingStations] = useState([]);
  const [hotels, setHotels] = useState([]);

  // Only for initial center/zoom
  const [initialCenter, setInitialCenter] = useState({
    lat: 25.276987,
    lng: 55.296249,
  }); // Dubai fallback
  const initialZoom = 12;
  const mapRef = useRef(null);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  // Geocode first location for initial center (only on first load)
  useEffect(() => {


    if (!from) return;
    async function geocodeFirst() {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          from
        )}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await resp.json();
      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        setInitialCenter({ lat, lng });
      }
    }
    geocodeFirst();
    // eslint-disable-next-line
  }, [from]);

  // Calculate directions
  useEffect(() => {
    if (!isLoaded || !from || !to) return;

    const timerId = setTimeout(() => {
      const google = window.google;
      const DirectionsService = new google.maps.DirectionsService();
      const waypoints = stops
        .filter(Boolean)
        .map((stop) => ({ location: stop, stopover: true }));
      DirectionsService.route(
        {
          origin: from,
          destination: to,
          waypoints: waypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
            findPlacesAlongRoute(result.routes[0], "electric_vehicle_charging_station", setChargingStations);
            findPlacesAlongRoute(result.routes[0], "lodging", setHotels);
            if (result.routes[0] && result.routes[0].legs[0]) {
              let totalDistance = 0;
              let totalDuration = 0;
              result.routes[0].legs.forEach((leg) => {
                totalDistance += leg.distance.value;
                totalDuration += leg.duration.value;
              });
              const newDistance = (totalDistance / 1000).toFixed(1) + " km";
              const hours = Math.floor(totalDuration / 3600);
              const minutes = Math.round((totalDuration % 3600) / 60);
              const newDuration =
                (hours > 0 ? hours + " hr " : "") +
                (minutes > 0 ? minutes + " min" : "");

              console.log("newDistance: ", newDistance);
              console.log("newDuration", newDuration);

              setRouteInfo({ distance: newDistance, duration: newDuration });
            }
          } else {
            setDirections(null);
            setRouteInfo({ distance: "", duration: "" });
          }
        }
      );
    }, 300);

    return () => clearTimeout(timerId);
  }, [isLoaded, from, to, stops]);

  useEffect(() => {
    if (
      routeInfo.distance &&
      routeInfo.duration &&
      typeof onRouteInfoChange === "function"
    ) {
      onRouteInfoChange(routeInfo.distance, routeInfo.duration);
    }
  }, [routeInfo, onRouteInfoChange]);

  const handleViewFullMap = useCallback(() => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    stops.forEach((stop, index) => {
      params.set(`stop${index + 1}`, stop);
    });
    const otherParams = [
      "maxDistance",
      "autonomy",
      "needHotel",
      "travellers",
      "startDate",
    ];
    otherParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) params.set(param, value);
    });
    router.push(`/fullmap?${params.toString()}`);
  }, [from, to, stops, searchParams, router]);

  const findPlacesAlongRoute = useCallback((route, type, setter) => {
    if (!route || !window.google) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const path = route.overview_path;
    const step = Math.max(1, Math.floor(path.length / 10));
    const allPlaces = [];

    for (let i = 0; i < path.length; i += step) {
      const point = path[i];

      service.nearbySearch(
        {
          location: point,
          radius: 5000,
          type: type,
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
              // Filter out permanently closed businesses using business_status
              if (place.business_status === 'OPERATIONAL' &&
                place.types &&
                place.types.includes(type) &&
                !allPlaces.some(p => p.place_id === place.place_id)) {
                allPlaces.push({
                  ...place,
                  position: place.geometry.location,
                });
              }
            });

            setter((prev) => {
              const newPlaces = [...allPlaces];
              return newPlaces.filter((place, index, self) =>
                index === self.findIndex(p => p.place_id === place.place_id)
              );
            });
          }
        }
      );
    }
  }, []);

  const purplePinSVG = (name) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 24 24">
    <path fill="#9C27B0" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    <text x="12" y="22" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle" fill="white">${name.substring(0, 8)}</text>
  </svg>
`;

  const bluePinSVG = (name) => `
  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 24 24">
    <path fill="#4CAF50" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    <text x="12" y="22" font-family="Arial" font-size="8" font-weight="bold" text-anchor="middle" fill="white">${name.substring(0, 8)}</text>
  </svg>
`;

  return (
    <div className="mt-0">
      <div className="relative bg-white max-md:rounded-2xl fhd:h-[600px] 2k:h-[800px] 4k:h-[1000px] overflow-hidden shadow-lg">
        <div
          className="relative h-[400px] fhd:h-[600px]"
          style={{ height: `400px`, minHeight: 300, width: "100%" }}
        >
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{
                ...containerStyle,
                height: mapHeight,
                minHeight: 300,
                width: "100%",
              }}
              defaultCenter={initialCenter}
              defaultZoom={initialZoom}
              onLoad={(map) => {
                mapRef.current = map;
              }}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                scrollwheel: true,
                draggable: true,
                gestureHandling: "auto",
              }
              }
            >
              {/* Directions route */}
              {directions && (
                <DirectionsRenderer
                  directions={directions}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#F96C41",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}

              {/* EV Charging Stations */}
              {chargingStations.map((station, index) => (
                <Marker
                  key={`${station.place_id}_${index}`}
                  position={station.position}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      bluePinSVG(station.name)
                    )}`,
                    scaledSize: new window.google.maps.Size(40, 50),
                    anchor: new window.google.maps.Point(20, 50),
                  }}
                  title={station.name}
                />
              ))}

              {hotels.map((hotel, index) => (
                <Marker
                  key={`hotel_${hotel.place_id}_${index}`}
                  position={hotel.position}
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
                      purplePinSVG(hotel.name)
                    )}`,
                    scaledSize: new window.google.maps.Size(40, 50),
                    anchor: new window.google.maps.Point(20, 50),
                  }}
                  title={`Hotel: ${hotel.name}`}
                />
              ))}
            </GoogleMap>
          ) : (
            <div className="relative h-full flex items-center justify-center bg-gray-100">
              <div className="text-gray-500">Loading map...</div>
            </div>
          )}
          {/* View Full Map button */}
          <button
            className="absolute top-3 right-3 fhd:top-5 fhd:right-5 2k:top-10 2k:right-10 4k:top-18 4k:right-18 cursor-pointer bg-white bg-opacity-90 hover:bg-opacity-100 transition-all duration-200 px-6 py-3 fhd:px-9 fhd:py-5 4k:px-12 4k:py-8 rounded-lg fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl shadow-md z-[1000]"
            onClick={handleViewFullMap}
          >
            <div className="flex items-center gap-1.5 fhd:gap-2 2k:gap-4">
              <SearchIcon className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12" />
              <span className="text-xs fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium text-gray-700">
                VIEW FULL MAP
              </span>
            </div>
          </button>

          <div className="absolute top-3 left-3 fhd:top-5 fhd:left-5 2k:top-7 2k:left-7 4k:top-9 4k:left-9 bg-white bg-opacity-90 rounded-lg shadow-md z-[1000] px-4 py-3 fhd:px-6 fhd:py-5 2k:px-8 2k:py-8 fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl fhd:shadow-lg 2k:shadow-xl 4k:shadow-2xl">
            <div className="flex flex-col gap-2 fhd:gap-3 2k:gap-4 4k:gap-6">
              <div className="flex items-center gap-2 fhd:gap-3 2k:gap-4 4k:gap-6">
                <div className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-10 4k:h-10 rounded-full bg-[#9C27B0]"></div>
                <span className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium">Hotels</span>
              </div>
              <div className="flex items-center gap-2 fhd:gap-3 2k:gap-4 4k:gap-6">
                <div className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-10 4k:h-10 rounded-full bg-[#4CAF50]"></div>
                <span className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium">Charging Stations</span>
              </div>
              <div className="flex items-center gap-2 fhd:gap-3 2k:gap-4 4k:gap-6">
                <div className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-10 4k:h-10 rounded-full bg-[#F96C41]"></div>
                <span className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium">Route</span>
              </div>
            </div>
          </div>

          {/* Cities Box */}
          <div className="absolute left-3 mt-3 fhd:mt-18 fhd:left-5 2k:mt-36 2k:left-7 4k:mt-48 4k:left-9" style={{ top: '94px' }}>
            <div className="bg-white bg-opacity-90 rounded-lg shadow-md fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl fhd:shadow-lg 2k:shadow-xl 4k:shadow-2xl z-[1000] px-4 py-3 fhd:px-6 fhd:py-5 2k:px-8 2k:py-8">
              <div className="flex flex-col gap-1 fhd:gap-3 2k:gap-4 4k:gap-6">
                <div className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium"><span className="font-semibold">From:</span> {from.split(',')[0] || '-'}</div>
                {stops.length > 0 && (
                  <div className="flex flex-col gap-0.5">
                    {stops.map((stop, idx) => (
                      <div key={idx} className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium">
                        <span className="font-semibold">Stop {idx + 1}:</span> {stop.split(',')[0]}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs fhd:text-base 2k:text-2xl 4k:text-4xl font-medium"><span className="font-semibold">To:</span> {to.split(',')[0] || '-'}</div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}