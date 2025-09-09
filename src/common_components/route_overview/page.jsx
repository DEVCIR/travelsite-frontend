"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RouteOverview({
  from,
  to,
  stops = [],
  maxDistance,
  autonomy,
  startDate,
  distance,  // Add this prop
  duration
}) {
  
  const searchParams = useSearchParams()
  // const [routeData, setRouteData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(false);
  },[distance,duration])


   // Local calculation functions as fallback
  const calculateTotalDistanceLocal = () => {
    
    const maxDistanceValue = Number.parseInt(maxDistance) || 500
    const maxDistanceUnit = maxDistance.includes("MI") ? "MI" : "KM"
    const MILES_TO_KM = 1.60934
    
    const maxDistanceKm = maxDistanceUnit === "MI" ? maxDistanceValue * MILES_TO_KM : maxDistanceValue
    const totalDistanceKm = maxDistanceKm * (stops.length + 1)
    const totalDistance = maxDistanceUnit === "MI" ? totalDistanceKm / MILES_TO_KM : totalDistanceKm
    
    return `${Math.round(totalDistance).toLocaleString()}${maxDistanceUnit}`
  }

  const calculateDrivingTimeLocal = () => {
    const maxDistanceValue = Number.parseInt(maxDistance) || 500
    const maxDistanceUnit = maxDistance.includes("MI") ? "MI" : "KM"
    const MILES_TO_KM = 1.60934
    
    const maxDistanceKm = maxDistanceUnit === "MI" ? maxDistanceValue * MILES_TO_KM : maxDistanceValue
    const totalDistanceKm = maxDistanceKm * (stops.length + 1)
    const averageSpeed = maxDistanceUnit === "MI" ? 50 : 80 // mph or km/h
    const drivingHours = totalDistanceKm / averageSpeed
    const stopHours = stops.length * 0.5 // 30min per stop
    const totalHours = Math.round(drivingHours + stopHours)
    
    return `~${totalHours} HOURS`
  }

  const getDailyLimitLocal = () => {
    const maxDistanceValue = Number.parseInt(maxDistance) || 500
    const maxDistanceUnit = maxDistance.includes("MI") ? "MI" : "KM"
    return `<${maxDistanceValue}${maxDistanceUnit}`
  }

  const getChargingIntervalLocal = () => {
    const autonomyValue = Number.parseInt(autonomy) || 500
    const autonomyUnit = autonomy.includes("MI") ? "MI" : "KM"
    const minRange = Math.round(autonomyValue * 0.8)
    return `${minRange}-${autonomyValue}${autonomyUnit}`
  }


  const DistanceIcon = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-20 xl:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36  "
    >
      <path
        d="M11.39 10.3899L7.5 14.2769L3.61 10.3899C2.84107 9.62059 2.3175 8.64058 2.10549 7.57376C1.89349 6.50693 2.00255 5.4012 2.41891 4.39635C2.83527 3.39151 3.54022 2.53268 4.44463 1.92845C5.34905 1.32421 6.41232 1.00171 7.5 1.00171C8.58769 1.00171 9.65096 1.32421 10.5554 1.92845C11.4598 2.53268 12.1647 3.39151 12.5811 4.39635C12.9975 5.4012 13.1065 6.50693 12.8945 7.57376C12.6825 8.64058 12.1589 9.62059 11.39 10.3899ZM7.5 8.49988C8.03044 8.49988 8.53914 8.28917 8.91422 7.9141C9.28929 7.53902 9.5 7.03032 9.5 6.49988C9.5 5.96945 9.28929 5.46074 8.91422 5.08567C8.53914 4.7106 8.03044 4.49988 7.5 4.49988C6.96957 4.49988 6.46086 4.7106 6.08579 5.08567C5.71072 5.46074 5.5 5.96945 5.5 6.49988C5.5 7.03032 5.71072 7.53902 6.08579 7.9141C6.46086 8.28917 6.96957 8.49988 7.5 8.49988ZM20.39 19.3899L16.5 23.2779L12.61 19.3889C11.8411 18.6196 11.3175 17.6396 11.1055 16.5728C10.8935 15.5059 11.0026 14.4002 11.4189 13.3954C11.8353 12.3905 12.5402 11.5317 13.4446 10.9274C14.349 10.3232 15.4123 10.0007 16.5 10.0007C17.5877 10.0007 18.651 10.3232 19.5554 10.9274C20.4598 11.5317 21.1647 12.3905 21.5811 13.3954C21.9974 14.4002 22.1065 15.5059 21.8945 16.5728C21.6825 17.6396 21.1589 18.6206 20.39 19.3899ZM16.5 17.4999C17.0304 17.4999 17.5391 17.2892 17.9142 16.9141C18.2893 16.539 18.5 16.0303 18.5 15.4999C18.5 14.9695 18.2893 14.4607 17.9142 14.0857C17.5391 13.7106 17.0304 13.4999 16.5 13.4999C15.9696 13.4999 15.4609 13.7106 15.0858 14.0857C14.7107 14.4607 14.5 14.9695 14.5 15.4999C14.5 16.0303 14.7107 16.539 15.0858 16.9141C15.4609 17.2892 15.9696 17.4999 16.5 17.4999Z"
        fill="#F96C41"
      />
    </svg>
  )

  const TimeIcon = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-20 xl:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.01 11.0659C14.39 11.0659 12.26 8.93592 12.26 6.31592C12.26 3.69592 14.39 1.56592 17.01 1.56592C19.63 1.56592 21.76 3.69592 21.76 6.31592C21.76 8.93592 19.63 11.0659 17.01 11.0659ZM17.01 3.06592C15.22 3.06592 13.76 4.52592 13.76 6.31592C13.76 8.10592 15.22 9.56592 17.01 9.56592C18.8 9.56592 20.26 8.10592 20.26 6.31592C20.26 4.52592 18.8 3.06592 17.01 3.06592ZM20.51 23.0659C19.98 23.0659 19.66 23.0659 19.33 22.9259C19.1179 22.8383 18.9254 22.7091 18.764 22.5459C18.6025 22.3828 18.4754 22.189 18.39 21.9759C18.26 21.6659 18.26 21.3659 18.26 20.8159C18.26 20.5559 18.26 20.2859 18.24 20.2159C18.2132 20.1587 18.1672 20.1127 18.11 20.0859C18.03 20.0659 17.77 20.0659 17.51 20.0659H6.51C6.25 20.0659 5.99 20.0659 5.92 20.0859C5.85 20.1159 5.81 20.1559 5.78 20.2159C5.76 20.2859 5.76 20.5559 5.76 20.8159C5.76 21.3659 5.76 21.6659 5.62 21.9859C5.45 22.4159 5.11 22.7459 4.67 22.9259C4.36 23.0659 4.04 23.0659 3.502 23.0659H3.499C2.959 23.0659 2.65 23.0659 2.32 22.9259C2.10786 22.8383 1.9154 22.7091 1.75396 22.5459C1.59252 22.3828 1.46537 22.189 1.38 21.9759C1.25 21.6659 1.25 21.3659 1.25 20.8159V17.7359C1.25 16.5059 1.25 15.8259 1.45 15.1459C1.655 14.4739 2.04 13.8959 2.67 12.9509L2.72 12.8759L2.98 12.4859L1.55 11.4159C1.39087 11.2966 1.28567 11.1189 1.25754 10.922C1.22941 10.7251 1.28066 10.525 1.4 10.3659C1.51935 10.2068 1.69702 10.1016 1.89394 10.0735C2.09085 10.0453 2.29087 10.0966 2.45 10.2159L3.68 11.1359L4.27 9.71592L4.31 9.62192C5.065 7.82192 5.486 6.81592 6.42 6.19592C7.37 5.56592 8.48 5.56592 10.5 5.56592C10.91 5.56592 11.25 5.90592 11.25 6.31592C11.25 6.72592 10.91 7.06592 10.5 7.06592C8.71 7.06592 7.821 7.06592 7.251 7.44592C6.711 7.81592 6.391 8.53592 5.651 10.2959L5.021 11.7959L5.701 11.9659C5.921 12.0259 6.021 12.0459 6.121 12.0659H17.941C17.972 12.0659 18.038 12.0489 18.153 12.0179L18.271 11.9859L19.821 11.5959C20.131 11.5159 20.451 11.6459 20.621 11.9059L21.281 12.8859L21.331 12.9609C21.961 13.9069 22.347 14.4839 22.551 15.1559C22.751 15.8359 22.751 16.5159 22.751 17.7459V20.8259C22.751 21.3759 22.751 21.6759 22.611 21.9959C22.441 22.4259 22.101 22.7559 21.661 22.9359C21.351 23.0759 21.031 23.0759 20.492 23.0759L20.51 23.0659ZM6.519 18.5659H17.512C18.041 18.5659 18.36 18.5659 18.69 18.7059C19.11 18.8759 19.45 19.2159 19.63 19.6559C19.76 19.9659 19.76 20.2659 19.76 20.8159C19.76 21.0759 19.76 21.3459 19.78 21.4159C19.81 21.4759 19.85 21.5159 19.91 21.5459C20.07 21.5959 20.97 21.5859 21.1 21.5459C21.17 21.5159 21.21 21.4759 21.24 21.4159C21.26 21.3459 21.26 21.0759 21.26 20.8159V17.7359C21.26 16.6159 21.26 16.0459 21.12 15.5859C20.98 15.1359 20.67 14.6659 20.04 13.7159L19.68 13.1759L18.67 13.4259C18.39 13.4959 18.26 13.5259 18.13 13.5459C17.93 13.5659 17.79 13.5659 17.52 13.5659H6.5C6.22 13.5659 6.09 13.5659 5.95 13.5559C5.77177 13.5272 5.59493 13.4905 5.42 13.4459L5.38 13.4359L4.34 13.1759L3.98 13.7159C3.35 14.6659 3.04 15.1359 2.9 15.5859C2.76 16.0459 2.76 16.6059 2.76 17.7359V20.8159C2.76 21.0759 2.76 21.3459 2.78 21.4159C2.81 21.4759 2.85 21.5159 2.91 21.5459C3.07 21.5959 3.97 21.5859 4.1 21.5459C4.17 21.5159 4.21 21.4759 4.24 21.4159C4.26 21.3459 4.26 21.0759 4.26 20.8159C4.26 20.2659 4.26 19.9659 4.4 19.6459C4.57 19.2159 4.91 18.8859 5.35 18.7059C5.66 18.5659 5.98 18.5659 6.519 18.5659ZM18.009 17.3259C17.459 17.3259 17.009 16.8759 17.009 16.3259C17.009 15.7759 17.459 15.3259 18.009 15.3259C18.559 15.3259 19.009 15.7659 19.009 16.3259C19.009 16.8859 18.559 17.3359 18.009 17.3359V17.3259ZM5.009 16.3259C5.009 16.8759 5.459 17.3259 6.009 17.3259V17.3359C6.559 17.3359 7.009 16.8859 7.009 16.3259C7.009 15.7659 6.559 15.3259 6.009 15.3259C5.459 15.3259 5.009 15.7759 5.009 16.3259ZM18.269 7.52592C18.455 7.58107 18.6552 7.562 18.8274 7.4727C18.9996 7.3834 19.1306 7.23083 19.1927 7.04703C19.2548 6.86323 19.2433 6.66251 19.1606 6.48702C19.0779 6.31153 18.9303 6.17493 18.749 6.10592L17.759 5.77592V4.31592C17.759 3.90592 17.419 3.56592 17.009 3.56592C16.599 3.56592 16.259 3.90592 16.259 4.31592V6.31592C16.259 6.63592 16.459 6.92592 16.769 7.02592L18.269 7.52592Z"
        fill="#F96C41"
      />
    </svg>
  )

  const KMIcon = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-20 xl:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36"
    >
      <path
        d="M18 15C18 17.6 16.8 19.9 14.9 21.3L14.4 20.8L12.3 18.7L13.7 17.3L14.9 18.5C15.4 17.8 15.8 16.9 15.9 16H14V14H15.9C15.7 13.1 15.4 12.3 14.9 11.5L13.7 12.7L12.3 11.3L13.5 10.1C12.8 9.6 11.9 9.2 11 9.1V11H9V9.1C8.1 9.3 7.3 9.6 6.5 10.1L9.5 13.1C9.7 13.1 9.8 13 10 13C10.5304 13 11.0391 13.2107 11.4142 13.5858C11.7893 13.9609 12 14.4696 12 15C12 15.5304 11.7893 16.0391 11.4142 16.4142C11.0391 16.7893 10.5304 17 10 17C8.89 17 8 16.11 8 15C8 14.8 8 14.7 8.1 14.5L5.1 11.5C4.6 12.2 4.2 13.1 4.1 14H6V16H4.1C4.3 16.9 4.6 17.7 5.1 18.5L6.3 17.3L7.7 18.7L5.1 21.3C3.2 19.9 2 17.6 2 15C2 10.58 5.58 7 10 7C14.42 7 18 10.58 18 15ZM23 5C23 3.34 21.66 2 20 2C18.34 2 17 3.34 17 5C17 6.3 17.84 7.4 19 7.82V11H21V7.82C22.16 7.4 23 6.3 23 5ZM20 6C19.45 6 19 5.55 19 5C19 4.45 19.45 4 20 4C20.55 4 21 4.45 21 5C21 5.55 20.55 6 20 6Z"
        fill="#F96C41"
      />
    </svg>
  )

  const FuelIcon = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="xl:w-20 xl:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36"
    >
      <path
        d="M6 10H12V5H6V10ZM4 21V3H14V12H17V19.5H19.25V9H18V6H18.5V4.5H19.5V6H20.5V4.5H21.5V6H22V9H20.75V21H15.5V13.5H14V21H4ZM8.5 19L11 15H9.5V12L7 16H8.5V19Z"
        fill="#F96C41"
      />
    </svg>
  )

  const actualDistance = () => {
    const maxDistance = searchParams.get("maxDistance") || "500KM";
    const isMiles = maxDistance.includes("MI");
    const numericDistance = distance ? parseFloat(distance.toString().split(' ')[0]) : 0;
    console.log("distanceValue" , numericDistance);
    const validatedDistance = isMiles ? numericDistance * 0.621371 : numericDistance;
    
    return `${validatedDistance.toFixed(1)} ${isMiles ? "MI" : "KM"}`;
  }

   if (loading) {
    return (
      <div className="w-full">
        <h1 className="text-[10px] md:text-[19px] xl:text-4xl 2k:text-5xl 4k:text-7xl xl:-tracking-[1.4px] md:-tracking-[0.81px] font-bold text-[#22222299] -tracking-[0.41px] ml-2 xl:ml-6 uppercase">
          Route Overview
        </h1>
        <div className="bg-white rounded-2xl border border-gray-400 overflow-hidden mt-4 xl:mt-10 p-6 text-center">
          <div className="animate-pulse">Calculating route...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <h1 className="text-[10px] md:text-[19px] xl:text-4xl 2k:text-5xl 4k:text-7xl xl:-tracking-[1.4px] md:-tracking-[0.81px] font-bold text-[#22222299] -tracking-[0.41px] ml-2 xl:ml-6 uppercase">
          Route Overview
        </h1>
        <div className="bg-white rounded-2xl border border-gray-400 overflow-hidden mt-4 xl:mt-10 p-6 text-center text-red-500">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full ">
      <h1 className="text-[10px] md:text-[19px] xl:text-4xl 2k:text-5xl 4k:text-8xl xl:-tracking-[1.4px] md:-tracking-[0.81px] fhd:mt-8 2k:mt-12 4k:mt-16 font-bold text-[#22222299] -tracking-[0.41px] ml-2 xl:ml-6 uppercase">
        Route Overview
      </h1>
      <div className="bg-white rounded-2xl fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[3.5rem] border border-gray-400 overflow-hidden mt-4 fhd:mt-8 2k:mt-12 4k:mt-16 xl:mt-10 fhd:mb-8 2k:mb-10 4k:mb-12">
        <div className="grid grid-cols-2">
          {/* Total Distance */}
          <div className="p-6 fhd:p-10 2k:p-14 4k:p-24 border-r border-b border-gray-400 text-center">
            <div className="flex justify-center mb-3 2k:mb-10">
              <DistanceIcon />
            </div>
            <div className="text-lg md:text-3xl xl:text-[54px] 2k:text-[65px] 4k:text-[100px] xl:-tracking-[1.4px] md:-tracking-[0.81px] font-bold text-gray-600 mb-1 2k:mb-6">
              {actualDistance() || calculateTotalDistanceLocal()}
            </div>
            <div className="text-[8px] md:text-[11px] xl:text-[20px] 2k:text-[28px] 4k:text-[35px] font-bold xl:-tracking-[1.4px] md:-tracking-[0.81px] -tracking-[0.41px] text-gray-500 uppercase">
              TOTAL DISTANCE
            </div>
          </div>

          {/* Estimated Driving Time */}
          <div className="p-6 fhd:p-10 2k:p-14 4k:p-24 border-b border-gray-400 text-center">
            <div className="flex justify-center mb-3 2k:mb-10">
              <TimeIcon />
            </div>
            <div className="text-lg font-bold md:text-3xl xl:text-[54px] 2k:text-[65px] 4k:text-[100px] xl:-tracking-[1.4px] md:-tracking-[0.81px] text-gray-600 mb-1 2k:mb-6">
              {duration || calculateDrivingTimeLocal()}
            </div>
            <div className="text-[8px] font-bold md:text-2 xl:text-[20px] 2k:text-[28px] 4k:text-[35px] xl:-tracking-[1.4px] md:-tracking-[0.81px] -tracking-[0.41px] text-gray-500 uppercase">
              ESTIMATED DRIVING TIME
            </div>
          </div>

          {/* Daily Driving Limit */}
          <div className="p-6 fhd:p-10 2k:p-14 4k:p-24 border-r border-gray-400 text-center">
            <div className="flex justify-center mb-3 2k:mb-10">
              <KMIcon />
            </div>
            <div className="text-lg font-bold md:text-3xl xl:text-[54px] 2k:text-[65px] 4k:text-[100px] xl:-tracking-[1.4px] md:-tracking-[0.81px] text-gray-600 mb-1 2k:mb-6">
              {maxDistance || getDailyLimitLocal()}
            </div>
            <div className="text-[8px] font-bold md:text-2 xl:text-[20px] 2k:text-[28px] 4k:text-[35px] xl:-tracking-[1.4px] md:-tracking-[0.81px] -tracking-[0.41px] text-gray-500 uppercase">
              DAILY DRIVING LIMIT
            </div>
          </div>

          {/* Charging Intervals */}
          <div className="p-6 fhd:p-10 2k:p-14 4k:p-24 text-center">
            <div className="flex justify-center mb-3 2k:mb-10">
              <FuelIcon />
            </div>
            <div className="text-lg font-bold md:text-3xl xl:text-[54px] 2k:text-[65px] 4k:text-[100px] xl:-tracking-[1.4px] md:-tracking-[0.81px] text-gray-600 mb-1 2k:mb-6">
              {autonomy || getChargingIntervalLocal()}
            </div>
            <div className="text-[8px] font-bold md:text-2 xl:text-[20px] 2k:text-[28px] 4k:text-[35px] xl:-tracking-[1.4px] md:-tracking-[0.81px] -tracking-[0.41px] text-gray-500 uppercase">
              CHARGING INTERVALS
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}