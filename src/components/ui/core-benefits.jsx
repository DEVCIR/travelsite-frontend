import { MapPin, Building2, ClipboardList } from "lucide-react"

export default function CoreBenefits() {
  return (
    <div className="py-16 fhd:mt-44 2k:mt-96 4k:mt-[55rem] px-4">
      <div className="max-w-6xl fhd:max-w-[70%] 2k:max-w-[67%] 4k:max-w-[64%] mx-auto">
        <h2 className="text-3xl fhd:text-[50px] 2k:text-[60px] 4k:text-[90px] font-bold text-center text-gray-800 mb-12">Core Benefits</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* EV Road Trips Card */}
          <div className="bg-white rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-4xl p-8 fhd:px-16 fhd:py-6 2k:px-8 2k:py-12 4k:px-8 4k:py-20 shadow-lg border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <MapPin className="w-12 h-12 fhd:w-20 fhd:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36 text-[#F96C41]" />
                <MapPin className="w-8 h-8 fhd:w-16 fhd:h-16 2k:w-24 2k:h-24 4k:w-32 4k:h-32 text-[#F96C41] absolute top-6 left-6" />
              </div>
            </div>
            <h3 className="text-xl fhd:text-2xl 2k:text-5xl 4k:text-7xl font-bold text-gray-800 mb-4">EV Road Trips</h3>
            <p className="text-gray-600 fhd:text-lg 2k:text-4xl 4k:text-6xl leading-relaxed 4k:leading-snug">
              Discover scenic EV-friendly road trips tailored for your range and comfort.
            </p>
          </div>

          {/* Best Stays Card */}
          <div className="bg-white rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-4xl p-8 2k:px-8 2k:py-12 shadow-lg border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Building2 className="w-12 h-12 fhd:w-20 fhd:h-20 2k:w-28 2k:h-28  4k:w-36 4k:h-36 text-[#F96C41]" />
                <div className="absolute -bottom-1 -right-1 bg-[#F96C41] rounded-full p-1">
                  <svg className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-10 2k:h-10 4k:w-16 4k:h-16  text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl fhd:text-2xl 2k:text-5xl 4k:text-7xl font-bold text-gray-800 mb-4">Best Stays</h3>
            <p className="text-gray-600 fhd:text-lg 2k:text-4xl 4k:text-6xl leading-relaxed 4k:leading-snug">
              Book handpicked hotels with on-site charging and premium amenities.
            </p>
          </div>

          {/* Smart Planning Card */}
          <div className="bg-white rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-4xl p-8 2k:px-8 2k:py-12 shadow-lg border border-gray-100 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <ClipboardList className="w-12 h-12 fhd:w-20 fhd:h-20 2k:w-28 2k:h-28 4k:w-36 4k:h-36 text-[#F96C41]" />
                <div className="absolute -bottom-1 -right-1 bg-[#F96C41] rounded-full p-1">
                  <svg className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-10 2k:h-10 4k:w-16 4k:h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="text-xl fhd:text-2xl 2k:text-5xl 4k:text-7xl font-bold text-gray-800 mb-4">Smart Planning</h3>
            <p className="text-gray-600  fhd:text-lg 2k:text-4xl 4k:text-6xl leading-relaxed 4k:leading-snug">
              Plan routes, check chargers, and organize your trip in minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}