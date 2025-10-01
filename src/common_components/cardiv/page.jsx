"use client"

import Image from "next/image"

export default function CarDiv() {
  return (
    <div className="w-full relative rounded-[24px]  xl:rounded-[68px] 4k:rounded-[80px]  -mt-4">
      <div className="relative w-full h-[200px] sm:h-[300px] md:h-[330px] lg:h-[430px] xl:h-[550px] 2k:h-[750px] 4k:h-[1050px] shadow-2xl rounded-[24px] xl:rounded-[68px] 4k:rounded-[80px]">
        <Image
          src="/images/icons/imagesssssssss.png"
          alt="Background content"
          fill
          className="object-cover rounded-[24px]  xl:rounded-[68px] 4k:rounded-[80px]"
          quality={100}
          priority
        />

        <div className="absolute inset-0 bg-[#000000C7] rounded-t-3xl rounded-b-3xl xl:rounded-[68px] 4k:rounded-[80px]"></div>

        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 xl:top-10 xl:right-20 z-10">
          <div className="font-[400] -tracking-[0.41px] text-[10px] sm:text-xl md:text-2xl xl:text-4xl 2k:text-6xl 4k:text-8xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px]">
            <span className="text-[#F96C41]">ev</span>
            <span className="text-white">trips.club</span>
          </div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2k:p-20 4k:p-24 z-10">
          <div className="mt-6 sm:mt-10 sm:ml-4 flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4 sm:gap-6 lg:gap-8">
            <div className="flex-1 max-w-none lg:max-w-lg xl:max-w-xl 2k:max-w-4xl 4k:max-w-[50%]">
              <div className="text-white space-y-1 sm:space-y-2 md:space-y-0">
                <h1 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2k:text-7xl 4k:text-8xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] font-bold leading-tight  z-10">
                  EV Drivers Deserve Better
                </h1>
                <h2 className="text-sm sm:text-xl md:text-3xl lg:text-3xl xl:text-5xl 2k:text-7xl 4k:text-8xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] font-bold leading-tight z-10">
                  Join the Club. Get More.
                </h2>
                <h3 className="text-sm sm:text-xl md:text-3xl lg:text-3xl xl:text-5xl 2k:text-7xl 4k:text-8xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] font-bold leading-tight z-10">
                  Pay Less.
                </h3>
              </div>
            </div>

            <div className="absolute right-3 top-2/5 -translate-y-1/2 xl:right-10">
              <div className="block relative">
                <div className="relative w-[80px] h-[80px] sm:w-[140px] sm:h-[140px] md:w-[150px] md:h-[150px] lg:w-[180px] lg:h-[180px] xl:w-[222px] xl:h-[222px] 2k:w-[342px] 2k:h-[342px] 4k:w-[475px] 4k:h-[475px]">
                  <Image src="/images/icons/discount.png" alt="Star badge" fill className="object-contain transform" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-end mb-4 xl:mb-6 2k:xl:mb-8 4k:mb-10">
            <button className="bg-transparent border-2 border-[#F96C41] text-white hover:bg-gradient-to-b from-[#F96C41] to-[#AA3916] cursor-pointer transition-colors rounded-xl w-full max-w-[150px] xs:max-w-[180px] sm:max-w-[220px] md:max-w-[260px] xl:max-w-[342px] 2k:max-w-[400px] 2k:h-[110px] 4k:max-w-[500px] 4k:h-[150px] xl:h-[85px] h-[40px] sm:h-[52px] md:h-[56px] flex items-center justify-between px-3 sm:px-6 md:px-8">
              <span className="font-medium text-xs sm:text-lg xl:text-xl 2k:text-2xl 4k:text-4xl xl:font-bold flex-1 text-center pr-2">
                JOIN NOW
              </span>
              <div className="bg-transparent flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" className="2k:w-8 2k:h-8 4k:w-10 4k:h-10" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.384 5.47142C1.42441 5.49256 1.46984 5.50224 1.51536 5.49942C1.56088 5.4966 1.60476 5.48139 1.64225 5.45542L4.89225 3.20542C4.92546 3.18241 4.9526 3.15169 4.97134 3.1159C4.99009 3.08012 4.99988 3.04032 4.99988 2.99992C4.99988 2.95951 4.99009 2.91972 4.97134 2.88393C4.9526 2.84814 4.92546 2.81742 4.89225 2.79442L1.64225 0.544416C1.60474 0.518464 1.56085 0.503267 1.51533 0.50047C1.4698 0.497674 1.42438 0.507384 1.38398 0.52855C1.34358 0.549717 1.30974 0.581532 1.28612 0.620551C1.26251 0.65957 1.25002 0.704306 1.25 0.749916V5.24992C1.24999 5.29555 1.26248 5.34032 1.2861 5.37936C1.30972 5.41841 1.34358 5.45024 1.384 5.47142Z"
                    fill="white"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}