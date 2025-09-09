"use client"
import { ListFilter, X } from "lucide-react"
import HotelCard from "../../components/ui/hotel-card"
import Navbar from "../../common_components/navbar/page"
import HotelFilters from "../../common_components/hotel-filters/page"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"
import Footer from "../../components/ui/footer"
import Rentals from "../../common_components/rentals/page"
import CarDiv from "../../common_components/cardiv/page"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { useRef } from "react"
import Navbar1 from "../../common_components/navbar1/page"

export default function PageWrapper() {
  return (
    <Suspense
      fallback={
        <motion.div
          className="text-gray-800 fhd:text-2xl 2k:text-4xl 4k:text-6xl text-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          Loading...
        </motion.div>
      }
    >
      <Page />
    </Suspense>
  )
}



function Page() {
  const searchParams = useSearchParams()
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    selectedRatings: [],
    minRating: 0,
    maxDistance: 100,
    amenities: [],
    chains: [],
    roomTypes: [],
    refundableOnly: false,
    name: "",
  })
  const [sortOption, setSortOption] = useState("recommended")
  const [allHotels, setAllHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [sortedHotels, setSortedHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const hasFetched = useRef(false) // To track if we've already fetched data

  // Check if required parameters exist
  useEffect(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from || !to) {
      router.push("/")
    }
  }, [searchParams, router])

  // If params are missing, return null (will redirect)
  if (!searchParams.get("from") || !searchParams.get("to")) {
    return null
  }



  const fromCity = searchParams.get("from")?.split(",")[0]
  const toCity = searchParams.get("to")?.split(",")[0]
  const travellers = parseInt(searchParams.get("travellers")?.split(" ")[0]) || 1
  const rooms = parseInt(searchParams.get("travellers")?.split(",")[1]?.split(" ")[1]) || 1
  const cityGeo = searchParams.get("geo")
  const hotelcity = searchParams.get("city")

  const stops = [
    searchParams.get("stop1")?.split(",")[0],
    searchParams.get("stop2")?.split(",")[0],
    searchParams.get("stop3")?.split(",")[0],
  ].filter(Boolean)

  // Function to fetch hotels from API
  const fetchHotels = useCallback(async () => {
    if (!cityGeo) {
      router.push("/");
      return;
    }
    if (hasFetched.current) return; // Skip if already fetched or no geo

    try {
      setLoading(true)
      const [lat, lon] = cityGeo.split(';')

      const { checkInDate, checkOutDate } = getDatesForAPI()

      const response = await fetch(
        `https://gimmonixapi.militaryfares.com/?a=evtrips&method=search&_q=${lat};${lon}|${checkInDate}|${checkOutDate}|${rooms}|${travellers}:0|25|1||US|hotel&lang=en&curr=USD`
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.status !== "OK" || !data.response) {
        throw new Error("Invalid API response")
      }

      // Take only first 6 hotels from API response
      const apiHotels = data.response.slice(0, 6).map((hotel, index) => ({
        id: hotel.hid || `api-${index}`,
        name: hotel.name,
        rating: hotel.stars || 3,
        address: hotel.location?.address || `${searchParams.get("city") || fromCity} City Center`,
        nights: parseInt(hotel.date?.nights) || 1,
        travelers: travellers,
        price: parseFloat(hotel.per_night_price) || 100,
        image: hotel.img || hotel.thumb || "/images/1.jpg",
        distance: parseFloat(hotel.location?.distance) || (index + 1) * 10,
        amenities: ["Air conditioning", "WiFi", "Parking"],
        chain: "Local Chain",
        roomType: hotel.rooms?.["@Name"] || "Standard",
        roomImage: hotel.rooms?.["@image"] ? hotel.rooms?.["@thumb"] : "/images/defaultroom.jpg",
        refundable: hotel.rooms?.["@Refundable"] === "true",
        city: searchParams.get("city") || fromCity,
        geo: cityGeo,
        checkin: checkInDate, // Store the geo with each hotel
        checkout: checkOutDate, // Store the geo with each hotel
      }))

      setAllHotels(apiHotels)
      setFilteredHotels(apiHotels)
      setSortedHotels(apiHotels)
      setLoading(false)
      hasFetched.current = true
    } catch (err) {
      console.error("Error fetching hotels:", err)
      setError(err.message)
      setLoading(false)
      hasFetched.current = true
    }
  }, [cityGeo, travellers, rooms, fromCity, searchParams])

  // Generate dates for API call
  const getDatesForAPI = useCallback(() => {
    // Get startDate from params, or use today if missing
    const startDateParam = searchParams.get("startDate");
    let startDate;
    if (startDateParam) {
      // Only use the date part (YYYY-MM-DD)
      const dateOnly = startDateParam.split("T")[0];
      startDate = new Date(dateOnly + "T00:00:00");
    } else {
      startDate = new Date();
    }

    // Format as YYYYMMDD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}${month}${day}`;
    };

    const checkInDate = formatDate(startDate);

    // Add 1 day for check-out
    const checkOut = new Date(startDate);
    checkOut.setDate(checkOut.getDate() + 1);
    const checkOutDate = formatDate(checkOut);

    return { checkInDate, checkOutDate };
  }, [searchParams]);

  // Fetch hotels when component mounts or geo changes
  useEffect(() => {
    fetchHotels()
  }, [fetchHotels])

  // Filter hotels
  useEffect(() => {
    const filtered = allHotels.filter((hotel) => {
      if (filters.name && !hotel.name.toLowerCase().includes(filters.name.toLowerCase())) {
        return false
      }
      if (filters.selectedRatings.length > 0 && !filters.selectedRatings.includes(Math.floor(hotel.rating))) {
        return false
      }
      if (hotel.distance > filters.maxDistance) {
        return false
      }
      if (filters.amenities.length > 0 && !filters.amenities.every((amenity) => hotel.amenities.includes(amenity))) {
        return false
      }
      if (filters.chains.length > 0 && !filters.chains.includes(hotel.chain)) {
        return false
      }
      if (filters.roomTypes.length > 0) {
        // Check if any of the selected room types appears in the hotel's roomType string
        const hasMatchingRoomType = filters.roomTypes.some((type) => {
          // Create a regex pattern to match the room type in different formats
          const pattern = new RegExp(
            // Match the exact room type with optional variations
            `\\b${type.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`,
            'i' // case insensitive
          );

          // Check both the roomType property and the name (as sometimes it's in the name)
          return pattern.test(hotel.roomType) || pattern.test(hotel.name);
        });

        if (!hasMatchingRoomType) {
          return false;
        }
      }
      if (filters.refundableOnly && !hotel.refundable) {
        return false
      }
      return true
    })
    setFilteredHotels(filtered)
  }, [filters, allHotels])

  // Apply sorting
  useEffect(() => {
    const sorted = [...filteredHotels]
    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }
    setSortedHotels(sorted)
  }, [filteredHotels, sortOption])

  const applyFilters = (newFilters) => {
    setFilters(newFilters)
    setShowFilters(false)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 fhd:h-20 fhd:w-20 2k:h-24 2k:w-24 4k:w-28 4k:h-28  border-b-2 border-[#F96C41] mx-auto mb-4 fhd:mb-6 2k:mb-9 4k:mb-12"></div>
          <p className="text-gray-600 fhd:text-2xl 2k:text-4xl 4k:text-6xl">Loading</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-red-500 text-center fhd:text-2xl 2k:text-4xl 4k:text-6xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Error loading hotels: {error}
        </motion.div>
      </div>
    )
  }



  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Filter Overlay with Enhanced Animations */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            className="fixed inset-0 z-50 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleFilters}
            />

            {/* Filter Panel with Enhanced Slide Animation */}
            <motion.div
              className="absolute left-0 top-0 h-full w-full max-w-sm fhd:max-w-lg 2k:max-w-xl 4k:max-w-5xl bg-white text-black overflow-y-auto shadow-2xl"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
            >
              <motion.div
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <div className="flex justify-between items-center mb-6 4k:mt-4">
                  <motion.h2
                    className="text-xl fhd:text-3xl 2k:text-4xl 4k:text-6xl font-bold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Filters
                  </motion.h2>
                  <motion.button
                    onClick={toggleFilters}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <X className="w-6 h-6 2k:w-10 2k:h-10 4k:w-14 4k:h-14" />
                  </motion.button>
                </div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <HotelFilters initialFilters={filters} onApply={applyFilters} onCancel={toggleFilters} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header/Navbar Section with Dark Background */}
      <motion.div
        className="bg-black min-h-[63vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] fhd:min-h-[73vh] 2k:min-h-[75vh] 4k:min-h-[80vh] text-white rounded-b-[40px]"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="md:px-8 max-xl:hidden">
          <Navbar />
        </div>
        <div className="md:px-8 xl:hidden">
          <Navbar1 />
        </div>

        <div className="container mx-auto py-10 fhd:py-12 2k:py-16 4k:py-22">
          <motion.section
            className="my-8 px-8 md:px-14 2k:px-18"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h1
              className="text-[10px] md:text-[20px] md:-tracking-[0.81px] xl:text-[34px] fhd:text-[46px] 2k:text-[72px] 4k:text-[100px] xl:-tracking-[1.4px] -tracking-[0.41px] font-bold mb-6 2k:mb-16 4k:mb-32 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
            >
              Hotels in {hotelcity}
            </motion.h1>

            <motion.div
              className="flex justify-between items-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <motion.p
                className="font-bold text-[10px] -tracking-[0.41px] md:text-[12px] md:-tracking-[0.81px] xl:text-[20px] fhd:text-[40px] 2k:text-[45px] 4k:text-[65px] xl:-tracking-[1.4px] text-white"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                Showing results {filteredHotels.length} of {allHotels.length}
              </motion.p>

              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="appearance-none bg-transparent text-white cursor-pointer pr-0 font-semibold text-[10px] md:text-[15px] md:-tracking-[0.81px] xl:text-[20px] fhd:text-[40px] 2k:text-[45px] 4k:text-[65px] xl:-tracking-[1.4px] focus:outline-none"
                >
                  <option value="recommended" className="text-black">
                    Recommended
                  </option>
                  <option value="price-low" className="text-black">
                    Price: Low to High
                  </option>
                  <option value="price-high" className="text-black">
                    Price: High to Low
                  </option>
                  <option value="rating" className="text-black">
                    Rating
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-3.5 -right-3 md:inset-y-0 md:-right-2 flex items-center px-2 2k:px-4 4k:px-8 text-white">
                  <svg className="fill-current h-4 w-4 fhd:h-6 fhd:w-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center mb-8 fhd:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <motion.button
                onClick={toggleFilters}
                className="flex items-center justify-center px-10 py-3 fhd:py-5 2k:px-16 2k:py-8 4k:px-20 4k:py-12 rounded-full  cursor-pointer hover:bg-gradient-to-l btn-gradient text-white font-semibold shadow-lg w-full max-w-3xl fhd:max-w-4xl 2k:max-w-7xl 4k:max-w-[120rem] text-[10px] md:text-[14px] xl:text-[20px] fhd:fhd:text-3xl 2k:text-5xl 4k:text-7xl xl:-tracking-[1.4px]"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 15px 35px rgba(249, 108, 65, 0.4)",
                  background: "linear-gradient(to left, #AA3916, #F96C41)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                  <ListFilter className="w-2 h-2 md:w-4 md:h-4 xl:w-5 xl:h-5 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-18 4k:h-18 mr-1 md:mr-3 fhd:mr-4 2k:mr-8 4k:mr-12" />
                </motion.div>
                Filters
              </motion.button>
            </motion.div>
          </motion.section>
        </div>
      </motion.div>

      {/* Main Content Section with White Background */}
      <motion.main
        className="-mt-48 2k:-mt-56 4k:-mt-[30rem] "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >

        <div className="container mx-auto py-8 ">
          <motion.section
            className="grid grid-cols-1 gap-y-4 md:gap-y-8 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {sortedHotels.map((hotel, index) => (
                <motion.div
                  key={hotel.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <HotelCard {...hotel} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        </div>
      </motion.main>

      <motion.div
        className=" px-8 md:px-14 lg:px-20 mt-4 pb-8 xl:px-48 fhd:px-6"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
      >
        <div className="max-w-full mx-auto xl:w-[1200px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <CarDiv />
        </div>
      </motion.div>

      <motion.div
        className="px-8 md:px-14 lg:px-20 xl:px-48 fhd:px-6 mt-4 pb-8"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
      >
        <div className="max-w-full mx-auto xl:w-[1196px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <Rentals />
        </div>
      </motion.div>

      <motion.div
        className=""
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80, damping: 15 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  )
}