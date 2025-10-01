
"use client";
import type React from "react";
import Image from "next/image";
import type { Room } from "../types/hotel";
import { UserIcon, RoomIcon, MealIcon, CheckIcon } from "./Icons";


interface RoomCardProps {
  room: Room;
  onSelect: (roomId: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  const roomDetails = [
    {
      icon: <UserIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 mr-1 fhd:mr-3 2k:mr-5 4k:mr-8" />,
      text: `${room.sleeps} Sleeps`,
    },
    { icon: <RoomIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 mr-1 fhd:mr-3 2k:mr-5 4k:mr-8" />, text: room.bedType },
    { icon: <MealIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 mr-1 fhd:mr-3 2k:mr-5 4k:mr-8" />, text: room.mealPlan },
  ];

  const actionButtons = [
    { icon: <CheckIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 mr-1 fhd:mr-3 2k:mr-5 4k:mr-8" />, text: "More room details" },
    {
      icon: <CheckIcon className="w-4 h-4 fhd:w-8 fhd:h-8 2k:w-12 2k:h-12 4k:w-16 4k:h-16 mr-1 fhd:mr-3 2k:mr-5 4k:mr-8" />,
      text: "Cancellation policy",
    },
  ];

  return (
    <div className="bg-white rounded-xl  fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl shadow-sm overflow-hidden">
      {/* Fixed aspect ratio container (16:9) */}
      <div className="relative aspect-video bg-gray-200">
        <Image
          src={room.image || "/placeholder.svg"}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 fhd:p-8 2k:p-12 4k:p-16">
        <h4 className="text-xl fhd:text-3xl 2k:text-4xl 4k:text-5xl font-bold mb-3">{room.name}</h4>
        <div className="flex md:flex-wrap items-center gap-x-4 fhd:gap-x-6 2k:gap-x-9 4k:gap-x-12 text-[9px] md:text-xs fhd:text-xl 2k:text-2xl 4k:text-4xl text-gray-600 mb-3 fhd:mb-5 2k:mb-7 4k:mb-10">
          {roomDetails.map((detail, index) => (
            <div key={index} className="flex items-center">
              {detail.icon}
              {detail.text}
            </div>
          ))}
        </div>
        <div className="flex md:flex-wrap items-center gap-4 fhd:gap-6 2k:gap-9 4k:gap-12 mb-4 fhd:mb-7 2k:mb-10 4k:mb-14">
          {actionButtons.map((button, index) => (
            <button
              key={index}
              className="text-blue-500 text-xs  fhd:text-xl 2k:text-2xl 4k:text-4xl flex items-center"
            >
              {button.icon}
              {button.text}
            </button>
          ))}
        </div>
        <div className="flex md:flex-wrap items-center justify-between gap-4 fhd:gap-6 2k:gap-9 4k:gap-12">
          <span className="text-lg md:text-2xl fhd:text-3xl 2k:text-4xl 4k:text-6xl font-semibold md:font-bold">
            US$ {room.price.toFixed(2)}
          </span>
          <button
            onClick={() => onSelect(room.id)}
            className="btn-gradient text-white text-[10px] fhd:text-[18px] 2k:text-[25px] 4k:text-[30px] 4k:text-6xl px-6 py-2  2k:px-9 2k:py-5 4k:px-12 4k:py-10 rounded-lg fhd:rounded-2xl 2k:rounded-3xl 4k:rounded-4xl font-medium"
          >
            SELECT ROOM
          </button>
        </div>
      </div>
    </div>
  );
};