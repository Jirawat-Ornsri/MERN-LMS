import React from "react";
import CourseList from "../components/CourseList";
import Corasual from "../components/Corasual";
import Recommend from "../components/Recommend";

const HomePage = () => {
  return (
    <div className="my-16">
      <Corasual />
      <div className="max-w-[80%] mx-auto my-40">
        <Recommend />
        <CourseList />
      </div>
    </div>
  );
};

export default HomePage;
