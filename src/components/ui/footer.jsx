import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl fhd:max-w-[70%] 2k:max-w-[67%] 4k:max-w-[64%] mx-auto px-6 py-8 fhd:py-22 4k:py-32">
        <div className="flex flex-row max-sm:flex-col  max-lg:items-center justify-between items-start gap-8">
          {/* Left side - Logo and Quick Links */}
          <div className="flex-1">
            {/* Logo */}
            <div className="mb-8">
              <img src="/images/evcartrips-logo.png" alt="EVCartrips Logo" width={200} height={60} className="h-12 w-auto fhd:h-18 2k:h-22 4k:h-36" />
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 fhd:mb-8 4k:mb-14 text-lg fhd:text-2xl 2k:text-4xl 4k:text-7xl">Quick Links</h3>
              <nav className="flex flex-wrap gap-6 2k:gap-10 4k:gap-16  max-sm:gap-x-6 max-sm:gap-y-2 max-2k:gap-y-4 max-4k:gap-y-6">
                <Link href="/home" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  Home
                </Link>
                <Link href="/about-us" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  About us
                </Link>
                <Link href="/contactus" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  Contact us
                </Link>
                <Link href="/signup" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  Sign-up
                </Link>
                <Link href="/signin" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  Sign-in
                </Link>
                <Link href="/thankyou" className="text-white fhd:text-xl 2k:text-2xl 4k:text-5xl hover:text-orange-500 transition-colors">
                  Thankyou
                </Link>
              </nav>
            </div>
          </div>

          {/* Right side - Payment Methods */}
          <div className="flex-shrink-0 ">
            <div className="grid grid-cols-3 gap-3 4k:gap-5  max-sm:gap-x-10 max-sm:gap-y-4">
              {/* Row 1 */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[200px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <span className="text-black font-bold text-sm fhd:text-2xl 4k:text-5xl">AMEX</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[250px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <span className="text-black font-bold text-sm fhd:text-2xl 4k:text-5xl">VISA</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[250px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <span className="text-black font-bold text-xl fhd:text-4xl 4k:text-7xl ">$</span>
              </div>

              {/* Row 2 */}
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[250px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <div className="flex items-center">
                  <div className="w-4 h-4 fhd:w-8 fhd:h-8 4k:w-14 4k:h-14  bg-red-500 rounded-full"></div>
                  <div className="w-4 h-4 fhd:w-8 fhd:h-8 4k:w-14 4k:h-14 bg-yellow-400 rounded-full -ml-2"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[250px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <span className="text-blue-600 font-bold text-sm fhd:text-2xl 4k:text-5xl">PayPal</span>
              </div>
              <div className="bg-white rounded-lg px-4 py-2 flex items-center justify-center min-w-[70px] fhd:min-w-[80px] 2k:min-w-[140px] 4k:min-w-[250px] h-10 fhd:h-16 2k:h-20 4k:h-32">
                <span className="text-black font-semibold text-sm fhd:text-2xl 4k:text-5xl">🍎 Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section with divider */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl fhd:max-w-[70%] 2k:max-w-[67%] 4k:max-w-[64%] mx-auto px-6 py-4 fhd:py-6 4k:py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm fhd:text-lg 2k:text-3xl 4k:text-5xl text-gray-400">
            <Link href="/termsconditions" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>

            <div className="text-center">© 2025 EVCartrips</div>

            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}