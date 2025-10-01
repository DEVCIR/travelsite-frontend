"use client";
import { Button } from "../../components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

export default function PageWrapper() {
  return (
    <Suspense
      fallback={<div className="text-white text-center mt-10">Loading...</div>}
    >
      <Iternary />
    </Suspense>
  );
}

function Iternary({
  stops = [],
  startDate,
  maxDistance = "",
  autonomy = "",
  needHotel = false,
  travellers = "",
  from,
  to,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [apiItinerary, setApiItinerary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchedHotels, setMatchedHotels] = useState([]);
  const hasFetched = useRef(false);
  const [isContinueLoading, setIsContinueLoading] = useState(false);

  // Extract params
  const actualFrom = searchParams.get("from") || from;
  const actualTo = searchParams.get("to") || to;
  const actualStartDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate"))
    : startDate || new Date();
  const actualMaxDistance = searchParams.get("maxDistance") || maxDistance;
  const actualAutonomy = searchParams.get("autonomy") || autonomy;
  const actualNeedHotel = searchParams.get("needHotel") === "true" || needHotel;
  const actualTravellers = searchParams.get("travellers") || travellers;

  // Extract stops from URL
  const actualStops = (() => {
    const urlStops = [];
    let i = 1;
    while (searchParams.get(`stop${i}`)) {
      urlStops.push(searchParams.get(`stop${i}`));
      i++;
    }
    return urlStops.length > 0 ? urlStops : stops;
  })();

  useEffect(() => {
    if (!actualFrom || !actualTo || hasFetched.current) return;

    hasFetched.current = true;
    setIsLoading(true);
    setError(null);

    const generateItineraryFromAPI = async () => {
      try {
        const response = await fetch("/api/generate-itinerary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: actualFrom,
            to: actualTo,
            stops: actualStops,
            maxDistance: actualMaxDistance,
            autonomy: actualAutonomy,
            needHotel: actualNeedHotel,
            startDate: actualStartDate.toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate itinerary");
        }

        const data = await response.json();
        setApiItinerary(parseItineraryText(data.itinerary,actualNeedHotel));
        if (!actualNeedHotel) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error generating itinerary:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    generateItineraryFromAPI();
  }, [
    actualFrom,
    actualTo,
    actualStops,
    actualMaxDistance,
    actualAutonomy,
    actualNeedHotel,
    actualStartDate,
  ]);

  // After apiItinerary is set, fetch hotels for each city
  useEffect(() => {
    if (!actualNeedHotel || !apiItinerary.length) return;
    let cancelled = false;

    async function fetchHotels() {
      setMatchedHotels([]);
      const results = await Promise.all(
        apiItinerary.map(async (item) => {
          if (!item.to || !item.hotel?.name)
            return { ...item, matchedHotel: null };
          // 1. Get geocode
          const geoRes = await fetch(
            `https://cp.militaryfares.com/api.php?input=${encodeURIComponent(
              item.to
            )}&method=geocode`
          );
          let geoData;
          try {
            geoData = await geoRes.json();
          } catch {
            return { ...item, matchedHotel: null };
          }
          const geo = geoData?.response?.[0]?.geo;
          if (!geo) return { ...item, matchedHotel: null };
          // 2. Get hotels
          // Calculate check-in date based on actual start date and day number
          let checkin = "20250915"; // fallback

          if (actualStartDate && item.day) {
            // Calculate the check-in date by adding (day - 1) days to the start date
            const checkinDate = new Date(actualStartDate);
            checkinDate.setDate(checkinDate.getDate() + (item.day - 1));

            // Format as YYYYMMDD for the API
            const year = checkinDate.getFullYear();
            const month = String(checkinDate.getMonth() + 1).padStart(2, "0");
            const day = String(checkinDate.getDate()).padStart(2, "0");
            checkin = `${year}${month}${day}`;

            console.log(
              `📅 Day ${item.day}: Start date ${actualStartDate
                .toISOString()
                .slice(0, 10)} → Check-in: ${checkin}`
            );
          }

          // Calculate checkout date (next day)
          const checkoutDate = new Date(actualStartDate);
          checkoutDate.setDate(checkoutDate.getDate() + item.day);
          const checkoutYear = checkoutDate.getFullYear();
          const checkoutMonth = String(checkoutDate.getMonth() + 1).padStart(
            2,
            "0"
          );
          const checkoutDay = String(checkoutDate.getDate()).padStart(2, "0");
          const checkout = `${checkoutYear}${checkoutMonth}${checkoutDay}`;

          console.log(
            `🏨 Day ${item.day} - Check-in: ${checkin}, Check-out: ${checkout}`
          );

          const apiUrl = `https://gimmonixapi.militaryfares.com/?a=evtrips&method=search&_q=${geo}|${checkin}|${checkout}|1|2:0|25|1||US|hotel&lang=en&curr=USD`;
          let hotelRes;
          try {
            hotelRes = await fetch(apiUrl);
            console.log("hotelRes : ", hotelRes);
          } catch {
            return { ...item, matchedHotel: null };
          }
          if (!hotelRes.ok) return { ...item, matchedHotel: null };
          let hotelData;
          try {
            hotelData = await hotelRes.json();
          } catch {
            return { ...item, matchedHotel: null };
          }
          const hotels = hotelData?.response || [];
          // 3. Try to match GPT hotel
          const match = hotels.find(
            (hotel) =>
              hotel.name.trim().toLowerCase() ===
              item.hotel.name.trim().toLowerCase()
          );
          return {
            ...item,
            matchedHotel: match || hotels[0] || null,
          };
        })
      );
      if (!cancelled) {
        setMatchedHotels(results);
        setIsLoading(false);
      }
    }
    fetchHotels();
    return () => {
      cancelled = true;
    };
  }, [actualNeedHotel, apiItinerary]);

  // Helper function to parse the text response from ChatGPT
  // const parseItineraryText = (text) => {
  //   if (!text) return [];

  //   const days = text.split("\n\n").filter((day) => day.startsWith("DAY"));
  //   const parsedDays = days.map((dayText) => {
  //     const lines = dayText.split("\n").filter((l) => l.trim());

  //     // Parse DAY line
  //     const dayLine = lines[0];
  //     const dayNumber = dayLine.match(/DAY (\d+)/)?.[1] || 1;
  //     const route = dayLine.split(": ")[1] || "";
  //     const [from, toWithDist] = route.split(" --> ");
  //     const to = toWithDist?.split(" (")[0] || "";
  //     const distance = toWithDist?.match(/\(~(.+)\)/)?.[1] || "";

  //     // Parse date line
  //     const dateLine = lines.find(
  //       (l) => l.includes("Departure:") || l.includes("Overnight Stay:")
  //     );
  //     const date = dateLine?.split(": ")[1]?.trim() || "";

  //     // Parse charging stop
  //     const chargingLine = lines.find((l) =>
  //       l.includes("Midway Charging Stop:")
  //     );
  //     const chargingStop = chargingLine?.split(": ")[1]?.trim() || "";

  //     // Only parse hotel if needed
  //     let hotel = null;
  //     if (actualNeedHotel) {
  //       const hotelLine = lines.find((l) =>
  //         l.includes("Hotel Recommendation:")
  //       );
  //       const hotelName = hotelLine?.split(": ")[1]?.trim() || "";
  //       if (hotelName) {
  //         hotel = {
  //           name: hotelName,
  //           description: `Recommended hotel in ${to}`,
  //           savings: "Gratis 25KWh/night",
  //         };
  //       }
  //     }

      

  //     return {
  //       day: parseInt(dayNumber),
  //       from: from?.trim(),
  //       to: to?.trim(),
  //       distance: distance?.trim(),
  //       date: date?.trim(),
  //       chargingStop: chargingStop?.trim(),
  //       ...(hotel && { hotel }),
  //     };
  //   });
    
  //   const cityData = parsedDays.map(day => ({
  //   city: day.to,
  //   date: day.date,
  //   midwayChargingStop: day.chargingStop,
  //   hotelRecommendation: day.hotel?.name || '',
  //   hotelAddress: day.hotel?.address || ''
  // }));

  // localStorage.setItem('tripCities', JSON.stringify(cityData));
  // localStorage.setItem('fullItinerary', JSON.stringify(parsedDays));

  //     return parsedDays;
  // };

  const parseItineraryText = (text) => {
  if (!text) return [];

  // Step 1: Clean the text
  let cleanedText = text
    .replace(/\*\*/g, '') // Remove **bold**
    .replace(/\u00A0|\u202F/g, ' ') // Replace non-breaking spaces with normal space
    .replace(/\u2013/g, '-') // Optional: fix en-dash if any
    .trim();

  // Step 2: Split by --- separator
  const dayBlocks = cleanedText
    .split(/^-{3,}$/m) // Split by lines with only ---
    .map(block => block.trim())
    .filter(block => block && block.includes('DAY '));

  if (dayBlocks.length === 0) {
    console.warn("No DAY blocks found in itinerary:", cleanedText);
    return [];
  }

  const parsedDays = dayBlocks.map((block) => {
    const lines = block.split('\n').filter(l => l.trim());

    // Parse DAY line (e.g., "DAY 1", "DAY 1", "**DAY 1**" etc.)
    const dayLine = lines.find(l => /DAY\s+\d+/i.test(l));
    if (!dayLine) return null;

    const dayMatch = dayLine.match(/DAY\s+(\d+)/i);
    const dayNumber = dayMatch ? parseInt(dayMatch[1], 10) : 1;

    // Extract route: "New York --> Pittsburgh (~280 mi)"
    const routeLine = lines.find(l => l.includes('-->'));
    let from = '', to = '', distance = '';
    if (routeLine) {
      const routeMatch = routeLine.match(/(.+?)\s*-->\s*(.+?)\s*\(~(.+?)\)/);
      if (routeMatch) {
        from = routeMatch[1].trim();
        to = routeMatch[2].trim();
        distance = routeMatch[3].trim();
      }
    }

    // Parse date
    const dateLine = lines.find(l => l.includes('Departure:') || l.includes('Overnight Stay:'));
    const date = dateLine ? dateLine.split(':')[1]?.trim() || '' : '';

    // Charging stop
    const chargingLine = lines.find(l => l.includes('Midway Charging Stop:'));
    const chargingStop = chargingLine ? chargingLine.split(':')[1]?.trim() || '' : '';

    // Hotel (if needed)
    let hotel = null;
    if (actualNeedHotel) {
      const hotelLine = lines.find(l => l.includes('Hotel Recommendation:'));
      const hotelName = hotelLine ? hotelLine.split(':')[1]?.trim() || '' : '';
      if (hotelName) {
        hotel = {
          name: hotelName,
          description: `Recommended hotel in ${to}`,
          savings: "Gratis 25KWh/night",
        };
      }
    }

    return {
      day: dayNumber,
      from,
      to,
      distance,
      date,
      chargingStop,
      ...(hotel && { hotel }),
    };
  }).filter(Boolean); // Remove nulls

  if (parsedDays.length === 0) {
    console.error("Failed to parse any itinerary days from:", text);
    return [];
  }

  // Save to localStorage as before
  const cityData = parsedDays.map(day => ({
    city: day.to,
    date: day.date,
    midwayChargingStop: day.chargingStop,
    hotelRecommendation: day.hotel?.name || '',
    hotelAddress: day.hotel?.address || ''
  }));

  if (typeof window !== 'undefined') {
    localStorage.setItem('tripCities', JSON.stringify(cityData));
    localStorage.setItem('fullItinerary', JSON.stringify(parsedDays));
  }

  return parsedDays;
};

  // Helper functions
  const getCityName = (location) => {
    if (!location) return "Unknown";
    return location.split(",")[0]?.trim() || location;
  };

  const ArrowIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 sm:w-5 sm:h-5 md:w-10 md:h-10 xl:w-[69px] xl:h-[69px]"
    >
      <path
        d="M14.8959 15.8496L20.2291 10.9032L14.8959 5.95679L13.7599 7.17885L16.8768 10.0694H1.64035V11.737H16.8768L13.7599 14.6278L14.8959 15.8496Z"
        fill="#222222"
        fillOpacity="0.5"
      />
    </svg>
  );

  const handleContinue = () => {
    setIsContinueLoading(true);
    if(typeof window !== "undefined")
    {
      localStorage.setItem('setForm' , "false");
      localStorage.removeItem('formData');
    }
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/recommendedHotels?${params.toString()}`);
  };

  if (!actualFrom || !actualTo) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 fhd:h-16 fhd:w-16 2k:h-20 2k:w-20 4k:h-28 4k:w-28 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return null; // Show nothing if there's an error
  }

  const displayData = matchedHotels.length > 0 ? matchedHotels : apiItinerary;
  if (displayData.length === 0) {
    return (
      <div className="w-full flex justify-center items-center h-64">
        No Iternery Found
      </div>
    );
  }

  return (
    <div className="w-full max-auto">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="relative">
          {displayData.map((item, index) => (
            <div key={item.day} className="relative">
              {/* Timeline Line */}
              <div
                className={`absolute left-4 sm:left-5 2k:left-6 4k:left-9 top-10 sm:top-12 2k:top-18 4k:top-22 w-0.5  h-[80%] 2k:w-1 2k:h-[90%] 4k:w-2   z-0 ${index === 0 ? "bg-[#5AB1FF]" : "bg-[#17C19B]"}`}
              ></div>

              <div className="flex gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
                {/* Day Number Circle */}
                <div
                  className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 2k:w-14 2k:h-14 4k:w-20 4k:h-20 text-white rounded-full flex items-center justify-center text-sm sm:text-base  2k:text-3xl 4k:text-4xl font-bold z-10 relative ${index === 0 ? "bg-[#5AB1FF]" : "bg-[#17C19B]"}`}
                >
                  {item.day}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Day Title */}
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 2k:mb-8 flex-wrap">
                    <h3 className="text-base sm:text-lg md:text-3xl xl:text-[50px] 2k:text-[75px] 4k:text-[100px] font-bold text-gray-900">
                      DAY {item.day}: {item.from} → {item.to} (~{item.distance})
                    </h3>
                  </div>

                  {/* Trip Details */}
                  <div className="space-y-2 sm:space-y-3 2k:space-y-8  4k:space-y-14 mb-4 sm:mb-6">
                    <div className="flex items-start gap-2  fhd:gap-4 2k:gap-4">
                      <div className="w-1.5 h-1.5 fhd:w-3 fhd:h-3 2k:w-4 2k:h-4 4k:w-6 4k:h-6 bg-orange-500 rounded-full mt-2 xl:mt-4 flex-shrink-0"></div>
                      <div className="text-[10px] sm:text-base md:text-lg xl:text-3xl 2k:text-5xl 4k:text-7xl">
                        <span className="font-medium text-gray-900">
                          {index === 0 ? "Departure:" : "Overnight Stay:"}
                        </span>
                        <span className="text-gray-800 ml-1 font-[400]">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    {item.chargingStop && (
                      <div className="flex items-start gap-2 fhd:gap-4 2k:gap-4">
                        <div className="w-1.5 h-1.5 fhd:w-3 fhd:h-3 2k:w-4 2k:h-4 4k:w-6 4k:h-6 bg-orange-500 rounded-full mt-2 xl:mt-4 flex-shrink-0"></div>
                        <div className="text-[10px] sm:text-base">
                          <span className="font-medium text-gray-900 md:text-lg xl:text-3xl 2k:text-5xl 4k:text-7xl ">Midway Charging Stop:</span>
                          <span className="text-[10px] font-[400] text-gray-700 ml-1 md:text-lg xl:text-3xl 2k:text-5xl 4k:text-7xl">
                            {item.chargingStop}
                          </span>
                        </div>
                      </div>
                    )}

                    {actualNeedHotel && (item.matchedHotel || item.hotel) && (
                      <>
                        <div className="flex items-start gap-2  fhd:gap-4 2k:gap-4 ">
                          <div className="w-1.5 h-1.5 fhd:w-3 fhd:h-3 2k:w-4 2k:h-4 4k:w-6 4k:h-6 bg-orange-500 rounded-full mt-2 xl:mt-4 flex-shrink-0"></div>
                          <div className="text-[10px] sm:text-base md:text-lg 2k:text-5xl">
                            <span className="font-medium text-gray-900 xl:text-3xl 2k:text-5xl 4k:text-7xl">Hotel Recommendation:</span>
                          </div>
                        </div>
                        <div className="bg-white w-[311px] md:w-[584px] xl:w-[1005px] 2k:w-[1505px] 4k:w-[2055px] h-auto rounded-lg px-4 py-4 sm:p-5 border-2 border-gray-200 relative">
                          <div className="absolute -top-5 right-4 md:-top-12 md:right-8 xl:right-8 xl:-top-22 2k:-top-28 4k:-top-44 w-[36px] h-[36px] md:w-[68px] md:h-[68px] xl:w-[117px] xl:h-[117px]  2k:w-[170px] 2k:h-[170px] 4k:w-[250px] 4k:h-[250px] flex items-center justify-center">
                            <img
                              src="images/icons/discount2.png"
                              alt="discount"
                              className="w-full h-auto"
                            />
                          </div>
                          <div className="flex flex-row sm:items-center sm:justify-between gap-3 2k:p-4 4k:p-6 ">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 text-[10px] md:text-lg sm:text-base xl:text-3xl 2k:text-5xl 4k:text-7xl mb-1 sm:mb-2 md:mb-0 2k:mb-5">
                                {(item.matchedHotel && item.matchedHotel.name) || (item.hotel && item.hotel.name)}
                              </h4>
                              <p className="text-[8px] font-[400] md:text-base sm:text-sm xl:text-2xl 2k:text-3xl 4k:text-5xl text-gray-600 leading-relaxed">
                                {(item.matchedHotel && item.matchedHotel.location?.address) || (item.hotel && item.hotel.description)}
                              </p>
                            </div>
                            <Button className="bg-[#F96C41] hover:bg-[#e55f38]  cursor-pointer text-white text-xs font-medium rounded-sm flex-shrink-0 self-center w-[50px] h-[21px] md:w-24 md:h-10 xl:w-36 xl:h-[50px] 2k:w-44 2k:h-[65px] 4k:w-66 4k:h-[100px] md:rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl">
                              <div className="flex items-center justify-center w-full gap-x-1 md:gap-x-2 4k:md:gap-x-6">
                                <h1 className="text-[6px] font-[600] md:text-[11px] xl:text-xl 2k:text-2xl 4k:text-4xl">More Info</h1>
                                <img
                                  src="images/icons/more.png"
                                  alt="MORE"
                                  className="w-2 h-2 md:w-3 md:h-3 xl:w-4 xl:h-4 2k:w-6 2k:h-6"
                                />
                              </div>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="md:flex md:justify-center">
            <Button
              onClick={handleContinue}
              className="w-full md:w-[381px] xl:w-[656px] 2k:w-[866px] 4k:w-[1200px] btn-gradient text-white font-semibold py-3 md:py-4 fhd:py-8 2k:py-10 4k:py-22 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-12 md:h-10 xl:h-[75px] 2k:h-[110px] text-base md:text-sm xl:text-lg fhd:text-3xl 2k:text-4xl 4k:text-6xl mt-3 fhd:mt-4 2k:mt-6 4k:mt-10 md:mt-0 uppercase cursor-pointer"
              disabled={isContinueLoading}
            >
              {isContinueLoading ? (
                <span className="flex items-center justify-center gap-2 fhd:gap-4 2k:gap-6 4k:gap-9">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 fhd:h-6 fhd:w-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12 border-t-2 border-b-2 border-white"></span>
                  Loading...
                </span>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}