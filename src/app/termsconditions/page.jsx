
"use client"

import Footer from "../../components/ui/footer"
import HalfNavbar from "../../common_components/halfnavbar/page"
import Navbar from "../../common_components/navbar/page"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function Page() {
  // Refs for animation triggers
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const footerRef = useRef(null)

  // Check if elements are in view
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" })
  const isContentInView = useInView(contentRef, { once: true, margin: "-100px" })
  const isFooterInView = useInView(footerRef, { once: true })

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
      {/* Animated Header Section */}
      <motion.div
        className="bg-black pt-1 pb-4 min-h-[45vh] flex flex-col rounded-b-[16px] sm:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      {/* Main Content */}
      <div className="w-full -mt-60 fhd:-mt-96 2k:-mt-[32rem] 4k:-mt-[46em]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 xl:px-28 fhd:px-36 py-8 fhd:py-20 2k:py-24 4k:py-32">
          {/* Breadcrumb Animation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl fhd:max-w-[95rem] 2k:max-w-[126rem] 4k:max-w-[189rem] 2k:text-3xl mx-auto text-sm fhd:text-xl 4k:text-5xl text-[#FFFFFFCC] mb-2 fhd:mb-4 2k:mb-8 4k:mb-12"
          >
            Home &gt; Pages &gt; <span className="text-[#FFFFFF]">Terms and Conditions</span>
          </motion.div>

          {/* Title Section with Scroll Animation */}
          <motion.div
            ref={titleRef}
            className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl fhd:max-w-[95rem] 2k:max-w-[126rem] 4k:max-w-[189rem] mb-6 fhd:mb-10 2k:mb-14 4k:mb-20  mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.h1
              className="text-3xl sm:text-4xl fhd:text-6xl 2k:text-7xl 4k:text-[7rem] font-bold text-white"
              initial={{ opacity: 0 }}
              animate={isTitleInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Terms and Conditions
            </motion.h1>
            <motion.h2
              className="text-2xl sm:text-3xl fhd:text-5xl 2k:text-6xl 4k:text-[6rem] font-bold text-white"
              initial={{ opacity: 0 }}
              animate={isTitleInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              EvCarTrips.com
            </motion.h2>
          </motion.div>

          {/* Content Box with Staggered Animations */}
          <motion.div
            ref={contentRef}
            className="bg-white shadow-2xl w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl fhd:max-w-[95rem] 2k:max-w-[126rem] 4k:max-w-[189rem] h-auto p-4 fhd:p-6 2k:p-10 4k:p-16 rounded-lg 2k:rounded-xl 4k:rounded-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isContentInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="mb-6 2k:mb-8 4k:mb-14 fhd:text-2xl 2k:text-3xl 4k:text-5xl text-gray-800 leading-relaxed max-w-4xl fhd:max-w-[85rem] 2k:max-w-[113rem] 4k:max-w-[175rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to EvCarTrips.com!<br />
              By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, including vehicle bookings, trip planning, and all other related services. Please read them carefully before proceeding.<br />
              By using EvCarTrips.com, you acknowledge that:
            </motion.p>

            <motion.ul
              className="list-disc mt-10 pl-6 mb-6 fhd:mt-18 fhd:pl-8 fhd:mb-8 2k:mt-24 2k:pl-12 2k:mb-12 4k:mt-32 4k:pl-18 4k:mb-20 space-y-2 fhd:space-y-4 2k:space-y-6 4k:space-y-12 fhd:text-2xl 2k:text-3xl 4k:text-5xl text-gray-800 max-w-4xl fhd:max-w-[85rem] 2k:max-w-[113rem] 4k:max-w-[175rem] marker:text-[#F96C41]"
              initial={{ opacity: 0 }}
              animate={isContentInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={isContentInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                All users must provide accurate and complete information during registration or booking.
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={isContentInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Vehicle availability, pricing, and trip schedules are subject to change without prior notice.
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={isContentInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                You are responsible for complying with local traffic laws and ensuring the safety of the rented vehicle.
              </motion.li>
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={isContentInView ? { x: 0, opacity: 1 } : {}}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                Any misuse or damage to the vehicle during your trip will result in applicable charges as per our policy.
              </motion.li>
            </motion.ul>

            <motion.p
              className="text-gray-800 mt-10 fhd:mt-18 fhd:text-2xl 2k:text-3xl 4k:text-5xl leading-relaxed max-w-4xl fhd:max-w-[85rem] 2k:max-w-[113rem] 4k:max-w-[175rem]"
              initial={{ opacity: 0, y: 20 }}
              animate={isContentInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.0, duration: 0.5 }}
            >
              We reserve the right to update these terms at any time. Continued use of the platform following any changes implies acceptance of the revised terms.<br />
              If you have any questions or concerns regarding these terms, please contact us at
              <div><a href="mailto:support@evcartrips.com" className="text-[#F96C41] hover:underline">support@evcartrips.com</a></div>
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Animated Footer */}
      <motion.div
        ref={footerRef}
        className=""
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </div>
  )
}