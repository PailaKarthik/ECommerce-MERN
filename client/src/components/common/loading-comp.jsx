import React from "react";

const CommonLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-900 min-w-screen ">
      <div className="flex flex-col items-center justify-between">
        {/* loading  */}
        <div className="w-full">
          <div className="animate-pulse flex flex-col space-y-4 justify-center items-center">
            <div className="h-16 bg-gray-700 rounded w-full"></div>
            <div className="h-[400px] bg-gray-600 rounded w-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 p-10">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="h-32 bg-gray-700 rounded mb-4"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="h-10 bg-gray-700 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        {/* end loading */}
        <div className="text-gray-400 text-center mt-4">
          Loading, please wait...
        </div>
        <div className="text-gray-400 text-center mt-2">
          If this takes too long, please check your internet connection or try
          refreshing the page.
        </div>
      </div>
    </div>
  );
};

export default CommonLoadingSkeleton;
