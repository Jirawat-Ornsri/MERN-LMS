import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import commentRoute from "./routes/comment.route.js";
import enrollRoute from "./routes/enroll.route.js";
import reviewRoute from "./routes/review.route.js";

import path from "path";

import { connectDB } from "./lib/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/course", courseRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);
app.use("/api/post", postRoute);
app.use("/api/enroll", enrollRoute);
app.use("/api/reviews", reviewRoute);


if(process.env.NODE_ENV==="production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend","dist","index.html"));
  });
}

app.listen(PORT, () => {
  console.log("server listening on port:", PORT);
  connectDB();
});
