"use client"
import dynamic from "next/dynamic"

// Dynamically import the map to prevent SSR issues
const MapComponent = dynamic(() => import("../../components/ui/leaflet"), {
  ssr: false,
  loading: () => (
    <div className="mt-0">
      <div className="relative bg-white max-md:rounded-2xl overflow-hidden shadow-lg">
        <div className="relative h-56 sm:h-64 md:h-72 xl:h-[540px] flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    </div>
  ),
})

export default function Map({ onRouteInfoChange }) {
  return <MapComponent onRouteInfoChange={onRouteInfoChange} />
} 