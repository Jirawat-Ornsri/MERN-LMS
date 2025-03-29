import React from "react";

const CourseCardSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Banner Skeleton */}
      <div className="relative h-80 md:h-96 w-full bg-gray-300 animate-pulse"></div>

      <div className="max-w-[80%] mx-auto pt-16 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Course Details Skeleton */}
            <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
              <div className="h-6 w-40 bg-gray-300 rounded mb-4 animate-pulse" />
              <div className="h-4 w-full bg-gray-300 rounded mb-2 animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
            </div>

            {/* Instructor Skeleton */}
            <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content flex items-center">
              <div className="h-16 w-16 bg-gray-300 rounded-full mr-4 animate-pulse" />
              <div>
                <div className="h-5 w-40 bg-gray-300 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse" />
              </div>
            </div>

            {/* Learning Points Skeleton */}
            <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
              <div className="h-6 w-48 bg-gray-300 rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="md:col-span-1">
            <div className="rounded-lg shadow-sm p-6 bg-base-300 text-base-content">
              <div className="h-10 w-full bg-gray-300 rounded mb-4 animate-pulse" />
              <div className="h-12 w-full bg-gray-300 rounded mb-4 animate-pulse" />
              <div className="h-5 w-24 bg-gray-300 rounded mb-2 animate-pulse" />
              <div className="h-5 w-32 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
