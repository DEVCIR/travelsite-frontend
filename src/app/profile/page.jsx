"use client"

import Footer from "../../components/ui/footer";
import Navbar from "../../common_components/navbar/page";
import { ImageIcon, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "@/config/config";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

export default function EditProfilePage() {
  const router = useRouter();
  const headerRef = useRef(null);
  const profileRef = useRef(null);
  const infoRef = useRef(null);
  const bookingRef = useRef(null);
  const footerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // State for booking details
  const [bookingDetails, setBookingDetails] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Add form state for editing
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    birthDate: ""
  });

  const isHeaderInView = useInView(headerRef, { once: true });
  const isProfileInView = useInView(profileRef, { once: true, margin: "-100px" });
  const isInfoInView = useInView(infoRef, { once: true, margin: "-50px" });
  const isBookingInView = useInView(bookingRef, { once: true, margin: "-50px" });
  const isFooterInView = useInView(footerRef, { once: true });




  const getData = () => {

    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      fetch(`${apiUrl}/api/users/profile/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data);
          setProfile(data.data);
          if (data.data.profileImage) {
            setImagePreview(`${apiUrl}/${data.data.profileImage}`);
            // alert(`${apiUrl}/${data.data.profileImage}`);
          }
        })
        .catch((err) => console.error("Profile fetch error:", err));
    }
  }

  const fetchBookingDetails = async () => {
    setBookingLoading(true); // Start loading
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) {
      // alert('User not logged in');
      setBookingLoading(false); // Stop loading on error
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/users/bookingDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json();

      data.error ? null : setBookingDetails(data.data);
    } catch (err) {
      setBookingDetails([]);
      console.error('Error fetching booking details:', err);
    } finally {
      setBookingLoading(false); // Stop loading after fetch
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
      }
    }
    getData();
    fetchBookingDetails();
  }, []);

  // Populate form state when profile loads
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
        birthDate: profile.birthDate || ""
      });
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle update button click
  const handleUpdate = async () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      const formData = new FormData();

      // Append all form fields
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });

      // Append image if selected
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      try {
        const res = await fetch(`${apiUrl}/api/users/profile/${user.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        console.log(res.body);
        console.log(res);
        if (!res.ok) throw new Error("Update failed");
        const data = await res.json();
        setShowForm(false); // Hide form after update
        toast.success("Profile updated successfully!");
        getData();
      } catch (err) {
        toast.error("Error updating profile");
        console.error(err);
      }
    }
  };

   const inputRef = useRef(null);
  const datePickerRef = useRef(null);

useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

