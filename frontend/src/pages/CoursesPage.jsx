import React, { useState } from "react";
import { Menu } from "lucide-react";
import mockCourses from "../data/course";
import { Link } from "react-router-dom";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ดึง Subject ทั้งหมดโดยไม่ซ้ำ
  const subjects = [...new Set(mockCourses.map((course) => course.subject))];

  // อัปเดตค่า Checkbox
  const handleSubjectChange = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  // ฟังก์ชันกรองคอร์ส
  const filteredCourses = mockCourses.filter((course) => {
    return (
      (selectedSubjects.length === 0 ||
        selectedSubjects.includes(course.subject)) &&
      (searchTerm
        ? course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.subject.toLowerCase().includes(searchTerm.toLowerCase())
        : true)
    );
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row py-16 px-5 md:px-10 lg:px-20">
      {/* Sidebar (Responsive) */}
      <div className="md:w-1/4 lg:w-1/5 md:pr-5">
        <button
          className="md:hidden flex items-center gap-2 text-primary font-bold mb-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="w-5 h-5" /> Filter
        </button>

        <div
          className={`md:block ${
            isSidebarOpen ? "block" : "hidden"
          }  p-4 rounded-lg shadow-md md:shadow-none`}
        >
          <h2 className="text-lg font-bold mb-3">FILTERS BY SUBJECT</h2>
          <ul>
            {subjects.map((subject) => (
              <li key={subject} className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id={subject}
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                  className="cursor-pointer"
                />
                <label htmlFor={subject} className="cursor-pointer">
                  {subject}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:w-3/4 lg:w-4/5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-row justify-between w-full items-center mt-5">
            <h1 className="font-semibold">
              ALL COURSES: {filteredCourses.length}
            </h1>
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-4 py-2 w-full md:w-64"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="card bg-base-100 w-full shadow-xl">
              <figure>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
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

        {/* ถ้าไม่พบคอร์ส */}
        {filteredCourses.length === 0 && (
          <p className="text-center  mt-4">No courses found</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
