import React from "react";
import CourseList from "../components/CourseList";
import Corasual from "../components/Corasual";
import Recommend from "../components/Recommend";

const HomePage = () => {
  return (
    <div className="my-16">
      <Corasual />
      <div className="sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-xl mx-auto my-40">
        <Recommend />
        <CourseList />
      </div>
    </div>
  );
};

export default HomePage;
