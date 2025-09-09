"use client"

import { useState } from "react"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import { motion } from "framer-motion"
import { apiUrl } from "@/config/config"

export default function ResetForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/auth/request-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset link')
      }

      toast.success(data.message || "Password reset link sent to your email!")
    } catch (error) {
      toast.error(error.message || "Error sending reset link")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="w-[350px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[1030px] 2k:w-[1358px] 4k:w-[2050px] bg-[#FFFFFF] rounded-t-3xl rounded-b-3xl shadow-xl px-4 md:px-6 xl:px-10 2k:px-14 4k:px-24 xl:py-10 py-6 2k:py-14 4k:py-24 -mt-4 relative z-40 mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 fhd:space-y-7 2k:space-y-10 4k:space-y-16">
        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[35px] 2k:text-[55px] 4k:text-[78px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-[24px] h-[24px] xl:w-[40px] xl:h-[40px] fhd:h-[50px] 2k:w-[65px] 2k:h-[65px] 4k:w-[85px] 4k:h-[85px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_348_572)">
                  <path d="M17.5295 14.6064C17.5295 15.6144 17.8163 16.0164 18.5663 16.0164C20.2379 16.0164 21.3023 13.8864 21.3023 10.344C21.3023 4.92956 17.3567 2.33756 12.4307 2.33756C7.36314 2.33756 2.75394 5.73596 2.75394 12.1584C2.75394 18.2928 6.78594 21.6336 12.9779 21.6336C15.0803 21.6336 16.4915 21.4032 18.6503 20.6832L19.1135 22.6116C16.9823 23.304 14.7047 23.5044 12.9491 23.5044C4.82754 23.5044 0.477539 19.0404 0.477539 12.1572C0.477539 5.21636 5.51874 0.493164 12.4595 0.493164C19.6883 0.493164 23.5175 4.81316 23.5175 10.1124C23.5175 14.6052 22.1075 18.0324 17.6723 18.0324C15.6551 18.0324 14.3315 17.226 14.1587 15.4392C13.6403 17.4264 12.2579 18.0324 10.3847 18.0324C7.87914 18.0324 5.77674 16.1016 5.77674 12.2148C5.77674 8.29796 7.62114 5.87876 10.9331 5.87876C12.6899 5.87876 13.7843 6.56996 14.2715 7.66436L15.1079 6.13796H17.5271V14.6064H17.5295ZM13.9883 10.8048C13.9883 9.22196 12.8063 8.55836 11.8271 8.55836C10.7615 8.55836 9.58194 9.42116 9.58194 11.9568C9.58194 13.9728 10.4747 15.096 11.8271 15.096C12.7775 15.096 13.9883 14.4912 13.9883 12.8208V10.8048Z" fill="#F96C41" />
                </g>
                <defs>
                  <clipPath id="clip0_348_572">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <Input
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Email address"
              type="email"
              className="w-full h-[44px] md:h-[55px]  pl-10 md:pl-12 xl:pl-16 fhd:pl-20 2k:pl-24 4k:pl-32 pr-10 md:pr-12 py-2 md:py-2 fhd:py-10 2k:py-14 4k:py-20 border-gray-400 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
              required
            />
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Button
            type="submit"
            disabled={loading}
            className={`w-full h-[44px] md:h-[67px] fhd:h-[90px] 2k:h-[115px] 4k:h-[170px] cursor-pointer btn-gradient text-white font-bold py-3 md:py-4 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[30px] 2k:text-[40px] 4k:text-[58px] xl:-tracking-[1.17px] mt-3 md:mt-0 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? "SENDING LINK..." : "RESET PASSWORD"}
          </Button>
        </motion.div>

        {/* Back to Sign In link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-center py-0 my-0"
        >
          <button
            onClick={() => router.push("/signin")}
            className="text-[#F96C41] font-semibold text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[23px] 2k:text-[30px] 4k:text-[46px] xl:-tracking-[1.17px] hover:underline"
          >
            Back to Sign In
          </button>
        </motion.div>
      </form>
      <ToastContainer />
    </motion.div>
  )
}