import React, { useEffect } from "react";
import { useCourseStore } from "../store/useCourseStore.js";
import Header from "./Header";
import { Link } from "react-router-dom";
import { Loader, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useUserStore } from "../store/useUserStore.js";

const Recommend = () => {
  const { authUser } = useAuthStore();
  const { user, getSingleUser } = useUserStore();
  const { courses, getCourses, isFetchingCourses } = useCourseStore();

  useEffect(() => {
    if (courses.length === 0) {
      getCourses();
    }
    if (!user && authUser?._id) {
      getSingleUser(authUser._id);
    }
  }, [courses, user, authUser, getCourses, getSingleUser]);

  if (isFetchingCourses || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ตรวจสอบว่าผู้ใช้มี interests หรือไม่
  if (!user || !user.interests || user.interests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Header text1={"RECOMMENDED"} />
        <p className="text-sm text-gray-500 text-center">
          There are no recommended courses yet. Please add your interests to
          your profile.
        </p>
        <Link to={"/profile"} className="flex items-center text-primary mt-2">
          <p className="text-sm">Go to Profile</p> 
          <ArrowRight className="ml-1 w-4 h-4"/>
        </Link>
      </div>
    );
  }

  // กรองเฉพาะคอร์สที่มี category ตรงกับ interests ของ user
  const recommendedCourses = courses.filter((course) =>
    course.category?.some((cat) => user?.interests?.includes(cat))
  );

  return (
    <div className="my-10">
      <Header text1={"RECOMMENDED"} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendedCourses.length > 0 ? (
          recommendedCourses.map((course) => (
            <div
              key={course._id}
              className="bg-base-300 text-base-content card w-full shadow-xl"
            >
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
                  <Link
                    to={`/course/${course._id}`}
                    className="btn btn-primary"
                  >
                    See more
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No recommended courses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Recommend;
