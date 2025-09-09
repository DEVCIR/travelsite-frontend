"use client"

import { useEffect, useState } from "react"
import { X, ShoppingCart, Minus, Plus } from "lucide-react"
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../../components/ui/sheet"

// Removed initialCartItems

export function CartSidebar() {
  const router = useRouter();
  const [reservationDetails, setReservationDetails] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  // Helper to sync localStorage and state
  const syncReservationDetails = (data) => {
    if (data) {
      setReservationDetails(JSON.parse(data));
    } else {
      setReservationDetails({});
    }
  };

  useEffect(() => {
    // Only access localStorage in browser environment
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem("reservationDetailsByStop");
      syncReservationDetails(data);
    }
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      const data = localStorage.getItem("reservationDetailsByStop");
      syncReservationDetails(data);
    };
    window.addEventListener('reservationDetailsUpdated', handleUpdate);
    return () => window.removeEventListener('reservationDetailsUpdated', handleUpdate);
  }, []);


  useEffect(() => {
    const openSidebar = () => setIsOpen(true);
    window.addEventListener('open-cart-sidebar', openSidebar);
    return () => window.removeEventListener('open-cart-sidebar', openSidebar);
  }, []);

  // Update quantity for a stop
  const updateQuantity = (stop, newQuantity) => {
    if (newQuantity < 1) return;
    setReservationDetails((prev) => {
      const updated = { ...prev };
      if (updated[stop]) {
        updated[stop] = { ...updated[stop], quantity: newQuantity };
        // Only access localStorage in browser environment
        if (typeof window !== 'undefined') {
          localStorage.setItem("reservationDetailsByStop", JSON.stringify(updated));
          window.dispatchEvent(new Event('reservationDetailsUpdated'));
        }
      }
      return updated;
    });
  };

  // Remove item for a stop
  const removeItem = (stop) => {
    setReservationDetails((prev) => {
      const updated = { ...prev };
      delete updated[stop];
      // Only access localStorage in browser environment
      if (typeof window !== 'undefined') {
        localStorage.setItem("reservationDetailsByStop", JSON.stringify(updated));
        window.dispatchEvent(new Event('reservationDetailsUpdated'));
      }
      return updated;
    });
  };

  // Get total items (sum of all quantities, default 1 if not set)
  const getTotalItems = () => {
    return Object.values(reservationDetails).reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // Get subtotal (sum of price * quantity)
  const getSubtotal = () => {
    return Object.values(reservationDetails).reduce((total, item) => total + ((item.price || item.selectedRoom?.price || 0) * (item.quantity || 1)), 0);
  };

  const handleCheckout = () => {
    router.push('/payment');
    setIsOpen(false);
  }

  // Custom sidebar and backdrop
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-[99] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] fhd:w-[600px] 2k:w-[700px] 4k:w-[1000px] bg-white z-[9999] shadow-lg flex flex-col transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ maxWidth: '90vw' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 fhd:py-5 2k:py-7 4k:py-10 border-b">
          <div className="flex items-center gap-2 fhd:gap-4 2k:gap-3 4k:gap-5">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 fhd:w-8 fhd:h-8 2k:w-10 2k:h-10 4k:w-14 4k:h-14" />
              <span className="absolute -top-2 -right-2 fhd:-top-3 fhd:-right-4 2k:-top-3 2k:-right-3 4k:-right-5 4k:-top-6 btn-gradient text-white text-xs rounded-full h-5 w-5 fhd:w-8 fhd:h-8 2k:w-9 2k:h-9 4k:w-14 4k:h-14 flex items-center justify-center text-[12px] fhd:text-[14px] 2k:text-[22px] 4k:text-[34px]">
                {getTotalItems()}
              </span>
            </div>
            <span className="text-lg fhd:text-2xl 4k:text-4xl font-medium">Your Cart</span>
          </div>
          <button className="px-2 py-2 hover:bg-gray-300 rounded-sm cursor-pointer" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-14 4k:h-14" />
          </button>
        </div>
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 4k:mt-4">
          <div className="space-y-4 fhd:space-y-6">
            {Object.keys(reservationDetails).length === 0 ? (
              <div className="text-center text-gray-500 py-10 text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium">Cart is empty</div>
            ) : (
              Object.entries(reservationDetails).map(([stop, item]) => (
                <div key={stop} className="relative">
                  <button
                    className="absolute top-0 right-0 4k:right-4 px-2 py-2 hover:bg-gray-300 rounded-sm cursor-pointer z-10"
                    onClick={() => removeItem(stop)}
                  >
                    <X className="h-4 w-4 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-14 4k:h-14" />
                  </button>
                  <div className="flex gap-3 pr-8">
                    <div className="w-16 h-16 fhd:w-24 fhd:h-24 2k:w-32 2k:h-32 4k:w-48 4k:h-48 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img
                        src={item.image || item.selectedRoom?.image || "/placeholder.svg"}
                        alt={item.name || item.selectedRoom?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-sm mb-1 4k:mb-4 fhd:text-lg 2k:text-2xl 4k:text-4xl">{item.name || item.selectedRoom?.name}</h3>
                      <p className="text-lg fhd:text-xl 2k:text-3xl 4k:text-5xl font-semibold text-gray-900 mb-2 4k:mb-5">${item.price || item.selectedRoom?.price}</p>
                      <div className="flex items-center gap-3">
                        <button
                          className="px-2 py-2 rounded-full bg-transparent cursor-pointer hover:bg-gray-300 border"
                          onClick={() => updateQuantity(stop, (item.quantity || 1) - 1)}
                        >
                          <Minus className="h-3 w-3 fhd:w-4 fhd:h-4 2k:w-6 2k:h-6 4k:w-10 4k:h-10" />
                        </button>
                        <span className="text-lg fhd:text-xl 2k:text-2xl 4k:text-4xl font-medium min-w-[20px] text-center">{item.quantity || 1}</span>
                        <button
                          className="px-2 py-2 rounded-full bg-transparent cursor-pointer hover:bg-gray-300 border"
                          onClick={() => updateQuantity(stop, (item.quantity || 1) + 1)}
                        >
                          <Plus className="h-3 w-3 fhd:w-4 fhd:h-4 2k:w-6 2k:h-6 4k:w-10 4k:h-10" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Subtotal and Actions */}
        <div className="border-t bg-gray-50 px-4 py-4 fhd:py-8 fhd:px-8 2k:py-14 4k:py-32 space-y-4">
          <div className="flex justify-between items-center 4k:mb-6">
            <span className="text-sm fhd:text-lg 2k:text-xl fhd:font-bold 4k:text-4xl font-medium text-gray-600 uppercase tracking-wide">Subtotal:</span>
            <span className="text-lg fhd:text-xl 2k:text-2xl 4k:text-5xl font-semibold text-gray-900">${getSubtotal()}</span>
          </div>
          <div className="space-y-4 4k:space-y-8">
            <Button className="w-full cursor-pointer bg-black hover:bg-gray-800 text-white font-medium py-3 fhd:py-7 2k:py-10 4k:py-14 rounded-full fhd:text-base 2k:text-xl 4k:text-4xl" size="lg">
              VIEW CART
            </Button>
            <Button onClick={handleCheckout} className="cursor-pointer w-full btn-gradient text-white font-medium py-3 fhd:py-7 2k:py-10 4k:py-14 rounded-full fhd:text-base 2k:text-xl 4k:text-4xl" size="lg">
              CHECKOUT
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
