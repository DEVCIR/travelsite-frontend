"use client"

import Footer from "../../components/ui/footer";
import Navbar from "../../common_components/navbar/page";
import { ChevronRight, ArrowRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function BlogPage() {
  const headerRef = useRef(null);
  const breadcrumbRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const footerRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true });
  const isBreadcrumbInView = useInView(breadcrumbRef, { once: true });
  const isTitleInView = useInView(titleRef, { once: true });
  const isFooterInView = useInView(footerRef, { once: true });

  return (
    <div className="min-h-screen bg-white text-white overflow-hidden z-10">
      {/* Animated Header */}
      <motion.div
        ref={headerRef}
        className="bg-black pt-1 pb-4 fhd:pb-10 min-h-[45vh] flex flex-col rounded-b-[16px] sm:rounded-b-[20px] z-20"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Navbar />
      </motion.div>

      <div className="w-full -mt-60 fhd:-mt-[20rem] 2k:-mt-[32rem] 4k:-mt-[46em] z-40">
        {/* Breadcrumb Navigation */}
        <motion.div
          ref={breadcrumbRef}
          className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-5xl fhd:max-w-[1530px] 2k:max-w-[1979px] 4k:max-w-[2950px] mx-auto px-4 py-4"
          initial={{ opacity: 0, x: -20 }}
          animate={isBreadcrumbInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center text-gray-400 text-sm 2k:text-3xl  fhd:text-xl 4k:text-5xl">
            <span>Home</span>
            <ChevronRight className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-14 2k:h-14 4k:w-20 4k:h-20 mx-2 fhd:mx-4 2k:mx-8 4k:mx-14" />
            <span>Pages</span>
            <ChevronRight className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-14 2k:h-14 4k:w-20 4k:h-20 mx-2 fhd:mx-4 2k:mx-8 4k:mx-14" />
            <span className="text-white">Blog</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          ref={titleRef}
          className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-5xl fhd:max-w-[1530px] 2k:max-w-[1979px] 4k:max-w-[2950px] mx-auto px-4 mb-8 fhd:mb-12 2k:mb-16 4k:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl fhd:text-5xl 2k:text-6xl 4k:text-[6rem] font-bold leading-tight"
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            EV Travel & Hotel Booking
            <br />
            Insights
          </motion.h1>
        </motion.div>

        {/* Blog Cards */}
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl fhd:max-w-[1040px] 2k:max-w-[1508px] 4k:max-w-[2090px]  px-4  space-y-6 fhd:space-y-10 2k:space-y-14 4k:space-y-20 mx-auto mb-24">
          {/* First Blog Card */}
          <motion.div
            ref={(el) => (cardsRef.current[0] = el)}
            className="flex justify-center gap-x-3 sm:gap-x-6 md:gap-x-8 fhd:gap-x-10 2k:gap-x-14 4k:gap-x-18 bg-white rounded-2xl fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[3.5rem] p-6 fhd:p-10 2k:p-14 4k:p-20 text-black shadow-xl fhd:shadow-2xl 2k:shadow-2xl border border-gray-100 w-full max-w-2xl fhd:max-w-[1030px] 2k:max-w-[1488px] 4k:max-w-[2080px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="w-[230px] sm:w-[280px] md:w-[320px] lg:w-[360px] fhd:w-[520px] 2k:w-[700px] 4k:w-[1070px] sm:flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <img
                src="/images/car.png"
                alt="CAR IMAGEE"
                className="w-full h-auto  rounded-md fhd:rounded-xl 2k:rounded-3xl 4k:rounded-[3rem]"
              />
            </motion.div>
            <div className="flex flex-col sm:flex-1 sm:min-h-[200px] sm:justify-between">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
              >
                <motion.div
                  className="mb-3 fhd:mb-5 2k:mb-10 4k:mb-16"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="bg-blue-500 text-white text-xs fhd:text-lg 2k:text-2xl 4k:text-5xl px-4 fhd:px-5 2k:px-8 4k:px-9 py-1.5 fhd:py-3 2k:py-5 4k:py-6 rounded-full font-semibold">
                    Electric Car
                  </span>
                </motion.div>
                <motion.h2
                  className="text-[14px] sm:text-[20px] md:text-[24px] lg:text-[26px] fhd:text-[32px] 2k:text-[55px] 4k:text-[75px] font-semibold leading-[17px] sm:leading-[24px] md:leading-[28px] lg:leading-[32px] fhd:leading-[40px] 2k:leading-[54px] 4k:leading-[88px] -tracking-[0.25px] mb-2 fhd:mb-6 2k:mb-10 4k:mb-16 text-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  Why Renting an EV
                  <br />
                  is the Smartest Way
                  <br />
                  to Travel in 2025
                </motion.h2>
                <motion.p
                  className="text-gray-500 text-[14px] fhd:text-[26px] 2k:text-[38px] 4k:text-[50px] font-normal leading-[17px] fhd:leading-[20px] 2k:leading-[30px] 4k:leading-[42px] -tracking-[0.25px] mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  5 min read
                </motion.p>
              </motion.div>

              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] fhd:w-[50px] fhd:h-[50px] 2k:w-[70px] 2k:h-[70px] 4k:w-[110px] 4k:h-[110px] bg-orange-50 border-2 fhd:border-4 4k:border-8  border-orange-200 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-10 2k:h-10 4k:w-16 4k:h-16 text-orange-500" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Second Blog Card */}
          <motion.div
            ref={(el) => (cardsRef.current[1] = el)}
            className="flex justify-center gap-x-3 sm:gap-x-6 md:gap-x-8 fhd:gap-x-10 2k:gap-x-14 4k:gap-x-18 bg-white rounded-2xl fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[3.5rem] p-6 fhd:p-10 2k:p-14 4k:p-20 text-black shadow-xl fhd:shadow-2xl 2k:shadow-2xl  border border-gray-100 w-full max-w-2xl fhd:max-w-[1030px] 2k:max-w-[1488px] 4k:max-w-[2080px]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="w-[230px] sm:w-[280px] md:w-[320px] lg:w-[360px] fhd:w-[520px]  2k:w-[700px] 4k:w-[1070px] sm:flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <img
                src="/images/bed.png"
                alt="Hotel"
                className="w-full h-auto object-cover rounded-md fhd:rounded-xl 2k:rounded-3xl 4k:rounded-[3rem]"
              />
            </motion.div>
            <div className="flex flex-col flex-1 sm:min-h-[200px] justify-between">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.6 }}
              >
                <motion.div
                  className="mb-3 fhd:mb-5 2k:mb-10 4k:mb-16"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <span className="bg-blue-500 text-white text-xs fhd:text-lg 2k:text-2xl 4k:text-5xl px-4 fhd:px-5 2k:px-8 4k:px-9 py-1.5 fhd:py-3 2k:py-5 4k:py-6 rounded-full font-semibold">
                    Hotel
                  </span>
                </motion.div>
                <motion.h2
                  className="text-[14px] sm:text-[20px] md:text-[24px] lg:text-[26px] fhd:text-[32px] 2k:text-[55px] 4k:text-[75px] font-semibold leading-[17px] sm:leading-[24px] md:leading-[28px] lg:leading-[32px] fhd:leading-[40px] 2k:leading-[54px] 4k:leading-[88px] -tracking-[0.25px] mb-2 fhd:mb-6 2k:mb-10 4k:mb-16 text-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  How to Find the
                  <br />
                  Best Hotel Deals
                  <br />
                  with EVCarTrips
                </motion.h2>
                <motion.p
                  className="text-gray-500 text-[14px] fhd:text-[26px] 2k:text-[38px] 4k:text-[50px] font-normal leading-[17px] fhd:leading-[20px] 2k:leading-[30px] 4k:leading-[42px] -tracking-[0.25px] mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  4 min read
                </motion.p>
              </motion.div>

              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
              >
                <motion.div
                  className="w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] fhd:w-[50px] fhd:h-[50px] 2k:w-[70px] 2k:h-[70px] 4k:w-[110px] 4k:h-[110px] bg-orange-50 border-2 fhd:border-4 4k:border-8  border-orange-200 rounded-full flex items-center justify-center hover:bg-orange-100 transition-colors cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowRight className="w-4 h-4 fhd:w-6 fhd:h-6 2k:w-10 2k:h-10 4k:w-16 4k:h-16 text-orange-500" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Animated Footer */}
      <motion.div
        ref={footerRef}
        className=""
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}