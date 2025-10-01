
"use client"

import Footer from "../../components/ui/footer"
import CarDiv from "../../common_components/cardiv/page"
import HalfNavbar1 from "../../common_components/halfnavbar1/page"
import Rentals from "../../common_components/rentals/page"
import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/common_components/navbar/page"

export default function Page() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const headerRef = useRef(null)
  const checkmarkRef = useRef(null)
  const contentRef = useRef(null)
  const footerRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isCheckmarkInView = useInView(checkmarkRef, { once: true, margin: "-50px" })
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })
  const isFooterInView = useInView(footerRef, { once: true })


  useEffect(() => {
    try {
      const storedOrderDetails = localStorage.getItem("orderDetails");
      if (storedOrderDetails) {
        const parsedDetails = JSON.parse(storedOrderDetails);
        setOrderDetails(parsedDetails);
        setLoading(false);
        // Trigger animations after a short delay to ensure DOM is ready
        setTimeout(() => setIsVisible(true), 100);
      } else {
        // If no orderDetails found, redirect to home immediately
        console.log("No orderDetails found in localStorage, redirecting to home");
        router.push('/home');
      }
    } catch (error) {
      console.error("Error parsing orderDetails from localStorage:", error);
      // If there's an error parsing, also redirect to home
      router.push('/home');
    }
  }, [router]);

  // Format payment time
  const formatPaymentTime = (paymentTime) => {
    if (!paymentTime) return "N/A";
    try {
      const date = new Date(paymentTime);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return paymentTime;
    }
  };

  // Format payment method
  const formatPaymentMethod = (method) => {
    if (!method) return "N/A";
    return method.charAt(0).toUpperCase() + method.slice(1);
  };


  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-white flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 fhd:h-20 fhd:w-20 2k:h-24 2k:w-24 4k:w-28 4k:h-28  border-b-2 border-[#F96C41] mx-auto mb-4 fhd:mb-6 2k:mb-9 4k:mb-12"></div>
  //         <p className="text-gray-600 fhd:text-2xl 2k:text-4xl 4k:text-6xl">Loading....</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Header */}
      <motion.div
        ref={headerRef}
        className="bg-black px-3 sm:px-4 pt-1 pb-4 min-h-[10vh] md:min-h-[40vh] flex flex-col rounded-b-[16px] sm:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <div className="md:hidden">
          <HalfNavbar1 />
        </div>
        <div className="max-md:hidden">
          <Navbar />
        </div>
      </motion.div>

      <div className="w-full md:-mt-[210px] fhd:-mt-[310px] 2k:-mt-[410px] 4k:-mt-[580px] ">
        <div className="max-w-7xl  fhd:max-w-[105rem] 2k:max-w-[250rem] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <motion.div
            className="flex flex-col items-center justify-center text-center px-2 sm:px-4"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            {/* Animated Checkmark */}
            <motion.div
              ref={checkmarkRef}
              className="mb-4 sm:mb-6 2k:mb-8 4k:mb-12"
              initial={{ scale: 0 }}
              animate={isVisible ? {
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  delay: 0.2
                }
              } : {}}
            >
              <svg
                width="66"
                height="65"
                viewBox="0 0 66 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 sm:w-16 sm:h-16 md:w-[66px] md:h-[65px] fhd:w-[100px] fhd:h-[100px] 2k:w-[150px] 2k:h-[150px] 4k:w-[220px] 4k:h-[220px] "
              >
                <circle cx="32.7664" cy="32.387" r="32.387" fill="#F96C41" fillOpacity="0.19" />
                <path
                  d="M32.1882 16.9646C23.6905 16.9646 16.7659 23.8892 16.7659 32.387C16.7659 40.8847 23.6905 47.8093 32.1882 47.8093C40.686 47.8093 47.6106 40.8847 47.6106 32.387C47.6106 23.8892 40.686 16.9646 32.1882 16.9646ZM39.5601 28.8398L30.8156 37.5843C30.5997 37.8002 30.3067 37.9236 29.9983 37.9236C29.6898 37.9236 29.3968 37.8002 29.1809 37.5843L24.8163 33.2198C24.3691 32.7725 24.3691 32.0323 24.8163 31.585C25.2636 31.1378 26.0039 31.1378 26.4511 31.585L29.9983 35.1321L37.9254 27.2051C38.3726 26.7578 39.1129 26.7578 39.5601 27.2051C40.0074 27.6523 40.0074 28.3771 39.5601 28.8398Z"
                  fill="#F96C41"
                />
              </svg>
            </motion.div>

            {/* Animated Heading */}
            <motion.h1
              className="text-xl sm:text-2xl md:text-3xl fhd:text-4xl 4k:text-6xl text-gray-900 mb-2 fhd:mb-5 2k:mb-12 4k:mb-12 md:text-white/80"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Payment Success!
            </motion.h1>

            {/* Animated Amount */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl fhd:text-5xl 2k:text-6xl 4k:text-8xl font-bold text-gray-800 mb-4 sm:mb-6 md:text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? {
                opacity: 1,
                scale: 1,
                transition: {
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200
                }
              } : {}}
            >
              US$ {orderDetails?.totalPrice || "0.00"}
            </motion.p>

            {/* Payment Details Container */}
            <motion.div
              ref={contentRef}
              className="w-full fhd:mt-20 max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-6xl fhd:max-w-[83rem] 2k:max-w-[128rem] 4k:max-w-[184rem] rounded-lg p-3 sm:p-4 fhd:p-7 2k:p-14 md:p-6 mb-6 sm:mb-8 fhd:mb-10 2k:mb-14 4k:mb-18 bg-white shadow-lg"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Divider Line */}
              <motion.div
                className="w-full border-t border-gray-400 mb-4 sm:mb-6 fhd:mb-8 2k:mb-12 4k:mb-16"
                initial={{ scaleX: 0 }}
                animate={isVisible ? { scaleX: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.5 }}
              />

              {/* Payment Details - Staggered Animation */}
              <motion.div
                className="space-y-3 sm:space-y-4 fhd:space-y-8 2k:space-y-14 4k:space-y-20 "
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : {}}
                transition={{ delay: 0.9 }}
              >
                {[
                  { label: "Order ID", value: orderDetails?.orderId || "N/A" },
                  { label: "Payment Time", value: formatPaymentTime(orderDetails?.paymentTime) },
                  { label: "Payment Method", value: formatPaymentMethod(orderDetails?.paymentMethod) },
                  { label: "Sender Name", value: orderDetails?.senderName || "N/A" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.0 + index * 0.1 }}
                  >
                    <span className="text-gray-600 text-sm sm:text-base fhd:text-3xl 2k:text-5xl 4k:text-7xl text-left">{item.label}</span>
                    <span className="text-gray-900 font-medium text-sm sm:text-base fhd:text-3xl 2k:text-5xl 4k:text-7xl text-left">{item.value}</span>
                  </motion.div>
                ))}

                <motion.div
                  className="w-full border-t border-[#F96C41] border-dashed mb-4 sm:mb-6 fhd:mb-8 2k:mb-12 4k:mb-16"
                  initial={{ scaleX: 0 }}
                  animate={isVisible ? { scaleX: 1 } : {}}
                  transition={{ delay: 1.3, duration: 0.5 }}
                />

                {[
                  { label: "Amount", value: `US$ ${orderDetails?.totalPrice || "0.00"}` },
                  { label: "Tax", value: `US$ 0` }
                ].map((item, index) => (
                  <motion.div
                    key={index + 4}
                    className="flex justify-between items-center"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1.4 + index * 0.1 }}
                  >
                    <span className="text-gray-600 text-sm sm:text-base fhd:text-3xl 2k:text-5xl 4k:text-7xl  text-left">{item.label}</span>
                    <span className="text-gray-900 font-medium text-sm sm:text-base fhd:text-3xl 2k:text-5xl 4k:text-7xl text-left">{item.value}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Home Page Button */}
            <motion.div
              className="w-full max-w-sm sm:max-w-6xl fhd:max-w-[83rem] 2k:max-w-[128rem] 4k:max-w-[184rem]"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6, duration: 0.5 }}
            >
              <motion.button
                className="w-full fhd:text-xl 2k:text-4xl 4k:text-6xl  btn-gradient text-white font-semibold py-4 fhd:py-6 2k:py-10 4k:py-16 rounded-xl text-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/home')}
              >
                HOME PAGE
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animated CarDiv */}
      <motion.div
        className="px-8 md:px-14 lg:px-20 mt-4 pb-8 xl:px-48 fhd:px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <div className="max-w-full mx-auto xl:w-[1200px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <CarDiv />
        </div>
      </motion.div>

      {/* Animated Rentals */}
      <motion.div
        className="px-8 md:px-14 lg:px-20 xl:px-48 fhd:px-6 mt-4 pb-8 "
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.0, duration: 0.6 }}
      >
        <div className="max-w-full mx-auto xl:w-[1196px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <Rentals />
        </div>
      </motion.div>

      {/* Animated Footer */}
      <motion.div
        ref={footerRef}
        className=" overflow-y-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </div>
  )
}