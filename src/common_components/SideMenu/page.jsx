"use client"

import { X, DollarSign } from "lucide-react"
import Link from "next/link"

export const SideMenu = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      {/* {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />} */}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-gray-900 text-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button onClick={onClose} className="text-orange-500 hover:text-orange-400 mb-8 cursor-pointer">
            <X size={24} />
          </button>

          {/* Quick Links Section */}
          <div className="mb-12">
            <h2 className="text-lg font-medium mb-6">Quick Links</h2>
            <nav className="space-y-4">
              <Link href="/home" className="block text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/rentbio" className="block text-gray-300 hover:text-white transition-colors">
                RentBio
              </Link>
              <Link href="/recommendedHotels" className="block text-gray-300 hover:text-white transition-colors">
                RecommendedHotels
              </Link>
              <Link href="/about-us" className="block text-gray-300 hover:text-white transition-colors">
                About us
              </Link>
              <Link href="/contactus" className="block text-gray-300 hover:text-white transition-colors">
                Contact us
              </Link>
              <Link href="/thankyou" className="block text-gray-300 hover:text-white transition-colors">
                Thankyou
              </Link>
            </nav>
          </div>

          {/* Payment Options Section */}
          <div className="mb-12">
            <h2 className="text-lg font-medium mb-6">Payment Options</h2>
            <div className="space-y-3">
              {/* First row of payment methods */}
              <div className="flex space-x-3">
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <span className="text-blue-600 font-bold text-sm">AMEX</span>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <span className="text-blue-600 font-bold text-sm">VISA</span>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <DollarSign className="text-green-600" size={20} />
                </div>
              </div>

              {/* Second row of payment methods */}
              <div className="flex space-x-3">
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <div className="flex space-x-1">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <span className="text-blue-600 font-bold text-sm">PayPal</span>
                </div>
                <div className="bg-white rounded px-3 py-2 flex items-center justify-center min-w-[60px]">
                  <span className="text-black font-medium text-sm">Pay</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
          <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
            Privacy Policy
          </a>
          <a href="/termsconditions" className="block text-gray-400 hover:text-white transition-colors text-sm">
            Terms & Conditions
          </a>
        </div>
      </div>
    </>
  )
}