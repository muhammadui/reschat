// components/LoadingScreen.tsx
import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="mb-6">
        <div className="relative w-32 h-32">
          {/* Cooking pot animation */}
          <div className="absolute w-24 h-16 bg-gray-600 rounded-b-full left-4 top-12"></div>
          <div className="absolute w-32 h-4 bg-gray-700 rounded-full top-12"></div>
          <div className="absolute w-24 h-12 bg-gray-200 rounded-t-full left-4 top-0"></div>

          {/* Steam animation */}
          <div className="absolute w-4 h-8 bg-gray-100 rounded-full left-8 top-2 animate-pulse opacity-60"></div>
          <div className="absolute w-4 h-8 bg-gray-100 rounded-full left-16 top-0 animate-pulse opacity-70 delay-300"></div>
          <div className="absolute w-4 h-8 bg-gray-100 rounded-full left-20 top-2 animate-pulse opacity-80 delay-500"></div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Preparing your experience!
      </h2>
      <p className="text-gray-600 mb-4 text-center px-6">
        Our chef is warming up the kitchen. This might take a minute on our free
        tier.
      </p>

      <div className="flex items-center justify-center mt-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-1 delay-75"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-1 delay-150"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce mx-1 delay-300"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
