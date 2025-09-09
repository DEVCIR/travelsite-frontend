"use client"
import React, { useState, useEffect } from 'react'
import { MapPin, Users, Check, Bed, Utensils, Moon, Star, User, Phone, Mail, Globe, ShieldCheck, SquareX, SquareCheck, DollarSign } from "lucide-react"
import Navbar from "../../common_components/navbar/page"
import Navbar1 from "../../common_components/navbar1/page"
import Footer from '../../components/ui/footer'
import Rentals from '../../common_components/rentals/page'
import CarDiv from '../../common_components/cardiv/page'
import countryData from 'country-code-flag-phone-extension-json/dist/index.json';
import { useRouter } from 'next/navigation';

function ReservationDetails() {

  const [isCheck, setIsCheck] = useState(false);
  const [reservation, setReservation] = useState(null);

  const [allReservations, setAllReservations] = useState({});
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    countryCode: '',
    phone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [isContinueLoading, setIsContinueLoading] = useState(false);


  useEffect(() => {
    const allSelections = JSON.parse(localStorage.getItem('reservationDetailsByStop') || '{}');
    // if (!allSelections || Object.keys(allSelections).length === 0) {
    //   router.push('/');
    //   return;
    // }
    setAllReservations(allSelections);
    // For backward compatibility, also load single reservation if present
    const details = localStorage.getItem("reservationDetails");
    if (details) {
      const parsed = JSON.parse(details);
      setReservation(parsed);
    } else {
      setReservation(null);
    }

    // Populate traveler details form if userData exists
    const userData = localStorage.getItem('user');
    const userData2 = localStorage.getItem('userData');
    if (userData2 && userData) {
      setForm(JSON.parse(userData2));
    }

    if (!userData && userData2) {
      setForm(JSON.parse(userData2));
    }

    if (!userData2 && userData) {
      setForm(JSON.parse(userData));
    }


    console.log("All Reservation Details:", allSelections);

    // Listen for cart updates
    const handleCartUpdate = () => {
      const updatedSelections = JSON.parse(localStorage.getItem('reservationDetailsByStop') || '{}');
      setAllReservations(updatedSelections);
    };
    window.addEventListener('reservationDetailsUpdated', handleCartUpdate);
    setLoading(false);
    return () => {
      window.removeEventListener('reservationDetailsUpdated', handleCartUpdate);
    };
  }, []);

  // Calculate total price of all reserved rooms
  const totalPrice = Object.values(allReservations).reduce(
    (sum, data) => sum + ((data.selectedRoom?.price || 0) * (data.quantity || 1)),
    0
  );

  // Helper functions for formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    // Accepts YYYY-MM-DD or YYYYMMDD
    if (dateStr.length === 8) {
      return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
    }
    if (dateStr.length === 10) {
      // YYYY-MM-DD
      return `${dateStr.slice(8, 10)}/${dateStr.slice(5, 7)}/${dateStr.slice(0, 4)}`;
    }
    return dateStr;
  };
  const getRoom = () => reservation?.selectedRoom || reservation?.room || {};

  const router = useRouter();

  // Handler for 'Book More Hotels' button
  const handleBookMoreHotels = () => {
    const url = localStorage.getItem('recommendedHotelsUrl');
    if (url) {
      router.push(url);
    } else {
      alert('No recommended hotels URL found.');
    }
  };

  // Add submit handler
  const handleContinue = (e) => {
    setIsContinueLoading(true);
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.countryCode || !form.phone || !form.email || !isCheck) {
      setIsContinueLoading(false);
      alert('Please fill all required fields.');
      return;
    }
    localStorage.setItem('userData', JSON.stringify(form));
    router.push('/payment');
  };

  return (
    loading ? (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 fhd:h-20 fhd:w-20 2k:h-24 2k:w-24 4k:w-28 4k:h-28  border-b-2 border-[#F96C41] mx-auto mb-4 fhd:mb-6 2k:mb-9 4k:mb-12"></div>
          <p className="text-gray-600 fhd:text-2xl 2k:text-4xl 4k:text-6xl">Loading</p>
        </div>
      </div>
    ) : (
      <div
        className="w-full min-h-screen bg-white"
      >

        <div className="bg-black  pt-4 pb-32 min-h-[50vh] md:min-h-[80vh] flex flex-col justify-start rounded-b-[18px]">
          <div className="xl:hidden px-4">
            <Navbar1 />
          </div>
          <div className="max-xl:hidden px-4">
            <Navbar />
          </div>

          <div className='w-full md:max-w-xl lg:max-w-3xl xl:max-w-5xl fhd:max-w-[89rem] 2k:max-w-[125rem] 4k:max-w-[175rem] mx-auto mt-10 md:mt-14 lg:mt-48 xl:mt-40 fhd:mt-56 2k:mt-66 4k:mt-[50rem] px-4 flex justify-between items-center'>
            <h1 className='text-white text-2xl fhd:text-5xl 2k:text-7xl 4k:text-9xl font-bold'>Reservation Details</h1>
            <button
              onClick={handleBookMoreHotels}
              className="btn-gradient cursor-pointer text-white font-semibold py-2 px-5 fhd:py-4 4k:py-8 4k:px-10 rounded-lg shadow-md transition-colors duration-200 text-[12px] md:text-[14px] fhd:text-[24px] 4k:text-[40px]"
            >
              Book More Hotels
            </button>
          </div>

        </div>


        {/* main content */}
        <div className={`-mt-[10rem] md:-mt-[32rem] lg:-mt-[18rem] xl:-mt-[19rem] lg:gap-x-5 fhd:gap-12 2k:gap-14 lg:grid ${Object.entries(allReservations).length === 1 ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} h-auto px-4 mx-auto w-full xl:w-[135vh] max-lg:space-y-4`}>
          {/* card1 */}
          {Object.entries(allReservations).length > 0 ? (
            Object.entries(allReservations).map(([stop, data]) => (
              <div key={stop} className="w-full h-auto p-4 fhd:p-8 2k:p-14 rounded-3xl fhd:rounded-4xl 2k:rounded-[3.5rem] 4k:rounded-[5rem] md:max-w-xl lg:max-w-2xl fhd:max-w-3xl 2k:max-w-5xl 4k:max-w-[115rem]  mx-auto bg-white shadow-2xl mb-6">
                <div className="pb-3">
                  <div className="space-y-1 fhd:space-y-3 2k:space-y-6 4k:space-y-10">
                    <h2 className="text-lg fhd:text-3xl 2k:text-5xl 4k:text-7xl font-semibold text-gray-900">{data.name || "Hotel Name"}</h2>
                  </div>
                  {/* Star Rating */}
                  <div className="flex items-center gap-1 fhd:gap-3 pt-1 fhd:pt-3 2k:pt-6 4k:pt-12">
                    {Array.from({ length: Math.floor(data?.rating || 4) }, (_, i) => (
                      <Star key={i} className="w-4 h-4 fhd:w-7 fhd:h-7 2k:w-12 2k:h-12 4k:w-18 4k:h-18 fill-orange-400 text-orange-400" />
                    ))}
                    {Array.from({ length: 5 - Math.floor(data?.rating || 4) }, (_, i) => (
                      <Star key={i + 10} className="w-4 h-4 fhd:w-7 fhd:h-7 2k:w-12 2k:h-12 4k:w-18 4k:h-18 text-gray-300" />
                    ))}
                  </div>
                  {/* Location */}
                  <div className="flex items-center gap-2 fhd:gap-3 pt-2 fhd:pt-2 2k:pt-5 4k:pt-10">
                    <MapPin className="w-5 h-5 fhd:w-6 fhd:h-6 2k:w-10 2k:h-10 4k:w-16 4k:h-16 text-blue-500" />
                    <span className="text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl text-[#3F97E2]">{data.address || "Hotel Address"}</span>
                  </div>
                </div>
                <div className="space-y-4 2k:space-y-6 fhd:mt-2 2k:mt-4 4k:mt-10  4k:space-y-8">
                  {/* Check-in/Check-out */}
                  <div className="flex-col items-center space-y-3 gap-3 fhd:space-y-5 2k:space-y-7 4k:space-y-9">
                    <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                      <SquareCheck className="w-6 h-6 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black rounded-sm" />
                      <div className='flex justify-between items-center w-full'>
                        <p className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-gray-900">Check in:</p>
                        <p className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl text-gray-600">{formatDate(data?.checkin) || "-"}</p>
                      </div>
                    </div>
                    <hr />
                    <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                      <SquareX className=' w-6 h-6 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black rounded-sm' />
                      <div className='flex justify-between items-center w-full'>
                        <p className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-gray-900">Check out:</p>
                        <p className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl text-gray-600">{formatDate(data?.checkout) || "-"}</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {/* Nights */}
                  <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                    <Moon className="w-6 h-6 fhd:w-8 fhd:h-8  2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-gray-900">Nights:</span>
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl text-gray-600">{data?.nights || 1}</span>
                    </div>
                  </div>
                  <hr />
                  {/* Room */}
                  <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                    <Bed className="w-6 h-6 fhd:w-8 fhd:h-8  2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black" />
                    <div className="flex justify-between gap-x-2 items-center w-full 2k:gap-x-28">
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-black">Room:</span>
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-3xl 4k:text-6xl text-gray-600">{data.selectedRoom?.name || "Room Name"}</span>
                    </div>
                  </div>
                  <hr />
                  {/* Meal */}
                  <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                    <Utensils className="w-6 h-6 fhd:w-8 fhd:h-8  2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-black">Meal:</span>
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl text-gray-600">{data.selectedRoom?.mealPlan || "Meal Plan"}</span>
                    </div>
                  </div>
                  <hr />
                  {/* Travelers */}
                  <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                    <Users className="w-6 h-6 fhd:w-8 fhd:h-8  2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-black" />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-black">Travelers:</span>
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-gray-600">{data?.sleeps ? `${data.sleeps} adult(s)` : "2 adult(s)"}</span>
                    </div>
                  </div>
                  <hr />
                  {/* Price */}
                  <div className="flex items-center gap-3 fhd:gap-5 2k:gap-7 4k:gap-9">
                    <DollarSign className="w-6 h-6 fhd:w-8 fhd:h-8  2k:w-12 2k:h-12 4k:w-20 4k:h-20 " />
                    <div className="flex justify-between items-center w-full">
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-medium text-black ">Price:</span>
                      <span className="text-sm md:text-lg fhd:text-2xl 2k:text-4xl 4k:text-6xl font-semibold text-gray-900">US$ {data.selectedRoom?.price ? data.selectedRoom.price.toFixed(2) : "375.00"}</span>
                    </div>
                  </div>
                  {/* Cancellation Policy */}
                  <div className="fhd:mt-6 2k:mt-10 4k:mt-16">
                    <div className="flex items-center gap-2 pt-2 cursor-pointer">
                      <ShieldCheck className="w-5 h-5 fhd:w-7  2k:w-10 2k:h-10 4k:w-18 4k:h-18 text-blue-500" />
                      <button className="text-blue-500 text-base fhd:text-xl 2k:text-3xl 4k:text-5xl hover:underline">Cancellation policy</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-auto p-4 rounded-3xl  mx-auto bg-white shadow-2xl mb-6">
              <div className="pb-3">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-gray-900">No reservations found</h2>
                </div>
              </div>
            </div>
          )}

        </div>





        {/* form */}
        <div className={` px-0 md:px-24 fhd:px-72 mx-auto ${Object.entries(allReservations).length > 0 ? "mt-10" : "mt-82"}`}>
          <div className="max-w-full mx-auto xl:w-[1200px] fhd:w-[1650px] 2k:w-[2170px] 4k:w-[3200px] p-6 fhd:p-8 2k:p-12  4k:p-28">
            {/* Total Section */}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl fhd:text-4xl 2k:text-5xl 4k:text-7xl font-bold text-gray-900">Total</h1>
              <span className="text-2xl fhd:text-4xl 2k:text-5xl 4k:text-7xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
            </div>

            {/* Form Section */}
            <div className="space-y-6 fhd:space-y-8 4k:space-y-12">
              <h2 className="text-xl fhd:text-4xl 2k:text-5xl 4k:text-7xl font-bold text-gray-900 mb-6 fhd:mb-14 2k:mb-18 4k:mb-22">Enter traveler details</h2>

              <form className="space-y-6 fhd:space-y-10 2k:space-y-14 4k:space-y-20">
                {/* Name Fields Row */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 fhd:gap-8 2k:gap-14 4k:gap-20">
                  <div className="relative">
                    <label htmlFor="firstName" className="md:text-sm text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl absolute top-[-12px] fhd:top-[-28px] 2k:top-[-34px] 4k:top-[-44px]  py-1 fhd:py-2.5 2k:py-4 4k:py-5 px-3 fhd:px-6 2k:px-9 4k:px-14 bg-[#F6F6F6] left-2 md:left-6 4k:left-10 font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12 text-gray-500" />
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                      className="w-full px-5 fhd:px-8 2k:px-12 4k:px-18  py-4 fhd:py-7 2k:py-10 4k:py-16 fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="lastName" className="md:text-sm text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl absolute top-[-12px] fhd:top-[-28px] 2k:top-[-34px] 4k:top-[-44px]  py-1 fhd:py-2.5 2k:py-4 4k:py-5 px-3 fhd:px-6 2k:px-9 4k:px-14 bg-[#F6F6F6] left-2 md:left-6 4k:left-10 font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12 text-gray-500" />
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-5 fhd:px-8 2k:px-12 4k:px-18  py-4 fhd:py-7 2k:py-10 4k:py-16 fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Country Code and Phone Row */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 fhd:gap-8 2k:gap-14 4k:gap-20">
                  <div className="relative">
                    <label htmlFor="countryCode" className="md:text-sm text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl absolute top-[-12px] fhd:top-[-28px] 2k:top-[-34px] 4k:top-[-44px]  py-1 fhd:py-2.5 2k:py-4 4k:py-5 px-3 fhd:px-6 2k:px-9 4k:px-14 bg-[#F6F6F6] left-2 md:left-6 4k:left-10 font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12 text-gray-500" />
                      Country Code
                    </label>
                    <select
                      id="countryCode"
                      value={form.countryCode}
                      onChange={e => setForm({ ...form, countryCode: e.target.value })}
                      className="w-full px-5 py-4 2k:px-12 4k:px-18 fhd:px-8  fhd:py-7  2k:py-10 4k:py-16  border border-gray-300 rounded-lg  fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl fhd:text-2xl 2k:text-4xl 4k:text-6xl text-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choose a country</option>
                      {countryData.map(country => (
                        <option key={country.code} value={country.phone_code}>
                          {country.emoji} {country.name} ({country.phone_code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-0 relative">
                    <label htmlFor="phoneNumber" className="md:text-sm text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl absolute top-[-12px] fhd:top-[-28px] 2k:top-[-34px] 4k:top-[-44px]  py-1 fhd:py-2.5 2k:py-4 4k:py-5 px-3 fhd:px-6 2k:px-9 4k:px-14 bg-[#F6F6F6] left-2 md:left-6 4k:left-10 font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12 text-gray-500" />
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Phone number"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                        onInput={(e) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, '');
                      }}
                      className="w-full px-5 fhd:px-8 2k:px-12 4k:px-18  py-4 fhd:py-7 2k:py-10 4k:py-16 fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label htmlFor="email" className="md:text-sm text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl absolute top-[-12px] fhd:top-[-28px] 2k:top-[-34px] 4k:top-[-44px]  py-1 fhd:py-2.5 2k:py-4 4k:py-5 px-3 fhd:px-6 2k:px-9 4k:px-14 bg-[#F6F6F6] left-2 md:left-6 4k:left-10 font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-3 h-3 fhd:w-6 fhd:h-6 2k:w-8 2k:h-8 4k:w-12 4k:h-12 text-gray-500" />
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-5 fhd:px-8 2k:px-12 4k:px-18  py-4 fhd:py-7 2k:py-10 4k:py-16 fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-300 rounded-lg fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}

              </form>
            </div>
            {/* continue */}
            <div className="w-full mx-auto py-6 fhd:py-8 2k:py-20 4k:py-28 space-y-6">
              {/* Notification Box */}
              <div className="bg-orange-50 border border-l-4 border-orange-100 border-l-[#F96C41] rounded-full  py-5 px-6 fhd:py-10 fhd:px-10 2k:py-14 2k:px-16 4k:py-18 4k:px-20">
                <p className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl text-gray-700 leading-relaxed">
                  <span className="font-medium">Note:</span> All communication regarding your booking will be sent to this email
                  address and/or mobile number.
                </p>
              </div>

              {/* Terms Agreement */}
              <div className={`flex ${isCheck === true ? 'items-center' : 'items-start'}  space-x-3 fhd:space-x-6 2k:space-x-8 px-2 fhd:px-4 2k:px-6 2k:py-10 4k:px-10 4k:py-16`}>
                {/* <Check/> */}
                <input id="orange-checkbox" type='checkbox' className={`h-5 w-5 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-18 4k:h-18  rounded-full border-2  border-gray-300 
                 
                 focus:outline-none focus:ring-2 focus:ring-orange-200
                 transition-colors duration-200 ${isCheck ? 'hidden' : undefined}`}
                  checked={isCheck}
                  onChange={() => setIsCheck(!isCheck)}
                  required
                />
                {isCheck && <Check onClick={() => setIsCheck(!isCheck)} className="w-5 h-5 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-18 4k:h-18 text-white font-bold bg-orange-500 rounded-full cursor-pointer" />
                }
                <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl text-gray-700 leading-relaxed cursor-pointer">
                  I understand and agree with the{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-600 underline">
                    Privacy Policy
                  </a>
                  , the{" "}
                  <a href="#" className="text-blue-500 hover:text-blue-600 underline">
                    Terms & Conditions
                  </a>{" "}
                  of <span className="font-medium">evcartrips</span>
                </label>
              </div>

              {/* Continue Button */}
              <button
                type="button"
                onClick={handleContinue}
                disabled={isContinueLoading}
                className="w-full cursor-pointer  btn-gradient text-white font-semibold py-3 fhd:py-6 2k:py-10 4k:py-16 px-6 fhd:px-10 2k:px-14 4k:px-18   rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl text-base fhd:text-xl 2k:text-4xl 4k:text-6xl"

              >
                {isContinueLoading ? (
                  <span className="flex items-center justify-center gap-2 fhd:gap-4 2k:gap-6 4k:gap-9">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 fhd:h-6 fhd:w-6 2k:h-8 2k:w-8 4k:h-12 4k:w-12 border-t-2 border-b-2 border-white"></span>
                    Loading...
                  </span>
                ) : (
                  'CONTINUE'
                )}
              </button>
            </div>
          </div>

        </div>


        <div className="px-8 md:px-14 lg:px-20 mt-4 pb-8 xl:px-48 fhd:px-6">
          <div className="max-w-full mx-auto xl:w-[1200px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
            <CarDiv />
          </div>
        </div>

        {/* Rentals Component */}
        <div className="px-8 md:px-14 lg:px-20 xl:px-48 fhd:px-6 mt-4 pb-8">
          <div className="max-w-full mx-auto xl:w-[1196px] fhd:w-[70%] 2k:w-[67%] 4k:w-[64%]">
            <Rentals />
          </div>
        </div>

        <div className="">
          <Footer />
        </div>
      </div >
    )
  )
}

export default ReservationDetails