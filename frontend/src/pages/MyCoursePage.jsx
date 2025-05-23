import React, { useEffect } from "react";
import { useEnrollStore } from "../store/useEnrollStore"; // นำเข้า store ที่ใช้ในการดึงข้อมูลคอร์ส
import { useAuthStore } from "../store/useAuthStore"; // นำเข้า store ที่ใช้ในการดึงข้อมูลผู้ใช้งาน
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { BookPlus, ArrowRight, Loader } from "lucide-react";

const MyCoursePage = () => {
  // ดึงข้อมูลผู้ใช้จาก store
  const { authUser } = useAuthStore();
  // ดึงฟังก์ชันและข้อมูลที่เกี่ยวกับการลงทะเบียนจาก store
  const { getEnrollments, enrollments, isFetching, error } = useEnrollStore();

  // ดึงข้อมูลคอร์สที่ลงทะเบียนเมื่อหน้าเพจโหลด
  useEffect(() => {
    if (authUser?._id) {
      getEnrollments(authUser._id);
    }
  }, [authUser, getEnrollments]);

  // แสดงข้อมูลขณะที่กำลังโหลด
  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
  if (error) {
    return <div>Error: {error}</div>;
  }

  // ถ้าไม่มีการลงทะเบียน
  if (enrollments.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <BookPlus className="w-32 h-32" />
          <p className="font-bold text-base md:text-2xl mt-5">
            You don't have any courses registered yet.
          </p>
          <div className="flex flex-row text-primary text-sm mt-4">
            <Link to={"/courses"}>Go to Courses Page</Link>
            <ArrowRight className="ml-3 w-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-[80%] mx-auto py-24">
      <Header text1={"MY COURSES"} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {enrollments.map((enrollment) => (
          <div
            key={enrollment._id}
            className="bg-base-300 text-base-content rounded-lg shadow-lg p-4 flex flex-col justify-between"
          >
            <img
              src={enrollment.course_id.image || "/placeholder.svg"}
              alt={enrollment.course_id.title}
              className="w-full h-40 object-cover rounded-md mb-4 "
            />
            <h2 className="text-xl font-semibold">
              {enrollment.course_id.title}
            </h2>
            <p className="text-gray-600">{enrollment.course_id.description}</p>
            <div className="mt-4">
              <Link
                to={`/mycourse/${enrollment._id}`}
                className="btn btn-primary w-full font-medium py-3 px-4 rounded-lg"
              >
                Course Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCoursePage;
