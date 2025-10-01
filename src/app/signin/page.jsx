"use client"

import Navbar from "../../common_components/navbar/page"
import SignInForm from "../../common_components/signInForm/page"
import Rentals from "../../common_components/rentals/page"
import Footer from "../../components/ui/footer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export default function Page() {
  const headerRef = useRef(null)
  const formRef = useRef(null)
  const footerRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" })
  const isFooterInView = useInView(footerRef, { once: true })

  return (
    <div className="w-full min-h-screen bg-white overflow-hidden">
      {/* Animated Header Section */}
      <motion.div 
        ref={headerRef}
        className="bg-black px-3 sm:px-4 md:px-6 lg:px-8 fhd:px-10 2k:px-14 4k:px-16 pt-4  pb-12 sm:pb-16 min-h-[40vh] lg:min-h-[60vh] xl:min-h-[80vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />
        
        <motion.div 
          className="max-w-sm md:max-w-md lg:max-w-lg fhd:max-w-3xl 2k:max-w-5xl 4k:max-w-[88rem] mx-auto w-full space-y-2 fhd:space-y-4 2k:space-y-6 4k:space-y-8 mt-4 xl:mt-24  2k:mt-44 4k:mt-80  text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1 
            className="text-[#FFFFFFEB] font-bold text-[16px] -tracking-[0.41px] md:text-[26px] md:-tracking-[0.68px] xl:text-[45px] fhd:text-[55px] 2k:text-[75px] 4k:text-[110px]  xl:-tracking-[1.17px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          > 
            WELCOME BACK
          </motion.h1>
          
          <motion.div 
            className="text-[#FFFFFFAB] font-[400] text-[14px] -tracking-[0.41px] md:text-[23px] md:-tracking-[0.68px] xl:text-[40px] fhd:text-[55px] 2k:text-[70px] 4k:text-[100px] xl:-tracking-[1.17px] xl:-space-y-3"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              Log in to manage your EV trips
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              and hotel bookings.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Form Section */}
      <motion.div
        ref={formRef}
        className="-mt-24 md:-mt-18 lg:-mt-36 xl:-mt-40 pb-8 fhd:pb-16 2k:pb-20 4k:pb-28"
        initial={{ opacity: 0, y: 50 }}
        animate={isFormInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="mx-auto">
          <SignInForm />
        </div>
      </motion.div>

      {/* Mobile Rentals Section */}
      <motion.div
        className="mt-4 pb-8 px-8 md:px-14 lg:px-20  xl:px-48 fhd:px-[370px] 2k:px-[400px] 4k:px-[490px] mx-auto"
        initial={{ opacity: 0 }}
        animate={isFormInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="max-w-full mx-auto">
          <Rentals />
        </div>
      </motion.div>

      {/* Animated Footer */}
      <motion.div
        ref={footerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className=""
      >
        <Footer />
      </motion.div>
    </div>
  )
}