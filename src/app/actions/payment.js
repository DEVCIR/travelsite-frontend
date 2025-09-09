'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { apiUrl } from "@/config/config";

export async function processPayment( formData )
{
  try
  {
    // Extract form data from FormData object
    const firstName = formData.get( 'firstName' )
    const lastName = formData.get( 'lastName' )
    const email = formData.get( 'email' )
    const countryCode = formData.get( 'countryCode' )
    const phone = formData.get( 'phone' )
    const zipCode = formData.get( 'zipCode' )
    const selectedPayment = formData.get( 'selectedPayment' )
    const totalPrice = formData.get( 'totalPrice' )
    const stripeToken = formData.get( 'stripeToken' )
    const token = formData.get( 'token' )
    const userId = formData.get( 'userId' )

    // Get reservation data from localStorage (will be passed as hidden input)
    const allReservations = formData.get( 'allReservations' )

    // Validate required fields
    if ( !firstName || !lastName || !email || !countryCode || !phone )
    {
      return {
        success: false,
        message: 'Please fill all traveler details'
      }
    }

    if ( selectedPayment === 'card' && !stripeToken )
    {
      return {
        success: false,
        message: 'Please fill all payment details'
      }
    }

    // Parse JSON data
    let reservations = {}
    try
    {
      reservations = allReservations ? JSON.parse( allReservations ) : {}
    } catch ( e )
    {
      console.error( 'Error parsing reservations:', e )
    }

    // Prepare the data object for backend
    const paymentData = {
      travelerDetails: {
        firstName,
        lastName,
        email,
        phone: {
          countryCode,
          number: phone
        }
      },
      paymentDetails: {
        method: selectedPayment,
        ...( selectedPayment === "card" && {
          stripeToken: stripeToken,
          zipCode
        } )
      },
      bookingDetails: {
        totalPrice: parseFloat( totalPrice ),
        reservations: reservations,
        userId: userId,
      }
    }

    // Get token from cookies
    const cookieStore = await cookies()

    // Send data to backend
    const response = await fetch( `${apiUrl}/api/payment/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify( paymentData )
    } )

    const data = await response.json()

    if ( response.ok )
    {
      return {
        success: true,
        message: data.message || 'Booking successful!',
        bookingId: data.bookingId,
        orderId: data.orderId,
        paymentTime: data.paymentTime,
        paymentMethod: data.paymentMethod,
        senderName: data.senderName,
        totalPrice: data.totalPrice,
      }
    } else
    {
      return {
        success: false,
        message: data.message || 'Booking failed. Please try again.'
      }
    }

  } catch ( error )
  {
    console.error( 'Payment processing error:', error )
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
} 