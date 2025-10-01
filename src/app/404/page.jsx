import Link from "next/link"
import Navbar from "../../common_components/navbar/page"
import Footer from "../../components/ui/footer"

export default function Custom404() {
  return (
   <div className="min-h-screen bg-blue-500">
      
      <div className="bg-black px-3 sm:px-4 pt-1 pb-4 min-h-[10vh] flex flex-col">
        <Navbar />
      </div>

      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        {/* Large 404 Text */}
        <div className="mb-4 fhd:mb-6 2k:mb-10 4k:mb-16">
          <h1 className="text-8xl md:text-9xl fhd:text-[12rem] 2k:text-[16rem] 4k:text-[24rem] font-black text-black leading-none">404</h1>
        </div>

        {/* Not Found Text */}
        <div className="mb-8 fhd:mb-10 2k:mb-14 4k:mb-18">
          <h2 className="text-2xl md:text-3xl fhd:text-5xl 2k:text-7xl 4k:text-8xl font-bold text-gray-600">Not Found!</h2>
        </div>

        {/* 404 Illustration */}
        <div className="mb-8 fhd:mb-10 2k:mb-14 4k:mb-18">
          <img src="/images/404.png" alt="404 Error Illustration" className="w-64 h-auto md:w-80 fhd:w-[35rem] 2k:w-[50rem] 4k:w-[85rem]" />
        </div>

        {/* Error Message */}
        <div className="mb-8 max-w-md fhd:max-w-2xl 2k:max-w-4xl 4k:max-w-6xl">
          <p className="text-gray-500 text-base md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl leading-relaxed">
            Oops! Sorry, we can't find the page you're looking for. It might have been moved, deleted, or maybe it never
            existed.
          </p>
        </div>

        {/* Back to Home Button */}
        <div className="w-full fhd:mb-4 2k:mb-8 4k:2k:mb-14 max-w-sm fhd:max-w-xl 2k:max-w-3xl 4k:max-w-6xl">
          <Link href="/">
            <button className="w-full btn-gradient text-white font-bold py-4 fhd:py-5 2k:py-7 4k:py-10 px-6 fhd:px-8 2k:px-10 4k:px-14 rounded-xl fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl text-base fhd:text-2xl 2k:text-4xl 4k:text-5xl mt-6 fhd:mt-8 2k:mt-10 4k:mt-12 transition-all duration-200 shadow-lg">
              BACK TO HOME
            </button>
          </Link>
        </div>
      </div>
      {/* Animated Footer */}
            <div className="">

              <Footer />
            </div>
           
    </div>
  )
}
