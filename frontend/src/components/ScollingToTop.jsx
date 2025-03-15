import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // เมื่อ pathname เปลี่ยน ให้เลื่อนขึ้นบนสุด

  return null;
};

export default ScrollToTop;
