// src/hooks/useLocalStorage.js
"use client"

import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      // Return raw value if it's a JWT token (starts with "eyJ")
      if (item && item.startsWith('eyJ')) {
        return item
      }
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        // Store raw value if it's a string (like JWT)
        if (typeof value === 'string' && value.startsWith('eyJ')) {
          window.localStorage.setItem(key, value)
        } else {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}