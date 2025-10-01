"use client"

import { useState,useEffect } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import { motion } from "framer-motion"
import { apiUrl } from "@/config/config"

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm_password: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      setLoading(true);
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/")
    }

    setLoading(false);
  }, [])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error.message || "Signup failed";
        if (errorMessage.toLowerCase().includes("email already exists")) {
          toast.error("Email already exists");
        } else {
          toast.error(errorMessage);
        }
        return;
      }

      toast.success("Account created successfully!");
      setTimeout(() => {
        router.push("/signin");
      }, 3000)
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-[350px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[1030px] 2k:w-[1358px] 4k:w-[2050px] bg-[#FFFFFF] rounded-t-3xl rounded-b-3xl shadow-xl px-4 md:px-6 xl:px-10 2k:px-14 4k:px-24 xl:py-10 py-6 2k:py-14 4k:py-24 -mt-4 relative z-40 mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 fhd:space-y-7 2k:space-y-10 4k:space-y-16">
        {/* First Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[35px] xl:h-[35px] fhd:w-[55px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 9C13.933 9 15.5 7.433 15.5 5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5C8.5 7.433 10.067 9 12 9Z" 
                  fill="#F96C41" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 20.5C2 16.0815 6.0295 12.5 11 12.5" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M15.5 21L20.5 16L18.5 14L13.5 19V21H15.5Z" 
                  fill="#F96C41" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Input
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="First name"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
              required
            />
          </div>
        </motion.div>

        {/* Last Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            Last Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[35px] xl:h-[35px] fhd:w-[50px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 9C13.933 9 15.5 7.433 15.5 5.5C15.5 3.567 13.933 2 12 2C10.067 2 8.5 3.567 8.5 5.5C8.5 7.433 10.067 9 12 9Z" 
                  fill="#F96C41" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M2 20.5C2 16.0815 6.0295 12.5 11 12.5" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M15.5 21L20.5 16L18.5 14L13.5 19V21H15.5Z" 
                  fill="#F96C41" 
                  stroke="#F96C41" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Input
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Last name"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
            />
          </div>
        </motion.div>

        {/* Email */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[35px] xl:h-[35px] fhd:w-[50px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_348_338)">
                  <path d="M17.5295 14.6064C17.5295 15.6144 17.8163 16.0164 18.5663 16.0164C20.2379 16.0164 21.3023 13.8864 21.3023 10.344C21.3023 4.92956 17.3567 2.33756 12.4307 2.33756C7.36314 2.33756 2.75394 5.73596 2.75394 12.1584C2.75394 18.2928 6.78594 21.6336 12.9779 21.6336C15.0803 21.6336 16.4915 21.4032 18.6503 20.6832L19.1135 22.6116C16.9823 23.304 14.7047 23.5044 12.9491 23.5044C4.82754 23.5044 0.477539 19.0404 0.477539 12.1572C0.477539 5.21636 5.51874 0.493164 12.4595 0.493164C19.6883 0.493164 23.5175 4.81316 23.5175 10.1124C23.5175 14.6052 22.1075 18.0324 17.6723 18.0324C15.6551 18.0324 14.3315 17.226 14.1587 15.4392C13.6403 17.4264 12.2579 18.0324 10.3847 18.0324C7.87914 18.0324 5.77674 16.1016 5.77674 12.2148C5.77674 8.29796 7.62114 5.87876 10.9331 5.87876C12.6899 5.87876 13.7843 6.56996 14.2715 7.66436L15.1079 6.13796H17.5271V14.6064H17.5295ZM13.9883 10.8048C13.9883 9.22196 12.8063 8.55836 11.8271 8.55836C10.7615 8.55836 9.58194 9.42116 9.58194 11.9568C9.58194 13.9728 10.4747 15.096 11.8271 15.096C12.7775 15.096 13.9883 14.4912 13.9883 12.8208V10.8048Z" fill="#F96C41"/>
                </g>
                <defs>
                  <clipPath id="clip0_348_338">
                    <rect width="24" height="24" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              type="email"
              placeholder="Email address"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
              required
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[35px] xl:h-[35px] fhd:w-[50px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 19V17H22V19H2ZM3.15 12.95L1.85 12.2L2.7 10.7H1V9.2H2.7L1.85 7.75L3.15 7L4 8.45L4.85 7L6.15 7.75L5.3 9.2H7V10.7H5.3L6.15 12.2L4.85 12.95L4 11.45L3.15 12.95ZM11.15 12.95L9.85 12.2L10.7 10.7H9V9.2H10.7L9.85 7.75L11.15 7L12 8.45L12.85 7L14.15 7.75L13.3 9.2H15V10.7H13.3L14.15 12.2L12.85 12.95L12 11.45L11.15 12.95ZM19.15 12.95L17.85 12.2L18.7 10.7H17V9.2H18.7L17.85 7.75L19.15 7L20 8.45L20.85 7L22.15 7.75L21.3 9.2H23V10.7H21.3L22.15 12.2L20.85 12.95L20 11.45L19.15 12.95Z" fill="#F96C41"/>
              </svg>
            </div>
            <Input
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
              required
              minLength="6"
            />
          </div>
        </motion.div>

        {/* Confirm Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[35px] xl:h-[35px] fhd:w-[50px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 19V17H22V19H2ZM3.15 12.95L1.85 12.2L2.7 10.7H1V9.2H2.7L1.85 7.75L3.15 7L4 8.45L4.85 7L6.15 7.75L5.3 9.2H7V10.7H5.3L6.15 12.2L4.85 12.95L4 11.45L3.15 12.95ZM11.15 12.95L9.85 12.2L10.7 10.7H9V9.2H10.7L9.85 7.75L11.15 7L12 8.45L12.85 7L14.15 7.75L13.3 9.2H15V10.7H13.3L14.15 12.2L12.85 12.95L12 11.45L11.15 12.95ZM19.15 12.95L17.85 12.2L18.7 10.7H17V9.2H18.7L17.85 7.75L19.15 7L20 8.45L20.85 7L22.15 7.75L21.3 9.2H23V10.7H21.3L22.15 12.2L20.85 12.95L20 11.45L19.15 12.95Z" fill="#F96C41"/>
              </svg>
            </div>
            <Input
              value={formData.confirm_password}
              onChange={(e) => handleInputChange("confirm_password", e.target.value)}
              type="password"
              placeholder="Confirm password"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
              required
              minLength="6"
            />
          </div>
        </motion.div>
                         
        {/* Sign Up Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-[44px] md:h-[67px] fhd:h-[90px] 2k:h-[115px] 4k:h-[170px] cursor-pointer btn-gradient text-white font-bold py-3 md:py-4 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[30px] 2k:text-[40px] 4k:text-[58px] xl:-tracking-[1.17px] mt-3 md:mt-0 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
          </Button>
        </motion.div>

        {/* Already have account link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/signin")}
            className="w-full cursor-pointer border-none shadow-none text-gray-800 font-bold rounded-lg text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[25px] 2k:text-[30px] 4k:text-[50px] xl:-tracking-[1.17px] py-0 my-0 xl:my-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ALREADY HAVE AN ACCOUNT
          </Button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="relative flex items-center justify-center py-0"
        >
          <span className="flex-shrink mx-4 text-[#F96C41] font-semibold text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[23px] 2k:text-[30px] 4k:text-[46px] xl:-tracking-[1.17px]">
            or continue with
          </span>
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex justify-center space-x-4 md:space-x-6 fhd:space-x-8 2k:space-x-12 4k:space-x-20"
        >
          <button className="cursor-pointer w-[42px] h-[42px] md:w-[70px] md:h-[70px] xl:w-[90px] xl:h-[90px] 2k:w-[115px] 2k:h-[115px] 4k:w-[175px] 4k:h-[175px] p-2 rounded-lg md:rounded-xl xl:rounded-2xl bg-[#D9D9D9] hover:bg-[#D9D9D9]">
            <svg className='w-[24px] h-[24px] md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] 2k:w-[90px] 2k:h-[90px] 4k:w-[150px] 4k:h-[150px] mx-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12C5.99856 13.4165 6.49829 14.7877 7.41074 15.8712C8.32318 16.9546 9.58951 17.6802 10.9856 17.9197C12.3816 18.1592 13.8174 17.897 15.0388 17.1797C16.2601 16.4623 17.1883 15.336 17.659 14H12V10H21.805V14H21.8C20.873 18.564 16.838 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C13.6345 1.99884 15.2444 2.39875 16.6883 3.16467C18.1323 3.93058 19.3662 5.0391 20.282 6.393L17.004 8.688C16.2924 7.61241 15.2532 6.79473 14.0404 6.35617C12.8275 5.9176 11.5057 5.88149 10.2707 6.25319C9.03579 6.62488 7.95347 7.38461 7.18421 8.41974C6.41495 9.45487 5.9997 10.7103 6 12Z" fill="black"/>
            </svg>
          </button>

          <button className="cursor-pointer w-[42px] h-[42px] md:w-[70px] md:h-[70px] xl:w-[90px] xl:h-[90px] 2k:w-[115px] 2k:h-[115px] 4k:w-[175px] 4k:h-[175px] p-2 rounded-lg md:rounded-xl xl:rounded-2xl bg-[#D9D9D9] hover:bg-[#D9D9D9]">
            <svg className='w-[24px] h-[24px] md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] 2k:w-[90px] 2k:h-[90px] 4k:w-[150px] 4k:h-[150px] mx-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" fill="black"/>
            </svg>
          </button>

          <button className="cursor-pointer w-[42px] h-[42px] md:w-[70px] md:h-[70px] xl:w-[90px] xl:h-[90px] 2k:w-[115px] 2k:h-[115px] 4k:w-[175px] 4k:h-[175px] p-2 rounded-lg md:rounded-xl xl:rounded-2xl bg-[#D9D9D9] hover:bg-[#D9D9D9]">
            <svg className='w-[24px] h-[24px] md:w-[40px] md:h-[40px] xl:w-[60px] xl:h-[60px] 2k:w-[90px] 2k:h-[90px] 4k:w-[150px] 4k:h-[150px] mx-auto' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.0502 20.28C16.0702 21.23 15.0002 21.08 13.9702 20.63C12.8802 20.17 11.8802 20.15 10.7302 20.63C9.29016 21.25 8.53016 21.07 7.67016 20.28C2.79016 15.25 3.51016 7.59 9.05016 7.31C10.4002 7.38 11.3402 8.05 12.1302 8.11C13.3102 7.87 14.4402 7.18 15.7002 7.27C17.2102 7.39 18.3502 7.99 19.1002 9.07C15.9802 10.94 16.7202 15.05 19.5802 16.2C19.0102 17.7 18.2702 19.19 17.0402 20.29L17.0502 20.28ZM12.0302 7.25C11.8802 5.02 13.6902 3.18 15.7702 3C16.0602 5.58 13.4302 7.5 12.0302 7.25Z" fill="black"/>
            </svg>
          </button>
        </motion.div>
      </form>
      <ToastContainer/>
    </motion.div>
  )
}