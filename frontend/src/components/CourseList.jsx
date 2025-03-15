import React, { useState } from "react";
import mockCourse from "../data/course";

const CourseList = () => {
  const displayedCourses = mockCourse.slice(0, 4);

  return (
    <div className="pt-5">
      <h2 className="text-2xl font-bold mb-4 mt-20">Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedCourses.map((course) => (
          <div key={course.id} className="card bg-base-100 w-full shadow-xl">
            <figure>
              <img src={course.image} alt="Shoes" className="w-full" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2>
              <p>{course.description}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <p className="font-medium">Show all courses ➜</p>
      </div>
    </div>
  );
};

export default CourseList;