console.log("bookingDetails",bookingDetails);


  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <ToastContainer />
      {/* Animated Header */}
      <motion.div
        ref={headerRef}
        className="bg-black px-3 sm:px-4 pt-1 pb-4 min-h-[45vh] md:min-h-[50vh] flex flex-col rounded-b-[16px] sm:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Navbar />
      </motion.div>

      <div className="px-4 py-6 fhd:px-8 fhd:py-8 -mt-60 fhd:-mt-[20rem] 2k:-mt-[29rem] 4k:-mt-[37rem]">
        {/* Profile Image Section */}
        <motion.div
          ref={profileRef}
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isProfileInView ? {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 10
            }
          } : {}}
        >
          <div className="relative">
            <motion.div
              className="w-32 h-32 fhd:w-48 fhd:h-48 2k:w-72 2k:h-72 4k:w-96 4k:h-96 rounded-full overflow-hidden border-4 2k:border-8 border-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <img
                src={imagePreview || "/images/profile.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
            {showForm && (
              <>
                <motion.button
                  className="absolute -top-1 -right-1 bg-orange-500 rounded-lg p-2 hover:bg-orange-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current.click()}
                >
                  <ImageIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-20 4k:h-20 text-white" />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </>
            )}
          </div>
        </motion.div>

        <div className="xl:flex xl:gap-x-4 fhd:gap-x-10 xl:mx-auto xl:justify-center xl:items-start">
          {/* Edit Form */}
          {showForm ? (
            <motion.div
              ref={infoRef}
              className="w-[360px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[980px] 2k:w-[1280px] 4k:w-[1980px] fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[4rem] 2k:p-10 4k:p-14  fhd:mb-8 2k:mb-10 4k:mb-14  bg-white rounded-2xl p-6 mb-6 shadow-sm fhd:shadow-lg 2k:shadow-xl 4k:shadow-2xl max-xl:mx-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={isInfoInView ? {
                opacity: 1,
                x: 0,
                transition: { delay: 0.2 }
              } : {}}
            >
              <motion.h2
                className="text-xl fhd:text-3xl 2k:text-5xl  4k:text-7xl font-semibold text-gray-800 mb-4 pb-2 fhd:pb-4 2k:pb-6 border-b border-gray-200"
                initial={{ opacity: 0 }}
                animate={isInfoInView ? {
                  opacity: 1,
                  transition: { delay: 0.3 }
                } : {}}
              >
                Edit Profile
              </motion.h2>

              <motion.div
                className="space-y-4 fhd:space-y-6 2k:space-y-8 4k:space-y-14"
                initial={{ opacity: 0 }}
                animate={isInfoInView ? {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                } : {}}
              >
                {profile ? (
                  <>
                    <div className="md:flex md:items-center  max-md:space-y-4  md:gap-x-2 fhd:gap-x-6 2k:gap-x-8 4k:gap-x-12 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          First Name
                        </label>
                        <input type="text" name="firstName" className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl  px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8" value={form.firstName} onChange={handleInputChange} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          Last Name
                        </label>
                        <input type="text" name="lastName" className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl  px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8" value={form.lastName} onChange={handleInputChange} />
                      </motion.div>
                    </div>
                    <div className="md:flex md:items-center max-md:space-y-4  md:gap-x-2 fhd:gap-x-6 2k:gap-x-8 4k:gap-x-12 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          Gmail Adress
                        </label>
                        <input type="text" name="email" className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl  px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8" value={form.email} onChange={handleInputChange} />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          Phone Number
                        </label>
                        <input type="text" name="phoneNumber" className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl  px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8" value={form.phoneNumber} onChange={handleInputChange} />
                      </motion.div>
                    </div>
                    <div className="md:flex md:items-center max-md:space-y-4 md:gap-x-2 fhd:gap-x-6 2k:gap-x-8 4k:gap-x-12 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          Address
                        </label>
                        <input type="text" name="address" className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl  px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8" value={form.address} onChange={handleInputChange} />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                        className="md:w-2/4"
                      >
                        <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                          Date of Birth
                        </label>
                        <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={form.birthDate || ""}
        readOnly
        onClick={() => setShowDatePicker((prev) => !prev)}
        className="w-full text-black text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl border border-gray-400 rounded-sm fhd:rounded-lg 2k:rounded-2xl 4k:rounded-4xl px-2 py-1.5 fhd:px-4 fhd:py-3 2k:px-7 2k:py-5 4k:px-10 4k:py-8 cursor-pointer"
      />

      {showDatePicker && (
        <div ref={datePickerRef} className="absolute z-20 mt-1 w-full">
          <DatePicker
            selected={form.birthDate ? new Date(form.birthDate) : null}
            onChange={(date) => {
              const formattedDate = date.toLocaleDateString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
              });
              setForm({ ...form, birthDate: formattedDate });
              setShowDatePicker(false);
            }}
            maxDate={new Date()}
            inline
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={10}
            dropdownMode="select"
            calendarClassName="react-datepicker__calendar-custom"
            renderCustomHeader={({
              date,
              changeYear,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => (
              <div className="flex items-center justify-between px-2 py-1 fhd:px-4 fhd:py-2 2k:px-6 2k:py-3 4k:px-8 4k:py-4">
                <button
                  onClick={decreaseMonth}
                  disabled={prevMonthButtonDisabled}
                  className="p-1 fhd:p-2 2k:p-3 4k:p-4"
                >
                  <span className="text-base fhd:text-2xl 2k:text-3xl 4k:text-5xl">{"<"}</span>
                </button>

                <select
                  value={date.getFullYear()}
                  onChange={({ target: { value } }) => changeYear(value)}
                  className="mx-1 text-base fhd:text-2xl 2k:text-3xl 4k:text-5xl bg-transparent border-none outline-none"
                >
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year} className="text-base fhd:text-2xl 2k:text-3xl 4k:text-5xl">
                      {year}
                    </option>
                  ))}
                </select>

                <button
                  onClick={increaseMonth}
                  disabled={nextMonthButtonDisabled}
                  className="p-1 fhd:p-2 2k:p-3 4k:p-4"
                >
                  <span className="text-base fhd:text-2xl 2k:text-3xl 4k:text-5xl">{">"}</span>
                </button>
              </div>
            )}
          />
        </div>
      )}
    </div>
                      </motion.div>
                    </div>
                  </>
                ) : (
                  <p className="fhd:text-2xl 2k:text-4xl 4k:text-5xl">Loading...</p>
                )}
              </motion.div>

              {/* Edit Profile Button */}
              <div className="md:flex md:items-center mt-6 max-md:space-y-2  md:space-x-2 fhd:space-x-6 2k:space-x-12 4k:space-x-18">

                <motion.button
                  className="w-full cursor-pointer btn-gradient text-white font-bold py-4 px-6 fhd:py-5 2k:py-7 4k:py-10  fhd:px-8 2k:px-10 4k:px-14  fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl  fhd:text-2xl 2k:text-4xl 4k:text-5xl mt-6 fhd:mt-8 2k:mt-10 4k:mt-12 rounded-xl text-base transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInfoInView ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.9 }
                  } : {}}
                  onClick={() => setShowForm(!showForm)}
                >
                  Cancel
                </motion.button>

                <motion.button
                  className="w-full cursor-pointer btn-gradient text-white font-bold py-4 px-6 fhd:py-5 2k:py-7 4k:py-10  fhd:px-8 2k:px-10 4k:px-14  fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl  fhd:text-2xl 2k:text-4xl 4k:text-5xl mt-6 fhd:mt-8 2k:mt-10 4k:mt-12 rounded-xl text-base transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInfoInView ? {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.9 }
                  } : {}}
                  onClick={handleUpdate}
                >
                  Update
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              ref={infoRef}
              className="w-[360px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[980px] 2k:w-[1280px] 4k:w-[1980px] bg-white shadow-2xl rounded-2xl fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[4rem] p-6 2k:p-10 4k:p-14 mb-6 fhd:mb-8 2k:mb-10 4k:mb-14 max-xl:mx-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={isInfoInView ? {
                opacity: 1,
                x: 0,
                transition: { delay: 0.2 }
              } : {}}
            >
              <motion.h2
                className="text-xl fhd:text-3xl 2k:text-5xl  4k:text-7xl font-semibold text-gray-800 mb-4 pb-2 fhd:pb-4 2k:pb-6 border-b border-gray-200"
                initial={{ opacity: 0 }}
                animate={isInfoInView ? {
                  opacity: 1,
                  transition: { delay: 0.3 }
                } : {}}
              >
                Profile Information
              </motion.h2>

              <motion.div
                className="space-y-4 fhd:space-y-6 2k:space-y-9 4k:space-y-14"
                initial={{ opacity: 0 }}
                animate={isInfoInView ? {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                } : {}}
              >
                {profile ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                        Full Name
                      </label>
                      <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl">{`${profile.firstName} ${profile.lastName}`}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <label className="text-sm fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                        Date of Birth
                      </label>
                      <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl">{profile.birthDate}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <label className="text-sm fhd:text-xl 2k:text-3xl  4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                        Gmail Address
                      </label>
                      <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl">{profile.email}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <label className="text-sm  fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                        Phone Number
                      </label>
                      <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl">{profile.phoneNumber}</p>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={isInfoInView ? { opacity: 1, y: 0 } : {}}
                    >
                      <label className="text- fhd:text-xl 2k:text-3xl 4k:text-5xl font-medium text-gray-600 block mb-1 fhd:mb-3 2k:mb-6 4k:mb-10">
                        Address
                      </label>
                      <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-6xl">{profile.address}</p>
                    </motion.div>
                  </>
                ) : (
                  <p className="fhd:text-2xl 2k:text-4xl  4k:text-5xl">Loading...</p>
                )}
              </motion.div>

              {/* Edit Profile Button */}
              <motion.button
                className="w-full btn-gradient text-white font-bold py-4 fhd:py-5 2k:py-7 4k:py-10 px-6 fhd:px-8 2k:px-10 4k:px-14 rounded-xl fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl text-base fhd:text-2xl 2k:text-4xl 4k:text-5xl mt-6 fhd:mt-8 2k:mt-10 4k:mt-12 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInfoInView ? {
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.9 }
                } : {}}
                onClick={() => setShowForm(!showForm)}
              >
                EDIT PROFILE
              </motion.button>
            </motion.div>
          )}
          {/* Current Booking */}
          <motion.div
            ref={bookingRef}
            className="w-[360px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[980px] 2k:w-[1280px] 4k:w-[1980px] bg-white rounded-2xl fhd:rounded-3xl 2k:rounded-4xl 4k:rounded-[4rem] p-6 2k:p-10 4k:p-14 max-xl:mx-auto"
            initial={{ opacity: 0, x: 50 }}
            animate={isBookingInView ? {
              opacity: 1,
              x: 0,
              transition: { delay: 0.3 }
            } : {}}
          >
            <motion.h2
              className="text-xl fhd:text-3xl 2k:text-5xl  4k:text-7xl font-semibold text-gray-800 mb-4 pb-2 fhd:pb-4 2k:pb-6 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={isBookingInView ? {
                opacity: 1,
                transition: { delay: 0.4 }
              } : {}}
            >
              Current Booking
            </motion.h2>

            {bookingLoading ? (
              <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F96C41] mx-auto mb-4"></div>
                  <p className="text-gray-600 fhd:text-3xl 2k:text-5xl  4k:text-7x">Loading</p>
                </div>
              </div>
            ) : bookingDetails && bookingDetails.length === 0 ? (
              <div className="fhd:text-2xl 2k:text-4xl  4k:text-5xl">No bookings found.</div>
            ) : (
              <div className="max-h-96 4k:max-h-[700px] overflow-y-auto space-y-2 fhd:space-y-4 2k:space-y-6 4k:space-y-9">
                {bookingDetails.map((trip, idx) => (
                  <motion.div
                    key={trip._id}
                    className="bg-[#EBEBEB] rounded-xl fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl p-4 fhd:p-6 2k:p-8 4k:p-16 flex items-center justify-between"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isBookingInView ? {
                      opacity: 1,
                      scale: 1,
                      transition: { delay: 0.5 }
                    } : {}}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-8 h-8 fhd:w-12  fhd:h-12 2k:w-14 2k:h-14 4k:w-24 4k:h-24 bg-[#F96C41] rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 10 }}
                      >
                        <span className="text-white font-bold text-sm fhd:text-xl 2k:text-2xl 4k:text-4xl">{idx + 1}.</span>
                      </motion.div>
                      <div>
                        <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-5xl">{idx + 1} EV Trip</p>
                        <p className="text-gray-400 text-base fhd:text-2xl 2k:text-4xl 4k:text-5xl">{Object.keys(trip.reservations[0]).length} Hotel stays</p>
                      </div>
                    </div>
                    <motion.button
                      className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 fhd:py-3 2k:py-5 4k:py-[3rem]  fhd:px-6 2k:px-8 4k:px-16 rounded-lg fhd:rounded-xl 2k:rounded-2xl 4k:rounded-3xl text-sm fhd:text-xl 2k:text-2xl 4k:text-5xl transition-colors duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedOrder(trip);
                        setShowOrderModal(true);
                      }}
                    >
                      SEE DETAILS
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
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

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
          <div className="bg-white rounded-lg fhd:rounded-xl 2k:rounded-3xl 4k:rounded-4xl shadow-lg p-6 2k:p-9 4k:p-14 max-w-2xl fhd:max-w-4xl 2k:max-w-[85rem] 4k:max-w-[120rem] w-full relative">
            <button
              className="absolute top-2 fhd:top-4 2k:top-7 4k:top-10 right-2 fhd:right-4 2k:right-7 4k:right-10 text-gray-500 hover:text-gray-700 text-3xl fhd:text-4xl 2k:text-6xl 4k:text-8xl cursor-pointer"
              onClick={() => setShowOrderModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl fhd:text-2xl 2k:text-4xl 4k:text-6xl font-bold mb-4 fhd:mb-6 2k:mb-9 4k:mb-12">Order Details</h2>
            <div className="space-y-2 fhd:space-y-4 2k:space-y-6 4k:space-y-9 fhd:text-xl 2k:text-3xl 4k:text-5xl max-h-[80vh] 2k:max-h-[900vh] 4k:max-h-[100vh] overflow-y-auto  pr-2 ">
              <div><b>Order ID:</b> {selectedOrder.orderId}</div>
              <div><b>Amount:</b> {selectedOrder.amount / 100} {selectedOrder.currency}</div>
              <div><b>Payment Status:</b> {selectedOrder.paymentStatus}</div>
              <div><b>Customer Name:</b> {selectedOrder.customerName}</div>
              <div><b>Customer Email:</b> {selectedOrder.customerEmail}</div>
              <div><b>Customer Phone:</b> {selectedOrder.customerPhone}</div>
              <div><b>Total Price:</b> {selectedOrder.totalPrice}</div>
              <div><b>Reservations:</b>
                <ul className="list-disc  ml-6 fhd:ml-7 2k:ml-10 4k:ml-14 2k:mt-2 4k:mt-4">
                  {selectedOrder.reservations && selectedOrder.reservations[0] && Object.entries(selectedOrder.reservations[0]).map(([city, res]) => (
                    <li key={city} className="mb-2 fhd:mb-4 2k:mb-7 4k:mb-10">
                      <b >{res.city}:</b> {res.name} ({res.roomName})<br />
                      <b>Check-in:</b> {res.checkin} <b>Check-out:</b> {res.checkout}<br />
                      <b>Price:</b> {res.price} <b>Bed:</b> {res.bedType} <b>Meal:</b> {res.mealPlan}
                    </li>
                  ))}
                </ul>
              </div>
              <div><b>Created At:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}