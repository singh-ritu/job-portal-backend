import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import jobRoutes from "./src/routes/job.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
dotenv.config(); 

const app = express();
connectDB();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // safe even if not used
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoutes);



app.get("/", (req, res) => {
  res.send("Backend server is running...");
});


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
