import { User } from "lucide-react"

export default function HalfNavbar() {
  return (
    <nav className="bg-black px-4 py-3 flex items-center justify-between">
     
      <div className="flex items-center">
        <img src="/images/icons/burger_icon.png" className="h-8 w-8 md:h-10 md:w-10" alt="Menu" />
      </div>

    
      <div className="flex items-center">
        <img src="/images/evcartrips-logo.png" alt="evcartrips.com" className="h-8 w-auto md:h-10" />
      </div>

   
      <div className="flex items-center space-x-2 md:space-x-3">
        
        <div className="relative">
          <img src="/images/icons/cart_icon.png" className="h-5 w-5 md:h-6 md:w-6" alt="Cart" />
          <div className="absolute -top-0 -right-0 bg-orange-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
            1
          </div>
        </div>

        
        <div className="bg-gray-600 rounded-full p-1">
          <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </div>
      </div>
    </nav>
  )
}
