"use client"
import { Input } from "../../components/ui/input"
import Navbar from "../../common_components/navbar/page"
import TravelForm from "../../common_components/form/page"
import CarDiv from "../../common_components/cardiv/page"
import Rentals from "../../common_components/rentals/page"
import CoreBenefits from "../../components/ui/core-benefits"
import Footer from "../../components/ui/footer"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ToastContainer } from "react-toastify"
import { useState,useEffect } from "react"


export default function Page() {
  // const [token] = useLocalStorage('token', null)

  // console.log(token) // Now safe to use

  // Refs for scroll animations
  const heroRef = useRef(null)
  const formRef = useRef(null)
  const benefitsRef = useRef(null)
  const carDivRef = useRef(null)
  const rentalsRef = useRef(null)
  const footerRef = useRef(null)

  // useInView hooks for scroll-triggered animations
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 })
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 })
  const isBenefitsInView = useInView(benefitsRef, { once: true, amount: 0.3 })
  const isCarDivInView = useInView(carDivRef, { once: true, amount: 0.3 })
  const isRentalsInView = useInView(rentalsRef, { once: true, amount: 0.3 })
  const isFooterInView = useInView(footerRef, { once: true, amount: 0.3 })

  if (typeof window !== 'undefined') {
    const isForm = localStorage.getItem("setForm");
    if (isForm !== "true") {
      localStorage.removeItem('fullItinerary');
      localStorage.removeItem('selectedHotel');
      localStorage.removeItem('tripCities');
      localStorage.removeItem('userData');
      localStorage.removeItem('orderDetails');
      localStorage.removeItem('recommendedHotelsUrl');
      localStorage.removeItem('reservationDetailsByStop');
      localStorage.removeItem('setForm');
    }
  }

  //  const useResponsiveFontSize = () => {
  //   const [paddingSize, setpaddingSize] = useState('16px');
  //   const [widthSize, setWidthSize] = useState('auto');

  //   useEffect(() => {
  //     const updatePaddingSize = () => {
  //       const width = window.innerWidth;
  //       if (width >= 3840) { // 4K screens
  //         setWidthSize('60px');
  //         setpaddingSize('34rem');
  //       } else if (width >= 2560) { // 2K screens
  //          setWidthSize('130px');
  //       setpaddingSize('40px');
  //       } else if (width >= 1920) { // FHD screens
  //          setWidthSize('130px');
  //         setpaddingSize('30px');
  //       } else {
  //          setWidthSize('auto');
  //         setpaddingSize('auto');
  //       }
  //     };

  //     window.addEventListener('resize', updatePaddingSize);
  //     updatePaddingSize(); // Initial call

  //     return () => window.removeEventListener('resize', updatePaddingSize);
  //   }, []);

  //   return paddingSize,widthSize;
  // };

  //  const paddingSize = useResponsiveFontSize();
  //  const widthSize = useResponsiveFontSize();

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        ref={heroRef}
        className="max-md:bg-black sm:px-4 md:px-6 lg:px-8 pt-4 2k:pt-8 4k:pt-12 pb-12 sm:pb-16 min-h-[65vh] md:min-h-[50vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[40px]"
        initial={{ y: -50, opacity: 0 }}
        animate={isHeroInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.img
          src="./images/icons/hero.png"
          alt="HERO IMAGE"
          className="w-full max-md:hidden absolute top-0 left-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={isHeroInView ? { scale: 1, opacity: 1 } : { scale: 1.1, opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.2 }}
        />
        <motion.div
          className="px-3 z-50"
          initial={{ y: -30, opacity: 0 }}
          animate={isHeroInView ? { y: 0, opacity: 1 } : { y: -30, opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Navbar />
        </motion.div>
        <motion.div
          className="px-8 mt-4 pb-8 z-10 xl:hidden"
          initial={{ y: 30, opacity: 0 }}
          animate={isHeroInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <div className="max-w-sm md:max-w-md lg:max-w-lg mx-auto w-full space-y-6 ">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <motion.div
                  className="w-7 h-7 bg-gradient-to-b from-gray-600 to-gray-800 rounded-sm border-2 border-[#F96C41] flex items-center justify-center relative"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 rounded-sm border border-white/20"></div>
                  <img src="/images/icons/diamon_icon.png" className="w-3 h-3" />
                </motion.div>
              </div>
              <Input
                placeholder="Ask me"
                className="bg-[#323232] border-gray-700 text-[#FFFFFFAB] placeholder:text-[#FFFFFFAB] pl-12 pr-12 py-3 rounded-lg h-12"
              />
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src="/images/icons/mic_icon.png" className="h-5 w-5" />
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={isHeroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <p className="text-[#FFFFFF99] text-sm font-medium tracking-wider">OR FILL OUT THIS FORM</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={formRef}
        className="px-8 -mt-48 md:-mt-22 pb-8 xl:flex xl:justify-between xl:-mt-56 2xl:-mt-36 fhd:-mt-64 2k:mt-[-420px] 4k:mt-[-490px] xl:mr-16 fhd:px-36 2k:px-52 4k:px-[660px]  xl:mb-0"
        initial={{ y: 50, opacity: 0 }}
        animate={isFormInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="z-10 xl:ml-36 2xl:ml-48 mt-28 max-xl:hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={isFormInView ? { x: 0, opacity: 1 } : { x: -100, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h3
            className="text-[24px] fhd:text-[34px] 2k:text-[65px] 4k:text-[75px]  font-medium text-[#FFFFFFCF]"
            initial={{ y: 20, opacity: 0 }}
            animate={isFormInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Your Journey, Electrified.
          </motion.h3>
          <motion.h1
            className="xl:text-[40px] 2xl:text-[48px] fhd:text-[60px] 2k:text-[105px] 4k:text-[135px] font-bold text-white fhd:leading-18 2k:leading-25 4k:leading-35 leading-14"
            initial={{ y: 30, opacity: 0 }}
            animate={isFormInView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Your EV travel hub with
            <br />
            routes, hotels and
            <br />
            charging.
          </motion.h1>
        </motion.div>
        <motion.div
          className=" z-50 max-w-full md:max-w-10/12 xl:w-[543px] xl:h-[685px] 2k:w-[850px] 2k:h-[900px] 4k:w-[950px] 4k:h-[1100px]   max-xl:mx-auto"
          initial={{ x: 100, opacity: 0 }}
          animate={isFormInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <TravelForm />
        </motion.div>
      </motion.div>

      <motion.div
        ref={benefitsRef}
        className="px-8 pb-8 max-md:hidden"
        initial={{ y: 50, opacity: 0 }}
        animate={isBenefitsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <CoreBenefits />
      </motion.div>

      <motion.div
        ref={carDivRef}
        className="px-8 md:px-14 lg:px-20 mt-4 pb-8 xl:px-48 fhd:px-6 z-30"
        initial={{ y: 50, opacity: 0 }}
        animate={isCarDivInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="z-10 max-w-full mx-auto xl:w-[1200px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
          <CarDiv />
        </div>
      </motion.div>

      <motion.div
        ref={rentalsRef}
        className="px-8 md:px-14 lg:px-20 xl:px-48 fhd:px-6 mt-4 pb-8"
        initial={{ y: 50, opacity: 0 }}
        animate={isRentalsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-full mx-auto xl:w-[1196px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%] ">
          <Rentals />
        </div>
        
      </motion.div>

      <motion.div
        ref={footerRef}
        className=""
        initial={{ y: 50, opacity: 0 }}
        animate={isFooterInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Footer />
      </motion.div>
      <ToastContainer />
    </div>
  )
}