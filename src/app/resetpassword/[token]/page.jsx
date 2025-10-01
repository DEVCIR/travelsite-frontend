"use client"

import Navbar from "../../../common_components/navbar/page"
import Rentals from "../../../common_components/rentals/page"
import Footer from "../../../components/ui/footer"
import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { toast, ToastContainer } from 'react-toastify'
import { apiUrl } from "@/config/config"

export default function Page() {
  const params = useParams()
  const router = useRouter()
  const token = params.token

  const headerRef = useRef(null)
  const formRef = useRef(null)
  const footerRef = useRef(null)

  const isHeaderInView = useInView(headerRef, { once: true })
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" })
  const isFooterInView = useInView(footerRef, { once: true })

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const [verifying, setVerifying] = useState(true)

  // Verify token on component mount
  useEffect(() => {
    async function verifyToken() {
      try {
        const res = await fetch(`${apiUrl}/api/auth/verify-reset-token?token=${token}`)

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Invalid token')
        }

        const data = await res.json()
        if (data.valid) {
          setTokenValid(true)
        } else {
          throw new Error(data.message || 'Invalid token')
        }
      } catch (error) {
        console.error('Token verification failed:', error)
        toast.error(error.message || 'Invalid or expired reset link')
        router.push('/resetpassword')
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Password reset failed')
      }

      toast.success('Password updated successfully!')
      router.push('/signin')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (verifying) return (
    <div className="w-svw min-h-screen bg-white overflow-x-hidden">
      {/* Animated Header Section */}
      <motion.div
        ref={headerRef}
        className="w-full bg-black px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-12 sm:pb-16 min-h-[40vh] lg:min-h-[60vh] xl:min-h-[80vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />

        <motion.div
          className="max-w-sm md:max-w-md lg:max-w-lg mx-auto w-full space-y-2 mt-4 xl:mt-24 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            className="text-[#FFFFFFEB] font-bold text-[16px] -tracking-[0.41px] md:text-[26px] md:-tracking-[0.68px] xl:text-[45px] xl:-tracking-[1.17px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Verifying Your Link
          </motion.h1>

          <motion.div
            className="text-[#FFFFFFAB] font-[400] text-[14px] -tracking-[0.41px] md:text-[23px] md:-tracking-[0.68px] xl:text-[30px] xl:-tracking-[1.17px] xl:-space-y-3"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              Please wait while we verify your password
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              reset link.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )

  if (!tokenValid) return (
    <div className="w-svw min-h-screen bg-white overflow-x-hidden">
      {/* Animated Header Section */}
      <motion.div
        ref={headerRef}
        className="w-full bg-black px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-12 sm:pb-16 min-h-[40vh] lg:min-h-[60vh] xl:min-h-[80vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />

        <motion.div
          className="max-w-sm md:max-w-md lg:max-w-lg mx-auto w-full space-y-2 mt-4 xl:mt-24 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            className="text-[#FFFFFFEB] font-bold text-[16px] -tracking-[0.41px] md:text-[26px] md:-tracking-[0.68px] xl:text-[45px] xl:-tracking-[1.17px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Link Expired
          </motion.h1>

          <motion.div
            className="text-[#FFFFFFAB] font-[400] text-[14px] -tracking-[0.41px] md:text-[23px] md:-tracking-[0.68px] xl:text-[30px] xl:-tracking-[1.17px] xl:-space-y-3"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              This password reset link is invalid or
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              has expired. Please request a new one.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Footer */}
      <motion.div
        ref={footerRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isFooterInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="max-md:hidden"
      >
        <Footer />
      </motion.div>
    </div>
  )

  return (
    <div className="w-svw min-h-screen bg-white overflow-x-hidden">
      {/* Animated Header Section */}
      <motion.div
        ref={headerRef}
        className="w-full bg-black px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-12 sm:pb-16 min-h-[40vh] lg:min-h-[60vh] xl:min-h-[80vh] flex flex-col justify-start rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[20px]"
        initial={{ opacity: 0, y: -50 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Navbar />

        <motion.div
          className="max-w-sm md:max-w-md lg:max-w-lg mx-auto w-full space-y-2 mt-4 xl:mt-24 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isHeaderInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h1
            className="text-[#FFFFFFEB] font-bold text-[16px] -tracking-[0.41px] md:text-[26px] md:-tracking-[0.68px] xl:text-[45px] xl:-tracking-[1.17px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Create New Password
          </motion.h1>

          <motion.div
            className="text-[#FFFFFFAB] font-[400] text-[14px] -tracking-[0.41px] md:text-[23px] md:-tracking-[0.68px] xl:text-[30px] xl:-tracking-[1.17px] xl:-space-y-3"
            initial={{ opacity: 0 }}
            animate={isHeaderInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, staggerChildren: 0.1 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              Enter your new password below to
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            >
              reset your account access.
            </motion.p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Form Section */}
      <div
        className="-mt-24 md:-mt-18 lg:-mt-36 xl:-mt-40 pb-8"
      >
        <div className="mx-auto">
          <div
            className="w-[350px] h-auto md:w-[586px] xl:w-[680px] bg-[#FFFFFF] rounded-t-3xl rounded-b-3xl shadow-xl px-4 md:px-6 xl:px-10 xl:py-10 py-6 relative z-10 mx-auto"

          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* New Password Field */}
              <div

              >
                <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[28px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
                  New Password
                </label>
                <Input
                  type="password"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full h-[44px] md:h-[67px] pl-4 md:pl-6 xl:pl-8 pr-4 md:pr-6 py-2 md:py-3 border-gray-400 rounded-lg text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[28px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="text-[#00000082] text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[28px] xl:-tracking-[1.17px] font-medium mb-1 md:mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                  className="w-full h-[44px] md:h-[67px] pl-4 md:pl-6 xl:pl-8 pr-4 md:pr-6 py-2 md:py-3 border-gray-400 rounded-lg text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[28px] xl:-tracking-[1.17px] text-[#00000075] font-medium"
                />
              </div>

              {/* Reset Button */}
              <div>
                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full h-[44px] md:h-[67px] bg-gradient-to-b from-[#F96C41] to-[#AA3916] text-white font-bold py-3 md:py-4 rounded-lg text-[10px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] xl:-tracking-[1.17px] ${loading ? "opacity-70 cursor-not-allowed" : ""} hover:cursor-pointer`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? "UPDATING..." : "UPDATE PASSWORD"}
                </Button>
              </div>

              {/* Back to Sign In link */}
              <div className="text-center py-0 my-0">
                <button
                  onClick={() => router.push("/signin")}
                  className="text-[#F96C41] font-[600] text-[10px] cursor-pointer -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] xl:-tracking-[1.17px] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
            <ToastContainer/>
          </div>
        </div>
      </div>

      {/* Mobile Rentals Section */}
      <div
        className="px-8 mt-4 pb-8"
      >
        <div className="w-[350px] md:w-[586px] xl:w-[1000px] mx-auto">
          <Rentals />
        </div>
      </div>

      {/* Animated Footer */}
      <div
        className="max-md:hidden"
      >
        <Footer />
      </div>
    </div>
  )
}