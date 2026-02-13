import React from "react";
import { FALLBACK_IMAGE } from "../utils";

interface FoodCardProps {
  image: string;
  title: string;
  description: string | null;
  price: number;
  spicy?: boolean;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({
  image,
  title,
  description,
  price,
  spicy = false,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
}) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_IMAGE;
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden font-sans flex flex-col">
      {/* Image */}
      <div className="w-full h-30 sm:h-28 md:h-32 overflow-hidden">
        <img
          onError={handleImgError}
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-2 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold truncate" title={title}>
            {title}
          </h3>

          {spicy && (
            <span className="bg-red-100 text-red-700 px-1 py-0.5 rounded-full text-xs">
              Spicy
            </span>
          )}
        </div>

        <p
          className="text-gray-600 text-xs mb-1 line-clamp-2 min-h-[1.5rem]"
          title={description || ""}
        >
          {description || ""}
        </p>

        <span className="font-bold text-xs sm:text-sm md:text-base mb-2">
          ₹{price.toFixed(2)}
        </span>

        {/* Action */}
        <div className="mt-auto">
          {quantity === 0 ? (
            <button
              onClick={onAdd}
              className="w-full py-2 bg-[#0576B2] hover:bg-[#0460a0] text-white font-bold rounded transition-colors text-sm"
            >
              Add
            </button>
          ) : (
            <div className="flex border border-gray-200 rounded overflow-hidden text-sm">
              <button
                onClick={onDecrement}
                className="flex-1 py-2 bg-[#0576B2] hover:bg-[#0460a0] text-white font-bold"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold py-2">
                {quantity}
              </span>
              <button
                onClick={onIncrement}
                className="flex-1 py-2 bg-[#0576B2] hover:bg-[#0460a0] text-white font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
