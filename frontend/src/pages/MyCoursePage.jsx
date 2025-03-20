import React, { useEffect } from 'react';
import { useEnrollStore } from "../store/useEnrollStore"; // นำเข้า store ที่ใช้ในการดึงข้อมูลคอร์ส
import { useAuthStore } from "../store/useAuthStore"; // นำเข้า store ที่ใช้ในการดึงข้อมูลผู้ใช้งาน
import Header from "../components/Header"
import { Link } from 'react-router-dom';

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
    return <div>Loading...</div>;
  }

  // ถ้ามีข้อผิดพลาดในการดึงข้อมูล
  if (error) {
    return <div>Error: {error}</div>;
  }

  // ถ้าไม่มีการลงทะเบียน
  if (enrollments.length === 0) {
    return <div>คุณยังไม่ได้ลงทะเบียนเรียนคอร์สใดๆ</div>;
  }

  return (
    <div className='h-screen py-16 max-w-[80%] mx-auto'>
      <Header text1={"MY COURSES"}/>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {enrollments.map((enrollment) => (
          <div key={enrollment._id} className='rounded-lg shadow-lg p-4 flex flex-col justify-between'>
            <img
              src={enrollment.course_id.image || '/placeholder.svg'}
              alt={enrollment.course_id.title}
              className='w-full h-40 object-cover rounded-md mb-4'
            />
            <h2 className='text-xl font-semibold'>{enrollment.course_id.title}</h2>
            <p className='text-gray-600'>{enrollment.course_id.description}</p>
            <div className='mt-4'>
              <Link 
                to={`/mycourse/${enrollment._id}`} 
                className='btn btn-primary w-full font-medium py-3 px-4 rounded-lg'
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
