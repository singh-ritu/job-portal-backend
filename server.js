import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import applicationRoutes from "./src/routes/application.routes.js";
import jobSeekerRoutes from "./src/routes/jobseeker.routes.js";
import employerRoutes from "./src/routes/employer.routes.js"
import multer from "multer";
dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobseekers", jobSeekerRoutes);
app.use("/api/employers", employerRoutes)



app.get("/api/debug-cookies", (req, res) => {
  console.log("COOKIES:", req.cookies);
  res.json(req.cookies);
});
app.get("/", (req, res) => {
  res.send("Backend server is running...");
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
