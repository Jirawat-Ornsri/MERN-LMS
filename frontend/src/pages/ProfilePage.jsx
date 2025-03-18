import React, { useEffect } from "react";
import { useUserStore } from "../store/useUserStore"; // Import zustand store
import { useAuthStore } from "../store/useAuthStore"; // ใช้ store ที่เก็บข้อมูลผู้ใช้ที่ล็อกอิน

const ProfilePage = () => {
  const { user, getSingleUser, isFetchingUser, error } = useUserStore();
  const { authUser } = useAuthStore(); // ข้อมูลผู้ใช้ที่ล็อกอิน

  useEffect(() => {
    if (authUser?._id) {
      getSingleUser(authUser._id); // ดึงข้อมูลผู้ใช้ที่ล็อกอินโดยใช้ ID
    }
  }, [authUser, getSingleUser]);

  if (isFetchingUser) return <p>Loading user profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Profile Page</h2>
      {user ? (
        <div className="mt-4 p-6 bg-white shadow-lg rounded-lg w-96">
          <img
            src={user.profilePic || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto"
          />
          <h3 className="text-xl text-center mt-2">{user.fullName}</h3>
          <p className="text-center text-gray-600">{user.email}</p>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

export default ProfilePage;
