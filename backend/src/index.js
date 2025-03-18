import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import { connectDB } from './lib/db.js';


dotenv.config()

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json()); 
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );


app.use("/api/auth", authRoutes)
app.use("/api/course", courseRoute)
app.use("/api/users", userRoute)

app.listen(PORT, () => {
    console.log("server listening on port:",PORT);
    connectDB()
})