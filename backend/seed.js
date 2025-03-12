import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import User from "./models/User.js"
import Course from "./models/Course.js"
import Category from "./models/Category.js"
import Post from "./models/Post.js"
import Comment from "./models/Comment.js"

dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Seed data
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Course.deleteMany({})
    await Category.deleteMany({})
    await Post.deleteMany({})
    await Comment.deleteMany({})

    console.log("Cleared existing data")

    // Create categories
    const categories = await Category.insertMany([
      { name: "การพัฒนาเว็บไซต์", description: "เรียนรู้การพัฒนาเว็บไซต์ด้วยเทคโนโลยีล่าสุด" },
      { name: "การพัฒนาแอปพลิเคชัน", description: "เรียนรู้การพัฒนาแอปพลิเคชันสำหรับมือถือและเดสก์ท็อป" },
      { name: "ปัญญาประดิษฐ์", description: "เรียนรู้เกี่ยวกับปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง" },
      { name: "การออกแบบ UX/UI", description: "เรียนรู้การออกแบบประสบการณ์ผู้ใช้และส่วนต่อประสานกับผู้ใช้" },
      { name: "การตลาดดิจิทัล", description: "เรียนรู้กลยุทธ์การตลาดดิจิทัลและเครื่องมือต่างๆ" },
    ])

    console.log("Categories created")

    // Create users
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("password123", salt)

    const users = await User.insertMany([
      {
        name: "ผู้ใช้ทดสอบ",
        email: "user@example.com",
        password: hashedPassword,
        interests: ["การพัฒนาเว็บไซต์", "ปัญญาประดิษฐ์"],
      },
      {
        name: "ผู้สอนทดสอบ",
        email: "instructor@example.com",
        password: hashedPassword,
        interests: ["การพัฒนาแอปพลิเคชัน", "การออกแบบ UX/UI"],
      },
    ])

    console.log("Users created")

    // Create courses
    const courses = await Course.insertMany([
      {
        title: "React สำหรับผู้เริ่มต้น",
        description: "เรียนรู้การพัฒนาเว็บแอปพลิเคชันด้วย React จากพื้นฐานจนถึงขั้นสูง",
        image: "/placeholder.svg?height=480&width=854",
        category: "การพัฒนาเว็บไซต์",
        level: "เริ่มต้น",
        duration: 10,
        lessons: [
          {
            title: "แนะนำ React",
            content: "บทนี้จะแนะนำพื้นฐานของ React และการติดตั้ง",
            duration: 30,
            order: 1,
          },
          {
            title: "Components และ Props",
            content: "เรียนรู้เกี่ยวกับ Components และการส่งข้อมูลด้วย Props",
            duration: 45,
            order: 2,
          },
          {
            title: "State และ Lifecycle",
            content: "เรียนรู้เกี่ยวกับ State และวงจรชีวิตของ Component",
            duration: 60,
            order: 3,
          },
        ],
        enrollmentCount: 120,
      },
      {
        title: "Node.js และ Express",
        description: "เรียนรู้การสร้าง API ด้วย Node.js และ Express",
        image: "/placeholder.svg?height=480&width=854",
        category: "การพัฒนาเว็บไซต์",
        level: "ปานกลาง",
        duration: 8,
        lessons: [
          {
            title: "แนะนำ Node.js",
            content: "บทนี้จะแนะนำพื้นฐานของ Node.js และการติดตั้ง",
            duration: 30,
            order: 1,
          },
          {
            title: "การสร้าง API ด้วย Express",
            content: "เรียนรู้การสร้าง RESTful API ด้วย Express",
            duration: 60,
            order: 2,
          },
          {
            title: "การเชื่อมต่อกับฐานข้อมูล",
            content: "เรียนรู้การเชื่อมต่อ API กับฐานข้อมูล MongoDB",
            duration: 45,
            order: 3,
          },
        ],
        enrollmentCount: 85,
      },
      {
        title: "การพัฒนาแอปพลิเคชันด้วย Flutter",
        description: "เรียนรู้การพัฒนาแอปพลิเคชันข้ามแพลตฟอร์มด้วย Flutter",
        image: "/placeholder.svg?height=480&width=854",
        category: "การพัฒนาแอปพลิเคชัน",
        level: "เริ่มต้น",
        duration: 12,
        lessons: [
          {
            title: "แนะนำ Flutter",
            content: "บทนี้จะแนะนำพื้นฐานของ Flutter และการติดตั้ง",
            duration: 40,
            order: 1,
          },
          {
            title: "Widgets และการจัดเลย์เอาต์",
            content: "เรียนรู้เกี่ยวกับ Widgets และการจัดเลย์เอาต์ในแอป",
            duration: 50,
            order: 2,
          },
          {
            title: "การจัดการสถานะและการนำทาง",
            content: "เรียนรู้การจัดการสถานะและการนำทางในแอป Flutter",
            duration: 55,
            order: 3,
          },
        ],
        enrollmentCount: 65,
      },
      {
        title: "พื้นฐานปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง",
        description: "เรียนรู้พื้นฐานของปัญญาประดิษฐ์และการเรียนรู้ของเครื่อง",
        image: "/placeholder.svg?height=480&width=854",
        category: "ปัญญาประดิษฐ์",
        level: "เริ่มต้น",
        duration: 15,
        lessons: [
          {
            title: "แนะนำปัญญาประดิษฐ์",
            content: "บทนี้จะแนะนำพื้นฐานของปัญญาประดิษฐ์และประเภทต่างๆ",
            duration: 45,
            order: 1,
          },
          {
            title: "การเรียนรู้ของเครื่องเบื้องต้น",
            content: "เรียนรู้พื้นฐานของการเรียนรู้ของเครื่องและอัลกอริทึม",
            duration: 60,
            order: 2,
          },
          {
            title: "การเรียนรู้เชิงลึกเบื้องต้น",
            content: "เรียนรู้พื้นฐานของการเรียนรู้เชิงลึกและโครงข่ายประสาทเทียม",
            duration: 75,
            order: 3,
          },
        ],
        enrollmentCount: 150,
      },
      {
        title: "หลักการออกแบบ UX/UI",
        description: "เรียนรู้หลักการออกแบบประสบการณ์ผู้ใช้และส่วนต่อประสานกับผู้ใช้",
        image: "/placeholder.svg?height=480&width=854",
        category: "การออกแบบ UX/UI",
        level: "เริ่มต้น",
        duration: 8,
        lessons: [
          {
            title: "แนะนำการออกแบบ UX/UI",
            content: "บทนี้จะแนะนำพื้นฐานของการออกแบบ UX/UI และความแตกต่าง",
            duration: 35,
            order: 1,
          },
          {
            title: "หลักการออกแบบ UX",
            content: "เรียนรู้หลักการออกแบบประสบการณ์ผู้ใช้และการวิจัยผู้ใช้",
            duration: 50,
            order: 2,
          },
          {
            title: "หลักการออกแบบ UI",
            content: "เรียนรู้หลักการออกแบบส่วนต่อประสานกับผู้ใช้และองค์ประกอบต่างๆ",
            duration: 45,
            order: 3,
          },
        ],
        enrollmentCount: 95,
      },
      {
        title: "การตลาดดิจิทัลสำหรับธุรกิจออนไลน์",
        description: "เรียนรู้กลยุทธ์การตลาดดิจิทัลสำหรับธุรกิจออนไลน์",
        image: "/placeholder.svg?height=480&width=854",
        category: "การตลาดดิจิทัล",
        level: "เริ่มต้น",
        duration: 10,
        lessons: [
          {
            title: "แนะนำการตลาดดิจิทัล",
            content: "บทนี้จะแนะนำพื้นฐานของการตลาดดิจิทัลและช่องทางต่างๆ",
            duration: 40,
            order: 1,
          },
          {
            title: "การตลาดบนสื่อสังคมออนไลน์",
            content: "เรียนรู้กลยุทธ์การตลาดบนสื่อสังคมออนไลน์และแพลตฟอร์มต่างๆ",
            duration: 55,
            order: 2,
          },
          {
            title: "การตลาดเนื้อหาและ SEO",
            content: "เรียนรู้การทำการตลาดเนื้อหาและการปรับแต่งเว็บไซต์เพื่อ SEO",
            duration: 50,
            order: 3,
          },
        ],
        enrollmentCount: 110,
      },
    ])

    console.log("Courses created")

    // Create posts
    const posts = await Post.insertMany([
      {
        title: "มีใครแนะนำคอร์สเรียน React ดีๆ บ้างไหมครับ?",
        content: "ผมกำลังมองหาคอร์สเรียน React ที่เหมาะกับผู้เริ่มต้น มีใครแนะนำได้บ้างครับ?",
        author: users[0]._id,
        commentCount: 2,
      },
      {
        title: "วิธีการเรียนรู้ AI ด้วยตัวเองอย่างไรให้มีประสิทธิภาพ",
        content: "ผมสนใจเรียนรู้เกี่ยวกับ AI และ Machine Learning แต่ไม่รู้ว่าควรเริ่มต้นอย่างไร มีใครมีคำแนะนำบ้างไหมครับ?",
        author: users[1]._id,
        commentCount: 1,
      },
    ])

    console.log("Posts created")

    // Create comments
    await Comment.insertMany([
      {
        postId: posts[0]._id,
        content: 'ผมแนะนำคอร์ส "React สำหรับผู้เริ่มต้น" ในเว็บไซต์นี้ครับ เนื้อหาดีและเข้าใจง่าย',
        author: users[1]._id,
      },
      {
        postId: posts[0]._id,
        content: "เห็นด้วยกับคุณ instructor คอร์สนี้ดีมากๆ ครับ",
        author: users[0]._id,
      },
      {
        postId: posts[1]._id,
        content: "ผมแนะนำให้เริ่มจากพื้นฐานคณิตศาสตร์และสถิติก่อนครับ จากนั้นค่อยเรียนรู้ภาษา Python และไลบรารีต่างๆ",
        author: users[0]._id,
      },
    ])

    console.log("Comments created")

    console.log("Database seeded successfully")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()

