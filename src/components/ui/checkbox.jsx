"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, defaultChecked, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(defaultChecked || false)

  const handleChange = () => {
    const newChecked = !isChecked
    setIsChecked(newChecked)
    if (onCheckedChange) {
      onCheckedChange(newChecked)
    }
  }

  const checkedState = checked !== undefined ? checked : isChecked

  return (
    <button
      ref={ref}
      type="button"
      role="checkbox"
      aria-checked={checkedState}
      onClick={handleChange}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center",
        checkedState && "bg-orange-500 border-orange-500 text-white",
        className,
      )}
      {...props}
    >
      {checkedState && <Check className="h-3 w-3 fhd:h-6 fhd:w-6 2k:h-10 2k:w-10 4k:h-12 4k:w-12" />}
    </button>
  )
})

Checkbox.displayName = "Checkbox"

export { Checkbox }