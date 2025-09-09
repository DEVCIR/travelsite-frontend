import type React from "react";
import { StarIcon } from "./Icons";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  className = "w-4 h-4 md:w-5 md:h-5",
}) => {
  return (
    <div className="flex text-yellow-400 mr-2">
      {[...Array(maxRating)].map((_, i) => (
        <StarIcon key={i} className={className} filled={i < rating} />
      ))}
    </div>
  );
};
