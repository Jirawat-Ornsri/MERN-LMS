import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import courseRoutes from "./routes/courses.js"
import enrollmentRoutes from "./routes/enrollments.js"
import progressRoutes from "./routes/progress.js"
import postRoutes from "./routes/posts.js"
import categoryRoutes from "./routes/categories.js"
import { authenticateToken } from "./middleware/auth.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/enrollments", authenticateToken, enrollmentRoutes)
app.use("/api/progress", authenticateToken, progressRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/categories", categoryRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

