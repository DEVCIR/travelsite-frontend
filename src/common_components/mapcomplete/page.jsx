"use client"
import dynamic from "next/dynamic"

// Dynamically import the map to prevent SSR issues
const MapComplete = dynamic(() => import("../../components/ui/map-complete-leaflet"), {
  ssr: false,
  loading: () => (
    <div className="mt-0">
      <div className="relative bg-white max-md:rounded-2xl shadow-lg overflow-hidden">
        <div className="relative h-[55rem] sm:h-[40rem] md:h-[85rem] lg:h-[56rem] xl:h-[146rem] flex items-center justify-center bg-gray-100">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    </div>
  ),
})

export default function MapCompleteWrapper({ from, to, stops }) {
  return <MapComplete from={from} to={to} stops={stops} />
}
