import Navbar from "./components/Navbar";

import SettingsPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CommunityPage from "./pages/CommunityPage";
import MyCoursePage from "./pages/MyCoursePage";
import PostDetailPage from "./pages/PostDetailPage";


import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import ScrollToTop from "./components/ScollingToTop";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <ScrollToTop/>
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/courses" element={authUser ? <CoursesPage /> : <Navigate to="/login" />} />
        <Route path="/course/:id" element={authUser ? <CourseDetailPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/community" element={authUser ? <CommunityPage /> : <Navigate to="/login" />} />
        <Route path="/mycourse" element={authUser ? <MyCoursePage /> : <Navigate to="/login" />} />
        <Route path="/community/post/:postId" element={authUser ? <PostDetailPage /> : <Navigate to="/login" />} />
      </Routes>

      <Footer/>

      <Toaster />
    </div>
  )
}

export default App
