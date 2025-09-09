
"use client";

import type React from "react";
import type { FormField as FormFieldType } from "../types/hotel";

interface FormFieldProps {
  field: FormFieldType;
  onChange: (value: string) => void;
}

export const FormField: React.FC<FormFieldProps> = ({ field, onChange }) => {
  return (
    <div className="relative">
      <label className="text-sm max-sm:text-xs fhd:text-2xl 2k:text-3xl 4k:text-5xl  mb-1 absolute max-sm:top-[-12px] sm:top-[-12px] md:top-[-14px] fhd:top-[-24px] 2k:top-[-40px] 4k:top-[-75px] left-4 md:left-6 fhd:left-8 2k:left-12 4k:left-16 bg-[#F6F6F6] py-1 fhd:py-2 2k:py-3 4k:py-7 max-sm:py-1 px-2 fhd:px-4 2k:px-8 4k:px-12 sm:w-[35%] md:w-[36%] w-[58%] text-gray-700 flex items-center gap-1 fhd:gap-3 2k:gap-5 4k:gap-8">
        {field.icon}
        {field.label}
      </label>
      {field.type === "date" ? (
        <div className="border fhd:text-3xl 2k:text-4xl 4k:text-5xl rounded-lg fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl p-5 fhd:p-8 2k:p-12 4k:p-18 max-sm:p-4 flex items-center justify-between bg-white">
          <span className="font-medium">{field.value}</span>
          {field.icon}
        </div>
      ) : (
        <div className=" w-full">
          <select
            className="w-full border fhd:text-3xl 2k:text-4xl 4k:text-5xl rounded-lg fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl p-5 fhd:p-8 2k:p-12 4k:p-18 max-sm:p-4 appearance-none bg-white pr-12"
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500">
            {field.arrow}
          </div>
        </div>
      )}
    </div>
  );
};
