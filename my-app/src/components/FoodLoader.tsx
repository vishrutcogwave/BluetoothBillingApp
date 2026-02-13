// FoodLoader.tsx
import React from "react";

const mainBlue = "#0576B2";

const FoodLoader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      {/* Spinning plate */}
      <div
        className="relative flex items-center justify-around w-20 h-20 rounded-full border-4 animate-spin mb-4"
        style={{ borderColor: mainBlue }}
      >
        {/* Food dots */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full animate-bounce"
            style={{
              backgroundColor: mainBlue,
              animationDelay: ` ₹{i * 0.2}s`,
            }}
          ></div>
        ))}
      </div>
      <p className="text-sm" style={{ color: mainBlue }}>
        Loading deliciousness...
      </p>
    </div>
  );
};

export default FoodLoader;
