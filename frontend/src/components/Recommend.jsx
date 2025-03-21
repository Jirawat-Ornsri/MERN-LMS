import React, { useEffect } from "react";
import { useCourseStore } from "../store/useCourseStore.js"; // Assuming the useCourseStore is in this path
import Header from "./Header";
import { Link } from "react-router-dom";

const Recommend = () => {
  // Fetching courses from the store
  const { courses, getCourses, isFetchingCourses } = useCourseStore(
    (state) => state
  );

  // Fetch courses on component mount
  useEffect(() => {
    if (courses.length === 0) {
      // Only fetch if no courses are available
      getCourses();
    }
  }, [courses, getCourses]);

  // If still fetching, show loading message
  if (isFetchingCourses) {
    return <div>Loading...</div>;
  }

  // Display only the first 4 courses
  const displayedCourses = courses.slice(0, 4);

  return (
    <div className="my-10">
      <Header text1={"RECOMMENDED"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedCourses.map((course) => (
          <div key={course._id} className="bg-base-300 text-base-content card w-full shadow-xl">
            <figure className="h-60 w-full overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{course.title}</h2>
              <p>{course.description}</p>
              <div className="card-actions justify-end">
                <Link to={`/course/${course._id}`} className="btn btn-primary">
                  See more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommend;
