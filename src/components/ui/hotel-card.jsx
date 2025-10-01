"use client"
import { Star, MapPin, Moon, Users } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const HotelCard = ({
  id,
  name,
  rating,
  address,
  nights,
  travelers,
  price,
  image,
  roomImage,
  index = 0,
  distance,
  amenities,
  chain,
  roomType,
  refundable,
  city,
  geo,
  checkin,
  checkout
}) => {
  const router = useRouter()

  const handleChooseRoom = () => {
    // Prepare hotel and room details for hotel-select
    const hotelData = {
      name,
      image: image,
      roomImage: roomImage,
      city: city || '',
      address: address || '',
      rating: rating || 0,
      // Room details placeholders (to be replaced with real data if available)
      roomName: roomType || 'Double room',
      sleeps: travelers || 2,
      bedType: 'Double', // Placeholder, update if available
      mealPlan: 'Bread and Breakfast BB', // Placeholder, update if available
      price: price || 0,
      refundable: refundable || false,
      cancellation: 'Free cancellation', // Placeholder, update if available
      moreDetails: '', // Placeholder, update if available
      checkin: checkin,
      checkout: checkout
    };
    localStorage.setItem('selectedHotel', JSON.stringify(hotelData));
    // Navigate to hotel-select page
    router.push('/hotel-select');
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  // Generate star rating

  return (
    <motion.div
      className=" w-[370px] sm:w-[520px] md:w-[692px] xl:w-[900px] fhd:w-[1370px] 2k:w-[1860px] 4k:w-[2830px]  h-auto bg-white rounded-3xl fhd:rounded-4xl 2k:rounded-[4.5rem] 4k:rounded-[6rem] shadow-lg overflow-hidden mb-8 fhd:mb-10 2k:mb-22 4k:mb-32 p-4 md:p-6 fhd:p-8 2k:p-14 4k:p-22 mx-auto"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex flex-row 2k:gap-x-4 4k:gap-x-8">
        <div
          className="w-[225px] h-[165px] md:w-[324px] md:h-[284px] xl:w-[560px] xl:h-[400px] fhd:w-[600px] fhd:h-[490px] 2k:w-[860px] 2k:h-[700px] 4k:w-[1350px] 4k:h-[1110px]"

        >
          <img
            src={image || "images/1.jpg"}
            alt={name}
            className="w-full h-full object-cover rounded-3xl fhd:rounded-4xl 2k:rounded-[3rem] 4k:rounded-[4.5rem]"
          />
        </div>

        <div className="pl-4 flex flex-col justify-between w-2/5 md:w-3/5 text-black">
          <div>
            <motion.h2
              className="font-semibold text-[22px] -tracking-[0.44px] md:text-[29px] md:-tracking-[0.87px] xl:text-[40px] fhd:text-[50px] 2k:text-[70px] 4k:text-[90px] xl:-tracking-[1.5px] xl:leading-[50px] 2k:leading-[80px] 4k:leading-[90px] mb-1 md:mb-2 fhd:mb-5 2k:mb-10 4k:mb-18"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
            >
              {name}
            </motion.h2>

            <motion.div
              className="flex items-center mb-1 md:mb-4 fhd:mb-6 2k:mb-9 4k:mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            >
              <div className="flex items-center">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                  <motion.div
                    key={`full-${i}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                  >
                    <Star className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-10 fhd:w-14 fhd:h-14 2k:w-18 2k:h-18 4k:w-26 4k:h-26 text-orange-400 fill-orange-400" />
                  </motion.div>
                ))}

                {/* Half star */}
                {hasHalfStar && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + fullStars * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                  >
                    <Star className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-10 fhd:w-14 fhd:h-14 2k:w-18 2k:h-18 4k:w-26 4k:h-26 text-orange-400 fill-orange-400" />
                  </motion.div>
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                  <motion.div
                    key={`empty-${i}`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + (fullStars + (hasHalfStar ? 1 : 0) + i * 0.1),
                      type: "spring",
                      stiffness: 200,
                      damping: 10,
                    }}
                  >
                    <Star className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-10 fhd:w-14 fhd:h-14 2k:w-18 2k:h-18 4k:w-26 4k:h-26 text-gray-300" />
                  </motion.div>
                ))}

                <span className="ml-1 fhd:ml-3 2k:ml-6 4k:ml-9 text-[12px] md:text-[16px] xl:text-[24px] fhd:text-[34px] 2k:text-[50px] 4k:text-[70px] font-medium text-gray-600">
                  {rating.toFixed(1)}
                </span>
              </div>
            </motion.div>

            <motion.div
              className="flex items-center mb-1 md:mb-2 fhd:mb-6 2k:mb-9 4k:mb-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <MapPin className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-10 fhd:w-14 fhd:h-14 2k:w-18 2k:h-18  4k:w-26 4k:h-26 mr-1 md:mr-2 fhd:mr-4 2k:mr-8 4k:mr-12 text-blue-500" />
              <span className="text-blue-500 font-normal text-[12px] -tracking-[0.44px] md:text-[16px] fhd:text-[40px] 2k:text-[55px] 4k:text-[83px]  md:-tracking-[0.87px] xl:text-[29px] xl:-tracking-[1.5px]">
                {address}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center text-gray-600 mb-1 md:mb-2 fhd:mb-6 2k:mb-9 4k:mb-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <Moon className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-14 fhd:w-14 fhd:h-12 2k:w-18 2k:h-18  4k:w-26 4k:h-26 mr-1 md:mr-2 fhd:mr-4 2k:mr-8 4k:mr-12 text-gray-500" />
              <span className="font-normal text-[12px] -tracking-[0.44px] md:text-[16px] fhd:text-[36px] 2k:text-[51px] 4k:text-[82px] md:-tracking-[0.87px] xl:text-[29px] xl:-tracking-[1.5px]">
                Nights: {nights}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center text-gray-600 mb-4 fhd:mb-6 2k:mb-9 4k:mb-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              whileHover={{ x: 5 }}
            >
              <Users className="w-4 h-4 md:w-6 md:h-6 xl:w-10 xl:h-10 fhd:w-14 fhd:h-12 2k:w-18 2k:h-18  4k:w-26 4k:h-26 mr-1 md:mr-2 fhd:mr-4 2k:mr-8 4k:mr-12 text-gray-500" />
              <span className="font-normal text-[12px] -tracking-[0.44px] md:text-[16px] fhd:text-[36px] 2k:text-[51px] 4k:text-[82px] md:-tracking-[0.87px] xl:text-[29px] xl:-tracking-[1.5px]">
                Travler(s): {travelers}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="flex justify-between items-center md:pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
      >
        <motion.div className="text-center" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
          <motion.p
            className="font-semibold py-2 2k:py-4 4k:py-8 text-[16px] -tracking-[0.44px] md:text-[29px] fhd:text-[42px] 2k:text-[52px] 4k:text-[75px] md:-tracking-[0.87px] xl:text-4xl xl:font-bold text-gray-900"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.9 + index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 10,
            }}
          >
            USD ${price}
          </motion.p>
          <p className="font-semibold text-[10px] -tracking-[0.44px] md:text-[11px] fhd:text-[21px] 2k:text-[29px] 4k:text-[40px] md:-tracking-[0.87px] text-gray-500">
            Inclusive taxes
          </p>
        </motion.div>

        <motion.button
          onClick={handleChooseRoom}
          className="px-4 py-2 md:px-8 md:py-4 2k:px-14 2k:py-7 4k:px-20 4k:py-12 rounded-md md:rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-4xl cursor-pointer btn-gradient text-white shadow-lg flex items-center font-bold text-[8px] -tracking-[0.41px] md:text-[11px] fhd:text-[20px] 2k:text-[30px] 4k:text-[40px] md:-tracking-[0.81px]"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(249, 108, 65, 0.4)",
            background: "linear-gradient(to left, #ea580c, #dc2626)",
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
        >
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 + index * 0.1 }}>
            CHOOSE ROOM
          </motion.span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-3 h-3 md:w-5 md:h-5 fhd:w-7 fhd:h-7 2k:w-12 2k:h-12 4k:w-16 4k:h-16   ml-1 md:ml-2 fhd:ml-3 2k:ml-5 4k:ml-8"
            initial={{ x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
            whileHover={{ x: 3 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </motion.svg>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default HotelCard