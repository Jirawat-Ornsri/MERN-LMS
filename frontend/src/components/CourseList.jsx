import React, { useState } from "react";
import mockCourse from "../data/course";
import Header from "./Header";
import { Link } from "react-router-dom";

const CourseList = () => {
  const displayedCourses = mockCourse.slice(0, 4);

  return (
    <div className="my-10">
      <Header text1={"COURSES"} />
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
                <Link to={`/course/${course.id}`} className="btn btn-primary">
                  See more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-7">
        <Link to={"/courses"}>
          <p className="font-normal text-sm">Show all courses ➜</p>
        </Link>
      </div>
    </div>
  );
};

export default CourseList;
