"use client";
import { useEffect } from "react";
import AOS from 'aos';

export default function AOSInitializer() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 50,
        mirror: false
      });
    }
  }, []);

  return null;
}