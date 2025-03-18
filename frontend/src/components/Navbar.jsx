import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogOut,
  BookOpenText,
  Settings,
  User,
  School,
  MessageCircleMore,
  LibraryBig,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null); // ใช้ ref เพื่อตรวจจับการคลิกข้างนอก

  // ปิดเมนูเมื่อคลิกนอก dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
      backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
          >
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpenText className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Learnly</h1>
          </Link>

          {/* เมนูสำหรับหน้าจอใหญ่ */}
          <div className="hidden md:flex items-center gap-4">
            <NavLinks authUser={authUser} logout={logout} />
          </div>

          {/* Hamburger Menu สำหรับมือถือ */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              className="btn btn-ghost"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-base-content shadow-lg rounded-lg transition-all duration-300 
                ${
                  isOpen
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
            >
              <div className="flex flex-col p-2 space-y-2">
                <NavLinks
                  authUser={authUser}
                  logout={logout}
                  setIsOpen={setIsOpen}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// แยก NavLinks เป็น Component
const NavLinks = ({ authUser, logout, setIsOpen }) => (
  <>
    {authUser && (
      <>
        <Link
          to="/courses"
          className="btn btn-sm gap-2"
          onClick={() => setIsOpen(false)}
        >
          <School className="w-4 h-4" />
          <span>Courses</span>
        </Link>
        <Link
          to="/mycourse"
          className="btn btn-sm gap-2"
          onClick={() => setIsOpen(false)}
        >
          <LibraryBig className="w-4 h-4" />
          <span>My Course</span>
        </Link>
        <Link
          to="/community"
          className="btn btn-sm gap-2"
          onClick={() => setIsOpen(false)}
        >
          <MessageCircleMore className="w-4 h-4" />
          <span>Community</span>
        </Link>
      </>
    )}
    <Link
      to="/settings"
      className="btn btn-sm gap-2"
      onClick={() => setIsOpen(false)}
    >
      <Settings className="w-4 h-4" />
      <span>Settings</span>
    </Link>

    {authUser && (
      <>
        <Link
          to="/profile"
          className="btn btn-sm gap-2"
          onClick={() => setIsOpen(false)}
        >
          <User className="size-5" />
          <span>Profile</span>
        </Link>
        <button
          className="btn btn-error btn-sm flex gap-2 items-center justify-center"
          onClick={() => {
            logout();
            setIsOpen(false);
          }}
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </button>
      </>
    )}
  </>
);

export default Navbar;
