"use client"

import { useState } from "react"
import Navbar from "../../common_components/navbar/page"
import { ChevronDown, ChevronUp } from "lucide-react"
import Footer from "../../components/ui/footer"

export default function FAQ() {
  const [openFAQ, setOpenFAQ] = useState(0) // First FAQ is open by default

  const faqs = [
    {
      question: "What is EVCarTrips?",
      answer:
        "EVCarTrips is a travel app that lets you easily book electric vehicles (EVs) and hotels in one place, making your eco-friendly journeys smooth and convenient.",
    },
    {
      question: "How do I book an EV car?",
      answer:
        "To book an EV car, simply search for your destination, select your preferred dates, choose from available electric vehicles, and complete your booking with secure payment options.",
    },
    {
      question: "Can I cancel my EV car booking?",
      answer:
        "Yes, you can cancel your EV car booking. Cancellation policies vary depending on the booking terms. Please check your booking details for specific cancellation conditions and any applicable fees.",
    },
    {
      question: "How do I book a hotel?",
      answer:
        "Booking a hotel is easy! Enter your destination and travel dates, browse through available accommodations, select your preferred hotel, and complete the reservation process.",
    },
    {
      question: "Can I cancel my hotel booking?",
      answer:
        "Hotel cancellation policies depend on the specific property and rate selected. Most bookings can be cancelled, but terms and conditions vary. Check your booking confirmation for detailed cancellation information.",
    },
  ]

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index)
  }

  return (
    <div className="w-full min-h-screen bg-white text-white overflow-hidden">

      {/* Mobile Status Bar Simulation */}
      <div className="bg-black pt-1 pb-4 min-h-[45vh] flex flex-col rounded-b-[20px] sm:rounded-b-[24px]">
        <Navbar />
      </div>

      {/* Breadcrumb */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl  fhd:max-w-[1430px] 2k:max-w-[2005px] 4k:max-w-[2995px]   mx-auto px-4 pt-4 mb-2 fhd:mb-4 2k:mb-8 4k:mb-14 -mt-60 fhd:-mt-[21rem] 2k:-mt-[24rem] 4k:-mt-[42rem]">
        <div className="flex items-center text-gray-400 text-sm 2k:text-3xl  fhd:text-xl 4k:text-5xl">
          <span>Home</span>
          <ChevronDown className="w-4 h-4 mx-2 rotate-[-90deg]" />
          <span>Pages</span>
          <ChevronDown className="w-4 h-4 mx-2 rotate-[-90deg]" />
          <span className="text-white">Frequently Asked Question</span>
        </div>
      </div>

      {/* Main Heading */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl  fhd:max-w-[1430px] 2k:max-w-[2005px] 4k:max-w-[2995px]  mx-auto px-4 mb-8 fhd:mb-16 2k:mb-20 4k:mb-28">
        <h1 className="text-4xl fhd:text-6xl 2k:text-7xl 4k:text-[7rem] font-bold text-white leading-tight">
          Frequently Asked
          <br />
          Question
        </h1>
      </div>

      {/* FAQ Section */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl fhd:max-w-[1430px] 2k:max-w-[2005px] 4k:max-w-[2995px] mx-auto px-4 space-y-4 2k:space-y-10 4k:space-y-16">
        {faqs.map((faq, index) => (
          <div key={index} className="rounded-2xl 2k:rounded-4xl 4k:rounded-[3rem] overflow-hidden shadow-lg">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-6 fhd:py-10 2k:py-14 2k:px-8 4k:py-20 4k:px-14 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-semibold text-gray-800 pr-4">{faq.question}</h3>
              {openFAQ === index ? (
                <ChevronUp className="w-6 h-6 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-18 4k:h-18 text-orange-500 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-6 h-6 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-18 4k:h-18 text-gray-400 flex-shrink-0" />
              )}
            </button>

            {openFAQ === index && (
              <div className="px-6 pb-6 fhd:px-10 fhd:pb-10 2k:px-14 2k:pb-14 4k:px-20 4k:pb-20 bg-white">
                <div className="border-l-4 fhd:border-l-[5px] 2k:border-l-[7px] 4k:border-l-[10px] border-gray-200 pl-4">
                  <p className="text-gray-600 fhd:text-2xl 2k:text-4xl 4k:text-5xl leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom spacing */}
      <div className="h-20"></div>

      <div className="">
        <Footer />
      </div>
    </div>
  )
}