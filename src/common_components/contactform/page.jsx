"use client"

import { useEffect, useState } from "react"
import { Phone, VoicemailIcon as Fax, Mail, ChevronDown } from "lucide-react"
import { apiUrl } from "@/config/config"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    help: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    help: "",
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [token, setToken] = useState(null)

  const helpOptions = [
    "How can we help you?",
    "General Inquiry",
    "Technical Support",
    "Sales Question",
    "Partnership",
    "Other",
  ]

  useEffect(() => {

    if (typeof window === "undefined") return;

    let userData = localStorage.getItem('user')

    if (userData) {
      try {
        const user = JSON.parse(userData)
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

        setFormData(prev => ({
          ...prev,
          name: fullName,
          email: user.email || ''
        }))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  useEffect(() => {
    // Check for token in localStorage when component mounts
    const storedToken = localStorage.getItem('token')
    setToken(storedToken)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectOption = (option) => {
    setFormData((prev) => ({
      ...prev,
      help: option,
    }))
    setIsDropdownOpen(false)
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      help: "",
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
      valid = false
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
      valid = false
    } else if (!/^[0-9+\-\s]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number"
      valid = false
    }

    // Help validation
    if (!formData.help || formData.help === "How can we help you?") {
      newErrors.help = "Please select a help option"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error("Please login first to submit the contact form")
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setSubmitStatus('submitting')
    setIsLoading(true)

    try {
      const response = await fetch(`${apiUrl}/api/users/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Submission failed')
      }

      const result = await response.json()
      // console.log("Form submitted successfully:", result)
      setSubmitStatus('success')
      toast.success("Contact form submitted successfully!")

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        help: "",
      })
    } catch (error) {
      // console.error("Error submitting form:", error)
      setSubmitStatus('error')
      toast.error(error.message || "Failed to submit contact form")
    } finally {
      setIsLoading(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <ToastContainer />
      <div className="w-[350px] h-auto md:w-[586px] xl:w-[680px] fhd:w-[1030px] 2k:w-[1358px] 4k:w-[2050px] bg-[#FFFFFF] rounded-t-3xl rounded-b-3xl fhd:rounded-4xl 2k:rounded-[3rem] 4k:rounded-[4.5rem] shadow-xl px-4 md:px-6 xl:px-10 2k:px-14 4k:px-24 xl:py-10 py-6 2k:py-14 4k:py-24 -mt-4 relative z-40 mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 fhd:space-y-7 2k:space-y-10 4k:space-y-16">
          {/* Name Field */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name *"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full h-[44px] md:h-[55px] px-4 py-3 pl-4 md:pl-6 xl:pl-8 fhd:pl-18 2k:pl-20 4k:pl-24 pr-10 md:pr-12  md:py-2 fhd:py-10 2k:py-14 4k:py-20 border rounded-md text-[14px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px]  font-medium placeholder-gray-400 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full  h-[44px] md:h-[55px] px-4 py-3 pl-4 md:pl-6 xl:pl-8 fhd:pl-18 2k:pl-20 4k:pl-24 pr-10 md:pr-12  md:py-2 fhd:py-10 2k:py-14 4k:py-20 border text-[14px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px]  font-medium placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone number *"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full  h-[44px] md:h-[55px] px-4 py-3 pl-4 md:pl-6 xl:pl-8 fhd:pl-18 2k:pl-20 4k:pl-24 pr-10 md:pr-12  md:py-2 fhd:py-10 2k:py-14 4k:py-20 border text-[14px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px]  font-medium placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Dropdown Field */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`w-full h-[44px] md:h-[55px] px-4 py-3 pl-4 md:pl-6 xl:pl-8 fhd:pl-18 2k:pl-20 4k:pl-24 pr-4 md:pr-6  md:py-2 fhd:py-10 2k:py-14 4k:py-20 border  text-[14px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[25px] fhd:text-[34px] 2k:text-[55px] 4k:text-[75px] xl:-tracking-[1.17px] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-left flex items-center justify-between bg-white font-medium ${errors.help ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent`}
            >
              <span className={formData.help || "text-gray-500"}>{formData.help || "How can we help you?"}</span>
              <ChevronDown className="h-5 w-5 fhd:h-8 fhd:w-8 2k:h-12 4k:w-12 text-gray-500 font-medium" />
            </button>
            {errors.help && <p className="mt-1 text-sm text-red-600">{errors.help}</p>}

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {helpOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelectOption(option)}
                    className="w-full px-4 py-3 text-left fhd:text-[30px] 2k:text-[49px] 4k:text-[66px] hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-md last:rounded-b-md cursor-pointer"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[44px] md:h-[67px] fhd:h-[90px] 2k:h-[105px] 4k:h-[160px] cursor-pointer btn-gradient text-white font-bold py-3 md:py-4 rounded-lg 2k:rounded-3xl 4k:rounded-4xl text-[14px] -tracking-[0.41px] md:text-[16px] md:-tracking-[0.68px] xl:text-[20px] fhd:text-[30px] 2k:text-[40px] 4k:text-[58px] xl:-tracking-[1.17px] mt-3 md:mt-0"
          >
            SEND
          </button>
        </form>

        {/* Contact Information */}
        <div className="mt-8 fhd:pt-10 2k:pt-14 4k:pt-18 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-4 text-center">
            {/* Phone */}
            <div className="flex flex-col items-center">
              <Phone className="h-5 w-5 fhd:h-8 fhd:w-8 2k:h-12 2k:w-12 4k:w-20 4k:h-20 text-gray-600 mb-1 fhd:mb-4 2k:mb-8 4k:mb-12" />
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl font-medium text-gray-800 uppercase tracking-wide">PHONE</div>
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl text-orange-600 mt-1 fhd:mb-4 2k:mb-8 4k:mb-12">+1 858-222-4037</div>
            </div>

            {/* Fax */}
            <div className="flex flex-col items-center">
              <Fax className="h-5 w-5 fhd:h-8 fhd:w-8 2k:h-12 2k:w-12 4k:w-20 4k:h-20 text-gray-600 mb-1 fhd:mb-4 2k:mb-8 4k:mb-12" />
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl font-medium text-gray-800 uppercase tracking-wide">FAX</div>
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl text-orange-600 mt-1 fhd:mb-4 2k:mb-8 4k:mb-12">03 5432 1234</div>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center">
              <Mail className="h-5 w-5 fhd:h-8 fhd:w-8 2k:h-12 2k:w-12 4k:w-20 4k:h-20 text-gray-600 mb-1 fhd:mb-4 2k:mb-8 4k:mb-12" />
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl font-medium text-gray-800 uppercase tracking-wide">EMAIL</div>
              <div className="text-xs fhd:text-lg 2k:text-2xl 4k:text-4xl text-orange-600 mt-1 fhd:mb-4 2k:mb-8 4k:mb-12">mail@evcartrips.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}