"use client"
import { useEffect, useState } from "react"
import { Search, RotateCcw } from "lucide-react"

// Define default filter structure
const defaultFilters = {
  selectedRatings: [],
  minRating: 0,
  maxDistance: 50,
  amenities: [],
  chains: [],
  roomTypes: [],
  refundableOnly: false,
  name: "",
}

export default function HotelFilters({ initialFilters = defaultFilters, onApply = () => { }, onCancel = () => { } }) {
  // Merge initialFilters with defaults to ensure all properties exist
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    ...initialFilters,
  }))

  const [showMoreAmenities, setShowMoreAmenities] = useState(false)
  const [showMoreChains, setShowMoreChains] = useState(false)
  const [showMoreRoomTypes, setShowMoreRoomTypes] = useState(false)
  const [hotelName, setHotelName] = useState(initialFilters?.name || "")

  const allAmenities = [
    { name: "Air conditioning", count: 3 },
    { name: "Airport shuttle", count: 28 },
    { name: "Bar", count: 7 },
    { name: "Business center", count: 21 },
    { name: "Casino", count: 19 },
    { name: "Fitness center", count: 15 },
    { name: "Free WiFi", count: 32 },
    { name: "Pool", count: 12 },
  ]

  const allChains = [
    { name: "Inter", count: 3 },
    { name: "Carlson Hospitality", count: 28 },
    { name: "Every Hilton", count: 7 },
    { name: "Marriott Intl", count: 21 },
    { name: "Preferred Hotel Grp", count: 19 },
    { name: "Hyatt Hotels", count: 14 },
    { name: "Accor Hotels", count: 9 },
  ]

  const allRoomTypes = [
    { name: "2 double beds", count: 3 },
    { name: "2 queen beds", count: 28 },
    { name: "Double", count: 7 },
    { name: "Double/Twin", count: 21 },
    { name: "Family", count: 19 },
    { name: "King", count: 15 },
    { name: "Queen", count: 22 },
  ]

  const handleRatingChange = (rating) => {
    setFilters((prev) => {
      const currentRatings = prev.selectedRatings || []
      const newRatings = currentRatings.includes(rating)
        ? currentRatings.filter((r) => r !== rating)
        : [...currentRatings, rating]
      return { ...prev, selectedRatings: newRatings }
    })
  }

  const handleDistanceChange = (distance) => {
    setFilters((prev) => ({
      ...prev,
      maxDistance: Number(distance),
    }))
  }

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const currentAmenities = prev.amenities || []
      const newAmenities = currentAmenities.includes(amenity)
        ? currentAmenities.filter((a) => a !== amenity)
        : [...currentAmenities, amenity]
      return { ...prev, amenities: newAmenities }
    })
  }

  const handleChainToggle = (chain) => {
    setFilters((prev) => {
      const currentChains = prev.chains || []
      const newChains = currentChains.includes(chain)
        ? currentChains.filter((c) => c !== chain)
        : [...currentChains, chain]
      return { ...prev, chains: newChains }
    })
  }

  const handleRoomTypeToggle = (roomType) => {
  setFilters((prev) => {
    const currentRoomTypes = prev.roomTypes || []
    const newRoomTypes = currentRoomTypes.includes(roomType)
      ? currentRoomTypes.filter((r) => r !== roomType)
      : [...currentRoomTypes, roomType]
    return { ...prev, roomTypes: newRoomTypes }
  })
}


  const handleRefundableToggle = () => {
    setFilters((prev) => ({
      ...prev,
      refundableOnly: !prev.refundableOnly,
    }))
  }

  const handleApply = () => {
    onApply(filters)
  }

  const renderStars = (count) => {
    return Array.from({ length: count }, (_, i) => (
      <span key={i} className="text-orange-500 text-sm fhd:text-lg 4k:text-5xl">
        ★
      </span>
    ))
  }

  const handleNameChange = (e) => {
    const value = e.target.value
    setHotelName(value)
    setFilters((prev) => ({
      ...prev,
      name: value,
    }))
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    setHotelName("")
  }

  // Update filters when initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      const mergedFilters = {
        ...defaultFilters,
        ...initialFilters,
      }
      setFilters(mergedFilters)
      setHotelName(initialFilters.name || "")
    }
  }, [initialFilters])

  // Ensure filters has all required properties before rendering
  const safeFilters = {
    ...defaultFilters,
    ...filters,
  }

  console.log(safeFilters.roomTypes.includes(allRoomTypes.name))

  return (
    <div className="w-full bg-white p-6 space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl fhd:text-2xl 4k:text-5xl font-bold">Filters</h2>
          <button onClick={handleReset} className="flex items-center gap-1 text-orange-500 text-sm fhd:text-lg 4k:text-4xl font-medium cursor-pointer">
            <RotateCcw className="w-4 h-4 fhd:w-6 fhd:h-6 4k:w-10 4k:h-10" />
            Reset
          </button>
        </div>

        {/* General Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">General</h3>
          <div className="space-y-4 4k:space-y-5">
            <div>
              <label className="block text-sm fhd:text-lg 4k:text-4xl 4k:mt-4 text-gray-600 mb-2 4k:mb-4">Hotel Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter hotel name"
                  value={hotelName}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 fhd:py-3 4k:py-5 fhd:text-lg 4k:text-4xl border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
                <Search className="absolute right-3 top-2.5 h-4 w-4 fhd:w-6 fhd:h-6 fhd:top-3.5 4k:w-12 4k:h-12 4k:top-4.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Point of Interest Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">Distance from location</h3>
          <div className="flex items-center space-x-3">
            <input
              type="range"
              min="0"
              max="100"
              value={safeFilters.maxDistance}
              onChange={(e) => handleDistanceChange(e.target.value)}
              className="flex-1 h-2 4k:h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm fhd:text-lg 4k:text-4xl font-medium">{safeFilters.maxDistance} km</span>
          </div>
        </div>

        {/* Star Rating Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">Star rating</h3>
          <div className="space-y-3 4k:space-y-5">
            {[5, 4, 3, 2].map((rating) => (
              <div key={rating} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 fhd:w-6 fhd:h-6 4k:w-12 4k:h-12 rounded border-2 cursor-pointer flex items-center justify-center ${safeFilters.selectedRatings.includes(rating)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 bg-gray-100"
                      }`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    {safeFilters.selectedRatings.includes(rating) && (
                      <div className="w-2 h-2 fhd:w-4 fhd:h-4 4k:w-8 4k:h-8 bg-white rounded-sm 2k:rounded-lg 4k:rounded-full"></div>
                    )}
                  </div>
                  <div className="flex items-center">{renderStars(rating)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amenities Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">Amenities</h3>
          <div className="space-y-3 4k:space-y-5">
            {(showMoreAmenities ? allAmenities : allAmenities.slice(0, 5)).map((amenity) => (
              <div key={amenity.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 fhd:w-6 fhd:h-6 4k:w-12 4k:h-12 rounded border-2 cursor-pointer flex items-center justify-center ${safeFilters.amenities.includes(amenity.name)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 bg-gray-100"
                      }`}
                    onClick={() => handleAmenityToggle(amenity.name)}
                  >
                    {safeFilters.amenities.includes(amenity.name) && (
                      <div className="w-2 h-2 fhd:w-4 fhd:h-4 4k:w-8 4k:h-8 bg-white rounded-sm 2k:rounded-lg 4k:rounded-full"></div>
                    )}
                  </div>
                  <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-700">{amenity.name}</span>
                </div>
                <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-500">({amenity.count})</span>
              </div>
            ))}
            <button
              className="text-orange-500 text-sm fhd:text-lg 4k:text-4xl font-medium"
              onClick={() => setShowMoreAmenities(!showMoreAmenities)}
            >
              {showMoreAmenities ? "Show less" : "Show more"}
            </button>
          </div>
        </div>

        {/* Hotel Chain Group Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">Hotel chain group</h3>
          <div className="space-y-3 4k:space-y-5">
            {(showMoreChains ? allChains : allChains.slice(0, 5)).map((chain) => (
              <div key={chain.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 fhd:w-6 fhd:h-6 4k:w-12 4k:h-12 rounded border-2 cursor-pointer flex items-center justify-center ${safeFilters.chains.includes(chain.name)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 bg-gray-100"
                      }`}
                    onClick={() => handleChainToggle(chain.name)}
                  >
                    {safeFilters.chains.includes(chain.name) && <div className="w-2 h-2 fhd:w-4 fhd:h-4 4k:w-8 4k:h-8 bg-white rounded-sm 2k:rounded-lg 4k:rounded-full"></div>}
                  </div>
                  <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-700">{chain.name}</span>
                </div>
                <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-500">({chain.count})</span>
              </div>
            ))}
            <button className="text-orange-500 text-sm fhd:text-lg 4k:text-4xl font-medium" onClick={() => setShowMoreChains(!showMoreChains)}>
              {showMoreChains ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>

      {/* Room Filters */}
      <div className="space-y-6">
        <h2 className="text-lg fhd:text-xl 4k:text-5xl font-medium text-gray-900">Room Filters</h2>

        {/* General Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">General</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 4k:space-y-5">
              <div
                className={`w-4 h-4 fhd:w-6 fhd:h-6 4k:w-12 4k:h-12 rounded border-2 cursor-pointer flex items-center justify-center ${safeFilters.refundableOnly ? "bg-orange-500 border-orange-500" : "border-gray-300 bg-gray-100"
                  }`}
                onClick={handleRefundableToggle}
              >
                {safeFilters.refundableOnly && <div className="w-2 h-2 fhd:w-4 fhd:h-4 4k:w-8 4k:h-8 bg-white rounded-sm 2k:rounded-lg 4k:rounded-full"></div>}
              </div>
              <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-700">Refundable Room Only</span>
            </div>
          </div>
        </div>

        {/* Room Type Section */}
        <div className="border border-gray-200 rounded-lg p-4 space-y-4 4k:space-y-6">
          <h3 className="text-sm fhd:text-lg 4k:text-4xl font-medium text-gray-700 bg-gray-50 px-3 py-2 4k:py-4 rounded">Room type</h3>
          <div className="space-y-3 4k:space-y-5">
            {(showMoreRoomTypes ? allRoomTypes : allRoomTypes.slice(0, 5)).map((type) => (
              <div key={type.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-4 h-4 fhd:w-6 fhd:h-6 4k:w-12 4k:h-12 rounded border-2 cursor-pointer flex items-center justify-center ${safeFilters.roomTypes.includes(type.name)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300 bg-gray-100"
                      }`}
                    onClick={() => handleRoomTypeToggle(type.name)}
                  >
                    {safeFilters.roomTypes.includes(type.name) && <div className="w-2 h-2 fhd:w-4 fhd:h-4 4k:w-8 4k:h-8 bg-white rounded-sm 2k:rounded-lg 4k:rounded-full"></div>}

                  </div>
                  <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-700">{type.name}</span>
                </div>
                <span className="text-sm fhd:text-lg 4k:text-4xl text-gray-500">({type.count})</span>
              </div>
            ))}
            <button
              className="text-orange-500 text-sm fhd:text-lg 4k:text-4xl font-medium"
              onClick={() => setShowMoreRoomTypes(!showMoreRoomTypes)}
            >
              {showMoreRoomTypes ? "Show less" : "Show more"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <button className="px-4 py-3 fhd:py-4 fhd:text-lg 2k:py-5 2k:text-2xl 4k:py-10 4k:text-4xl  border border-gray-300 bg-transparent hover:bg-white/40 rounded-lg flex-1 cursor-pointer" onClick={onCancel}>
          Cancel
        </button>
        <button className="px-4 py-3 fhd:py-4 fhd:text-lg 2k:py-5 2k:text-2xl 4k:py-10 4k:text-4xl btn-gradient text-white rounded-lg flex-1 cursor-pointer" onClick={handleApply}>
          Apply Filters
        </button>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}