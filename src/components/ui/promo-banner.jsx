import Image from "next/image"
import { Button } from "../../components/ui/button"
import { Play } from "lucide-react"

export default function PromoBanner()

{
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-black text-white p-6 md:p-8 lg:p-10">
      <Image
        src="/placeholder.svg?height=300&width=800"
        alt="EV Car Charging"
        layout="fill"
        objectFit="cover"
        className="opacity-50"
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            EV Drivers Deserve Better
          </h2>
          <p className="text-lg md:text-xl font-semibold">
            Join the Club. Get More. Pay Less.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="relative bg-yellow-500 text-black font-bold py-2 px-4 rounded-full text-sm md:text-base shadow-md transform rotate-6 -translate-y-4 translate-x-4">
            Big Discounts Free Charging
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full shadow-md hover:from-orange-600 hover:to-red-700">
            JOIN NOW <Play className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
  
}
