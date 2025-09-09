import type React from "react";
export interface Room {
  id: string;
  name: string;
  image: string;
  sleeps: number;
  bedType: string;
  mealPlan: string;
  price: number;
}

export interface FormField {
  id: string;
  label: string;
  icon: React.ReactNode;
  arrow : React.ReactNode;
  type: "date" | "select";
  value: string;
  options?: string[];
}
