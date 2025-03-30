import React, { useEffect, useState, useRef } from "react";
import { useUserStore } from "../store/useUserStore";
import { useAuthStore } from "../store/useAuthStore";
import { useCourseStore } from "../store/useCourseStore";
import { Camera } from "lucide-react";

const ProfilePage = () => {
  const { user, getSingleUser, updateProfile } = useUserStore();
  const { authUser } = useAuthStore();
  const { courses, getCourses, isFetchingCourses } = useCourseStore();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("Personal Info");

  useEffect(() => {
    if (authUser?._id) getSingleUser(authUser._id);
  }, [authUser, getSingleUser]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setSelectedInterests(user.interests || []);
    }
  }, [user]);

  useEffect(() => {
    if (courses.length === 0) getCourses();
  }, [courses, getCourses]);

  const subjects = [...new Set(courses.map((course) => course.subject))];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setSelectedImg(reader.result);
  };

  const handleIconClick = () => fileInputRef.current.click();

  const handleInterestChange = (subject) => {
    setSelectedInterests((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleSave = async () => {
    await updateProfile({
      fullName,
      interests: selectedInterests,
      profilePic: selectedImg,
    });
    setIsEditing(false);
    setSelectedImg(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImg(null);
    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setSelectedInterests(user.interests || []);
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24  p-4">
      {/* header section */}
      <div className="w-full max-w-2xl mb-10">
        <h2 className="text-3xl font-bold mb-4">Profile</h2>

        {/* Tabs */}
        <div className="max-w-max p-2 bg-base-300 rounded-lg">
          <nav className="-mb-px flex space-x-4">
            <button
              onClick={() => setActiveTab("Personal Info")}
              className={`py-2 px-4 font-medium rounded-md text-sm ${
                activeTab === "Personal Info"
                  ? "bg-base-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("Interests")}
              className={`py-2 px-4 font-medium rounded-md text-sm ${
                activeTab === "Interests"
                  ? "bg-base-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap`}
            >
              Interests
            </button>
            <button
              onClick={() => setActiveTab("Activity")}
              className={`py-2 px-4 font-medium rounded-md text-sm ${
                activeTab === "Activity"
                  ? "bg-base-100"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap`}
            >
              Activity
            </button>
            {/* Add more tabs as needed */}
          </nav>
        </div>
      </div>

      {/* body section */}
      <div className="w-full max-w-2xl bg-base-300 rounded-lg shadow-md p-6">
        {user ? (
          <div>
            {/* Personal Info Tab */}
            {activeTab === "Personal Info" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-500 text-sm">
                  Manage your personal information and how it appears to others.
                </p>

                {/* profile section */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-5">
                  <div className="relative w-32 h-32 ">
                    <img
                      src={
                        selectedImg ||
                        user.profilePic ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                    {isEditing && (
                      <div
                        className="absolute bottom-0 right-0 bg-accent p-2 rounded-full cursor-pointer hover:scale-105 transition-all duration-200"
                        onClick={handleIconClick}
                      >
                        <Camera className="w-4 h-4 text-base-100" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  {/* name, email */}
                  <div className="w-[75%]">
                    <div className="mb-4">
                      <label className="block text-sm font-medium">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="mt-1 text-gray-500">{fullName}</p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium ">
                        Email
                      </label>
                      <p className="mt-1 text-gray-500">{email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-base-100 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-primary rounded-md "
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-white bg-primary rounded-md "
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Interests Tab */}
            {activeTab === "Interests" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Interests</h3>
                <p className="text-gray-500 text-sm">
                  Select topics you're interested in to personalize your
                  experience.
                </p>
                {isEditing ? (
                  isFetchingCourses ? (
                    <p className="text-gray-500">Loading interests...</p>
                  ) : subjects.length === 0 ? (
                    <p className="text-gray-500">No subjects available</p>
                  ) : (
                    <ul className="py-4 space-y-2 flex flex-col md:flex-row justify-between">
                      {subjects.map((subject) => (
                        <li key={subject} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={selectedInterests.includes(subject)}
                            onChange={() => handleInterestChange(subject)}
                            className="w-4 h-4 rounded border-gray-300"
                          />
                          <span>{subject}</span>
                        </li>
                      ))}
                    </ul>
                  )
                ) : (
                  <div className="flex flex-row">
                  {selectedInterests.map((interest, index) => (
                    <div key={index} className="bg-accent mr-2 w-max py-1 px-2 rounded-full">
                      <p className="text-base-100 text-sm">{interest}</p>
                    </div>
                  ))}
                </div>
                
                )}

                <div className="flex justify-end space-x-2">
                {isEditing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-gray-700 bg-base-100 rounded-md hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-primary rounded-md "
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 text-white bg-primary rounded-md "
                    >
                      Edit Interests
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Activity Tab (Placeholder) */}
            {activeTab === "Activity" && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Activity</h3>
                <p className="text-gray-500 text-sm">No activity to display.</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-600">No user data available</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
