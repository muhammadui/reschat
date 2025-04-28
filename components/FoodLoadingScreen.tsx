// components/FoodLoadingScreen.tsx
import React, { useEffect, useState } from "react";

const FoodLoadingScreen = () => {
  const [loadingText, setLoadingText] = useState("Firing up the grill");

  // Cycle through different food preparation messages
  useEffect(() => {
    const messages = [
      "Firing up the grill",
      "Chopping the ingredients",
      "Preparing the kitchen",
      "Setting the table",
      "Warming up the oven",
      "Getting the menu ready",
      "Tasting for perfection",
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % messages.length;
      setLoadingText(messages[currentIndex]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white p-6">
      {/* Food icon animation */}
      <div className="relative w-32 h-32 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center animate-pulse">
            <svg
              className="w-16 h-16 text-orange-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 3a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 13.846 4.632 15 6 15h10a1 1 0 000-2H6l1-1h7.5a1 1 0 00.966-.741l1.5-6A1 1 0 0015 4H4.077l-.305-1.222A1 1 0 003 2H1a1 1 0 000 2h1.077L3 3z"></path>
            </svg>
          </div>
        </div>

        {/* Animated cooking elements */}
        <div
          className="absolute top-0 left-0 w-6 h-6 bg-yellow-400 rounded-full opacity-70 animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.2s" }}
        ></div>
        <div
          className="absolute bottom-4 right-2 w-4 h-4 bg-red-400 rounded-full opacity-70 animate-ping"
          style={{ animationDuration: "1.8s", animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-6 right-4 w-5 h-5 bg-green-400 rounded-full opacity-70 animate-ping"
          style={{ animationDuration: "2s", animationDelay: "0.7s" }}
        ></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-3">
        Almost ready to serve you!
      </h2>
      <p className="text-gray-600 mb-2 text-center">{loadingText}...</p>
      <p className="text-sm text-gray-500 text-center">
        Our kitchen takes some few seconds to warm up.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mt-6 bg-gray-200 rounded-full h-2.5">
        <div className="bg-orange-500 h-2.5 rounded-full animate-pulse w-full"></div>
      </div>
    </div>
  );
};

export default FoodLoadingScreen;
