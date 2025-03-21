import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const imageDetails = [
  {
    src: "javaScript.jpg",
    title: "JavaScript",
    description: "JavaScript เป็นภาษาสคริปต์ ทีมีลักษณะการเขียนแบบโพรโทไทป์ ส่วนมากใช้ในหน้าเว็บเพื่อประมวลผลข้อมูลที่ฝั่งของผู้ใช้งาน แต่ก็ยังมีใช้เพื่อเพิ่มเติมความสามารถในการเขียนสคริปต์โดยฝังอยู่ในโปรแกรมอื่น ๆ",
    link: "/course/67d7a77492cc9e7975ccd846"
  },
  {
    src: "ml.jpg",
    title: "Machine Learning",
    description: "การเรียนรู้ของเครื่อง เป็นส่วนหนึ่งของปัญญาประดิษฐ์ และเป็นสาขาวิชาที่พัฒนาและการศึกษาแบบจำลองเชิงสถิติที่สามารถเรียนรู้และพัฒนาตัวเองจากข้อมูล ซึ่งมักแบ่งเป็นชุดข้อมูลฝึกฝน ตรวจสอบ และทดสอบ แล้ววางนัยทั่วไปหรือคาดการณ์จากข้อมูลใหม่ที่ยังไม่เคยเห็น ",
    link: "/course/67d7a86e92cc9e7975ccd848"
  },
  {
    src: "python.jpg",
    title: "Python",
    description: "Python เป็นภาษาการเขียนโปรแกรมที่ใช้อย่างแพร่หลายในเว็บแอปพลิเคชัน การพัฒนาซอฟต์แวร์ วิทยาศาสตร์ข้อมูล และแมชชีนเลิร์นนิง (ML)",
    link: "/course/67d7a83092cc9e7975ccd847"
  }
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageDetails.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageDetails.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen relative w-full mx-auto overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {imageDetails.map((item, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img
              src={item.src}
              className="w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
            {/* 🔹 คำอธิบายภาพครอบคลุมทั้งรูป และอยู่ตรงกลาง */}
            <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-center text-white p-8">
              <h2 className="text-5xl md:text-7xl font-bold mb-16">{item.title}</h2>
              <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mb-10">{item.description}</p>
              <a
                href={item.link}
                className="text-md font-semibold px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition"
              >
                Enroll Now
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Button */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next Button */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-full"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {imageDetails.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
