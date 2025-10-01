"use client"

import dynamic from "next/dynamic"
import Navbar1 from "../../common_components/navbar1/page"
import CarDiv from "../../common_components/cardiv/page"
import Navbar from "../../common_components/navbar/page"
import { Edit } from "lucide-react"
import Rentals from "../../common_components/rentals/page"
import { useSearchParams, useRouter } from "next/navigation"
import React, { Suspense, useEffect } from "react"
import Footer from "../../components/ui/footer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function PageWrapper() {
  return (
    <Suspense fallback={
      <motion.div
        className="text-white text-center fhd:text-2xl 2k:text-4xl 4k:text-6xl mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        Loading...
      </motion.div>
    }>
      <Page />
    </Suspense>
  )
}

// Dynamically import MapComplete with SSR disabled
const MapComplete = dynamic(() => import("../../common_components/mapcomplete/page"), {
  ssr: false,
  loading: () => (
    <div className="h-[55rem] sm:h-[40rem] md:h-[85rem] lg:h-[56rem] xl:h-[146rem] bg-gray-200 animate-pulse rounded-2xl" />
  ),
})

function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Check if required parameters exist
  useEffect(() => {
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from || !to) {
      router.push("/") // Redirect to home if required params are missing
    }
  }, [searchParams, router])


  // If params are missing, return null (will redirect)
  if (!searchParams.get("from") || !searchParams.get("to")) {
    return null
  }

  // Refs for scroll animations
  const carDivRef = useRef(null)
  const rentalsRef = useRef(null)
  const footerRef = useRef(null)

  // useInView hooks for scroll-triggered animations
  const isCarDivInView = useInView(carDivRef, { once: true, amount: 0.3 })
  const isRentalsInView = useInView(rentalsRef, { once: true, amount: 0.3 })
  const isFooterInView = useInView(footerRef, { once: true, amount: 0.3 })

  // Get data from URL parameters
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const stops = []
  const maxDistance = searchParams.get("maxDistance") || "500 KM"
  const autonomy = searchParams.get("autonomy") || "500 KM"
  const needHotel = searchParams.get("needHotel") === "true"
  const travellers = searchParams.get("travellers") || "3 Travellers, 1 Room"
  const startDate = searchParams.get("startDate") ? new Date(searchParams.get("startDate")) : new Date()

  // Collect all stops from parameters
  let i = 1
  while (searchParams.get(`stop${i}`)) {
    stops.push(searchParams.get(`stop${i}`))
    i++
  }

  // Format city names (remove country if exists)
  const formatCityName = (location) => location?.split(",")[0]?.trim() || location

  return (
    <motion.div
      className="min-h-screen bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
        {/* Header Section */ }
        < motion.div
        className="bg-black px-3 sm:px-4 md:px-6 lg:px-8 xl:px-14 pt-4 pb-12 sm:pb-16 min-h-[54vh] md:min-h-[40vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-none"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="xl:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Navbar1 />
        </motion.div>
        <motion.div
          className="max-xl:hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Navbar />
        </motion.div>

        <motion.div
          className="mt-2 fhd:mt-24 2k:mt-28 max-xl:leading-4 px-6 lg:px-14 xl:px-32 4k:px-80 max-w-[80%]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h2
            className="text-gray-400 text-[10px] font-medium md:font-bold md:text-[16px] xl:text-[29px] fhd:text-[35px] 2k:text-[50px] 4k:text-[75px] mb-4 max-sm:mt-4 4k:mt-40  md:-tracking-[0.69px] xl:-tracking-[1.19px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            TRIP INFO
          </motion.h2>

          {/* Dynamic Route Display */}
          <motion.div
            className="flex items-center gap-1 sm:gap-2 md:gap-5 xl:gap-10 flex-wrap "
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <motion.span
              className="text-white text-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl fhd:text-5xl 2k:text-6xl 4k:text-8xl font-bold xl:-tracking-[1.43px] whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
            >
              {formatCityName(from)}
            </motion.span>

            {stops.length > 0 && (
              stops.map((stop, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    <ArrowIcon />
                  </motion.div>
                  <motion.span
                    className="text-white text-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl fhd:text-5xl 2k:text-6xl 4k:text-8xl font-bold xl:-tracking-[1.43px] whitespace-nowrap"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.6, type: "spring" }}
                  >
                    {formatCityName(stop)}
                  </motion.span>
                </React.Fragment>
              ))
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + stops.length * 0.1, duration: 0.5, type: "spring" }}
            >
              <ArrowIcon />
            </motion.div>
            <motion.span
              className="text-white text-wrap text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl fhd:text-5xl 2k:text-6xl 4k:text-8xl font-bold xl:-tracking-[1.43px] whitespace-nowrap"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + stops.length * 0.1, duration: 0.6, type: "spring" }}
            >
              {formatCityName(to)}
            </motion.span>
          </motion.div>

          <motion.div
            className="max-md:hidden absolute right-28 2k:right-60 4k:right-[29rem] top-32 xl:right-36 xl:top-52 2k:top-72 4k:top-[500px] bg-[#323232] rounded-md fhd:rounded-lg 2k:rounded-2xl 4k:rounded-3xl w-[49px] h-[46px] xl:w-[80px] cursor-pointer xl:h-[75px] 2k:w-[100px] 2k:h-[90px] 4k:w-[140px] 4k:h-[135px]"
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 1, duration: 0.6, type: "spring" }}
            onClick={() => {
              const formData = {
                startDate: startDate ? startDate.toISOString() : null,
                from,
                to,
                stops,
                maxDistance,
                autonomy,
                needHotel,
                travellers,
              };
              localStorage.setItem("setForm", "true");
              localStorage.setItem("formData", JSON.stringify(formData));
              router.push('/');
            }}
          >
            <Edit className="w-5 h-5 xl:w-8 xl:h-8 2k:w-12 2k:h-12 4k:w-24 4k:h-24 z-10 text-[#F96C41] mx-auto my-3 xl:my-5" />
          </motion.div>
        </motion.div>
    </motion.div>

      {/* Map Section */ }
  <div className="max-md:px-8 max-md:-mt-32 pb-8">
    <div className="max-w-full mx-auto">
      <MapComplete from={from} to={to} stops={stops} />
    </div>
  </div>


  {/* Other Sections */ }
      <motion.div
        ref={carDivRef}
        className="px-8 md:px-14 lg:px-20 mt-4 pb-8 xl:px-48 fhd:px-6 "
        initial={{ opacity: 0, y: 50 }}
        animate={isCarDivInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-full mx-auto xl:w-[1200px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <CarDiv />
        </div>
      </motion.div>

      <motion.div
        ref={rentalsRef}
        className="px-8 md:px-14 lg:px-20 xl:px-48 fhd:px-6 mt-4 pb-8 "
        initial={{ opacity: 0, y: 50 }}
        animate={isRentalsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-full mx-auto xl:w-[1196px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <Rentals />
        </div>
      </motion.div>

      <motion.div
        ref={footerRef}
        className=""
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </motion.div >
  )
}

// Reusable Arrow Icon Component
const ArrowIcon = () => (
  <svg
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="flex-shrink-0 w-[20px] h-[21px] md:w-[36px] md:h-[36px] xl:w-[62px] xl:h-[62px]"
  >
    <path
      d="M14.8959 15.9673L20.2291 11.0209L14.8959 6.07446L13.7599 7.29652L16.8768 10.1871H1.64035V11.8547H16.8768L13.7599 14.7455L14.8959 15.9673Z"
      fill="white"
      fillOpacity="0.5"
    />
  </svg>
)