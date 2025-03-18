import Course from "../models/course.model.js";


export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.log("Error in getCourses controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    console.log("Error in getCourseById controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ดึง lessons ของคอร์สตาม ID
export const getCourseLessons = async (req, res) => {
  try {
    // ค้นหา Course โดยใช้ ID และดึงเฉพาะ field `lessons`
    const course = await Course.findById(req.params.id).select("lessons");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course.lessons); // ส่งเฉพาะ lessons กลับไป
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


