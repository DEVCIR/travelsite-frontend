"use client"

export default function Rentals() {
  return (
    <div className="w-full relative -mt-4 z-10">
      <div className="bg-white rounded-xl 2k:rounded-3xl 4k:rounded-4xl shadow-2xl py-4 px-4 md:p-6 2k:px-8 2k:py-14 4k:py-20 4k:px-12 ">
        <div className="flex items-start sm:items-center">
          <div className="w-full xl:h-[200px] 4k:h-[260px] flex items-center gap-x-1 xl:gap-x-4">
            <img
              src="images/icons/agent.png"
              alt="Rental Agent"
              className="w-[53px] h-[53px] md:w-[105px] md:h-[105px] xl:w-[181px] xl:h-[181px] 2k:w-[200px] 2k:h-[200px] 4k:w-[260px] 4k:h-[260px] object-cover"
            />

            <div className="w-full">
              <h3 className="text-[15px] md:text-xl xl:text-4xl 2k:text-6xl 4k:text-7xl font-[600] xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] text-gray-900 mb-1">
                Need help with rentals?
              </h3>
              <p className="text-[9px] font-[400] md:text-lg xl:text-2xl 2k:text-4xl 4k:text-5xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] text-gray-700 max-xl:leading-relaxed">
                Our live agents are ready to find
                <br />
                the best event gear for you!
              </p>
            </div>
          </div>

          <div className="text-right w-[50%] my-auto">
            <div className=" flex justify-center text-[11px] md:text-xl xl:text-4xl 2k:text-5xl 4k:text-7xl xl:tracking-[0px] font-bold text-gray-900 mb-1">
              +1234-5678-9012
            </div>
            <div className=" flex justify-center text-[7px] font-[400] md:text-sm xl:text-2xl 2k:text-3xl 4k:text-5xl xl:-tracking-[1.4px] 2k:-tracking-[2px] 4k:-tracking-[2.2px] x-auto text-black">
              24/7 Assistance available
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}