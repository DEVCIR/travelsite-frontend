"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Checkbox } from "../../components/ui/checkbox"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { X } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"

export default function TravelForm() {
  const router = useRouter()
  const TRAVELLER_OPTIONS = [
    "1 Traveller, 1 Room",
    "2 Travellers, 1 Room",
    "3 Travellers, 1 Room",
    "4 Travellers, 2 Rooms",
    "5 Travellers, 2 Rooms",
    "6 Travellers, 3 Rooms"
  ];
  const [formData, setFormData] = useState({
    startDate: new Date(),
    from: "",
    to: "",
    stops: [""], // Initialize with one empty stop
    maxDistance: "500",
    autonomy: "500",
    needHotel: true,
    travellers: "2 Travellers, 1 Room",
  })

  const [distanceUnits, setDistanceUnits] = useState({
    maxDistance: 'KM',
    autonomy: 'KM'
  });

  // Inside your component
  const [showTravellerDropdown, setShowTravellerDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [cities, setCities] = useState([])
  const [loadingCities, setLoadingCities] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [activeStopIndex, setActiveStopIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("formData");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // If startDate is a string, convert to Date object
          if (parsed.startDate) {
            parsed.startDate = new Date(parsed.startDate);
          }

          if (parsed.maxDistance && parsed.autonomy) {
            const distanceUnit = parsed.maxDistance.split(' ')[1]
            const autonomyUnit = parsed.autonomy.split(' ')[1]
            setDistanceUnits({ maxDistance: distanceUnit, autonomy: autonomyUnit })
          }

          setFormData(prev => ({
            ...prev,
            ...parsed
          }));
        } catch (e) {
          // ignore parse errors, keep default form
        }
      }
    }
  }, []);

  const fetchCities = async (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return;

    setLoadingCities(true);
    try {
      const response = await axios.get(`/api/cities?q=${encodeURIComponent(searchTerm)}`);
      setCities(response.data.geonames || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };


  const handleInputChange = async (field, value, index = null) => {
    if (field === 'stop' && index !== null) {
      // Handle stop input change
      const updatedStops = [...formData.stops]
      updatedStops[index] = value
      setFormData(prev => ({
        ...prev,
        stops: updatedStops
      }))

      // Set active dropdown for stops
      setActiveDropdown(value.trim() ? `stop-${index}` : null)
      setActiveStopIndex(index)
    } else {
      // Handle other fields
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }))

      if (['from', 'to'].includes(field)) {
        setActiveDropdown(value.trim() ? field : null)
      }
    }

    // Clear previous timeout if it exists
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout for debouncing
    if (['from', 'to'].includes(field) || field === 'stop') {
      if (value.trim().length > 0) {
        setSearchTimeout(
          setTimeout(() => {
            fetchCities(value)
          }, 500) // 500ms debounce delay
        )
      } else {
        setCities([])
      }
    }
  }

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: [...prev.stops, ""] // Add new empty stop
    }))
  }

  const removeStop = (index) => {
    if (formData.stops.length <= 1) return // Don't remove the last stop

    setFormData(prev => {
      const updatedStops = [...prev.stops]
      updatedStops.splice(index, 1)
      return {
        ...prev,
        stops: updatedStops
      }
    })
  }

  const formatDate = (date) => {
    if (!date) return ""
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const validateForm = () => {
    if (!formData.from.trim()) {
      toast.error("Please enter a starting location")
      return false
    }

    if (!formData.to.trim()) {
      toast.error("Please enter a destination")
      return false
    }

    // Validate stops (remove empty stops first)
    // const validStops = formData.stops.filter(stop => stop.trim() !== "")
    // if (validStops.length === 0) {
    //   toast.error("Please enter at least one stop")
    //   return false
    // }

    return true
  }

  const handleSubmit = () => {
    // First validate the form
    if (!validateForm()) {
      return
    }
    setIsLoading(true);
    // Prepare data for URL parameters
    const params = new URLSearchParams()

    // Add basic fields
    params.append('startDate', formData.startDate.toISOString())
    params.append('from', formData.from)
    params.append('to', formData.to)

    // Add stops (filter out empty ones)
    const nonEmptyStops = formData.stops.filter(stop => stop.trim() !== "")
    nonEmptyStops.forEach((stop, index) => {
      params.append(`stop${index + 1}`, stop)
    })

    // Add distance fields with units
    params.append('maxDistance', `${String(formData.maxDistance).replace(/\D/g, '')} ${distanceUnits.maxDistance}`)
    params.append('autonomy', `${String(formData.autonomy).replace(/\D/g, '')} ${distanceUnits.autonomy}`)

    // Add optional fields
    params.append('needHotel', formData.needHotel.toString())
    if (formData.needHotel) {
      params.append('travellers', formData.travellers)
    }


    toast.success("Processing Request");
    setTimeout(() => {
      router.push(`/rentbio?${params.toString()}`)
    }, 3000);
  }


  return (
    <div className="bg-[#FFFFFF] fhd:w-[630px] fhd:h-auto 2k:w-[950px] 2k:h-auto 4k:w-[1490px] 4k:h-auto rounded-t-3xl rounded-b-3xl fhd:rounded-4xl 2k:rounded-[3rem] shadow-xl px-4 sm:mx-2 md:px-6 py-6 2k:py-12 2k:px-14 4k:py-16 4k:px-20  mx-auto md:mx-4 -mt-4 relative">
      <div className="space-y-4 md:space-y-6 4k:space-y-18">
        {/* Date Picker - unchanged */}
        <div>
          <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-6xl font-bold mb-1 md:mb-2 block">STARTS ON</label>
          <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium mb-1 md:mb-2 2k:mt-6 4k:mt-8 4k:mb-4 block">Date</label>
          <div className="relative items-center">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <img src="/images/icons/date_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-16 4k:w-16" alt="Date" />
            </div>
            <div
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="pl-10 md:pl-12 2k:pl-14 4k:pl-20 pr-10 md:pr-12 py-2 4k:py-16 md:py-3 border border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base fhd:h-16 md:text-lg fhd:text-xl 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28  text-[#00000075] font-semibold flex items-center cursor-pointer"
            >
              {formatDate(formData.startDate)}
            </div>
            <img
              src="/images/icons/Vector.png"
              className="absolute right-3 4k:right-6 top-1/2 transform -translate-y-1/2 h-2 w-3 2k:h-4 2k:w-5 "
              alt="Arrow"
              onClick={() => setShowDatePicker(!showDatePicker)}
            />

            {showDatePicker && (
              <div className="absolute z-20 mt-1 w-full 4k:top-[180px] 2k:top-[100px]  2k:w-[50rem]">
                <DatePicker
                  selected={formData.startDate}
                  onChange={(date) => {
                    handleInputChange("startDate", date);
                    setShowDatePicker(false);
                  }}
                  minDate={new Date()}
                  inline
                />
              </div>
            )}
          </div>
        </div>

        {/* From and To inputs - unchanged */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 fhd:gap-6 2k:gap-8 4k:gap-12 fhd:mt-6 2k:mt-10">
          <div>
            <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl  font-medium mb-1 md:mb-2 4k:mb-4 block">From</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <img src="/images/icons/location_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-14 4k:w-14" alt="Location" />
              </div>
              <Input
                value={formData.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                onFocus={() => setActiveDropdown('from')}
                placeholder="Search...."
                className="pl-10 md:pl-12 2k:pl-14 4k:pl-20 py-2 4k:py-16 md:py-3 border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-lg fhd:h-16 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28 text-[#00000075] font-semibold"
              />
              {activeDropdown === 'from' && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl shadow-lg max-2k:max-h-60 2k:max-h-96 4k:max-h-[28rem] overflow-auto">
                  {loadingCities ? (
                    <div className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl  text-gray-500">Loading...</div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <div
                        key={`${city.geonameId}-from`}
                        className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleInputChange("from", `${city.name}, ${city.countryName}`)
                          setActiveDropdown(null)
                        }}
                      >
                        {city.name}, {city.countryName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl  text-gray-500">Search City</div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium mb-1 md:mb-2 block 4k:mb-4">To</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <img src="/images/icons/location_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-14 4k:w-14" alt="Location" />
              </div>
              <Input
                value={formData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                onFocus={() => setActiveDropdown('to')}
                placeholder="Search...."
                className="pl-10 md:pl-12 2k:pl-14 4k:pl-20 py-2 4k:py-16 md:py-3 border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28 text-[#00000075] font-semibold"
              />
              {activeDropdown === 'to' && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl shadow-lg max-2k:max-h-60 2k:max-h-96 4k:max-h-[28rem] overflow-auto">
                  {loadingCities ? (
                    <div className="px-4 py-2 2k:py-4 4k:py-8 fhd:text-lg 2k:text-2xl 4k:text-5xl  text-gray-500">Loading...</div>
                  ) : cities.length > 0 ? (
                    cities.map((city) => (
                      <div
                        key={`${city.geonameId}-to`}
                        className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          handleInputChange("to", `${city.name}, ${city.countryName}`)
                          setActiveDropdown(null)
                        }}
                      >
                        {city.name}, {city.countryName}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-4xl  text-gray-500">Search City</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Stop inputs */}
        {formData.stops.map((stop, index) => (
          <div key={`stop-${index}`} className={`grid ${index === formData.stops.length - 1 ? 'grid-cols-2' : 'grid-cols-1'} md:grid-cols-${index === formData.stops.length - 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3 md:gap-4 fhd:gap-6 2k:gap-8 4k:gap-12 fhd:mt-6 2k:mt-10`}>
            <div >
              <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium mb-1 md:mb-2 4k:mb-4 block">
                {index === 0 ? "Stop Enroute" : `Stop ${index + 1}`}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <img src="/images/icons/location_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-14 4k:w-14" alt="Location" />
                </div>
                <Input
                  value={stop}
                  onChange={(e) => handleInputChange("stop", e.target.value, index)}
                  onFocus={() => {
                    setActiveDropdown(stop.trim() ? `stop-${index}` : null)
                    setActiveStopIndex(index)
                  }}
                  placeholder="Search...."
                  className="pl-10 md:pl-12 2k:pl-14 4k:pl-20 py-2 4k:py-16 md:py-3 border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28 text-[#00000075] font-semibold"
                />
                {activeDropdown === `stop-${index}` && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl shadow-lg max-h-60 overflow-auto">
                    {loadingCities && activeStopIndex === index ? (
                      <div className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl  text-gray-500">Loading...</div>
                    ) : cities.length > 0 ? (
                      cities.map((city) => (
                        <div
                          key={`${city.geonameId}-stop-${index}`}
                          className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            const updatedStops = [...formData.stops]
                            updatedStops[index] = `${city.name}, ${city.countryName}`
                            setFormData(prev => ({
                              ...prev,
                              stops: updatedStops
                            }))
                            setActiveDropdown(null)
                          }}
                        >
                          {city.name}, {city.countryName}
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 2k:py-4 4k:py-6 fhd:text-lg 2k:text-2xl 4k:text-5xl text-gray-500">No cities found</div>
                    )}
                  </div>
                )}
                {formData.stops.length > 1 && (
                  <button
                    onClick={() => removeStop(index)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
                  >
                    <X className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-10 4k:h-10" />
                  </button>
                )}
              </div>
            </div>
            {index === formData.stops.length - 1 && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={addStop}
                  className="w-full h-11 md:h-12 border-gray-300 text-[#00000075] text-xs md:text-sm fhd:text-lg fhd:h-16 2k:text-xl 2k:h-20 4k:text-4xl 4k:py-16 4k:h-28 flex items-center justify-center space-x-2 px-2"
                >
                  <img src="/images/icons/plus_icon.png" className="h-4 w-4 md:h-5 md:w-5 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-10 4k:h-10 flex-shrink-0" alt="Plus" />
                  <span className="truncate">ADD ANOTHER STOP</span>
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Rest of the form remains unchanged */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4fhd:gap-6 2k:gap-8 4k:gap-12 fhd:mt-6 2k:mt-12 4k:mt-16">
          <div>
            <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium mb-1 md:mb-2 4k:mb-4 block">
              Max driving distance per day
            </label>
            <div className="relative">
              <div className="absolute left-3 4k:left-3 top-1/2 transform -translate-y-1/2">
                <img src="/images/icons/time_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-14 4k:w-14" alt="Time" />
              </div>
              <Input
                value={typeof formData.maxDistance === 'string' ? formData.maxDistance.replace(/\D/g, '') : String(formData.maxDistance || '')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                  handleInputChange("maxDistance", value ? parseInt(value) : '');
                }}
                className="pl-10 md:pl-12 2k:pl-14 4k:pl-22 py-2 4k:py-16 md:py-3 border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28 text-[#00000075] font-semibold"
              />
              <div className="absolute right-3 4k:right-6 top-1/2 transform -translate-y-1/2 2k:text-xl 4k:text-4xl text-[#00000075] font-semibold">
                {distanceUnits.maxDistance}
              </div>
            </div>
            <div className="flex justify-center gap-3 md:gap-4 mt-2 ">
              <label className="flex items-center gap-1 md:gap-2 fhd:gap-4 2k:gap-6 4k:gap-8 fhd:mt-3 2k:mt-6 ">
                <Checkbox
                  checked={distanceUnits.maxDistance === 'KM'}
                  onCheckedChange={() => setDistanceUnits(prev => ({
                    ...prev,
                    maxDistance: 'KM'
                  }))}
                  className="h-4 w-4 md:h-5 md:w-5 fhd:w-6 fhd:h-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12"
                />
                <span className="text-xs md:text-sm fhd:text-lg 2k:text-2xl 4k:text-4xl text-gray-600">KM</span>
              </label>
              <label className="flex items-center gap-1 md:gap-2 fhd:gap-4 2k:gap-6 4k:gap-8 fhd:mt-3 2k:mt-6">
                <Checkbox
                  checked={distanceUnits.maxDistance === 'MI'}
                  onCheckedChange={() => setDistanceUnits(prev => ({
                    ...prev,
                    maxDistance: 'MI'
                  }))}
                  className="h-4 w-4 md:h-5 md:w-5 fhd:w-6 fhd:h-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12 "
                />
                <span className="text-xs md:text-sm fhd:text-lg 2k:text-2xl  4k:text-4xl text-gray-600">MI</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[#00000082] text-[10px] md:text-base fhd:text-lg 2k:text-2xl 4k:text-5xl font-medium mb-1 md:mb-2 4k:mb-4 block">
              Autonomy of my car
            </label>
            <div className="relative">
              <div className="absolute left-3 4k:left-3 top-1/2 transform -translate-y-1/2">
                <img src="/images/icons/distance_icon.png" className="h-6 w-6 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-14 4k:w-14" alt="Distance" />
              </div>
              <Input
                value={typeof formData.autonomy === 'string' ? formData.autonomy.replace(/\D/g, '') : String(formData.autonomy || '')}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
                  handleInputChange("autonomy", value ? parseInt(value) : '');
                }}
                className="pl-10 md:pl-12 2k:pl-14 4k:pl-22 py-2 4k:py-16 md:py-3 border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 2k:h-20 4k:text-5xl 4k:h-28 text-[#00000075] font-semibold"
              />
              <div className="absolute right-3 4k:right-6 top-1/2 transform -translate-y-1/2 2k:text-xl 4k:text-4xl text-[#00000075] font-semibold">
                {distanceUnits.autonomy}
              </div>
            </div>
            <div className="flex justify-center gap-3 md:gap-4 mt-2">
              <label className="flex items-center gap-1 md:gap-2 fhd:gap-4 2k:gap-6 4k:gap-8 fhd:mt-3 2k:mt-6 2k:text-2xl">
                <Checkbox
                  checked={distanceUnits.autonomy === 'KM'}
                  onCheckedChange={() => setDistanceUnits(prev => ({
                    ...prev,
                    autonomy: 'KM'
                  }))}
                  className="h-4 w-4 md:h-5 md:w-5 fhd:w-6 fhd:h-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12 "
                />
                <span className="text-xs md:text-sm fhd:text-lg 2k:text-2xl 4k:text-4xl text-[#00000075]">KM</span>
              </label>
              <label className="flex items-center gap-1 md:gap-2 fhd:gap-4 2k:gap-6 4k:gap-8 fhd:mt-3 2k:mt-6">
                <Checkbox
                  checked={distanceUnits.autonomy === 'MI'}
                  onCheckedChange={() => setDistanceUnits(prev => ({
                    ...prev,
                    autonomy: 'MI'
                  }))}
                  className="h-4 w-4 md:h-5 md:w-5 fhd:w-6 fhd:h-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12"
                />
                <span className="text-xs md:text-sm fhd:text-lg 2k:text-2xl 4k:text-4xl text-[#00000075]">MI</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-start gap-2 md:gap-3 pt-1 md:pt-0 2k:mb-8 4k:mb-20 ">
          <label htmlFor="hotel" className="text-[#00000075] font-medium md:font-semibold text-base md:text-lg fhd:text-xl 2k:text-4xl 4k:text-6xl fhd:mt-3 2k:mt-6 4k:mt-8">
            Need Hotel
          </label>
          <Checkbox
            id="hotel"
            checked={formData.needHotel}
            onCheckedChange={(checked) => handleInputChange("needHotel", checked)}
            className="h-5 w-5 md:h-6 md:w-6 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 border-2 border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl fhd:mt-3 2k:mt-6 4k:mt-10"
          />
        </div>

        {formData.needHotel && (
          <div>
            <label className="text-[#00000075] text-[10px] md:text-lg fhd:text-xl 2k:text-4xl 4k:text-6xl font-medium mb-1 md:mb-2  2k:mb-4 4k:mb-8 block">
              Travellers & rooms
            </label>
            <div className="relative ">
              <div className="absolute left-3 fhd:left-2 2k:left-3 4k:left-6 top-1/2 transform -translate-y-1/2">
                <img src="/images/icons/travelers_icon.png" className="h-6 w-6 fhd:h-8 fhd:w-8 md:h-7 md:w-7 2k:h-10 2k:w-10 4k:h-16 4k:w-16  " alt="Travelers" />
              </div>
              <div
                onClick={() => setShowTravellerDropdown(!showTravellerDropdown)}
                className="pl-10 md:pl-12 2k:pl-20 4k:pl-24 pr-10 md:pr-12 py-2 md:py-3 2k:py-12 2k:px-12 4k:py-18 4k:px-22  2k:mb-4 4k:mb-6 border border-gray-400 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl h-11 md:h-12 text-base md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 4k:text-5xl text-[#00000075] font-semibold flex items-center cursor-pointer"
              >
                {formData.travellers}
              </div>
              <img
                src="/images/icons/Vector.png"
                className="absolute right-3 4k:right-6 top-1/2 transform -translate-y-1/2 h-2 w-3 2k:h-3 2k:w-4 4k:h-4 4k:w-5 "
                alt="Arrow"
              />

              {showTravellerDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl shadow-lg max-h-60 4k:max-h-110 overflow-auto">
                  {TRAVELLER_OPTIONS.map((option, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 4k:py-6 fhd:text-xl 2k:text-3xl 4k:text-5xl hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        handleInputChange("travellers", option);
                        setShowTravellerDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          className="w-full btn-gradient cursor-pointer text-white font-semibold py-3 md:py-4 2k:py-12 4k:py-18  rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-4xl h-12 md:h-14 text-base  md:text-lg fhd:text-xl fhd:h-16 2k:text-2xl 2k:h-20 mt-3 2k:mt-6 4k:text-5xl 4k:h-28  4k:mt-10 md:mt-0"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin size-5 fhd:size-8 2k:size-10 4k:size-14  mr-2 fhd:mr-4 2k:mr-6 4k:mr-9 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <p className="md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl">Loading...</p>
            </span>
          ) : (
            "FIND MY ROUTE"
          )}
        </Button>


      </div>
    </div>
  )
}